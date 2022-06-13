"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response = {
    SUCCESS: { code: 1, message: 'success' },
    SERVER_ERROR: { code: 2, message: 'server error' },
    CLIENT_PARAM_ERROR(msg) {
        return { code: 3, message: msg };
    },
    TABLE_NOT_CREATED: { code: 4, message: 'table not created' },
    TABLE_NOT_UPDATED: { code: 5, message: 'table not updated' },
    TABLE_NOT_FOUND: { code: 6, message: 'table not found' },
    TABLE_NOT_RUNNING: { code: 7, message: 'table is not in running state' },
    PLAYER_NOT_CREATED: { code: 8, message: 'player not created' },
    PLAYER_NOT_UPDATED: { code: 9, message: 'player not updated' },
    PLAYER_NOT_FOUND: { code: 10, message: 'player not found' },
    PLAYER_NOT_ACTIVE: { code: 11, message: 'player is not in active state' },
    NOT_ENOUGH_CARDS: { code: 12, message: 'not enough cards' },
    NOT_YOUR_TURN: { code: 13, message: 'please wait for your turn' },
    CARD_NOT_IN_HAND: { code: 14, message: 'card not in hand' },
    EMPTY_HAND: { code: 15, message: 'hand is empty' },
    CARD_COLOR_REQUIRED: { code: 16, message: 'card color required when discarding wild card' },
    INVALID_NEXT_CARD_COLOR: { code: 17, message: 'invalid next card color' },
};
exports.default = response;
