import IEvents from "./event.interface";

export default interface IUser{
    id: string,
    Email: string,
    Password: string,
    Roles: string[],
    CreatedEvents : IEvents[]
}