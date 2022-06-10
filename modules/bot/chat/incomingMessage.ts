export default class IncomingMessage {

    public username: string;
    public time: Date;
    public message: string;

    constructor (data: {
        username: string,
        time: Date,
        message: string
    }) {
        this.username = data.username;
        this.time = data.time;
        this.message = data.message;
    }
}