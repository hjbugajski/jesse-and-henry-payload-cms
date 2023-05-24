import { CollectionConfig } from 'payload/types';

import { isAdmin } from '../access';

const Tags: CollectionConfig = {
  slug: 'tags',
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'value',
    group: 'Guests Collections',
    defaultColumns: ['id', 'value', 'sort'],
  },
  defaultSort: 'sort',
  fields: [
    {
      name: 'value',
      label: 'Value',
      type: 'text',
      required: true,
    },
    {
      name: 'color',
      label: 'Color',
      type: 'select',
      options: [
        {
          label: 'Green',
          value: 'green',
        },
        {
          label: 'Teal',
          value: 'teal',
        },
        {
          label: 'Cyan',
          value: 'cyan',
        },
        {
          label: 'Blue',
          value: 'blue',
        },
        {
          label: 'Violet',
          value: 'violet',
        },
        {
          label: 'Purple',
          value: 'purple',
        },
        {
          label: 'Plum',
          value: 'plum',
        },
        {
          label: 'Pink',
          value: 'pink',
        },
        {
          label: 'Red',
          value: 'red',
        },
        {
          label: 'Orange',
          value: 'orange',
        },
      ],
      admin: {
        isClearable: true,
      },
    },
    {
      name: 'sort',
      label: 'Sort',
      type: 'number',
      defaultValue: 0,
    },
  ],
};

export default Tags;
