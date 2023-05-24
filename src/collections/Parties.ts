import { BeforeValidateHook } from 'payload/dist/collections/config/types';
import { CollectionConfig } from 'payload/types';

import Tags from './Tags';
import { Party } from '../payload-types';

const beforeValidateHook: BeforeValidateHook<Party> = async ({ data, operation, req }) => {
  if (operation === 'create') {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const existingCodes = await req.payload
      .find({ collection: 'parties' })
      .then((data) => data.docs.map((doc: Party) => doc.code));
    let code = '';

    do {
      code = '';

      while (code.length < 6) {
        const char = characters.charAt(Math.floor(Math.random() * characters.length));

        if (code.length === 0 || code[code.length - 1] !== char) {
          code += char;
        }
      }
    } while (existingCodes.includes(code));

    return { ...data, code };
  }
};

const Parties: CollectionConfig = {
  ...Tags,
  slug: 'parties',
  hooks: {
    beforeValidate: [beforeValidateHook],
  },
  fields: [
    ...Tags.fields,
    {
      name: 'code',
      label: 'Code',
      type: 'text',
    },
  ],
};

export default Parties;
