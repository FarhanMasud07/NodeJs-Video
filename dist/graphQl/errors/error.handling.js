"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MyError';
        Error.captureStackTrace(this, MyError);
    }
}
exports.default = MyError;
