import { m } from 'framer-motion';

import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { textGradient } from 'src/theme/css';

import { MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

type Props = {
  title: string;
};

const StyledDescription = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(0, 0, 3, 0),
}));

const StyledGradientText = styled(m.h2)(({ theme }) => ({
  ...textGradient(
    `300deg, #64B189 5%,
    #22A3E7 20%,
    #00A09C 50%,
    #F79D5D 60%,
    #ED6D1E 80%`
  ),
  backgroundSize: '200%',
  fontSize: `${42 / 18}rem`,
  textAlign: 'center',
  lineHeight: 1,
  marginTop: 0,
  marginBottom: 0,
  letterSpacing: 0,
  [theme.breakpoints.up('md')]: {
    fontSize: `${50 / 24}rem`,
  },
}));

export default function ChatWelcomeTitle({ title }: Props) {
  return (
    <Container
      component={MotionContainer}
      sx={{
        display: { md: 'flex' },
        justifyContent: { md: 'space-between' },
        mb: 0,
      }}
    >
      <StyledDescription>
        <StyledGradientText animate={{ backgroundPosition: '200% center' }}>
          {title}
        </StyledGradientText>
      </StyledDescription>
    </Container>
  );
}
