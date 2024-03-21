import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

type Props = {
  code: string;
  updateCode: (value: string) => void;
};

export default function FunctionDetailsCodeEditor({ code, updateCode }: Props) {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  const onChange = (newValue: string) => updateCode(newValue);

  return (
    <Box
      sx={{
        minHeight: 300,
        maxHeight: 'calc(100vh - 512px)',
        height: code.split('\n').length * 20.5,
        py: 0.75,
        borderRadius: 1,
        backgroundColor: `${theme.palette.background.default}`,
        mb: 3,
      }}
    >
      <AceEditor
        mode="python"
        value={code}
        theme={isLight ? 'textmate' : 'tomorrow_night_bright'}
        onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        showPrintMargin={false}
        fontSize={13}
        editorProps={{ $blockScrolling: true }}
        height="100%"
        width="100%"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showGutter: true,
          highlightActiveLine: false,
        }}
        style={{
          fontFamily: "'Fira Code', monospace",
          lineHeight: 1.5,
          backgroundColor: `${theme.palette.background.default}`,
        }}
      />
    </Box>
  );
}
