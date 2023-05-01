import { Block } from 'payload/types';

const Content: Block = {
  slug: 'content',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
};

export default Content;
