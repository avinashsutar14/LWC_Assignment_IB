import { LightningElement, track } from 'lwc';
import createContacts from '@salesforce/apex/BulkContactsInsert.createContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class MultipleContactsInsert extends LightningElement {
@track tempId = 0;
@track keyIndex = 0;
@track contactRecList = [
    {
        FirstName: '',
        LastName: '',
        Email: '',
        AccountId: '',
        Id: this.tempId,
    }
];
selectedAccount;
error;
message;

changeHandler(event){
   // console.log('Access key2:'+event.target.accessKey);
   // console.log('id:'+event.target.id);
   // console.log('value:'+event.target.value); 

if(event.target.name === 'fName'){
    this.contactRecList[event.target.accessKey].FirstName = event.target.value;
}
else if(event.target.name === 'lName'){
    this.contactRecList[event.target.accessKey].LastName = event.target.value;
}
else if(event.target.name === 'email'){
    this.contactRecList[event.target.accessKey].Email = event.target.value;
}
/*
else if(event.target.name === 'AccountName'){
    this.contactRecList[event.target.accessKey].AccountId = event.target.value;
}*/
}

addRow(){
    //console.log('this.keyIndex#',this.keyIndex);
   // console.log('Access key:', event.target.accessKey);
    this.keyIndex = this.keyIndex + 1;
    console.log('this.keyIndex After#',this.keyIndex);

this.contactRecList.push({
    FirstName: '',
    LastName: '',
    Email: '',
    AccountId: ''
});

console.log('contactRecList123 ',this.contactRecList);
}

saveMultipleContacts(){
    console.log('contactRecList#: ', contactRecList);

    createContacts({conList : this.contactRecList})
    .then(result =>{
        console.log('result#: ', result);
        this.message = result;
        this.error = undefined;

        this.contactRecList.forEach(function(item){                   
            item.FirstName= '';
            item.LastName = '';
            item.Email = '';
            item.AccountId = '';
    });

    if(this.message !== undefined) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Contact(s) Created!',
                variant: 'success',
            }),
        );
        }

        console.log(JSON.stringify(result));
        console.log("result", this.message);

    }).catch(error =>{
        console.log('Error#: ', error);
        this.error = error;

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error creating records',
                message: error.body.message,
                variant: 'error',
            }),
        );
    });
 
}

handleAccountSelection(event){
    this.selectedAccount = event.target.value;
    // this.contactRecList[event.target.field-name].AccountId = this.selectedAccount;
    console.log("The selected Accout id is",event.target.value);
    console.log("The selected Accout id is",event.target);
}
}


