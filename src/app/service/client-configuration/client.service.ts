import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../../environments/environment';
import 'rxjs/Rx';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: Http) { }

  getClient(accessToken, id) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });

    return this.http.get(environment.ApiUrl + '/api/client/' + id, { headers: headers })
  }
  
  getClientAdministrator(accessToken) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });

    return this.http.get(environment.ApiUrl + '/api/client-administrator', { headers: headers })
  }

  getClientList(accessToken) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.get(environment.ApiUrl + '/api/client-administrator', { headers: headers });

  }

  updateClient(accessToken, client) {

    let headers: any = new Headers({
      'Content-Type': 'application/json',
      'Access_Token': accessToken
    });
    return this.http.put(environment.ApiUrl + '/api/client', client, { headers: headers })
  }
  saveClient(accessToken, client) {

    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.post(environment.ApiUrl + '/api/client', client, { headers: headers })
  }

  getClientProductivityReport(accessToken, clientId, startDate, endDate) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.get(environment.ApiUrl + '/api/productivity-report/' + clientId + '/' + startDate + '/' + endDate, { headers: headers }).map(res => res.json());
  }

  getManagerProductivityReport(accessToken, clientId, managerId, startDate, endDate) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.get(environment.ApiUrl + '/api/productivity-report/' + clientId + '/' + managerId + '/' + startDate + '/' + endDate, { headers: headers }).map(res => res.json());
  }

  getSupervisorProductivityReport(accessToken, clientId, managerId, supervisorId, startDate, endDate) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.get(environment.ApiUrl + '/api/productivity-report/' + clientId + '/' + managerId + '/' + supervisorId + '/' + startDate + '/' + endDate, { headers: headers }).map(res => res.json());
  }

  getAgentProductivityReport(accessToken, clientId, managerId, supervisorId, agentId, startDate, endDate) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.get(environment.ApiUrl + '/api/productivity-report/' + clientId + '/' + managerId + '/' + supervisorId + '/' + agentId + '/' + startDate + '/' + endDate, { headers: headers })
      .map(res => res.json());
  }


  getAgentReportByDate(accessToken, clientId, managerId, supervisorId, agentId, dateRange, startDate, endDate) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.get(environment.ApiUrl + '/api/productivity-report/' + clientId + '/' + managerId + '/' + supervisorId + '/' + agentId + '/' + dateRange + '/' + startDate + '/' + endDate, { headers: headers })
      .map(res => res.json());
  }

  getSingleAgentProductivityReport(accessToken, clientId, agentId, startDate, endDate) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.get(environment.ApiUrl + '/api/agent-productivity-report/' + clientId + '/' + agentId + '/' + startDate + '/' + endDate, { headers: headers })
      .map(res => res.json());
  }

  clientUserMapping(accessToken) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.get(environment.ApiUrl + '/api/Mapping_CRUD_', { headers: headers })
      .map(res => res.json());
  }

  addClientUserMapping(accessToken, userObj) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.post(environment.ApiUrl + '/api/Mapping_CRUD_', userObj, { headers: headers })
      .map(res => res.json());
  }

  updateClientUserMapping(accessToken, userObj) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.put(environment.ApiUrl + '/api/Mapping_CRUD_', userObj, { headers: headers }).map(res => res.json());
  }

  deleteECNUser(activeUser, user, isActive) {
    let headers: any = new Headers({
      'Access_Token': activeUser.TokenValue
    });
    const body = {
      "modifiedBy": activeUser.UserId,
      "ClientUserMappingManagement_Id": user.ClientUserMappingManagement_Id,
      "isActive": isActive
    }
    return this.http.post(environment.ApiUrl + '/api/Delete_ClientUserMapping_Data_', body, { headers: headers })
      .map(res => res.json());
  }

  getECNInfo(accessToken, ECN) {
    let headers: any = new Headers({
      'Access_Token': accessToken
    });
    return this.http.get(environment.ApiUrl + '/api/Get_PopUp_Data/' + ECN, { headers: headers })
      .map(res => res.json());
  }
  
}
