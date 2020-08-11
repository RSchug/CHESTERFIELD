//33P set the Expiration Date to 1825 days 
var expDateField = "Expiration Date";
var expDate = jsDateToASIDate(new Date(dateAdd(null, 1825)));
if (wfTask == 'Review Consolidation' && wfStatus == 'Approved'){
    editAppSpecific(expDateField, expDate, newCapId);}