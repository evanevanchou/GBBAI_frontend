import { Box, Typography } from '@mui/material';

import useMessagesScroll from 'src/hooks/use-messages-scroll';

import { promptExamplesCards } from 'src/api/gpt';

import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';

import { Conversation } from 'src/types/chat';

import { modeColorSets } from '../entry';
import ChatMessageItem from './ChatMessageItem';
import ChatWelcomeCard from './ChatWelcomeCard';
import ChatWelcomeTitle from './ChatWelcomeTitle';
import ChatPromptExampleCard from './ChatPromptExampleCard';

// ----------------------------------------------------------------------

const imageSuffixes = ['jpg', 'gif', 'png', 'gif', 'bmp', 'svg', 'webp'];
const regex = new RegExp(`https.*\\.(${imageSuffixes.join('|')}).*(?=\\))`, 'i');
const regex2 = /\!\[.*?\]\((.*?)\)/g;

const chatModeCards = [
  {
    title: 'Open chat',
    content: 'Ask any question, data copilot will generate an answer',
    colorTag: 'open-chat',
  },
  {
    title: 'RAG',
    content: 'Data copilot will scan your knowledge base and generate answers',
    colorTag: 'rag',
  },
  {
    title: 'Function calling',
    content: 'Data copilot will call different functions to perform tasks',
    colorTag: 'function-calling',
  },
];

type ChatMessageListProps = {
  conversation: Conversation;
  chatMode: string;
  onSend: Function;
  onSetChatMode: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChatMessageList({
  conversation,
  chatMode,
  onSend,
  onSetChatMode,
}: ChatMessageListProps) {
  const { messagesEndRef } = useMessagesScroll(conversation.messages);

  const images = conversation.messages
    .filter((message) => {
      if (!message.body) return false;
      const match = message.body.match(regex);
      const url = match ? match[0] : '';
      return !!url;
    })
    .map((message) => {
      if (!message.body) return { src: '' };
      const match = message.body.match(regex);
      const url = match ? match[0] : '';

      let match2;
      const imageLinks = [];

      while ((match2 = regex2.exec(message.body)) !== null) {
        if (match2[1] !== url) imageLinks.push(match2[1]);
      }
      return [{ src: url }, ...imageLinks.map((link) => ({ src: link }))];
    })
    .flat();

  conversation.messages.forEach((message) => {
    if (message.attachments !== undefined && message.attachments.length > 0) {
      message.attachments.forEach((attachment) => {
        images.push({ src: attachment.preview });
      });
    }
  });
  // console.log(images);attachments?: { type: string; url: string }[]; url: file.preview

  const lightbox = useLightBox(images);

  const handleOpenLightbox = (img: string) => {
    lightbox.onOpen(img);
  };

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ py: 2, px: 1, height: 1 }}>
        <Box sx={{ mx: 2, mb: 8, mt: 0 }}>
          <ChatWelcomeTitle title="Enterprise Data Copilot" />

          <Typography
            variant="subtitle1"
            sx={{ px: 0, mb: 1.5, mt: 1.5, textAlign: 'center', fontWeight: 500 }}
          >
            Select a mode
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              width: '100%',
            }}
          >
            {chatModeCards.map((card) => (
              <ChatWelcomeCard
                key={card.title}
                title={card.title}
                content={card.content}
                gradient={modeColorSets[card.colorTag]}
                chatMode={chatMode}
                onSetChatMode={onSetChatMode}
              />
            ))}
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              mt: 6,
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            Try following prompts
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              width: '100%',
            }}
          >
            {promptExamplesCards[chatMode].map((card: any) => (
              <ChatPromptExampleCard
                key={card.title}
                title={card.title}
                content={card.content}
                icon={card.icon}
                chatMode={chatMode}
                onSend={onSend}
              />
            ))}
          </Box>
        </Box>

        {conversation.messages.map((message, index) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            conversation={conversation}
            isLastMessage={index === conversation.messages.length - 1}
            onOpenLightbox={handleOpenLightbox}
          />
        ))}
      </Scrollbar>

      <Lightbox
        index={lightbox.selected}
        slides={images}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}
