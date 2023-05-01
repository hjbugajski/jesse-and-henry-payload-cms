import { Access, FieldAccess } from 'payload/types';

import { User } from '../payload-types';

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) {
    return false;
  }

  if (user.roles?.includes('admin')) {
    return true;
  }

  return {
    id: {
      equals: user.id,
    },
  };
};

export const isAdminOrSelfFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user }, id }) => {
  return user?.roles?.includes('admin') || user?.id === id;
};
