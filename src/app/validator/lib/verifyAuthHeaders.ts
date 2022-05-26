/* eslint-disable no-underscore-dangle */
import Joi from 'joi';

const options = {
  errors: {
    wrap: {
      label: '',
    },
  },
  allowUnknown: true,
};

interface IHeader {
  iPlayerId: string;
  sAuthToken: string;
  iBattleId: string;
}

const Schema = Joi.object().keys({
  i_player_id: Joi.string().min(1).max(500).required(),
  s_auth_token: Joi.string().min(1).max(500).required(),
  i_battle_id: Joi.string().min(1).max(500).required(),
});

async function isValidRequest(data: any) {
  try {
    const _result = await Schema.validateAsync(data, options);
    const result: IHeader = { iPlayerId: _result.i_player_id, sAuthToken: _result.s_auth_token, iBattleId: _result.i_battle_id };
    return { error: false, info: '', value: result };
  } catch (err: any) {
    return { error: true, info: err.details[0]?.message };
  }
}

// eslint-disable-next-line import/prefer-default-export
export { isValidRequest };
