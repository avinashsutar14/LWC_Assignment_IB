import { LightningElement, track, api, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import ACCOUNT_FIELD from '@salesforce/schema/Opportunity.AccountId';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import OPP_OBJECT from "@salesforce/schema/Opportunity";
import getOppFields from '@salesforce/apex/FieldSetClass.getOppFields';
       

export default class QuickOppCreation extends LightningElement {
    @api recordId;
    @track name;
    @track stageName;
    @track amount = 0;
    @track closeDate;
    error;
    showOpp = false;
    @track Methoddata;
   
    

    get options(){
        return [
            {label: 'Prospecting', value:'Prospecting' },
            {label: 'Qualification', value:'Qualification' },
            {label: 'Needs Analysis', value:'NeedsAnalysis' },
            {label: 'Value Proposition', value:'ValueProposition' },
            {label: 'Closed Won', value:'ClosedWon' },
            {label: 'Closed Lost', value:'ClosedLost' },
        
        ];
    }

    handlePickChange(event){
        this.stageName = event.target.value;
        console.log('StageName', this.stageName);
    }

    handlechange(event){
        if((event.target.name) === 'name'){
           this.name = event.target.value;
           //console.log('Name: #',this.name); 
        }
      
         else if((event.target.name) === 'Amount'){
            this.amount = event.target.value;
            //console.log('Amount: #',this.amount ); 
         }
         else if((event.target.name) === 'CloseDate'){
            this.closeDate = event.target.value;
            //console.log('CloseDate: #',this.closeDate); 
         }
    }

    @wire(getOppFields)
    wireddata({data, error}){
        if(data){
            this.Methoddata = data;
            console.log('data in wire: ',data);
        }
        else if(error){
            console.log('wire method error# ', error);
        }
    };

    createOppRec(){
        //var fields = {'Name':this.name, 'AccountId': this.recordId, 'StageName':this.stageName, 'Amount':this.amount, 'CloseDate':this.closeDate};
       
        let fields = {};
       // console.log('Before fields', fields);
        //console.log('this.Methoddata', JSON.stringify(this.Methoddata));
        this.Methoddata.forEach(element => {
          // fields.add(element) ;

           console.log('element# ',element);
           
        });
        //fields.push();
        console.log('fields#', fields);

        
        fields.Name = this.name;
        fields.AccountId= this.recordId;
        fields.StageName = this.stageName;
        fields.Amount = this.amount;
        fields.CloseDate= this.closeDate;

        console.log('fields After#', fields);
     
       
      //  var fields = {'Name' : this.strName, 'AccountNumber' : this.strAccountNumber, 'Phone' : this.strPhone};
/*
    fields[NAME_FIELD.fieldApiName] = this.name;
    fields[STAGE_FIELD.fieldApiName] = this.stageName;
    fields[AMOUNT_FIELD.fieldApiName] = this.amount;
    fields[CLOSEDATE_FIELD.fieldApiName] = this.closeDate;
    fields[ACCOUNT_FIELD.fieldApiName] = this.recordId;

*/
    const recordInput = {
        apiName: OPP_OBJECT.objectApiName,
        fields: fields
      };

      createRecord(recordInput).then((record) => {
        console.log('Returned record# ',record);

        //this.template.querySelector('form').reset();

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Opportunity created',
                variant: 'success',
            })
        );

        //this.template.querySelector('lightining-input').reset();

      }).catch(
        error => {
           
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error,
                    variant: 'error',
                }),
            );
            console.log("error", error);
           // console.log("error", error.body.message);
        }    
      );
    }

    handleClick(event){
        this.showOpp = true;
    }

}
