import { AbstractControl, Validators } from '@angular/forms';
export class customValidation {

    static validRole(editRole, userRole) {
        //


        if (userRole == 'Admin' && editRole.Role != 'Admin') {
            return true;
        }
        else if (userRole == 'Administrator' && editRole.Role != 'Administrator' && editRole.Role != 'Admin') {
            return true;
        }
        else if (userRole == 'Director' || userRole == 'Controller') {
            // 
            if (userRole == 'Administrator' || editRole.Role == "Admin" || editRole.Role == "Director" || editRole.Role == 'Controller') {
                return false;
            } else {
                return true;
            }
        }
        else if (userRole == 'Manager') {
            if (userRole == 'Administrator' || editRole.Role == 'Admin' || editRole.Role == 'Director' || editRole.Role == 'Manager' || editRole.Role == 'Controller') {
                return false;
            } else {
                return true;
            }
        } else if (userRole == 'Supervisor') {
            if (userRole == 'Administrator' || editRole.Role == 'Admin' || editRole.Role == 'Director' || editRole.Role == 'Manager' || editRole.Role == 'Supervisor' || editRole.Role == 'Controller') {
                return false;
            } else {
                return true;
            }
        } else if (userRole == 'QC') {
            if (editRole.Role == 'Agent') {
                return true;
            } else {
                return false;
            }
        } else if (userRole == 'Client Supervisor') {
            if (editRole.Role == 'Client User') {
                return true;
            } else {
                return false;
            }
        } else if (userRole == 'Agent') {
            return false;
        } else if (userRole == 'Client User') {
            return false;
        } else {
            return false;
        }
    }

