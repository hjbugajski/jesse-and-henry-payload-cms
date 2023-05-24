import React, {
  CSSProperties,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ICellEditorParams } from 'ag-grid-community';
import { useConfig } from 'payload/components/utilities';
import Select, { ClearIndicatorProps, components, OptionProps, SingleValueProps } from 'react-select';
import AsyncSelect from 'react-select/async';

import './SelectEditor.scss';

import Icon from './Icon';
import Tag from './Tag';

interface SelectEditorProps extends ICellEditorParams {
  collection?: string;
  getLabel: (value: any) => string;
  getValue: (value: any) => any;
  isClearable?: boolean;
  options?: any[];
}

const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ClearIndicator = (props: ClearIndicatorProps) => {
  const { getStyles, innerProps } = props;

  return (
    <div
      {...innerProps}
      className="relation-editor__indicator"
      style={getStyles('clearIndicator', props) as CSSProperties}
    >
      <Icon name="close" />
    </div>
  );
};

const DropdownIndicator = (props: ClearIndicatorProps) => {
  const { getStyles, innerProps } = props;

  return (
    <div
      {...innerProps}
      className="relation-editor__indicator"
      style={getStyles('clearIndicator', props) as CSSProperties}
    >
      <Icon name="expand_more" />
    </div>
  );
};

const SingleValue = (props: SingleValueProps<any>) => {
  return (
    <components.SingleValue {...props}>
      {props.getValue() ? <Tag value={props.getValue()[0].value} color={props.getValue()[0].color} /> : null}
    </components.SingleValue>
  );
};

const Option = (props: OptionProps<any>) => (
  <components.Option {...props}>
    {props.data ? <Tag value={props.data.value} color={props.data.color} /> : null}
  </components.Option>
);

const SelectEditor = memo(
  forwardRef((props: SelectEditorProps, ref) => {
    const {
      collection,
      getLabel,
      getValue,
      isClearable,
      options: initialOptions = [],
      stopEditing,
      value: initialValue,
    } = props;

    const refContainer = useRef(null);

    const [value, setValue] = useState(
      collection ? initialValue : initialOptions.find((option) => getValue(option) === initialValue)
    );

    const { serverURL } = useConfig();

    const loadOptions = useCallback(async () => {
      const res = await fetch(`${serverURL}/api/${collection}?limit=250`, {
        credentials: 'include',
      });

      if (res.status !== 200) {
        return [];
      }

      const data = await res.json();

      return data.docs;
    }, [collection, serverURL]);

    const onChange = useCallback(
      async (option: any) => {
        setValue(option);

        await timeout(50);

        stopEditing();
      },
      [stopEditing]
    );

    useImperativeHandle(
      ref,
      () => ({
        getValue: () => (value ? (collection ? value : getValue(value)) : null),
      }),
      [collection, getValue, value]
    );

    const defaultSelectProps = useMemo(
      () => ({
        ref: refContainer,
        className: 'relation-editor',
        classNamePrefix: 'relation-editor',
        closeMenuOnSelect: true,
        components: {
          ClearIndicator,
          DropdownIndicator,
        },
        defaultMenuIsOpen: true,
        defaultValue: value,
        getOptionLabel: (option: any) => getLabel(option),
        getOptionValue: (option: any) => getValue(option),
        isClearable: isClearable ?? false,
        isSearchable: false,
        onChange,
        unstyled: true,
      }),
      [collection, getLabel, getValue, initialOptions, isClearable, onChange, value]
    );

    if (collection) {
      return (
        <AsyncSelect
          {...defaultSelectProps}
          components={{
            ...defaultSelectProps.components,
            SingleValue,
            Option,
          }}
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
        />
      );
    }

    return <Select {...defaultSelectProps} options={initialOptions} />;
  })
);

export default SelectEditor;
