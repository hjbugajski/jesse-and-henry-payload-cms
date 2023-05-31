import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { ICellEditorParams } from 'ag-grid-community';

import './TextareaEditor.scss';

const TextareaEditor = memo(
  forwardRef((props: ICellEditorParams, ref) => {
    const refTextarea = useRef(null);

    const [value, setValue] = useState(props.value);

    useImperativeHandle(
      ref,
      () => ({
        getValue: () => value,
      }),
      [value]
    );

    useEffect(() => {
      refTextarea.current.focus();
    }, []);

    return (
      <textarea
        ref={refTextarea}
        value={value}
        rows={3}
        onChange={(event) => setValue(event.target.value)}
        onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
        className="textarea-editor"
      />
    );
  })
);

export default TextareaEditor;
