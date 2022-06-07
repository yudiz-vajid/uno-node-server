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
  bMustCollectOnMissTurn: Joi.boolean().optional().default(true),
  bSkipTurnOnDrawTwoOrFourCard: Joi.boolean().optional().default(true),
  bStackingDrawCards: Joi.boolean().optional().default(true),
  bVisualEffectOnUnoButton: Joi.boolean().optional().default(true),

  nTotalGameTime: Joi.number()
    .optional()
    .default(180 * 60 * 1000),
  nTurnTime: Joi.number().optional().default(10000),
  nGraceTime: Joi.number().optional().default(10000),

  nStartingNormalCardCount: Joi.number().optional().default(4),
  // nStartingActionCardCount: Joi.number().optional().default(3),
  nStartingSpecialCardCount: Joi.number().optional().default(0),

  nTotalPlayerCount: Joi.number().optional().default(2),
  nUnoTime: Joi.number().optional().default(10000),
  nSpecialMeterFillCount: Joi.number().optional().default(2),
  nGameInitializeTime: Joi.number().optional().default(5000), // - after all users join
  nTotalSkipTurnCount: Joi.number().optional().default(3),

  aCardScore: Joi.array().items(Joi.number().required()).length(15).optional().default([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 20, 20, 50, 50]),
});

async function isValidRequest(data: any) {
  try {
    const { aCardScore: cardScore, ...rest } = data;
    if (typeof cardScore === 'string') {
      const aCardScore = cardScore.split(',');
      rest.aCardScore = aCardScore;
    } else rest.aCardScore = cardScore;

    // const result: Omit<ISettings, 'aCardScore'> = await Schema.validateAsync(data, options);
    const result: ISettings = await Schema.validateAsync(rest, options);
    return { error: false, info: '', value: result };
  } catch (err: any) {
    return { error: true, info: err.details[0]?.message };
  }
}

// eslint-disable-next-line import/prefer-default-export
export { isValidRequest };