    static userMangementValidation(control: AbstractControl): any {


        if (control.get('Email_Id').hasError('invalidDomain')) {

            control.get('Email_Id').updateValueAndValidity();

        }
        if (control.get('Comma_Separated_Clients').hasError('cllientLimitExceed')) {
            control.get('Comma_Separated_Clients').reset()
        }

        if (control.get('Experties').hasError('required')) {
            control.get('Experties').setErrors({ required: null })
            control.get('Experties').updateValueAndValidity();
        }
        //    
        if (control.get('Role').value != null) {

            const NUMBER_REGEXP = /^-?[\d.]+(?:e-?\d+)?$/;
            if (control.get('Role').value.indexOf('Client') > -1) {
                control.get('Employee_Code').clearValidators()

            } else {
                if (control.get('Employee_Code').value == undefined || control.get('Employee_Code').value == null || control.get('Employee_Code').value == "") {
                    control.get('Employee_Code').setErrors({ required: true })

                } else {
                    control.get('Employee_Code').clearValidators()
                }
                if (control.get('Employee_Code').value) {
                    if (NUMBER_REGEXP.test(control.get('Employee_Code').value)) {
                        // control.get('Employee_Code').reset()
                    }
                    else {
                        control.get('Employee_Code').setErrors({ invalidNumber: true })
                    };
                }

            }
            if (control.get('Employee_Code').value == undefined || control.get('Employee_Code').value == null || control.get('Employee_Code').value == "") {

            } else {
                if ((control.get('Employee_Code').value.toString().length > 20)) {

                    if (control.get('Role').value.indexOf('Client') > -1) {
                        control.get('Employee_Code').clearValidators()
                    } else {
                        control.get('Employee_Code').setErrors({ maxlength: true })
                    }
                } else {
                    control.get('Employee_Code').clearValidators()
                }
            }

        }

        if (control.get('Comma_Separated_Clients').value == "" || control.get('Comma_Separated_Clients').value == null || control.get('Comma_Separated_Clients').value == undefined) {
            control.get('Comma_Separated_Clients').setErrors({ required: true })
            //     
        }
        //   
        if (control.get('User_Type').value == 'Demo') {
            control.get('Email_Id').clearValidators()
        }
        if (control.get('Email_Id').hasError('invalidDomain')) {

            control.get('Email_Id').updateValueAndValidity();

        }
        if (control.get('Comma_Separated_Clients').hasError('cllientLimitExceed')) {
            control.get('Comma_Separated_Clients').setErrors({ cllientLimitExceed: null })
        }

        //   
        if (control.get('Comma_Separated_Clients').value == "" || control.get('Comma_Separated_Clients').value == null || control.get('Comma_Separated_Clients').value == undefined) {
            control.get('Comma_Separated_Clients').setErrors({ required: true })
        }
        // 
        if (control.get('User_Type').value == 'Client') {
            let myVal = control.get('Email_Id').value;
            if (myVal == undefined) {
                control.get('Email_Id').setErrors({ required: true });

            }
            else if (myVal.indexOf('@gebbs.com') > -1) {
                //    
                control.get('Email_Id').setErrors({ invalidDomain: true })
            } else {
                // 
                control.get('Email_Id').clearValidators()
            }
        } else {

        }

        if (control.get('User_Type').value == 'GeBBS') {


            // console.log(control.get('Email_Id').value)
            if (control.get('Email_Id').value == undefined) {
                control.get('Email_Id').setErrors({ required: true });
            }
            else if (control.get('Email_Id').value.indexOf('@gebbs.com') > -1) {
                control.get('Email_Id').clearValidators();
            }
            else {
                control.get('Email_Id').setErrors({ invalidDomain: true });
            }
        }

        if (control.get('Role').value == "Agent") {
            // 
            // console.log(control.get('Comma_Separated_Clients').value)
            if (control.get('Comma_Separated_Clients').value == undefined || control.get('Comma_Separated_Clients').value == null) {
                control.get('Comma_Separated_Clients').setErrors({ required: true });
            } else if (control.get('Comma_Separated_Clients').value.includes(',')) {

                control.get('Comma_Separated_Clients').setErrors({ cllientLimitExceed: true });
            } else {
                control.get('Comma_Separated_Clients').clearValidators();
            }

            if (control.get('Expertise_In_Call').value == false || control.get('Expertise_In_Call').value == null) {
                if (control.get('Expertise_In_Fax').value == false || control.get('Expertise_In_Fax').value == null) {
                    if (control.get('Expertise_In_Website').value == false || control.get('Expertise_In_Website').value == null) {
                        if (control.get('Expertise_In_Email').value == false || control.get('Expertise_In_Email').value == null) {
                            control.get('Experties').setErrors({ required: true });
                        }
                        else {
                            control.get('Experties').clearValidators();
                        }
                    }
                    else {
                        control.get('Experties').clearValidators();
                    }
                }
                else {
                    control.get('Experties').clearValidators();
                }
            } else {
                control.get('Experties').clearValidators();
            }
        } else {
            control.get('Experties').clearValidators();
        }

        //Email Validation

        if (control.get('Email_Id').value != null) {

            let myvalue = control.get('Email_Id').value.toString();

            if (myvalue.indexOf('@') == -1) {
                control.get('Email_Id').setErrors({ EmailInvalid: true })

            } else {
                let a = myvalue.split('@');
                // console.log('length',a.length);
                if (a.length > 2) {
                    control.get('Email_Id').setErrors({ EmailInvalid: true })
                } else {
                    if (a.length == 2) {
                        let b = a[1];
                        if (b.indexOf('.') == -1) {
                            control.get('Email_Id').setErrors({ EmailInvalid: true })
                        } else {
                            if (b.includes('..')) {
                                control.get('Email_Id').setErrors({ EmailInvalid: true })
                            } else {
                                let c = b.split('.');
                                if (c[1].length <= 1) {
                                    control.get('Email_Id').setErrors({ EmailInvalid: true })
                                }
                            }
                        }
                    }


                }
            }
        } else {

        }
    }

    static agentPopup(role, client) {
        if ((role == 'Agent' && client.includes(',')) || (role == 'Client Supervisor' && client.includes(',')) || (role == 'Client User' && client.includes(','))) {

            return false
        } else {
            return true
        }

    }


    static checkClient(client) {

        var inValid = new RegExp("[\\s]");


        return inValid.test(client.Client_Name);
    }

    static CompareTime(AC: AbstractControl) {
        let fromdate = AC.get('From_Time').value; // to get value in input tag
        let todate = AC.get('To_Time').value; // to get value in input tag
        if (fromdate != "" && todate != "") {
            if (Date.parse('01/01/2011 ' + fromdate) >= Date.parse('01/01/2011 ' + todate)) {
                AC.get('To_Time').setErrors({ notMatch: true })
            } else {
                return null
            }
        }
    }

    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('New_Password').value; // to get value in input tag
        let confirmPassword = AC.get('confirmnewpass').value; // to get value in input tag
        if (password != confirmPassword) {
            AC.get('confirmnewpass').setErrors({ notMatch: true })
        } else {
            return null
        }
    }

    static validFollowupDays(followupvalues, followupcondition) {

        if (followupcondition == 'true' && (followupvalues == 0 || followupvalues == undefined)) {
            return false
        } else {
            return true
        }

    }
    static numOnly(value) {
        var RegExp = /^[0-9]*$/gm
        if (RegExp.test(value)) {
            return false;
        } else {
            return true;
        }
    }

}