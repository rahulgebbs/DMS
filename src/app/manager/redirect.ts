import { Token } from '../manager/token';
import { Router } from "@angular/router"
import { MenuMappingService } from '../menu-mapping.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RedirectHelper {
    Token: Token;
    userdata
    userRole
    constructor(private router: Router, public menuMappingService: MenuMappingService) { }

    redirectByRole() {

        let token = new Token(this.router);
        this.userdata = token.GetUserData();
        this.userRole = this.userdata.Role;
        console.log('this.userRole : ', this.userRole);

        switch (this.userRole) {
            case "Supervisor":
                this.router.navigate(['/supervisor-dashboard']);
                break;
            case "Agent":
                this.router.navigate(['/agent']);
                break;
            case "Client Supervisor": {
                this.getMenuListForUser();
                this.router.navigate(['/client-approval']);
                break;
            }
            case "Client User": {
                this.getMenuListForUser();
                this.router.navigate(['/client-user']);
                break;
            }
            default:
                this.router.navigate(['/dashboard']);
        }
    }

    getMenuListForUser() {
        this.menuMappingService.getMenuForUser().subscribe((response:any) => {
            console.log('getMenuForUser response : ', response);
            if (response && response.Data && response.Data.length > 0)
                // this.router.navigate(['/client-approval']);
                this.navigateClient(response.Data);
            else
                this.router.navigate(['/welcome-page']);
        }, (error) => {
            console.log('getMenuForUser error : ', error);
            this.router.navigate(['/welcome-page']);
        })
    }

    navigateClient(menuList) {
        console.log('navigateClient menuList : ', menuList);
        switch (this.userRole) {
            case "Client Supervisor": {
                const result = menuList.find((menu) => {
                    return menu.Route == 'client-approval'
                });
                console.log('Client Supervisor result : ', result)
                if (result != undefined) {
                    this.router.navigate(['/client-approval']);
                }
                else {
                    this.router.navigate(['/welcome-page']);
                }
                break;
            }
            case "Client User": {
                const result = menuList.find((menu) => {
                    return menu.Route == 'client-user'
                });
                console.log('Client User result : ', result)
                if (result != undefined) {
                    this.router.navigate(['/client-user']);
                }
                else {
                    this.router.navigate(['/welcome-page']);
                }

                break;
            }
            default: {
                this.router.navigate(['/welcome-page']);
                break;
            }

        }
    }
}