import { Card, Stack, Typography } from '@mui/material';

import { sendBtnColorSets } from '../entry';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  content: string;
  icon?: React.ReactNode;
  chatMode: string;
  onSend: Function;
};

export default function ChatPromptExampleCard({ title, content, icon, chatMode, onSend }: Props) {
  const handleSendPrompt = (message: string) => {
    if (!message) return;
    onSend({
      content: message,
      senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      mode: 'new',
    });
    onSend({
      content: '(SYS)Working on it...',
      senderId: '8864c717-587d-472a-929a-8e5f298024da-1',
      mode: 'new',
    });
  };

  return (
    <Card
      sx={{
        px: 1,
        py: 0.25,
        borderRadius: 1.25,
        bgcolor: 'background.white',
        boxShadow: (theme) => theme.customShadows.z3,
        '&:hover': { boxShadow: (theme) => theme.customShadows.z20 },
        ...(chatMode.includes(title.split(' ')[0].toLowerCase()) && {
          borderColor: 'transparent',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.z16,
        }),
      }}
      onClick={() => handleSendPrompt(content)}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ p: 0.5 }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.25} sx={{ p: 1 }} alignItems="center">
            <Typography variant="h6" sx={{ color: sendBtnColorSets[chatMode] }}>
              {title}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            sx={{
              px: 1,
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {content}
          </Typography>
        </Stack>

        {!!icon && icon}
      </Stack>
    </Card>
  );
}
