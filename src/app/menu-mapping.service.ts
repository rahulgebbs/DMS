import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as jwt_decode from "jwt-decode";

import 'rxjs/Rx';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MenuMappingService {

  constructor(private http: Http) { }
  getClientList() {
    const token = sessionStorage.getItem('access_token');
    // let data = jwt_decode(sessionStorage.getItem('access_token'));
    let headers: any = new Headers({
      'Access_Token': token
    });

    return this.http.get(environment.ApiUrl + '/api/Get_All_Clients_User_Menu_Mapping', { headers: headers }).map(res => res.json());
  }

  getUserList(id, role) {
    const token = sessionStorage.getItem('access_token');
    // console.log('token : ', token);
    // let data = jwt_decode(sessionStorage.getItem('access_token'));
    let headers: any = new Headers({
      'Access_Token': token
    });
    //Get_User_List_Menu_Mapping/id/name?id=1&name=Client Supervisor
    return this.http.get(environment.ApiUrl + '/api/Get_User_List_Menu_Mapping/id/name?id=' + id + '&name=' + role, { headers: headers }).map(res => res.json());
  }

  //api/Get_Menu_List_User_Menu_Mapping
  getMenuList() {
    const token = sessionStorage.getItem('access_token');
    // let data = jwt_decode(sessionStorage.getItem('access_token'));
    let headers: any = new Headers({
      'Access_Token': token
    });
    //Get_User_List_Menu_Mapping/id/name?id=1&name=Client Supervisor
    return this.http.get(environment.ApiUrl + '/api/Get_Menu_List_User_Menu_Mapping', { headers: headers }).map(res => res.json());
  }

  getAllUsersWithMenu() {
    // http://172.19.9.101:1001/api/Get_All_Clients_User_Menu_Mapping
    const token = sessionStorage.getItem('access_token');
    // let data = jwt_decode(sessionStorage.getItem('access_token'));
    let headers: any = new Headers({
      'Access_Token': token
    });
    //Get_User_List_Menu_Mapping/id/name?id=1&name=Client Supervisor
    // Get_All_Clients_User_Menu_Mapping
    return this.http.get(environment.ApiUrl + '/api/Get_User_Menu_List', { headers: headers }).map(res => res.json());
    // return this.http.get(environment.ApiUrl + '/api/Get_User_List_Menu_Mapping/id/name?id=' + data.User_Id + '&name=' + data.Role_Name, { headers: headers }).map(res => res.json());
  }

  saveMenuSubmenu(obj) {
    // http://172.19.9.101:1001/api/Save_Menu_SubMenu_Config_List_For_User
    const token = sessionStorage.getItem('access_token');
    let headers: any = new Headers({
      'Access_Token': token
    });

    return this.http.post(environment.ApiUrl + '/api/Save_Menu_SubMenu_Config_List_For_User', obj, { headers: headers }).map(res => res.json());
  }

  getMenuForUser() {
    const token = sessionStorage.getItem('access_token');
    let data = jwt_decode(token);
    console.log('getMenuForUser data : ', data);

    let headers: any = new Headers({
      'Access_Token': token
    });

    return this.http.get(environment.ApiUrl + '/api/Get_Menu_List_By_Username/username?username=' + data.User_Id, { headers: headers }).map(res => res.json());
  }
}
