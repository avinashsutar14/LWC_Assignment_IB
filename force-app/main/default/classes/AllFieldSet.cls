public with sharing class AllFieldSet {
    
    @AuraEnabled(cacheable=true)
    Public Static List<String>  getObjectFields(string objName){
        
        Map<string, string> ObjfieldAPIs = new Map<string, string>();
        List<String> fieldsList = new List<String>(); 
        
        Map<String, Schema.SObjectType> GlobalDescribeMap = Schema.getGlobalDescribe(); 
        
        Schema.SObjectType SObjectTypeObj = GlobalDescribeMap.get(objName);
        
        Schema.DescribeSObjectResult DescribeSObjectResultObj = SObjectTypeObj.getDescribe();
        //System.debug('DescribeSObjectResultObj# '+ DescribeSObjectResultObj);
        
        Schema.FieldSet field_Set =  DescribeSObjectResultObj.FieldSets.getMap().get('DatatableFields');
        
        For(Schema.FieldSetMember f:field_Set.getFields()){
            ObjfieldAPIs.put(f.getFieldPath(), f.getLabel());
            fieldsList.add(f.getFieldPath());
            //System.debug(f.getFieldPath());
        }
        //  system.debug('AccfieldAPIs #:'+ObjfieldAPIs.KeySet());
        // system.debug('fieldsList #:'+fieldsList);
        
        return fieldsList;
    }
    /*----------------------------------------------------------------------------------*/ 
    
    @AuraEnabled(cacheable=true)
    public static List<sObject> getRecords(string objectName) {
        String query = 'SELECT ';
        for(string f : AllFieldSet.getObjectFields(objectName)) {
            query += f +', ';
            // query += f.getFieldPath() + ', ';
        }
        query += 'Id FROM '+ objectName + ' LIMIT 10';
        System.debug(query);
        List<sObject> records = Database.query(query);
        System.debug(records);
        return Database.query(query);
    } 
    
    /*-----------------------------------------------------------------------------*/
    
    @AuraEnabled
    Public Static string deleteRecord(String recId, string objectName){
        String query = 'SELECT Id FROM ' +objectName+ ' WHERE ID = \'' + recId + '\'';
        
        
        System.debug('Query: '+query);
       // sObject rec = Database.query(query);
        try{
            Delete Database.query(query);  
            return 'success';
        } catch(exception e){
            System.debug('Error# '+e.getMessage());
            return (String)e.getMessage();
        }
        
    }
    
}