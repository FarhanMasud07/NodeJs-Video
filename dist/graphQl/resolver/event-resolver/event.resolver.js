"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../../models/user"));
const events_1 = __importDefault(require("../../models/events"));
class Events {
    constructor() {
        this.allEvents = (req) => __awaiter(this, void 0, void 0, function* () {
            // if (!req.isAuth) {
            //     throw Error('Unauthenticated');
            // }
            try {
                const events = yield events_1.default.find().populate(`creator`);
                const result = events.map((event) => {
                    event._doc.creator.password = null;
                    return Object.assign(Object.assign({}, event._doc), { date: new Date(event._doc.date).toISOString() });
                });
                return result;
            }
            catch (error) {
                throw error;
            }
        });
        this.insertEvent = (args, req) => __awaiter(this, void 0, void 0, function* () {
            if (!req.isAuth) {
                throw Error('Unauthenticated');
            }
            try {
                let createdEvent;
                const event = new events_1.default({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: args.eventInput.price,
                    date: args.eventInput.date,
                    creator: req.userId
                });
                if (event.creator && event.creator !== '') {
                    const savedEvent = yield event.save();
                    if (savedEvent)
                        createdEvent = Object.assign({}, savedEvent._doc);
                    const findUser = yield user_1.default.findById(req.userId);
                    if (!findUser)
                        throw Error('User not found');
                    findUser.createdEvents.push(event);
                    const savedUser = yield findUser.save();
                    const result = { user: savedUser, event: savedEvent };
                    return result ? createdEvent : 'nothing';
                }
                else {
                    throw Error('No user id given');
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    event() {
        return {
            events: (res, req) => __awaiter(this, void 0, void 0, function* () {
                return this.allEvents(req);
            }),
            createEvent: (eventInput, req) => __awaiter(this, void 0, void 0, function* () {
                return this.insertEvent(eventInput, req);
            })
        };
    }
}
exports.default = Events;
;
