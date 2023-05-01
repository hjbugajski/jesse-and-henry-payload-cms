import { Block } from 'payload/types';

export const HeroTitle: Block = {
  slug: 'heroTitle',
  fields: [
    {
      name: 'titleOne',
      type: 'text',
      label: 'Title One',
      required: true,
    },
    {
      name: 'titleTwo',
      type: 'text',
      label: 'Title Two',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      required: true,
    },
  ],
};
