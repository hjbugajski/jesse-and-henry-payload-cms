import dotenv from 'dotenv';
import { BeforeValidateHook } from 'payload/dist/collections/config/types';
import { CollectionConfig, Field } from 'payload/types';

import { isAdmin, isAdminFieldLevel, isAdminSelfOrParty } from '../access';
import GuestList from '../custom/components/GuestList';
import { Guest } from '../payload-types';

dotenv.config();

const cleanString = (party: string) => party.toLowerCase().replace(/[^a-zA-Z]/g, '');

const beforeValidateHook: BeforeValidateHook<Guest> = async ({ data, operation, req, originalDoc }) => {
  if (operation === 'create') {
    const { email, first, middle, last, sort } = data;
    const limit = await req.payload.find({ collection: 'guests' }).then((data) => data.totalDocs);
    let newEmail = email;
    let newSort = data.sort;

    if ((!email || email === `new${process.env.EMAIL}`) && (!first || !last)) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const existingEmails = await req.payload
        .find({ collection: 'guests', limit })
        .then((data) => data.docs.map((doc: Guest) => doc.email));

      do {
        let result = '';

        for (let i = 0; i < 10; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        newEmail = result + process.env.EMAIL;
      } while (existingEmails.includes(newEmail));
    }

    if ((!email || email === `new${process.env.EMAIL}`) && first && last) {
      newEmail = `${cleanString(first)}${cleanString(middle ?? '')}${cleanString(last)}${process.env.EMAIL}`;
    }

    if ((!sort && sort !== 0) || sort === -1) {
      const guests = await req.payload.find({ collection: 'guests', limit }).then((data) => data.docs as Guest[]);

      newSort = guests.length ?? 0;
    }

    return { ...data, email: newEmail, sort: newSort };
  }

  if (operation === 'update') {
    let newData = data;

    const updatePassword = async (party: string) => {
      const token = await req.payload.forgotPassword({
        collection: 'guests',
        data: {
          email: originalDoc.email,
        },
        req,
      });

      await req.payload.resetPassword({
        collection: 'guests',
        data: {
          token,
          password: `${process.env.GUEST_PASSWORD}-${party}`,
        },
        overrideAccess: true,
        req,
      });
    };

    if (data.party) {
      const code = await req.payload
        .findByID({
          collection: 'parties',
          id: data.party as string,
        })
        .then((data) => data.code);

      await updatePassword(code);
    } else if (data.party === null) {
      await updatePassword('party');
    }

    const first = data.first ?? originalDoc.first ?? '';
    const middle = data.middle ?? originalDoc.middle ?? '';
    const last = data.last ?? originalDoc.last ?? '';
    const email = `${cleanString(first)}${cleanString(middle)}${cleanString(last)}${process.env.EMAIL}`;

    if (first && last && email !== originalDoc.email) {
      newData = {
        ...data,
        email,
      };
    }

    return newData;
  }
};

const rsvpOptionField: Field = {
  name: 'rsvpOption',
  type: 'select',
  options: [
    {
      label: 'Accepted',
      value: 'accept',
    },
    {
      label: 'Declined',
      value: 'decline',
    },
  ],
  admin: {
    isClearable: true,
  },
};

const Guests: CollectionConfig = {
  slug: 'guests',
  auth: true,
  admin: {
    useAsTitle: 'first',
    group: 'Guests Collections',
    pagination: {
      defaultLimit: 250,
      limits: [5, 10, 25, 50, 100, 250, 500],
    },
    defaultColumns: [
      'first',
      'middle',
      'last',
      'party',
      'side',
      'relation',
      'email',
      'phone',
      'address',
      'rsvpWelcomeParty',
      'rsvpWedding',
      'rsvpBrunch',
      'sort',
    ],
    components: {
      views: {
        List: GuestList,
      },
    },
    disableDuplicate: true,
  },
  hooks: {
    beforeValidate: [beforeValidateHook],
  },
  defaultSort: 'sort',
  access: {
    create: isAdmin,
    read: isAdminSelfOrParty,
    update: isAdminSelfOrParty,
    delete: isAdmin,
  },
  endpoints: [
    {
      path: '/',
      method: 'post',
      handler: async (req, res) => {
        if (!isAdmin({ req })) {
          return res.status(401).json({
            message: 'Unauthorized',
          });
        }

        return await req.payload
          .create({
            collection: 'guests',
            data: {
              ...req.body,
              password: `${process.env.GUEST_PASSWORD}-${cleanString(req.body.party ?? 'party')}`,
            },
          })
          .then((doc) =>
            res.status(200).json({
              message: 'Guest successfully created.',
              doc,
            })
          )
          .catch((err) => res.status(500).json(err));
      },
    },
    {
      path: '/reorder',
      method: 'patch',
      handler: async (req, res) => {
        if (!isAdmin({ req })) {
          return res.status(401).json({
            message: 'Unauthorized',
          });
        }

        const reqDocs: Guest[] = req.body.docs ?? [];

        return await Promise.all(
          reqDocs.map((guest: Guest, index: number) =>
            req.payload.update({
              collection: 'guests',
              id: guest.id,
              data: {
                sort: index,
              },
            })
          )
        )
          .then((results) =>
            res.status(200).json({
              message: 'Guests reordered.',
              results,
            })
          )
          .catch((err) => res.status(500).json(err));
      },
    },
  ],
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      access: {
        create: isAdminFieldLevel,
        read: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
    {
      name: 'first',
      label: 'First Name',
      type: 'text',
    },
    {
      name: 'middle',
      label: 'Middle Name',
      type: 'text',
    },
    {
      name: 'last',
      label: 'Last Name',
      type: 'text',
    },
    {
      name: 'party',
      label: 'Party',
      type: 'relationship',
      relationTo: 'parties',
      access: {
        create: isAdminFieldLevel,
        read: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
    {
      name: 'side',
      label: 'Side',
      type: 'relationship',
      relationTo: 'sides',
      access: {
        create: isAdminFieldLevel,
        read: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
    {
      name: 'relation',
      label: 'Relation',
      type: 'relationship',
      relationTo: 'relations',
      access: {
        create: isAdminFieldLevel,
        read: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'text',
      access: {
        create: isAdminFieldLevel,
        read: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      access: {
        create: isAdminFieldLevel,
        read: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
    {
      ...rsvpOptionField,
      name: 'rsvpWelcomeParty',
      label: 'RSVP Welcome Party',
    },
    {
      ...rsvpOptionField,
      name: 'rsvpWedding',
      label: 'RSVP Wedding',
    },
    {
      ...rsvpOptionField,
      name: 'rsvpBrunch',
      label: 'RSVP Brunch',
    },
    {
      name: 'sort',
      label: 'Sort',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
      access: {
        create: isAdminFieldLevel,
        read: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
  ],
};

export default Guests;
