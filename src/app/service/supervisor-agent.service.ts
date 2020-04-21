import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';

@Injectable({
	providedIn: 'root'
})
export class SupervisorAgentService {
	TokenCls;

	constructor(private http: Http, private router: Router) {
		this.TokenCls = new Token(this.router);
	}

	GetStandardFields(ClientId: number): any {
		return this.http.get(environment.ApiUrl + '/api/standard-fields/' + ClientId, {
			headers: new Headers({ Access_Token: this.TokenCls.GetToken() })
		});
	}

	GetLogPopup(formobj): any {
		return this.http.get(environment.ApiUrl + '/api/supervisor-agent/' + formobj.Client_Id +
			'/?Display_Name=' + formobj.Display_Name +
			'&Header_Name=' + formobj.Header_Name +
			'&Field_Value=' + formobj.Field_Value, {
				headers: new Headers({ Access_Token: this.TokenCls.GetToken() })
			});
	}

	GetInventoryLog(clientId, NewlogId, OldLogId): any {
		return this.http.get(environment.ApiUrl + '/api/supervisor-agent/' + clientId + '/' + NewlogId + '/' + OldLogId, {
			headers: new Headers({ Access_Token: this.TokenCls.GetToken() })
		});
	}

	SaveAllFields(formobj) {
		return this.http.post(environment.ApiUrl + '/api/supervisor-agent', formobj, {
			headers: new Headers({ Access_Token: this.TokenCls.GetToken() })
		});
	}

	GetInstructionCount(ClientId: number): any {
		return this.http.get(environment.ApiUrl + '/api/supervisor-client-instructions-count/client/' + ClientId, {
			headers: new Headers({ Access_Token: this.TokenCls.GetToken() })
		});
	}

	getClientUpdate(ClientId: number): any {
		return this.http.get(environment.ApiUrl + '/api/supervisor-client-instruction/client/' + ClientId, {
			headers: new Headers({ Access_Token: this.TokenCls.GetToken() })
		});
	}

	UpdateClientInstruction(updateVlue): any {
		return this.http.put(environment.ApiUrl + '/api/client-instruction-supervisor-accept', updateVlue, {
			headers: new Headers({ Access_Token: this.TokenCls.GetToken() })
		});
	}
}
