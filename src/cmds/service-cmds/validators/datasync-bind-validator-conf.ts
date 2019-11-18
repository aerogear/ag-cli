import { ValidatorConfig } from 'json-data-validator';

export const conf: ValidatorConfig = {
  ruleSets: [
    {
      fields: {
        syncServerUrl: [
          {
            type: 'REQUIRED',
          },
          {
            type: 'VALID_URL',
          },
        ],
        graphqlEndpoint: [
          {
            type: 'REQUIRED',
          },
          {
            type: 'VALID_URL_PATH',
          },
        ],
      },
    },
  ],
};
