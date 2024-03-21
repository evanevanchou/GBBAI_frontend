import { Icon } from '@iconify/react';
import ReactPlayer from 'react-player';
import { useState, useEffect } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import functionFilled from '@iconify/icons-tabler/function-filled';
import textbox16Filled from '@iconify/icons-fluent/textbox-16-filled';
import thinking24Filled from '@iconify/icons-fluent/thinking-24-filled';
import playCircleFilled from '@iconify/icons-ant-design/play-circle-filled';
import checkmarkCircle2fill from '@iconify/icons-eva/checkmark-circle-2-fill';

import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  LinearProgress,
} from '@mui/material';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';

import { Message, Conversation } from 'src/types/chat';

import ChatMessageItemFuncHandler from './ChatMessageItemFuncHandler';

// ----------------------------------------------------------------------

const imageSuffixes = ['jpg', 'gif', 'png', 'gif', 'bmp', 'svg', 'webp'];
const regex = new RegExp(`https.*\\.(${imageSuffixes.join('|')}).*(?=\\))`, 'i');

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 680,
  padding: theme.spacing(0, 0),
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(0),
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.grey[400],
}));

const MessageImgStyle = styled('img')(({ theme }) => ({
  width: '100%',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: 6,
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(0),
  [theme.breakpoints.up('md')]: {
    height: 240,
    minWidth: 96,
  },
}));

// async function provideFeedback(
//   uuid: string,
//   timeStamp: string,
//   isLike: number,
//   callback: (error: string) => void
// ) {}

// ----------------------------------------------------------------------

type ChatMessageItemProps = {
  message: Message;
  conversation: Conversation;
  onOpenLightbox: (value: string) => void;
  isLastMessage: boolean;
};

