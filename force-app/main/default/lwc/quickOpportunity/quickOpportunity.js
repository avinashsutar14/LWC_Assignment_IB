import { LightningElement, track, api } from 'lwc';
import oppRecMethod from '@salesforce/apex/FieldSetClass.oppRecMethod';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';

export default class QuickOpportunity extends LightningElement {
    @api recordId;
    @track name = NAME_FIELD;
    @track stageName = STAGE_FIELD;
    @track amount = AMOUNT_FIELD;
    @track closeDate = CLOSEDATE_FIELD;
    message;
    errorMsg;

    OppRec = {

        Name : this.name,
        StageName : this.stageName,
        Amount : this.amount,
        CloseDate: this.closeDate
    }

    handelNamechange(event){
        this.OppRec.Name = event.target.name;
        console.log('Name ',this.OppRec.Name);
    }

    handelStNamechange(event){
        this.OppRec.StageName = event.target.StageName;
        console.log('StageName ',this.OppRec.StageName);
    }

    handelAmountchange(event){
        this.OppRec.Amount = event.target.Amount;
        console.log('Amount ',this.OppRec.Amount);
    }

    handelDatechange(event){
        this.OppRec.CloseDate = event.target.CloseDate;
        console.log('CloseDate ',this.OppRec.CloseDate);
    }

    createOppRec(){
        oppRecMethod({opp : this.OppRec})
        .then(
            result => {
                this.message = result;
                this.errorMsg = undefined;
                if(this.message !== undefined) {
                    this.OppRec.Name = '';
                    this.OppRec.StageName = '';
                    this.OppRec.CloseDate = '';
                    this.OppRec.Amount = '';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Opportunity created',
                            variant: 'success',
                        }),
                    );
                }
                
                console.log(JSON.stringify(result));
                console.log("result", this.message);
            }
        ).catch(
            error => {
                this.message = undefined;
                this.errorMsg = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.errorMsg));
            }
        );

        
    }
}
