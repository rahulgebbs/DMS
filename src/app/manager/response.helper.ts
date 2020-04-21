import { NotificationService } from "../service/notification.service";

export class ResponseHelper {
    constructor(private notification: NotificationService) { }

    GetSuccessResponse(httpres): number {
        console.log('GetSuccessResponse httpres : ', httpres);
        let notifydata = httpres.Message ? httpres.Message : httpres.json().Message;
        switch (httpres.status) {
            case 200: notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ Message: "Successful", Type: "SUCCESS" }])
                break;
            case 201:
                notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ Message: "Successful", Type: "SUCCESS" }])
                break;
            default: notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ Message: "Successful", Type: "SUCCESS" }])
                break;
        }
        return httpres.status;
    }

    GetFaliureResponse(httpres) {
        let notifydata = [];
        if (httpres.status == 500) {
            notifydata = null;
        }
        else {
            notifydata = httpres.Message ? httpres.Message : httpres.json().Message;
        }
        switch (httpres.status) {
            case 400:
                notifydata[0].Type != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ Message: "Bad Request", Type: "ERROR" }])
                break;
            case 401:
                notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ Message: "Unauthorized", Type: "ERROR" }])
                // window.location.href = "/login"
                //sessionStorage.clear();
                break;
            case 403:
                notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ Message: "User Account is Terminated", Type: "ERROR" }])
                break;
            case 404:
                this.notification.ChangeNotification([{ Message: "No Data found", Type: "ERROR" }]);
            case 405:
                // notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ Message: "CORS error", Type: "ERROR" }])
                break;
            case 406:
                notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ Message: "Not Acceptable", Type: "ERROR" }])
                break;
            case 500:
            case 0:
                this.notification.ChangeNotification([{ Message: "Internal Server Error", Type: "ERROR" }])
                break;
            default: notifydata != null ? this.notification.ChangeNotification(notifydata) : this.notification.ChangeNotification([{ Message: "Not Acceptable", Type: "ERROR" }])
                break;
        }
        return httpres.status;
    }
}
