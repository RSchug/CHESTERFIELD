var newTapNumber = Number(lookup("NEW_TAP_NUMBER","TAP_NUMBER"));
var count = 1;
editAppSpecific("Service Number",lookup("NEW_TAP_NUMBER","TAP_NUMBER"));
editLookup("NEW_TAP_NUMBER","TAP_NUMBER",zeroPad(newTapNumber+count,8));

if (!publicUser) performCISLookup()
//Add Fees//
if (!publicUser) {
    addFee("CC-UTL-RM01","CC-UTL-RM","FINAL",1,"Y");
    addFee("CC-UTL-RM02","CC-UTL-RM","FINAL",1,"Y");
    addFee("BACKFLOW","CC-UTL-RM","FINAL",1,"Y");
    addFee("STATELEVY","CC-UTL-RM","FINAL",1,"Y")
}