export default class MyError extends Error {
    constructor(message: string | undefined) {
        super(message)
        this.name = 'MyError'
        Error.captureStackTrace(this, MyError)
    }
}