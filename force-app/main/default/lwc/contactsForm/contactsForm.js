import { LightningElement, track } from 'lwc';
import createContacts from '@salesforce/apex/BulkContactsInsert.createContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactsForm extends LightningElement {
    @track keyIndex = 0;
   
    @track contactRecList = [
        {
            FirstName: '',
            LastName: '',
            Email: '',
            AccountId: '',
            Id: this.keyIndex,
        }
    ];
    error;
    message;

    addRow(){
        //console.log('this.keyIndex#',this.keyIndex);
       // console.log('Access key:', event.target.accessKey);
        this.keyIndex = this.keyIndex + 1;
        console.log('this.keyIndex After#',this.keyIndex);
    
    this.contactRecList.push({
        FirstName: '',
        LastName: '',
        Email: '',
        AccountId: '',
        Id: this.keyIndex,
    });
    
    console.log('contactRecList123 ',JSON.stringify(this.contactRecList));
    }

    handleChange(event){
        if(event.target.name === 'fName'){
            this.contactRecList[event.target.accessKey].FirstName = event.target.value;
        }
        else if(event.target.name === 'lName'){
            this.contactRecList[event.target.accessKey].LastName = event.target.value;
        }
        else if(event.target.name === 'email'){
            this.contactRecList[event.target.accessKey].Email = event.target.value;
        }
}

saveMultipleContacts(){
        //console.log('contactRecList#: ', JSON.stringify(this.contactRecList));
    
        createContacts({conList : this.contactRecList})
        .then(result =>{
            console.log('result#: ', result);
            this.message = result;
            this.error = undefined;
    
        if(this.message !== undefined) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact(s) Created!',
                    variant: 'success',
                }),
            );
            }
            
           // console.log(JSON.stringify(result));
            //console.log("result", this.message);
    
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
    
    }   
