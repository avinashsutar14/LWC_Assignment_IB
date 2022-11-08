import { LightningElement, track } from 'lwc';

export default class AccountLookup extends LightningElement {
@track accountValue;

    handleAccountSelection(event){
         this.accountValue = event.target.value;
       //  console.log('Account value in child: ',this.accountValue);
       const selectEvent = new CustomEvent('getaccountrec',
       {detail:this.accountValue});
       this.dispatchEvent(selectEvent);
    }
}