import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import Examples from './collections/Examples';
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { slateEditor } from '@payloadcms/richtext-slate'
import InnerSchema from './collections/InnerSchema';
import { Simple } from './collections/Simple';
import { Media } from './collections/Media';
import { Images } from './collections/Images';
// import { jsonSchemaFormPlugin } from '../../src/index'

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: config => {
      const newConfig = {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(config?.resolve?.alias || {}),
            react: path.join(__dirname, '../node_modules/react'),
            'react-dom': path.join(__dirname, '../node_modules/react-dom'),
            payload: path.join(__dirname, '../node_modules/payload'),
          },
        },
      }
      return newConfig
    },
  },
    localization: {
    locales: [
      {
        label: {
          en: 'English', // English label
          ru: 'Английский', // Norwegian label
        },
        code: 'en',
      },
      {
        label: {
          en: 'Russian', // English label
          ru: 'Русский', // Norwegian label
        },
        code: 'ru',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor({}),
  collections: [
    Examples, Users, InnerSchema, Simple, Media, Images
  ],
  upload: {
    limits: {
      fileSize: 25000000, // 5MB, written in bytes
    },
  },
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
  ],
  db: postgresAdapter({
    pool: {
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
  }),
  // db: mongooseAdapter({
  //   url: process.env.DATABASE_URI,
  // }),
})
