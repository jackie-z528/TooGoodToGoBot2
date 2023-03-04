"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvString = void 0;
const getEnvString = (variable, fallback) => process.env[variable] ?? fallback;
exports.getEnvString = getEnvString;
