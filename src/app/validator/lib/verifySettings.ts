import Joi from 'joi';
import { ISettings } from '../../../types/global';

const options = {
  errors: {
    wrap: {
      label: '',
    },
  },
  allowUnknown: true,
};

const Schema = Joi.object().keys({
  bMustCollectOnMissTurn: Joi.boolean().required(),
  nUnoTime: Joi.number().required(),
  nTurnMissLimit: Joi.number().required(),
  nGraceTime: Joi.number().required(),
  nTurnTime: Joi.number().required(),
  nStartGameTime: Joi.number().required(),
});

async function isValidRequest(data: any) {
  try {
    // const result: Omit<ISettings, 'aCardScore'> = await Schema.validateAsync(data, options);
    const result: ISettings = await Schema.validateAsync(data, options);
    return { error: false, info: '', value: result };
  } catch (err: any) {
    return { error: true, info: err.details[0]?.message };
  }
}

// eslint-disable-next-line import/prefer-default-export
export { isValidRequest };
