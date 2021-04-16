import IEvents from "../../interface/event.interface";
import User from "../../models/user";
import EventModel from '../../models/events'


export default class Events {
    event() {
        return {
            events: async (res: any, req: any):Promise<IEvents[]> => {
                return this.allEvents(req);
            },
            createEvent: async (eventInput: any, req: any) => {
                return this.insertEvent(eventInput, req);
            }
        }
    }

    private allEvents = async (req: any):Promise<IEvents[]> => {
        // if (!req.isAuth) {
        //     throw Error('Unauthenticated');
        // }
        try {
            const events = await EventModel.find().populate(`creator`);
            const result = events.map((event: any) => {
                event._doc.creator.password = null;
                return {...event._doc, date: new Date(event._doc.date).toISOString()};
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    private insertEvent = async (args: any, req: any) => {
        if (!req.isAuth) {
            throw Error('Unauthenticated')
        }
        try {
            let createdEvent: any;
            const event = new EventModel({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: args.eventInput.date,
                creator: req.userId
            });
            if (event.creator && event.creator !== '') {
                const savedEvent = await event.save();
                if (savedEvent) createdEvent = {...savedEvent._doc,};
                const findUser = await User.findById(req.userId);
                if (!findUser) throw Error('User not found');
                findUser.createdEvents.push(event);
                const savedUser = await findUser.save();
                const result = {user: savedUser, event: savedEvent}
                return result ? createdEvent : 'nothing';
            } else {
                throw Error('No user id given');
            }
        } catch (error) {
            throw error;
        }
    }
};

