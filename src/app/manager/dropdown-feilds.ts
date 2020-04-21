import { AbstractControl } from '@angular/forms';
export class dropDownFields {


    setSelected(data) {
        if (data && data.length > 1) {
            data[0].selected = false
            return data
        } else {
            data[0].selected = true
            return data
        }
    }


}