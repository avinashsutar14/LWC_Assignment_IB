public with sharing class BulkContactsInsert {
    
    @AuraEnabled
    public static List<Contact> createContacts(List<Contact> conList){
        insert conList;
        List<Contact> contactList = [SELECT Id, FirstName, LastName, Email, AccountId, Account.Name FROM Contact WHERE Id IN :conList ORDER BY CreatedDate];
        return contactList;
    }
    
    public static void validateContact(List<Contact> conList){
        
        Map<Id, List<string>> AccEmailsMap = new Map<Id, List<string>>();
        List<Contact> contactList = new List<Contact>();
        set<Id> AccIds = new set<Id>();
        Map<Id, List<Contact>> AccConMap = new Map<Id, List<Contact>>();
        List<string> EmailsList = new List<string>();
        
        For(Contact con:conList){
            AccIds.add(con.AccountId);
        }
        //List<Contact> ContactList = [SELECT id, email, accountId FROM Contact WHERE accountId IN :conList];
        List<Account> AccList = [SELECT id, (SELECT Email FROM Contacts) FROM Account WHERE Id IN :AccIds];
        
        For(Account acc: AccList){
            //contactList.add(acc.contacts);
            AccConMap.put(acc.Id, acc.Contacts);
            contactList = AccConMap.get(acc.Id);
            For(Contact conEmail:contactList ){
                EmailsList.add(conEmail.Email);
            }
            AccEmailsMap.put(acc.Id, EmailsList);
            
        }
        System.debug(AccEmailsMap);
        For(Contact con:conList){
            if(AccEmailsMap.containsKey(con.AccountId) && (AccEmailsMap.get(con.AccountId).contains(con.Email))){
                con.addError('Duplicate Record!!');
            }
        }

    }     

}