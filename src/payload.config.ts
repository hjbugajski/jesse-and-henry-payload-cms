import path from 'path';

import { buildConfig } from 'payload/config';

import Guests from './collections/Guests';
import Pages from './collections/Pages';
import Parties from './collections/Parties';
import Relations from './collections/Relations';
import Sides from './collections/Sides';
import Users from './collections/Users';

export default buildConfig({
  admin: {
    user: Users.slug,
    css: path.resolve(__dirname, 'custom/styles/index.scss'),
  },
  collections: [Guests, Pages, Parties, Relations, Sides, Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  cors: [process.env.MONGODB_IP].filter(Boolean),
  csrf: [process.env.SERVER_URL, process.env.DOMAIN, process.env.PAYLOAD_DOMAIN].filter(Boolean),
  serverURL: process.env.SERVER_URL,
});
