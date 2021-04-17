"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_resolver_1 = __importDefault(require("./user-resolver/user.resolver"));
const event_resolver_1 = __importDefault(require("./event-resolver/event.resolver"));
class Resolvers {
    constructor() {
        this.events = new event_resolver_1.default();
        this.users = new user_resolver_1.default();
    }
    setResolvers() {
        return Object.assign(Object.assign({}, this.events.event()), this.users.usersInfo());
    }
}
exports.default = Resolvers;
