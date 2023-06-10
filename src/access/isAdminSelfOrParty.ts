import { Access } from 'payload/types';

export const isAdminSelfOrParty: Access = ({ req: { user } }) => {
  if (!user) {
    return false;
  }

  if (user.roles?.includes('admin')) {
    return true;
  }

  return {
    or: [
      {
        and: [
          {
            party: {
              exists: true,
            },
          },
          {
            party: {
              not_equals: null,
            },
          },
          {
            party: {
              equals: user.party?.id,
            },
          },
        ],
      },
      {
        id: {
          equals: user.id,
        },
      },
    ],
  };
};
