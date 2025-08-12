import React, { useRef, useEffect } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { Box, alpha, Theme, useTheme } from '@mui/material';

// Tools
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';
import ImageTool from '@editorjs/image';
import LinkTool from '@editorjs/link';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Delimiter from '@editorjs/delimiter';

interface JEditorProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  readOnly?: boolean;
  placeholder?: string;
  borderColor?: string | ((theme: Theme) => string);
}

const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    config: {
      levels: [1, 2, 3, 4],
      defaultLevel: 2,
      placeholder: ''
    }
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      placeholder: ''
    }
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
    config: {
      placeholder: ''
    }
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: '',
      captionPlaceholder: ''
    }
  },
  code: Code,
  inlineCode: {
    class: InlineCode
  },
  marker: {
    class: Marker
  },
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: '/api/upload/image', // Replace with your endpoint
        byUrl: '/api/fetch/image'    // Replace with your endpoint
      }
    }
  },
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: '/api/fetch/link', // Replace with your endpoint
    }
  },
  table: {
    class: Table,
    inlineToolbar: true
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
    config: {
      titlePlaceholder: 'Title',
      messagePlaceholder: 'Message'
    }
  },
  delimiter: Delimiter
};

const JEditor: React.FC<JEditorProps> = ({
  data,
  onChange,
  readOnly = false,
  placeholder = 'Start writing your content...',
  borderColor
}) => {
  const theme = useTheme();
  const editorRef = useRef<EditorJS | null>(null);
  const holderId = useRef(`editor-${Math.random().toString(36).slice(2, 7)}`);

  useEffect(() => {
    const initEditor = async () => {
      if (editorRef.current) {
        try {
          await editorRef.current.isReady;
          await editorRef.current.destroy();
        } catch (err) {
          console.error('Editor cleanup failed:', err);
        }
        editorRef.current = null;
      }

      const editor = new EditorJS({
        holder: holderId.current,
        tools: EDITOR_JS_TOOLS as any,
        data,
        placeholder,
        readOnly,
        onChange: async (api) => {
          const data = await api.saver.save();
          onChange?.(data);
        },
        autofocus: false
      });

      editorRef.current = editor;
    };

    initEditor().catch(console.error);

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.isReady
          .then(() => {
            if (editorRef.current?.destroy) {
              editorRef.current.destroy();
            }
            editorRef.current = null;
          })
          .catch(console.error);
      }
    };
  }, []);

  return (
    <Box
      id={holderId.current}
      sx={{
        minHeight: 300,
        border: '1px solid',
        borderColor: typeof borderColor === 'function' ? borderColor(theme) : borderColor || theme.palette.divider,
        borderRadius: 1,
        p: 2,
        '& .ce-toolbar__plus, & .ce-toolbar__settings-btn, & .cdx-button': {
          color: theme => 
            theme.palette.mode === 'dark' 
              ? alpha(theme.palette.common.white, 0.7)
              : alpha(theme.palette.common.black, 0.7),
          backgroundColor: 'transparent'
        },
        '& .ce-toolbar__plus:hover, & .ce-toolbar__settings-btn:hover, & .cdx-button:hover': {
          backgroundColor: theme =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.1)
              : alpha(theme.palette.common.black, 0.1)
        },
        '& ::selection': {
          backgroundColor: theme =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.3)
              : alpha(theme.palette.primary.main, 0.3),
          color: theme =>
            theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.common.black
        },
        '& ::-moz-selection': {
          backgroundColor: theme =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.3)
              : alpha(theme.palette.primary.main, 0.3),
          color: theme =>
            theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.common.black
        },
        '& .ce-block--selected': {
          backgroundColor: theme =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.1)
              : alpha(theme.palette.primary.main, 0.05),
          color: theme =>
            theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.text.primary
        },
        '& .ce-block--selected .ce-block__content': {
          color: theme =>
            theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.text.primary
        }
      }}
    />
  );
};

export default JEditor;
