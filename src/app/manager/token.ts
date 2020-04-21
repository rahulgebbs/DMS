import * as jwt_decode from "jwt-decode";
import { Router } from "@angular/router";

export class Token {
    constructor(private router: Router) {

    }
    GetToken() {

        var token = sessionStorage.getItem(this.LoginTokenKey);
        if (token != null) {
            return token;
        }
        else {
            this.router.navigate(['/login']);
        }
    }
    private LoginTokenKey = "access_token";
    private TokenValue: string = null;
    public UserId: number = 0;
    public Full_Name: string = null;
    public Role: string = null;
    public FirstLogin;
    public Employee_Code;
    Clients = Array<Client>();

    SetLoginToken(Token: string): any {
        sessionStorage.setItem(this.LoginTokenKey, Token);
    }
    SetIsFirstLogin(isFirst: any) {
        sessionStorage.setItem(this.FirstLogin, isFirst)
    }
    getIsFirstLogin() {
        return sessionStorage.getItem(this.FirstLogin)
    }

    GetUserData() {

        let data = jwt_decode(sessionStorage.getItem(this.LoginTokenKey));
        console.log('getUser : ', data);
        this.TokenValue = sessionStorage.getItem(this.LoginTokenKey);
        this.Full_Name = data.Full_Name;
        this.UserId = data.User_Id;
        this.Role = data.Role_Name;
        this.Clients = data.Clients;
        this.Employee_Code = data.Employee_Code;
        this.FirstLogin = data.Is_First_Login
        return this;

    }

    ClearUserData() {
        sessionStorage.clear();
    }

    Exists() {

        let flag: boolean = true

        if (sessionStorage.getItem("access_token") == null) {
            flag = false
        }

        return flag;
    }
}

export class Client {
    Client_Id: number;
    Client_Name: string;
}