"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.use((0, morgan_1.default)('tiny'));
router.get('/', (req, res) => res.send('ok'));
router.get('/health', (req, res) => {
    res.send('green');
    log.info('health: green');
});
exports.default = router;
