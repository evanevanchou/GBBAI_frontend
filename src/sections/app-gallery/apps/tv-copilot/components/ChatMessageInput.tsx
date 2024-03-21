import { Icon } from '@iconify/react';
import micFill from '@iconify/icons-ri/mic-fill';
import bulbIcon from '@iconify/icons-tabler/bulb';
import roundSend from '@iconify/icons-ic/round-send';
import { useState, useEffect, useCallback } from 'react';
import roundAddPhotoAlternate from '@iconify/icons-ic/round-add-photo-alternate';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Input, Stack, Divider, IconButton } from '@mui/material';

import { MultiFilePreview } from 'src/components/upload';
import Lightbox, { useLightBox } from 'src/components/lightbox';

import { Participant } from 'src/types/chat';

import { sendBtnColorSets } from '../entry';
import ChatPromptPopover from './ChatPromptPopover';
import ChatMessageInputModeBtn from './ChatMessageInputModeBtn';

// ----------------------------------------------------------------------

type ChatMessageInputProps = {
  disabled: boolean;
  participants: Participant[] | null;
  onSend: Function;
  chatMode: string;
  onSetChatMode: React.Dispatch<React.SetStateAction<string>>;
  onSetOpenCopilot: () => void;
  onSetSwitchCopilot: () => void;
  onCaptureFrame: () => { dataUri: string } | undefined;
  setChatMode: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChatMessageInput({
  disabled,
  participants,
  onSend,
  chatMode,
  onSetChatMode,
  onSetOpenCopilot,
  onSetSwitchCopilot,
  onCaptureFrame,
  setChatMode,
}: ChatMessageInputProps) {
  const theme = useTheme();
  const [lines, setLines] = useState(0);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [inputFocus, setInputFocus] = useState(false);
  const [includeFrame, setIncludeFrame] = useState(true);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const images = files.map((file) => ({ src: file.preview }));

  const lightbox = useLightBox(images);

  const handleOpenLightbox = (img: string) => {
    lightbox.onOpen(img);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleToggleIncludeFrame = () => {
    setIncludeFrame((prev) => !prev);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleChange();
    }, 50);
    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = () => {
    const inputPanel = document.querySelector('.llm-input');
    if (inputPanel) {
      let lineCount;
      if (inputPanel.clientHeight < 60) {
        lineCount = 1;
      } else if (inputPanel.clientHeight >= 60 && inputPanel.clientHeight < 80) {
        lineCount = 2;
      } else if (inputPanel.clientHeight >= 80 && inputPanel.clientHeight < 100) {
        lineCount = 3;
      } else {
        lineCount = 4;
      }
      setLines(lineCount);
    }
  };

  const handleInputFocus = (flag: boolean) => {
    setInputFocus(flag);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      handleSend();
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'i') {
      handleToggleIncludeFrame();
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'c') {
      onSetSwitchCopilot();
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
      setChatMode('rag');
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'u') {
      setChatMode('function-calling');
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'e') {
      setChatMode('open-chat');
    }
  };

  const participantIds =
    participants === null ? [] : participants.map((participant) => participant.id);

  const handleSend = () => {
    if (!message || participants === null) {
      return;
    }
    let _files: any[] = [];
    if (includeFrame) {
      const frame = onCaptureFrame();
      _files = [frame && { preview: frame.dataUri }];
    }
    onSetOpenCopilot();
    onSend({
      content: message,
      senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      mode: 'new',
      attachments: _files,
    });
    onSend({
      content: '(SYS)Working on it...',
      senderId: participantIds[0],
      mode: 'new',
    });

    setMessage('');
    setFiles([]);
    setLines(1);
  };

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = files.filter((file) => file !== inputFile);
      setFiles(filtered);
    },
    [files]
  );

  let borderRadius;
  if (files.length > 0) {
    borderRadius = 1;
  } else if (lines < 2) {
    borderRadius = 20;
  } else if (lines === 2) {
    borderRadius = 2.5;
  } else if (lines === 3) {
    borderRadius = 2;
  } else {
    borderRadius = 1.5;
  }

  return (
    <Box
      sx={{
        minHeight: 52,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        bottom: -64,
        width: '100%',
        paddingLeft: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        py: 0.5,
        ...{
          boxShadow: inputFocus
            ? `0 0 1px 0 ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[200],
                0.32
              )}, 0 1px 10px 2px ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[700],
                0.1
              )}`
            : `0 0 1px 0 ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[200],
                0.32
              )}, 0 1px 4px -1px ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[700],
                0.34
              )}`,
          borderRadius,
        },
      }}
    >
      <ChatMessageInputModeBtn chatMode={chatMode} onSetChatMode={onSetChatMode} />

      <Stack sx={{ mr: 3 }} direction="row" alignItems="center">
        <IconButton size="small" onClick={onSetSwitchCopilot}>
          <Box
            component="img"
            src="/assets/icons/modules/ic_copilot.svg"
            sx={{ width: 26, height: 26, cursor: 'pointer' }}
          />
        </IconButton>
        <IconButton size="small" onClick={handleOpenPopover} sx={{ width: 36, height: 36 }}>
          <Icon icon={bulbIcon} width={22} />
        </IconButton>
        <ChatPromptPopover
          openPopover={openPopover}
          setMessage={setMessage}
          setOpenPopover={setOpenPopover}
        />
      </Stack>

      <Stack sx={{ width: '100%' }} alignItems="center">
        <Stack
          direction="row"
          flexWrap="wrap"
          sx={{ display: files.length === 0 ? 'none' : 'flex', width: '100%', mt: 0.75, ml: -1 }}
        >
          <MultiFilePreview
            thumbnail
            files={files}
            onRemove={(file) => handleRemoveFile(file)}
            sx={{ width: 64, height: 64 }}
            onClick={handleOpenLightbox}
          />
        </Stack>
        <Input
          className="llm-input"
          multiline
          maxRows={10}
          fullWidth
          value={message}
          disableUnderline
          onBlur={() => handleInputFocus(false)}
          onFocus={() => handleInputFocus(true)}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder="Enter a prompt"
          endAdornment={
            <Stack direction="row" sx={{ mr: 0.5, '& > *': { mx: 0.25 } }} alignItems="center">
              <IconButton
                size="small"
                onClick={handleToggleIncludeFrame}
                sx={{ background: includeFrame ? theme.palette.primary.main : 'none' }}
              >
                <Icon
                  icon={roundAddPhotoAlternate}
                  width={21}
                  color={includeFrame ? 'white' : theme.palette.grey[600]}
                />
              </IconButton>
              <IconButton disabled={disabled} size="small">
                <Icon icon={micFill} width={20} height={20} />
              </IconButton>
            </Stack>
          }
          sx={{ pb: 0.5 }}
        />
      </Stack>

      <Divider orientation="vertical" flexItem />

      <IconButton
        disabled={message.trim().length === 0}
        onClick={handleSend}
        sx={{ mx: 1, mr: 0.75 }}
      >
        <Icon color={sendBtnColorSets[chatMode]} icon={roundSend} width={24} height={24} />
      </IconButton>

      <Lightbox
        index={lightbox.selected}
        slides={images}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </Box>
  );
}
