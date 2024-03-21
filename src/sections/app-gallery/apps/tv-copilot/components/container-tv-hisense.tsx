import { Icon } from '@iconify/react';
import ReactPlayer from 'react-player';
import { useState, useEffect, MutableRefObject } from 'react';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import playCircleFilled from '@iconify/icons-ant-design/play-circle-filled';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';

import { Conversation } from 'src/types/chat';

import TVCopilot from './container-tv-copilot';
import ContainerTVHome from './container-tv-content-home';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  conversation: Conversation;
  playerRef: MutableRefObject<null>;
  onSetOpenCopilot: () => void;
};

export default function ContainerTV({ open, conversation, playerRef, onSetOpenCopilot }: Props) {
  const settings = useSettingsContext();
  const [videoUrl, setVideoUrl] = useState('');
  const [tvFrameHeight, setTvFrameHeight] = useState(700);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const refreshTvFrameHeight = () => {
    const tvFrame = document.querySelector('.tv-frame');
    if (tvFrame && tvFrame.clientHeight > 50) setTvFrameHeight(tvFrame.clientHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', refreshTvFrameHeight);
    return () => {
      window.removeEventListener('resize', refreshTvFrameHeight);
    };
  }, []);

  useEffect(() => {
    delay(100).then(refreshTvFrameHeight);
  }, [open, settings.themeLayout, settings.themeStretch]);

  const handleVideoUrl = (url: string) => {
    setVideoUrl(url);
  };

  // console.log('conversation', conversation.messages);

  return (
    <Scrollbar sx={{ height: 1 }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          height: 720,
          justifyContent: 'center',
        }}
      >
        <Image
          className="tv-frame"
          disabledEffect
          alt="grid"
          src="/assets/images/about/tv.png"
          sx={{ position: 'absolute', width: '90%', objectFit: 'contain' }}
        />

        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            width: '88.5%',
            color: 'common.white',
            height: () => tvFrameHeight * 0.825,
            left: () => tvFrameHeight * 0.094,
            top: () => tvFrameHeight * 0.0135,
          }}
        >
          {videoUrl === '' && (
            <ContainerTVHome onSetVideoUrl={handleVideoUrl} onSetOpenCopilot={onSetOpenCopilot} />
          )}
          {videoUrl !== '' && (
            <ReactPlayer
              className="tv-player"
              width="100%"
              url={videoUrl}
              controls
              ref={playerRef}
              height={tvFrameHeight * 0.823}
              config={{ file: { attributes: { crossOrigin: 'anonymous' } } }}
              playIcon={<Icon icon={playCircleFilled} width={36} height={36} />}
            />
          )}
          {videoUrl !== '' && (
            <IconButton
              color="inherit"
              onClick={() => handleVideoUrl('')}
              sx={{ position: 'absolute', top: 8, left: 8, zIndex: 9 }}
            >
              <Iconify icon={arrowIosBackFill} />
            </IconButton>
          )}
        </Box>

        <TVCopilot
          open={open}
          conversation={conversation}
          tvFrameHeight={tvFrameHeight}
          ratio1={0.021}
          ratio2={0.018}
          ratio3={0.8125}
        />
      </Box>
    </Scrollbar>
  );
}
