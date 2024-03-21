import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';

import useMessagesScroll from 'src/hooks/use-messages-scroll';

import { bgBlur, hideScroll, textGradient } from 'src/theme/css';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varFade } from 'src/components/animate';

import { Conversation } from 'src/types/chat';

import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------

// const chatSamples = [
//   {
//     title: 'Open chat',
//     content: '画面中的女主角穿的衣服是什么风格的？',
//     colorTag: 'open-chat',
//   },
//   {
//     title: 'RAG',
//     content: '画面中的餐厅是什么类型的？帮我搜附近类似的餐厅。',
//     colorTag: 'rag',
//   },
//   {
//     title: 'Function calling',
//     content: '这幅画面好美，请帮我生成类似的图。',
//     colorTag: 'function-calling',
//   },
// ];

const chatSamples = [
  {
    title: 'Open chat',
    content: 'What style of clothes is the actress in the screen wearing?',
    colorTag: 'open-chat',
  },
  {
    title: 'RAG',
    content:
      'What type of restaurant is in the screen? Help me search for similar restaurants nearby.',
    colorTag: 'rag',
  },
  {
    title: 'Function calling',
    content: 'This scene is so beautiful, please generate a similar one.',
    colorTag: 'function-calling',
  },
];

const StyledGradientText = styled(m.h2)(({ theme }) => ({
  ...textGradient(
    `170deg, 
    #22A3E7 0%,
    #28B8A3 25%,
    #BBC030 45%,
    #EF751C 65%,
    #F46A7F 85%,
    #BB55C9 100%`
    // 91deg, #22A3E7 0%, #28B8A3 23.22%, #BBC030 43.74%, #EF751C 64.26%, #F46A7F 83.71%, #BB55C9 103.69%
  ),
  padding: 0,
  marginTop: 8,
  lineHeight: 1.2,
  fontWeight: 700,
  marginBottom: 24,
  letterSpacing: 0,
  textAlign: 'center',
  backgroundSize: '300%',
  fontSize: `${28 / 16}rem`,
  fontFamily: theme.typography.fontSecondaryFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${54 / 21}rem`,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  conversation: Conversation;
  tvFrameHeight: number;
  ratio1: number;
  ratio2: number;
  ratio3: number;
};

export default function TVCopilot({
  open,
  conversation,
  tvFrameHeight,
  ratio1,
  ratio2,
  ratio3,
}: Props) {
  const theme = useTheme();

  const { messagesEndRef } = useMessagesScroll(conversation.messages);

  // console.log(tvFrameHeight);
  // console.log(window.innerHeight);

  // console.log('conversation', conversation.messages);

  return (
    <m.div variants={varFade().inRight}>
      <Box
        component={m.div}
        variants={varFade().inLeft}
        sx={{
          zIndex: 1999,
          position: 'absolute',
          right: '4.5%',
          width: '45%',
          height: '100%',
          display: open ? 'flex' : 'none',
        }}
      >
        <Box
          sx={{
            ...bgBlur({ color: theme.palette.grey[600], opacity: 0.62 }),
            px: 1.5,
            position: 'absolute',
            top: () => tvFrameHeight * ratio1,
            right: () => tvFrameHeight * ratio2,
            width: '97%',
            height: () => tvFrameHeight * ratio3,
            borderRadius: 1,
            ...hideScroll.y,
          }}
        >
          <Box sx={{ zIndex: 1999, px: -10, height: { md: 1 }, ...hideScroll.y }}>
            <Scrollbar ref={messagesEndRef} sx={{ py: -4, px: 0, height: 1 }}>
              <Box
                sx={{ textAlign: 'center', alignItems: 'center', mb: 0 }}
                alignItems="center"
                position="relative"
                display="block"
              >
                <Image
                  alt="copilot"
                  src="/logo/logo_colorful.png"
                  sx={{ width: 56, height: 56, mt: 5, mb: 0 }}
                />
                <StyledGradientText
                  animate={{ backgroundPosition: '100% center' }}
                  transition={{
                    repeatType: 'reverse',
                    ease: 'linear',
                    duration: 10,
                    repeat: Infinity,
                  }}
                >
                  Welcome to Copilot
                </StyledGradientText>
                <Typography variant="h4" color="white" sx={{ textAlign: 'center', mb: 2 }}>
                  {/* 您可以问我 */}
                  You can ask me
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: 'repeat(1, 1fr)',
                    width: '100%',
                  }}
                >
                  {chatSamples.map((testimonial, index) => (
                    <TestimonialCard key={index} testimonial={testimonial} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ px: 0.5 }}>
                <Divider
                  sx={{ my: 4 }}
                  style={{ borderStyle: 'dashed', borderColor: `${theme.palette.grey[400]}` }}
                />
              </Box>

              {conversation.messages.map((message, index) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  conversation={conversation}
                  isLastMessage={index === conversation.messages.length - 1}
                  onOpenLightbox={() => {}}
                />
              ))}
              <Box sx={{ height: 40 }} />
            </Scrollbar>
          </Box>
        </Box>
      </Box>
    </m.div>
  );
}

// ----------------------------------------------------------------------

type TestimonialCardProps = StackProps & { testimonial: { content: string } };

function TestimonialCard({ testimonial, sx, ...other }: TestimonialCardProps) {
  const theme = useTheme();

  const { content } = testimonial;

  return (
    <Stack
      spacing={0.5}
      sx={{
        ...bgBlur({
          color: theme.palette.common.black,
          opacity: 0.52,
        }),
        p: 2,
        pt: 1.5,
        borderRadius: 1.25,
        color: 'common.white',
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="mingcute:quote-left-fill" width={36} sx={{ opacity: 0.48 }} />

      <Typography variant="subtitle1">{content}</Typography>
    </Stack>
  );
}

// function FootballMatchCard({ testimonial }: TestimonialCardProps) {
//   const theme = useTheme();

//   const { content } = testimonial;

//   return (
//     <Stack
//       // direction="row"
//       justifyContent="space-between"
//       alignItems="center"
//       spacing={3}
//       sx={{
//         ...bgBlur({
//           color: theme.palette.common.black,
//           opacity: 0.62,
//         }),
//         p: 2,
//         // bgcolor: `${alpha(theme.palette.grey[600], 0.08)}`,
//         // border: `${alpha(theme.palette.grey[500], 0.22)} 1px solid`,
//         borderRadius: 1.5,
//         color: 'common.white',
//       }}
//     >
//       <Stack alignItems="center" spacing={1}>
//         <Iconify icon="solar:verified-check-bold" width={32} sx={{ color: 'primary.main' }} />
//         <Typography variant="h6" sx={{ mr: 0 }}>
//           预定成功
//         </Typography>
//       </Stack>

//       <Stack
//         rowGap={5}
//         columnGap={5}
//         flexWrap="wrap"
//         direction="row"
//         alignItems="center"
//         sx={{ color: `${theme.palette.grey[300]}`, typography: 'caption' }}
//       >
//         <Stack direction="row" alignItems="center">
//           <Iconify width={16} icon="solar:calendar-date-bold" sx={{ mr: 0.5, flexShrink: 0 }} />
//           2024年1月3日 18:00
//         </Stack>

//         <Stack direction="row" alignItems="center">
//           <Iconify
//             width={16}
//             icon="solar:users-group-rounded-bold"
//             sx={{ mr: 0.5, flexShrink: 0 }}
//           />
//           4人用餐
//         </Stack>
//       </Stack>

//       <Stack
//         direction="row"
//         alignItems="center"
//         justifyContent="space-between"
//         spacing={0}
//         sx={{ width: 1, px: 1, mt: 1 }}
//       >
//         <Stack direction="row" alignItems="center" spacing={2}>
//           <Image
//             alt="barcelona"
//             src="https://canadianfoodfocus.org/wp-content/uploads/2021/03/cultural-cuisine-1024x576.jpg"
//             sx={{ width: 56, height: 56, borderRadius: 0.5 }}
//           />
//           <Stack alignItems="flex-start" justifyContent="flex-start" spacing={0} sx={{ pt: 0 }}>
//             <Typography variant="body1">懒人业余餐厅</Typography>
//             <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.75 }}>
//               <Rating
//                 value={4.2}
//                 readOnly
//                 size="small"
//                 sx={{ transform: 'scale(0.7)', ml: -1.9, mr: -1.5 }}
//               />
//               <Typography variant="caption" color={`${theme.palette.grey[300]}`}>
//                 3169条评论
//               </Typography>
//               <Typography variant="caption" color={`${theme.palette.grey[300]}`}>
//                 ¥128/人
//               </Typography>
//             </Stack>
//             {/* <Stack></Stack> */}
//             <Typography variant="caption" color={`${theme.palette.grey[400]}`}>
//               牛排 福田中心-岗厦
//             </Typography>
//           </Stack>
//         </Stack>
//         <Typography variant="body2">623m</Typography>
//       </Stack>
//     </Stack>
//   );
// }
