import { useRef, useState } from 'react';

import Stack from '@mui/material/Stack';

import uuidv4 from 'src/utils/uuidv4';

import { formRequest, makeApiRequest } from 'src/api/gpt';

import {
  Message,
  SendMessage,
  Participant,
  Conversation,
  IConfiguration,
  SendTextFuncProps,
} from 'src/types/chat';

import ContainerTV from './container-tv-sony';
import ChatMessageInput from './ChatMessageInput';

// ----------------------------------------------------------------------

type Props = {
  configuration: { [key: string]: any };
  messages: Message[];
  onUpdateMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  configurations: IConfiguration;
};

export default function ChatWindow({
  configuration,
  messages,
  onUpdateMessages,
  configurations,
}: Props) {
  const playerRef = useRef(null);
  const [chatMode, setChatMode] = useState('open-chat');

  const messagesToInclude = configurations[`${chatMode}-Past messages included`];

  const [openCopilot, setOpenCopilot] = useState(false);

  const handleSwitchCopliot = () => {
    setOpenCopilot((prev) => !prev);
  };

  const handleOpenCopliot = () => {
    setOpenCopilot(true);
  };

  const onComposeRequest = (_messages: Message[]) => {
    const gptMessages: any[] = [];
    _messages.slice(-messagesToInclude - 1).forEach((message) => {
      const { body, senderId, function_calls, attachments } = message;

      if (function_calls !== undefined && function_calls.length > 0) {
        if (!body.startsWith('(SYS)function')) {
          gptMessages.push({
            content: body,
            role: 'assistant',
            attachments,
          });
        }

        function_calls.forEach((function_call: any) => {
          const { funcName, funcArgs, results } = function_call;

          if (chatMode === 'function-calling') {
            gptMessages.push({
              content: '',
              role: 'assistant',
              function_call: { name: funcName, arguments: funcArgs },
            });
          }

          if (results && results.length > 0)
            gptMessages.push({
              content: results,
              role: chatMode === 'function-calling' ? 'function' : 'assistant',
              name: funcName,
            });
        });
      } else {
        gptMessages.push({
          content: body,
          role: senderId.endsWith('0') ? 'user' : 'assistant',
          attachments,
        });
      }
    });

    return formRequest({
      chatMode,
      messages: gptMessages,
      configuration,
      configurations,
    });
  };

  const onSendMessage = (conversation: SendMessage) => {
    const {
      messageId,
      message,
      contentType,
      sources,
      function_calls,
      createdAt,
      senderId,
      mode,
      ddb_uuid,
      log_timestamp,
      attachments,
    } = conversation;

    const newMessage = {
      id: messageId,
      body: message,
      contentType,
      sources,
      function_calls,
      createdAt,
      senderId,
      mode,
      chatMode,
      ddb_uuid,
      log_timestamp,
      attachments,
    } as Message;

    onUpdateMessages((prev) => {
      const existedMsgIndex = prev.findIndex((msg) => msg.id === messageId);
      if (!message) return [...prev];
      if (existedMsgIndex === -1) {
        if (mode === 'attach') {
          if (message.startsWith('(SYS)function')) {
            const tmpMessage = {
              ...prev[prev.length - 1],
              body: message,
              function_calls,
            };
            if (message.startsWith('(SYS)function executed')) {
              makeApiRequest({
                mode: chatMode,
                onSend: handleSendText,
                request: onComposeRequest([...prev.slice(0, -1), tmpMessage]),
                shouldStream: configurations[`${chatMode}-Should stream`],
                aoaiResourceName: configurations[`${chatMode}-Deployment`],
              });
            }
            return [...prev.slice(0, -1), tmpMessage];
          }
          const tmpFunctions = prev[prev.length - 1].function_calls;
          return [
            ...prev.slice(0, -1),
            {
              ...prev[prev.length - 1],
              body: message,
              ...(tmpFunctions && { function_calls: tmpFunctions }),
            },
          ];
        }
        if (mode === 'new' && message !== '(SYS)Working on it...' && senderId.endsWith('1')) {
          return [...prev.slice(0, -1), newMessage];
        }
        if (mode === 'new' && senderId.endsWith('0')) {
          makeApiRequest({
            mode: chatMode,
            onSend: handleSendText,
            request: onComposeRequest([...prev, newMessage]),
            shouldStream: configurations[`${chatMode}-Should stream`],
            aoaiResourceName: configurations[`${chatMode}-Deployment`],
          });
          return [...prev, newMessage];
        }
        return [...prev, newMessage];
      }
      const newArr = [...prev];
      newArr[existedMsgIndex] = newMessage;
      return newArr;
    });
  };

  const MY_CONTACT = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    name: 'Admin',
  };

  const contacts = [
    {
      id: '8864c717-587d-472a-929a-8e5f298024da-1',
      name: 'GPT',
    },
  ];

  const participants = [contacts[0] as Participant];

  const conversation = {
    id: '1',
    participants: [MY_CONTACT, contacts[0]],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages,
  } as Conversation;

  const handleSendText = ({
    content,
    senderId,
    mode,
    sources = [],
    function_calls = [],
    msgId = undefined,
    uuid = undefined,
    timestamp = undefined,
    attachments = [],
  }: SendTextFuncProps) => {
    onSendMessage({
      conversationId: 'e12f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
      messageId: msgId === undefined ? uuidv4() : msgId,
      message: content,
      contentType: 'text',
      sources,
      function_calls,
      createdAt: new Date(),
      senderId,
      mode,
      chatMode,
      ddb_uuid: uuid,
      log_timestamp: timestamp,
      attachments,
    });
  };

  const captureVideoFrame = (video: any) => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const dataUri = canvas.toDataURL('image/jpeg');
    // URL.createObjectURL(dataUri)
    return { dataUri };
  };

  const captureFrame = () => {
    if (playerRef.current) {
      const frame = captureVideoFrame((playerRef.current as any).getInternalPlayer());
      return frame;
    }
    return undefined;
  };

  return (
    <Stack sx={{ width: 1, height: 1, overflow: 'hidden' }}>
      <ContainerTV
        open={openCopilot}
        conversation={conversation}
        playerRef={playerRef}
        onSetOpenCopilot={handleOpenCopliot}
      />

      <ChatMessageInput
        participants={participants}
        onSend={handleSendText}
        disabled
        chatMode={chatMode}
        onSetChatMode={setChatMode}
        onSetOpenCopilot={handleOpenCopliot}
        onSetSwitchCopilot={handleSwitchCopliot}
        onCaptureFrame={captureFrame}
        setChatMode={setChatMode}
      />
    </Stack>
  );
}
