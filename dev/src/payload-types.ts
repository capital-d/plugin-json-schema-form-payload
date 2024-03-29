/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    jsonformExamples: JsonformExample;
    users: User;
    innerSchema: InnerSchema;
    simplePage: SimplePage;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {};
}
export interface JsonformExample {
  id: number;
  title?: string | null;
  jsonForm: {
    data:
      | {
          [k: string]: unknown;
        }
      | unknown[]
      | string
      | number
      | boolean
      | null;
    schema:
      | {
          [k: string]: unknown;
        }
      | unknown[]
      | string
      | number
      | boolean
      | null;
    uiSchema?:
      | {
          [k: string]: unknown;
        }
      | unknown[]
      | string
      | number
      | boolean
      | null;
  };
  updatedAt: string;
  createdAt: string;
}
export interface User {
  id: number;
  roles?: ('admin' | 'editor')[] | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
}
export interface InnerSchema {
  id: number;
  title?: string | null;
  layout: {
    columns?:
      | {
          jsonForm: {
            data:
              | {
                  [k: string]: unknown;
                }
              | unknown[]
              | string
              | number
              | boolean
              | null;
            schema:
              | {
                  [k: string]: unknown;
                }
              | unknown[]
              | string
              | number
              | boolean
              | null;
            uiSchema?:
              | {
                  [k: string]: unknown;
                }
              | unknown[]
              | string
              | number
              | boolean
              | null;
          };
          enableLink?: boolean | null;
          id?: string | null;
        }[]
      | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'content';
  }[];
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
export interface SimplePage {
  id: number;
  title: string;
  publishedAt?: string | null;
  layout: {
    columns?:
      | {
          jsonForm: {
            data:
              | {
                  [k: string]: unknown;
                }
              | unknown[]
              | string
              | number
              | boolean
              | null;
            schema:
              | {
                  [k: string]: unknown;
                }
              | unknown[]
              | string
              | number
              | boolean
              | null;
            uiSchema?:
              | {
                  [k: string]: unknown;
                }
              | unknown[]
              | string
              | number
              | boolean
              | null;
          };
          enableLink?: boolean | null;
          id?: string | null;
        }[]
      | null;
    id?: string | null;
    blockName?: string | null;
    blockType: 'content';
  }[];
  slug?: string | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadPreference {
  id: number;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadMigration {
  id: number;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}