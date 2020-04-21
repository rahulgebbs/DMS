export class Notification {
    public Type:string;
    public Message:string;

    constructor(message:string,type:string){
        this.Message = message;
        this.Type = type;
    }
}