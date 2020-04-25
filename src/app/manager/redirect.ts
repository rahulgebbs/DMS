import { Token } from '../manager/token';
import { Router } from "@angular/router"

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RedirectHelper {
    Token: Token;
    userdata
    userRole
    constructor(private router: Router) { }

    redirectByRole() {

        let token = new Token(this.router);
        this.userdata = token.GetUserData();
        this.userRole = this.userdata.Role;
        switch (this.userRole) {
            case "Supervisor":
                this.router.navigate(['/refernce-document-supervisor']);
                break;
            case "Agent":
                this.router.navigate(['/view-file']);
                break;
            default:
                this.router.navigate(['/dashboard']);
        }
    }


}