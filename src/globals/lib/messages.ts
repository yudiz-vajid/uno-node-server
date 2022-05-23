const customMessages: any = {
  custom_message: { code: 200, message: 'custom message' },
  insufficient_balance: { code: 419, message: 'Sorry, You have insufficient balance' },
  wait_for_turn: { code: 419, message: 'Please wait for your turn.' },
  invalid_hand_length: { code: 419, message: 'Invalid hand length' },
  user_blocked: { code: 419, message: 'Your account is blocked please contact to the support' },
  user_deleted: { code: 419, message: 'Your account is deleted please contact to the support' },
};
/**
 * Push notification message
 */

const notifications = {};

const builder: any = {
  invalid_req: (prefix: string): any => builder.prepare(406, prefix, 'invalid Request'),
  wrong_otp: (prefix: string): any => builder.prepare(403, prefix, 'entered OTP is invalid'),
  server_error: (prefix: string): any => builder.prepare(500, prefix, 'server error'),
  server_maintenance: (prefix: string): any => builder.prepare(500, prefix, 'maintenance mode is active'),
  unauthorized: (prefix: string): any => builder.prepare(401, prefix, 'authentication Error, please try logging again'),
  inactive: (prefix: string): any => builder.prepare(403, prefix, 'inactive'),
  not_found: (prefix: string): any => builder.prepare(404, prefix, 'not found'),
  not_matched: (prefix: string): any => builder.prepare(406, prefix, 'not matched'),
  not_verified: (prefix: string): any => builder.prepare(406, prefix, 'not verified'),
  already_exists: (prefix: string): any => builder.prepare(409, prefix, 'already exists'),
  user_deleted: (prefix: string): any => builder.prepare(406, prefix, 'deleted by admin'),
  user_blocked: (prefix: string): any => builder.prepare(406, prefix, 'blocked by admin'),
  required_field: (prefix: string): any => builder.prepare(419, prefix, 'field required'),
  too_many_request: (prefix: string): any => builder.prepare(429, prefix, 'too many request'),
  expired: (prefix: string): any => builder.prepare(417, prefix, 'expired'),
  canceled: (prefix: string): any => builder.prepare(419, prefix, 'canceled'),
  created: (prefix: string): any => builder.prepare(200, prefix, 'created'),
  updated: (prefix: string): any => builder.prepare(200, prefix, 'updated'),
  deleted: (prefix: string): any => builder.prepare(417, prefix, 'deleted'),
  blocked: (prefix: string): any => builder.prepare(401, prefix, 'blocked'),
  success: (prefix: string): any => builder.prepare(200, prefix, 'success'),
  successfully: (prefix: string): any => builder.prepare(200, prefix, 'successfully'),
  error: (prefix: string): any => builder.prepare(500, prefix, 'error'),
  no_prefix: (prefix: string): any => builder.prepare(200, prefix, ''),
  custom: { ...customMessages },
  getString: (key: string): any => (customMessages ? customMessages[key].message : ''),
  // custom: (key) => builder.prepare(...customMessages[key], ''),
  notifications,
  grab_card_error_table: (prefix: string): any => builder.prepare(419, prefix, 'can not grab Card while table - '),
  grab_card_error_player: (prefix: string): any => builder.prepare(419, prefix, 'can not grab Card while player - '),
  discard_card_error_table: (prefix: string): any => builder.prepare(419, prefix, 'can not discard card while table -'),
  group_card_error_table: (prefix: string): any => builder.prepare(419, prefix, 'can not group hand while table - '),
  group_card_error_player: (prefix: string): any => builder.prepare(419, prefix, 'can not group hand while player '),
};

Object.defineProperty(builder, 'prepare', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: (code: number, prefix: string, message: string) => ({
    code,
    message: `${prefix ? `${prefix} ${message}` : message}`,
  }),
});

export default builder;
