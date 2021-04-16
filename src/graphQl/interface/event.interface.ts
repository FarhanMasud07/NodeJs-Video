import IUser from "./user.interface";

export default interface IEvents{
    Title?: string,
    Description?: string,
    Price?: number,
    Date?: string,
    Creator? : IUser,
}