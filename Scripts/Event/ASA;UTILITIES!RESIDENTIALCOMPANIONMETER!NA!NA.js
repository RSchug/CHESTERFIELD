var newTapNumber = Number(lookup("NEW_TAP_NUMBER","TAP_NUMBER"));
var count = 1;
editAppSpecific("Service Number",lookup("NEW_TAP_NUMBER","TAP_NUMBER"));
editLookup("NEW_TAP_NUMBER","TAP_NUMBER",zeroPad(newTapNumber+count,8));
}