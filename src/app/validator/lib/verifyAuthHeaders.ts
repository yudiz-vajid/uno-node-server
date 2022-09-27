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
  sPlayerName: string;
  sAuthToken: string;
  iBattleId: string;
  isReconnect: boolean;
  iLobbyId: string;
  nTablePlayer: number;
  nMinTablePlayer: number;
  isNewMatchMakingFlowEnabled: boolean;
}

const Schema = Joi.object().keys({
  i_player_id: Joi.string().min(1).max(500).required(),
  s_player_name: Joi.string().min(1).max(500).optional().default(''),
  s_auth_token: Joi.string().min(1).max(500).required(),
  i_battle_id: Joi.string().min(1).max(500),
  isReconnect: Joi.boolean().required().default(false),
  nTablePlayer: Joi.number(),
  nMinTablePlayer: Joi.number().default(2),
  isNewMatchMakingFlowEnabled: Joi.boolean().default(false),
});

async function isValidRequest(data: any) {
  try {
    const _result = await Schema.validateAsync(data, options);
    const result: IHeader = {
      iPlayerId: _result.i_player_id,
      isNewMatchMakingFlowEnabled: _result.isNewMatchMakingFlowEnabled,
      sPlayerName: _result.s_player_name,
      sAuthToken: _result.s_auth_token,
      iBattleId: _result.i_battle_id,
      isReconnect: _result.isReconnect,
      iLobbyId: _result.i_lobby_id,
      nTablePlayer: _result.nTablePlayer,
      nMinTablePlayer: _result.nMinTablePlayer,
    };
    return { error: false, info: '', value: result };
  } catch (err: any) {
    return { error: true, info: err.details[0]?.message };
  }
}

// eslint-disable-next-line import/prefer-default-export
export { isValidRequest };
