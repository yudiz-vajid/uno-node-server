import Joi from 'joi';

const options = {
  errors: {
    wrap: {
      label: '',
    },
  },
};

const Schema = Joi.object().keys({
  applicationKey: Joi.number().optional(),
  user_id: Joi.string().length(24).hex().required(),
  access_token: Joi.string().min(1).max(500).required(),
});

async function isValidRequest(data: any) {
  try {
    const result = await Schema.validateAsync(data, options);
    return { error: false, info: '', value: result };
  } catch (err: any) {
    return { error: true, info: err.details[0]?.message };
  }
}

// eslint-disable-next-line import/prefer-default-export
export { isValidRequest as authenticate };
