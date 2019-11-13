import { ValidatorConfig } from 'json-data-validator';

export const conf: ValidatorConfig = {
  ruleSets: [
    {
      fields: {
        variant: [
          {
            type: 'REQUIRED',
            errorMessage:
              'Bad service configuration - variant field is required',
          },
          {
            type: 'COMPOSITE',
            algorithm: 'any',
            errorMessage: `Bad service configuration - variant can be either 'ios' or 'android'`,
            subRules: [
              {
                type: 'EXACT_VALUE',
                value: 'android',
              },
              {
                type: 'EXACT_VALUE',
                value: 'ios',
              },
            ],
          },
        ],
      },
    },
    {
      constraints: [
        {
          type: 'FIELD_VALUE',
          path: 'variant',
          value: 'android',
        },
      ],
      fields: {
        serverKey: [
          {
            type: 'REQUIRED',
            errorMessage: 'Bad service configuration - serverKey is required',
          },
        ],
        senderId: [
          {
            type: 'REQUIRED',
            errorMessage: 'Bad service configuration - senderId is required',
          },
        ],
      },
    },
  ],
};
