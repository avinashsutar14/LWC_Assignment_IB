import { LightningElement, api, track, wire } from 'lwc';
import getRecords from '@salesforce/apex/AllFieldSet.getRecords';
import getObjectFields from '@salesforce/apex/AllFieldSet.getObjectFields';
import deleteRecord from '@salesforce/apex/AllFieldSet.deleteRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Edit', name: 'edit_details' },
    { label: 'Delete', name: 'delete' },
];

export default class AllDataTable extends NavigationMixin(LightningElement)  {
@track objectName;
@track selectedObject;
@track fieldColumns =[];
@track data = [];
error;
@track DataReceived = false;
@track modalContainer = false;
@track recordId;
@track sortBy;
@track sortDirection;

@api callFieldMethod(){
console.log('In child this.selectedObject',this.selectedObject );
getObjectFields({objName : this.selectedObject})
.then(result => {
    this.fieldColumns = [];
console.log('Object field result#', result);
//this.fieldColumns = result;

result.forEach(element => {
    this.fieldColumns.push({label:element, fieldName:element, sortable: "true"});
});
console.log('this.fieldColumns#', this.fieldColumns);

    
    this.fieldColumns.push({
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
   /**{
        sortable: "true"
    } */ 
    );
    

//this.fieldColumns = result;
console.log('this.fieldColumns#', this.fieldColumns);
this.error = undefined;
})
.catch(error => {
this.error = error;
this.fieldColumns = undefined;
});

}

@api callDataMethod(){
    getRecords({objectName : this.selectedObject})
    .then(res => {
        this.data = [];
    console.log('Table Data#: ', res);
    res.forEach(element => {
        this.data.push(element); 
    });
    this.DataReceived = true;
    
    }).catch(err => {
    console.log( 'Table Data Error#' , err);
    });
}

@api passObjectName(objectName){
    console.log('passObjectName');
    this.selectedObject = objectName;
    this.objectName = objectName;
}

handleRowAction(event){
    const actionName = event.detail.action.name;
   // console.log('Row#1: ', row);
    const row = event.detail.row;
    console.log('Row#1: ', JSON.stringify(row));
   
    switch (actionName) {
        case 'delete':
            this.deleteRow(row);
            console.log('Row#2: ', row);
            break;
        case 'show_details':
            this.showRowDetails(row);
           // console.log('Row#3: ', row);
            break;
        case 'edit_details':
             this.editRowDetails(row);   
        default:
    }
}

deleteRow(row) {
    const { id } = row;
    const index = this.findRowIndexById(id);
    
    let rowid = row.Id;
        //console.log('rowid#',rowid);

        deleteRecord({recId :rowid, objectName : this.objectName})
        .then(result =>{
            console.log('result##: ',result);
            if(result === 'success'){
                
                const evt = new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Deleted Succesfully!',
                        variant: 'Success',
                    });
                    this.dispatchEvent(evt);
                  
                    if(index !== -1){
                        this.data = this.data
                            .slice(0, index)
                            .concat(this.data.slice(index + 1));
                    }
            
        }
            else{
                const evt = new ShowToastEvent({
                    title: 'Error deleting record',
                        message: 'Error in deleting the record',
                        variant: 'Error',
                });
                this.dispatchEvent(evt); 
            }
        })
        .catch(error => {
            console.log('Error in deleterow()#', error);
        });
    }


findRowIndexById(id){
    let ret = -1;
    this.data.some((row, index) => {
        if (row.Id === id) {
            ret = index;
            return true;
        }
        return false;
    });
    return ret;
}

showRowDetails(row) {
    this.record = row;

    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: this.record.Id,
            //objectApiName: 'Lead', // objectApiName is optional
            actionName: 'view'
        }
    });
}

editRowDetails(row){
    this.modalContainer = true;
    this.recordId = row.Id;
}

closeModalAction(){
    this.modalContainer=false;
   }


   doSorting(event) {
    this.sortBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortData(this.sortBy, this.sortDirection);
}

sortData(fieldname, direction) {
    let parseData = JSON.parse(JSON.stringify(this.data));
    // Return the value stored in the field
    let keyValue = (a) => {
        return a[fieldname];
    };
    // cheking reverse direction
    let isReverse = direction === 'asc' ? 1: -1;
    // sorting data
    parseData.sort((x, y) => {
        x = keyValue(x) ? keyValue(x) : ''; // handling null values
        y = keyValue(y) ? keyValue(y) : '';
        // sorting values based on direction
        return isReverse * ((x > y) - (y > x));
    });
    this.data = parseData;
}  
}