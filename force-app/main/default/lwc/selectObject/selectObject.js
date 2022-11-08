import { LightningElement, track} from 'lwc';

export default class SelectObject extends LightningElement {

@track objectName;

    get options(){
        return [
            {label: 'Account', value:'Account'},
            {label: 'Lead', value:'Lead'},
            {label: 'Opportunity', value:'Opportunity'},
        ];
    }

    handleChange(event){
console.log('event', event, ':', event.target.value);
        this.objectName= event.target.value;
        this.template.querySelector('c-all-data-table').passObjectName(this.objectName);
        this.callApiMethods();
        
 
    }
    callApiMethods(){
        console.log('callApiMethods');
        this.template.querySelector('c-all-data-table').callFieldMethod();
        this.template.querySelector('c-all-data-table').callDataMethod();
    }
}