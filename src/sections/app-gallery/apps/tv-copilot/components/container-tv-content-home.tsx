import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgBlur } from 'src/theme/css';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Carousel, { useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

const _tvFeatured: ItemProps[] = [
  {
    id: '1',
    title: 'BELLINGHAM THE HERO! 🚨 Barcelona vs. Real Madrid',
    description: 'LALIGA Highlights | ESPN FC',
    coverUrl: '/assets/images/tv/movies/1.jpg',
    homeCoverUrl: '/assets/images/tv/home4.jpg',
    videoUrl:
      'https://xleazureailang.blob.core.windows.net/videos/%F0%9F%9A%A8%20BELLINGHAM%20THE%20HERO!%20%F0%9F%9A%A8%20Barcelona%20vs.%20Real%20Madrid%20%7C%20LALIGA%20Highlights%20%7C%20ESPN%20FC.mp4?sp=r&st=2024-02-06T13:18:47Z&se=2025-02-06T21:18:47Z&spr=https&sv=2022-11-02&sr=b&sig=X%2Bj7GuehvGRYn1rktI6Zs6T1zp563w1CdkdOvtCUfoY%3D',
  },
  {
    id: '2',
    title: 'Sex and the city',
    description: 'Drama - Season 1, Episode 1',
    coverUrl: '/assets/images/tv/movies/2.jpg',
    homeCoverUrl: '/assets/images/tv/home1.jpg',
    videoUrl:
      'https://xleazureailang.blob.core.windows.net/videos/sex_city_dinner.mp4?sp=r&st=2024-02-06T13:19:26Z&se=2025-02-06T21:19:26Z&spr=https&sv=2022-11-02&sr=b&sig=ht4qsvPeQuPbJJiEJay63Ngx1v1Veee4ApWujnaHD4A%3D',
  },
  {
    id: '3',
    title: 'Top 10 Restaurants from S&C',
    description: 'Food - Season 2, Episode 6',
    coverUrl: '/assets/images/tv/movies/3.jpg',
    homeCoverUrl: '/assets/images/tv/home5.jpg',
    videoUrl:
      'https://xleazureailang.blob.core.windows.net/videos/Top%2010%20Restaurants%20from%20Sex%20and%20the%20City%20You%20Can%20Actually%20Go%20To.mp4?sp=r&st=2024-02-06T13:19:53Z&se=2025-02-06T21:19:53Z&spr=https&sv=2022-11-02&sr=b&sig=nmiF%2FhRmuDW35oR6utRAgyXpc0DeiiHvqxwXXWzWaQM%3D',
  },
  {
    id: '4',
    title: 'Big buck bunny',
    description: 'Animation',
    coverUrl: '/assets/images/tv/movies/4.jpg',
    homeCoverUrl: '/assets/images/tv/home2.jpg',
    videoUrl:
      'https://xleazureailang.blob.core.windows.net/videos/big_buck_bunny.mp4?sp=r&st=2024-02-06T13:17:49Z&se=2025-02-06T21:17:49Z&spr=https&sv=2022-11-02&sr=b&sig=ds6rwkkr0OXwEzaIipCfijeB9v7NnDMZRZ8tl3uMi1Q%3D',
  },
];

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  homeCoverUrl: string;
  videoUrl: string;
};

type Props = {
  onSetVideoUrl: (videoUrl: string) => void;
  onSetOpenCopilot: () => void;
};

export default function ContainerTVHome({ onSetVideoUrl, onSetOpenCopilot }: Props) {
  const theme = useTheme();
  const [homeTv, setHomeTv] = useState(_tvFeatured[0]);

  const handleSetHomeTv = (item: ItemProps) => {
    setHomeTv(item);
  };

  const carousel = useCarousel({
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Button
        sx={{
          zIndex: 10,
          ...bgBlur({ color: theme.palette.grey[900], opacity: 0.48 }),
          px: 2.5,
          top: 13,
          height: 40,
          right: '1rem',
          position: 'absolute',
          borderRadius: '100px',
          '&:hover': {
            ...bgBlur({ color: theme.palette.grey[900], opacity: 0.28 }),
          },
        }}
        onClick={onSetOpenCopilot}
      >
        <Box
          component="img"
          src="/assets/icons/modules/ic_copilot.svg"
          sx={{ width: 28, height: 28, cursor: 'pointer', mr: 1, p: 0 }}
        />
        <Typography variant="h6" sx={{ color: 'white' }}>
          Copilot
        </Typography>
      </Button>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mx: 3,
          color: 'white',
          position: 'absolute',
          width: 'calc(100% - 3rem)',
          top: 'calc(60% - 80px)',
          zIndex: 9,
        }}
      >
        <Box
          sx={{
            color: 'white',
            textOverflow: 'hidden',
            minWidth: '200px',
            maxWidth: 'calc(100% - 120px)',
            mb: 0.5,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              textOverflow: 'hidden',
              // minWidth: '200px',
              // maxWidth: 'calc(100% - 220px)',
              mb: 0.5,
            }}
            noWrap
          >
            {homeTv.title}
          </Typography>
          <Typography variant="body1" sx={{ color: `${theme.palette.grey[400]}` }} noWrap>
            {homeTv.description}
          </Typography>
        </Box>
        <Button
          size="small"
          color="info"
          variant="contained"
          onClick={() => onSetVideoUrl(homeTv.videoUrl)}
          sx={{ px: 2, py: 2 }}
          startIcon={<Iconify icon="iconoir:play-solid" />}
        >
          Play
        </Button>
      </Stack>
      <Image
        disabledEffect
        alt="grid"
        src={homeTv.homeCoverUrl}
        overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 30%, ${
          theme.palette.grey[900]
        } 100%)`}
        sx={{ position: 'absolute', width: 1, height: '60%', objectFit: 'contain' }}
      />
      <Box
        sx={{
          px: 1.5,
          py: 2,
          width: '100%',
          height: '40%',
          position: 'absolute',
          bottom: 0,
          overflowY: 'hidden',
          // border: '1px solid blue',
          ...bgBlur({ color: theme.palette.grey[900], opacity: 0.92 }),
        }}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          <CarouselItem item={_tvFeatured[0]} handleSetHomeTv={handleSetHomeTv} />
          <CarouselItem item={_tvFeatured[1]} handleSetHomeTv={handleSetHomeTv} />
          <CarouselItem item={_tvFeatured[2]} handleSetHomeTv={handleSetHomeTv} />
          <CarouselItem item={_tvFeatured[3]} handleSetHomeTv={handleSetHomeTv} />
        </Carousel>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  item: ItemProps;
  handleSetHomeTv: (item: ItemProps) => void;
};

function CarouselItem({ item, handleSetHomeTv }: CarouselItemProps) {
  const theme = useTheme();

  const { coverUrl, title, description } = item;

  return (
    <Box sx={{ mx: 1.5 }}>
      <Box sx={{ mb: 1.5 }} onClick={() => handleSetHomeTv(item)}>
        <Image
          alt={title}
          src={coverUrl}
          ratio="16/9"
          sx={{ width: 1, height: 0.9, borderRadius: 1 }}
        />
      </Box>
      <Typography variant="body2" sx={{ color: 'white' }} noWrap>
        {title}
      </Typography>
      <Typography variant="caption" sx={{ color: `${theme.palette.grey[500]}` }} noWrap>
        {description}
      </Typography>
    </Box>
  );
}
