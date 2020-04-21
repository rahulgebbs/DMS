export interface Validator {
  name: string;
  validator: any;
  message: string;
}
export interface FieldConfig {
  label?: string;
  name?: string;
  id?:any;
  inputType?: string;
  options?: [{key:any,value:any}];
  collections?: any;
  type: string;
  value?: any;
  validations?: Validator[];
  classname?:any;
}

export class editUserInfo {
  Clients:any;
  User_Type?: string;
  Role?: string;
  Employee_Code?: string;
  Username?: string;
  Email_Id?: string;
  Full_Name?: string;
  Is_Deactivated?: string;
  Is_Locked?: string;
  Is_Terminated?: string;
  Expertise_In_Website?: string;
  Expertise_In_Fax?: string;
  Expertise_In_Email?: string;
  Expertise_In_Call?: string;
  Comma_Separated_Clients?: string;
  Id?: string;
  Experties?: string;
  URL?: string;
  Updated_Date?: string;
}

