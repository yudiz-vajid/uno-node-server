export = Object.freeze({
  GAME_NAME: 'callbreak',
  REDIS_CLEAR_TIMEOUT: 5400,
  ROBOT_BID_TIMER: 2000,
  TUTORIAL_BID_TIMER: 6000,
  TURN_TIMER: 10000,
  GAME_STARTNEW: 6000,
  GAME_START: 15000,
  CREATE_BATTLE_TIME: 3000,
  TIPS_SHOW_TIME: 8,
  TIPS_REMOVE_TIME: 5000,
  TUTORIAL_TURN_TIMER: 10,
  WIN_TIMER: 2000,
  BID_TIMER: 10000,
  ROBOT_TIMER: 2,
  ROBOT_TURN_TIMER: 1000,
  FORCE_WIN_TURN: 2,
  LOCK_IN_PERIOD: 5,
  bonusCallsEnabled: true,
  bonusCalls: 8,
  bidLimitEnabled: false,
  bidLimit: 2,
  redistribution_global: false,
  redistribution_lobbies: [1],
  DEFAULT_EXPIRY: 5400,
  LOBBY_EXPIRY: 86400, // one day
  enableToast: false,
  isValidThrowTest: false,
  inValidTurns: [1, 6, 9],
  COUNTRY: 'IN',
  COMMON_ERROR: 'Oops! Something went wrong. Please try again later.',
  LIM: 'PLAYERS ON THIS TABLE HAVE BEEN LOCKED. NOTE: ENTRY FEE WILL BE DEDUCTED IF YOU LEAVE THE TABLE NOW',
  IMWPM:
    "You don't have sufficient amount in your MPL wallet. Please add money and come back again. Thank you!",
  TUQ: 'All players have quit. This game will end now.',
  TUIA: 'All players are inactive now. The game will end after next turn.',
  AUIA: 'Since all the players are disconnected/inactive, this game will be cancelled after next turn. Please return to the game to continue playing.',
  GSSP: 'Game score submission in progress..',
  RITUT: 'You were disconnected. Please restart to continue.',
  WTIARAE: 'This game has ended due to inactivity.',
  GSDM: 'There was an error in debiting from your MPL wallet. Please try again later!',
  LEM: 'This lobby has expired.',
  FSFM: 'There was an error in submitting your score. You will get your money back in 30 minutes. Thank you!',
  TIPS: [
    'If you do not take your turn for two consecutive times,you are considered as Inactive.',
    'Spades are permanent trumps: any card of the Spade suit beats any card of any other suit.',
    'Keep playing till the last turn even when all your opponents have left the table.',
    'Deal, bids and play are counter-clockwise.',
    'You can rejoin your running game from the lobby again if your MPL wallet balance is more than the entry fee of the lobby.',
    'Calls of 8 tricks or more are bonus calls. A player who bids 8 or more scores 13 points if successful.',
    'Bid smartly. A lower bid does not always mean that you are safe.',
    'Entry fee is not deducted from your MPL wallet if you rejoin your running game.',
    'Discard your non-trump Aces in the beginning. You do not want others to use trump cards against your Ace.',
    'You cannot rejoin a game if you have willingly Exit the table.'
  ],
  FRAUD_USER_TEXT:
    'You have been found violating fairplay policies and have been banned from MPL',
  FINISH_BATTLE_FRAUD_ROOM_TEXT:
    '# have been found violating fairplay policies & have been removed from the table. This game is cancelled and your entry fees is refunded',
  WCM: 'Wrong card thrown'
});
