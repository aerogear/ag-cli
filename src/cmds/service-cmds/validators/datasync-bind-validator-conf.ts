import { ValidatorConfig } from 'json-data-validator';

export const conf: ValidatorConfig = {
  ruleSets: [
    {
      fields: {
        syncServerUrl: [
          {
            type: 'VALID_URL',
          },
        ],
        graphqlEndpoint: [
          {
            type: 'VALID_URL_PATH',
          },
        ],
      },
    },
  ],
};
