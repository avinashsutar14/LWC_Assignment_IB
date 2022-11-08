import { LightningElement, api, track, wire } from 'lwc';
import getRecords from '@salesforce/apex/AllFieldSet.getRecords';
import getObjectFields from '@salesforce/apex/AllFieldSet.getObjectFields';
import deleteRecord from '@salesforce/apex/AllFieldSet.deleteRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];

export default class AllDataTable extends LightningElement {
@track objectName;
@track selectedObject;
@track fieldColumns =[];
@track data = [];
error;
@track DataReceived = false;

@api callFieldMethod(){
console.log('In child this.selectedObject',this.selectedObject );
getObjectFields({objName : this.selectedObject})
.then(result => {
    this.fieldColumns = [];
console.log('Object field result#', result);
//this.fieldColumns = result;

result.forEach(element => {
    this.fieldColumns.push({label:element, fieldName:element});
});
console.log('this.fieldColumns#', this.fieldColumns);

    
    this.fieldColumns.push({
        type: 'action',
        typeAttributes: { rowActions: actions },
    });
    

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
}

}