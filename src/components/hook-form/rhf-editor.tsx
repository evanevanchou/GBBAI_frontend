import { useEffect } from 'react';
import { RangeStatic } from 'quill';
// import ReactQuill from 'react-quill';
import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

import Editor, { EditorProps } from '../editor';

// ----------------------------------------------------------------------

interface Props extends EditorProps {
  name: string;
  onSetSelectedText?: (selected: { start: number; length: number; text: string } | null) => void;
}

export default function RHFEditor({ name, onSetSelectedText, helperText, ...other }: Props) {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  const values = watch();

  // const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (values[name] === '<p><br></p>') {
      setValue(name, '', {
        shouldValidate: !isSubmitSuccessful,
      });
    }
  }, [isSubmitSuccessful, name, setValue, values]);

  const handleSelectionChange = (range: RangeStatic | null, source: string, editor: any) => {
    if (!range) {
      if (onSetSelectedText) onSetSelectedText(null);
      return;
    }

    // const quill = quillRef.current?.getEditor();
    // const selection = quill?.getSelection();

    const selectedText = range && editor.getText(range.index, range.length);
    if (onSetSelectedText)
      onSetSelectedText({ start: range.index, length: range.length, text: selectedText });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Editor
          id={name}
          value={field.value}
          onChange={(event) => {
            field.onChange(event);
          }}
          error={!!error}
          helperText={
            (!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ px: 2 }}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )
          }
          onChangeSelection={handleSelectionChange}
          {...other}
        />
      )}
    />
  );
}
