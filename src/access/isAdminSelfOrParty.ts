import { Access } from 'payload/types';

export const isAdminSelfOrParty: Access = ({ req: { user } }) => {
  if (!user) {
    return false;
  }

  if (user.roles?.includes('admin')) {
    return true;
  }

  console.log(user.party);

  return {
    or: [
      {
        party: {
          equals: user.party?.id,
        },
      },
      {
        id: {
          equals: user.id,
        },
      },
    ],
  };
};
