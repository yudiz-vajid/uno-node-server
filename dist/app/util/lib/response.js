"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response = {
    SUCCESS: { code: 1, message: 'success' },
    SERVER_ERROR: { code: 2, message: 'server error' },
    CLIENT_PARAM_ERROR(msg) {
        return { code: 3, message: msg };
    },
    FAILURE: { code: 4, message: 'server error' },
    TABLE_NOT_CREATED: { code: 5, message: 'table not created' },
    TABLE_NOT_UPDATED: { code: 6, message: 'table not updated' },
    PLAYER_NOT_CREATED: { code: 7, message: 'player not created' },
    PLAYER_NOT_UPDATED: { code: 8, message: 'player not updated' },
    NOT_ENOUGH_CARDS: { code: 9, message: 'not enough cards' },
};
exports.default = response;
