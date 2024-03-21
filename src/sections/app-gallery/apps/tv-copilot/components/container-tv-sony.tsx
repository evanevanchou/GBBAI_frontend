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
  const [tvFrameHeight, setTvFrameHeight] = useState(window.innerHeight * 0.683);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // console.log(tvFrameHeight);
  // console.log(window.innerHeight);

  const handleVideoUrl = (url: string) => {
    setVideoUrl(url);
  };

  const refreshTvFrameHeight = () => {
    const tvFrame = document.querySelector('.tv-frame');
    if (tvFrame && tvFrame.clientHeight > 50) setTvFrameHeight(tvFrame.clientHeight);
  };

  useEffect(() => {
    delay(1000).then(refreshTvFrameHeight);
    window.addEventListener('resize', refreshTvFrameHeight);
    return () => {
      window.removeEventListener('resize', refreshTvFrameHeight);
    };
  }, []);

  useEffect(() => {
    delay(100).then(refreshTvFrameHeight);
  }, [open, settings.themeLayout, settings.themeStretch]);

  return (
    <Scrollbar sx={{ height: 1, mt: 0.5 }}>
      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <Image
          className="tv-frame"
          disabledEffect
          alt="grid"
          src="/assets/images/about/tv-sony-2.png"
          sx={{ position: 'absolute', width: '98%', left: '1.75%', objectFit: 'contain' }}
        />

        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            width: '91.8%',
            // width: '88.95%',
            color: 'common.white',
            height: () => tvFrameHeight * 0.812,
            left: () => tvFrameHeight * 0.0595,
            top: () => tvFrameHeight * 0.079,
            // height: () => tvFrameHeight * 0.868,
            // left: () => tvFrameHeight * 0.0985,
            // top: () => tvFrameHeight * 0.0175, // for sony 1
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
              // height={tvFrameHeight * 0.868}
              height={tvFrameHeight * 0.812}
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
          ratio1={0.083}
          ratio2={0.003}
          ratio3={0.8045}
          // ratio1={0.021} // to sony 1
          // ratio2={0.01}
          // ratio3={0.861}
        />
      </Box>
    </Scrollbar>
  );
}
