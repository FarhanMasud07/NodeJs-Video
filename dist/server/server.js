"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class Server {
    constructor(port, app) {
        this.port = port;
        this.app = app;
    }
    core() {
        mongoose_1.default.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@farhan01.yzaff.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
            this.app.listen(this.port, (err) => {
                if (err)
                    console.log(err);
                else
                    console.log(`http://localhost:${this.port}/graphql`);
            });
        })
            .catch(error => {
            console.log(error);
        });
    }
}
exports.default = Server;
