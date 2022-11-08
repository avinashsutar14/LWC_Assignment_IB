public with sharing class FieldSetClass {
    @AuraEnabled(cacheable=true)
    Public Static List<string> getOppFields(){
        List<string> fieldAPIs = new List<string>();
        List<Schema.FieldSetMember> fieldSetList = SObjectType.Opportunity.FieldSets.New_Opportunity_FieldSet.getFields();
        
       // fieldSetList.getFieldPath();
        For(Schema.FieldSetMember f:fieldSetList){ 
            fieldAPIs.add(f.getFieldPath());
          //System.debug(f.getFieldPath());
        }
      return fieldAPIs;
        //return  SObjectType.Opportunity.FieldSets.New_Opportunity_FieldSet.getFields();
    }

    @AuraEnabled
    Public Static Opportunity oppRecMethod(Opportunity opp){
       insert opp;
       return opp; 
    }
}