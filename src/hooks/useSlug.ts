import { FieldHook } from 'payload/types';

export const useSlug: FieldHook = ({ operation, siblingData }) => {
  if (operation === 'create') {
    return siblingData.name.toLowerCase().replace(/\s+/g, '-');
  }
};
