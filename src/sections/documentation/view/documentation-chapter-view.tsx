import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { useGetContents } from 'src/api/documentation';

import Markdown from 'src/components/markdown';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

type Props = {
  section: string;
};

export default function DocumentationChapterView({ section }: Props) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const lightMode = theme.palette.mode === 'light';

  const { content, isLoading } = useGetContents(section);

  const renderNotFound = <EmptyContent filled title="No Data" sx={{ py: 12, my: 6, mx: -3 }} />;

  const maxWidthMode = section === 'introduction' ? 'md' : 'lg';
  const stretchMode = section === 'introduction' ? 'lg' : 'xl';

  return (
    <Container maxWidth={settings.themeStretch ? stretchMode : maxWidthMode} sx={{ mt: 1, mb: 1 }}>
      {isLoading && (
        <>
          <Skeleton height={260} variant="rectangular" sx={{ borderRadius: 2, my: 4 }} />
          <Stack spacing={3} sx={{ p: 0, my: 1 }}>
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} variant="rectangular" sx={{ height: 28, borderRadius: 0.75 }} />
            ))}
          </Stack>
        </>
      )}
      {!isLoading && !!content && (
        <Markdown
          sx={{
            p: { mb: 20 },
            hr: { marginY: 3.5, borderStyle: 'dashed' },
            h3: { my: 2 },
            h4: { my: 2 },
            '& .component-image': { borderRadius: 0 },
            '& ul, & ol': { my: 3 },
            '& pre, pre > code': {
              fontSize: 13,
            },
            '& pre': {
              fontSize: 12,
              lineHeight: 1.5,
              position: 'relative',
              left: '6%',
              width: '88%',
              color: theme.palette.common.white,
              backgroundColor: lightMode ? theme.palette.grey[800] : theme.palette.grey[800],
            },
          }}
          children={content}
        />
      )}

      {!isLoading && !content && renderNotFound}
    </Container>
  );
}