export default function ChatMessageItem({
  message,
  conversation,
  onOpenLightbox,
  isLastMessage,
}: ChatMessageItemProps) {
  const theme = useTheme();
  const [displayedContent, setDisplayedContent] = useState('');

  const sender = conversation.participants.find(
    (participant) => participant.id === message.senderId
  );
  const senderDetails =
    message.senderId === '8864c717-587d-472a-929a-8e5f298024da-0'
      ? { type: 'me' }
      : { avatar: sender?.avatarUrl, name: sender?.name };

  const isMe = senderDetails.type === 'me';
  const isImage = message.contentType === 'image';

  const matchVid = message.body ? message.body.match(/\/(.*\.mp4)/) : null;
  const videoUrl = matchVid ? `/${matchVid[1]}` : '';

  const matchImg = message.body ? message.body.match(regex) : null;
  const imageUrl = matchImg ? matchImg[0] : '';

  const timeDistanceToNow = formatDistanceToNowStrict(new Date(message.createdAt), {
    addSuffix: true,
  });
  const isSystemMsg =
    message &&
    message.body &&
    (message.body.startsWith('(SYS)Working') || message.body.startsWith('(SYS)function'));

  useEffect(() => {
    if (message.mode === 'attach') {
      const interval = setInterval(() => {
        if (displayedContent.length >= message.body.length) {
          clearInterval(interval);
        }
        try {
          setDisplayedContent((prev) => message.body.slice(0, prev.length + 3));
        } catch (e) {
          console.error(e);
        }
      }, 70);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [displayedContent, message.body, message.mode]);

  // console.log(message);

  // const handleUpdateReaction = (reaction: string) => {
  //   if (message.ddb_uuid !== undefined && message.log_timestamp !== undefined) {
  //     provideFeedback(
  //       message.ddb_uuid,
  //       message.log_timestamp,
  //       reaction === 'Yes' ? 1 : reaction === 'No' ? -1 : 0,
  //       feedbackCallback
  //     );
  //   }
  //   setUserReaction((prev) => (reaction === prev ? '' : reaction));
  // };

  const handleText = (msgText: string) => {
    try {
      if (isSystemMsg) return null;
      let content = msgText.replace('(请用中文回答)', '');
      if (imageUrl.length > 0) {
        if (content.includes('](http') && !content.includes('!['))
          content = content.replace('[', '![');
        if (content.endsWith(')。')) content = content.replace(')。', ')');
      }
      return (
        <Box
          onClick={() => {
            if (imageUrl.length > 0) onOpenLightbox(imageUrl);
          }}
          sx={{ mb: 0, mt: -1.5 }}
        >
          <Markdown children={content} sx={{ mb: -1.5, width: 1 }} />
        </Box>
      );
    } catch (error) {
      return <Box sx={{ typography: 'body2' }}>{msgText.replace('<eos>', '')}</Box>;
    }
  };

  function handleVideo(msgText: string) {
    try {
      if (isSystemMsg) return null;

      return (
        <>
          <Box>
            <Markdown children={msgText.replace('<eos>', '')} />
          </Box>
          <Box sx={{ py: 1.5 }}>
            <Paper
              sx={{
                pb: 2,
                pt: 2.9,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '5px',
                backgroundColor: `${theme.palette.grey[900]}`,
              }}
            >
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                playIcon={<Icon icon={playCircleFilled} width={36} height={36} />}
                controls
              />
            </Paper>
            {/* <Box component="img" src={cover} sx={{ borderRadius: 1.5, width: 1 }} /> */}
          </Box>
        </>
      );
    } catch (error) {
      return <Box sx={{ typography: 'body2' }}>{msgText.replace('<eos>', '')}</Box>;
    }
  }

  const handleMessage = (msg: string, _isMe: boolean) => {
    try {
      return (
        <>
          {!_isMe && <ChatMessageItemFuncHandler function_calls={message.function_calls || []} />}
          {handleText(msg)}
        </>
      );
    } catch (e) {
      return (
        <>
          {msg ? <Box sx={{ typography: 'body2' }}>{msg}</Box> : handleText('Nothing to display')}
        </>
      );
    }
  };
  // console.log(message);

  const handleSysMessage = (msg: string) => {
    if (msg.startsWith('(SYS)function')) {
      const functionName = message.body.split(':')[1].trim();
      const status = msg.includes('calling') ? 'running' : 'executed';
      return (
        <Stack>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
            <Iconify
              icon={status === 'running' ? functionFilled : thinking24Filled}
              sx={{ ml: -0.5, height: 24, width: 24, color: `${theme.palette.primary.main}` }}
            />
            <Box>
              {status === 'running' && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ fontSize: 14, py: 1 }}>Calling: </Box>
                  <Markdown
                    sx={{ transform: 'translateY(-1px)' }}
                    children={`\`${functionName}\``}
                  />
                </Stack>
              )}
              {status === 'executed' && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ fontSize: 14, py: 1 }}>Keep working ...</Box>
                </Stack>
              )}

              <LinearProgress color="primary" sx={{ mt: 0, mb: 1.5 }} />
            </Box>
          </Stack>
          {status === 'executed' && (
            <>
              <Divider sx={{ mt: 0.5, borderStyle: 'dashed' }} />
              <Stack spacing={0} sx={{ mt: 1, mb: -1 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ my: -0.5 }}>
                  <Iconify
                    icon={checkmarkCircle2fill}
                    sx={{
                      ml: -0.05,
                      height: 17,
                      width: 17,
                      transform: 'translateY(1.5px)',
                      color: `${theme.palette.success.main}`,
                    }}
                  />
                  <Markdown
                    sx={{ '& code': { fontSize: 12, borderRadius: 0.5 } }}
                    children={`\`${functionName}\``}
                  />
                  <Box sx={{ fontSize: 13, py: 1, ml: -1.25, transform: 'translateY(0.5px)' }}>
                    executed
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {}}
                    sx={{ ml: -1, transform: 'translateY(1.5px)' }}
                  >
                    <Iconify
                      icon={textbox16Filled}
                      sx={{
                        height: 16,
                        width: 16,
                        color: `${theme.palette.text.secondary}`,
                      }}
                    />
                  </IconButton>
                </Stack>
              </Stack>
            </>
          )}
        </Stack>
      );
    }
    if (msg.startsWith('(SYS)Working on it')) {
      return (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Iconify
            icon={thinking24Filled}
            sx={{ ml: -0.5, height: 24, width: 24, color: `${theme.palette.primary.main}` }}
          />
          <Box>
            <Box sx={{ fontSize: 15, py: 1 }}>Working on it</Box>
            <LinearProgress color="primary" sx={{ mt: 0, mb: 1.5 }} />
          </Box>
        </Stack>
      );
    }
    return null;
  };

  return (
    <Stack
      spacing={3}
      sx={{
        ...bgBlur({
          color: theme.palette.common.black,
          opacity: 0.52,
        }),
        p: 2.5,
        width: '100%',
        borderRadius: 1.5,
        color: 'common.white',
        mx: 0,
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', ...(isMe && { ml: 'auto' }) }}>
        <Stack alignItems="flex-end">
          {isMe && (
            <InfoStyle variant="caption" sx={{ ...(isMe && { justifyContent: 'flex-end' }) }}>
              {timeDistanceToNow.startsWith('0 sec') ? 'Just now' : timeDistanceToNow}
            </InfoStyle>
          )}

          <ContentStyle
            sx={{
              ...(isMe && { color: 'white' }),
              ...(isImage && { p: 1 }),
              // ...(isMe && {
              //   color: 'white',
              //   background: modeColorSets[message.chatMode],
              // }),
              // ...(!isMe &&
              //   message.body &&
              //   !isSystemMsg && {
              //     minWidth: { xs: 'auto', md: '380px' },
              //   }),
              ...(!isMe && {
                minWidth: { xs: 'auto', md: '380px' },
              }),
            }}
          >
            {isImage && (
              <MessageImgStyle
                alt="attachment"
                src={message.body}
                onClick={() => onOpenLightbox(message.body)}
              />
            )}

            {!!videoUrl && <>{handleVideo(message.body)}</>}

            {!isImage && !videoUrl && (
              <>
                {message.mode === 'attach'
                  ? handleMessage(displayedContent, isMe)
                  : handleMessage(message.body, isMe)}
              </>
            )}

            {message.attachments !== undefined && message.attachments.length > 0 && (
              <>
                {message.attachments.map((attachment, index) => (
                  <MessageImgStyle
                    key={index}
                    alt="attachment"
                    src={attachment?.preview || ''}
                    onClick={() => onOpenLightbox(attachment.preview)}
                  />
                ))}
              </>
            )}

            {isSystemMsg && !isMe && isLastMessage && handleSysMessage(message.body)}
          </ContentStyle>
        </Stack>
      </Box>
      {!isSystemMsg && !isMe && (
        <Stack direction="row" alignItems="center" sx={{ mt: -1 }}>
          <Avatar
            alt="copilot"
            src="/assets/avatars/avatar_copilot.jpg"
            sx={{ width: 30, height: 30, mr: 1.5 }}
          />

          <ListItemText
            primary="Copilot"
            secondary={timeDistanceToNow.startsWith('0 sec') ? 'Just now' : timeDistanceToNow}
            primaryTypographyProps={{
              typography: 'body2',
              mb: 0.05,
            }}
            secondaryTypographyProps={{
              typography: 'caption',
              color: 'inherit',
              sx: { opacity: 0.64, fontSize: '11px' },
            }}
          />
        </Stack>
      )}
    </Stack>
  );
}
