//Fees for Special Exception
if ((wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') && (AInfo["Special Exception Request Type"] == "Temporary Manufactured Home")) {
	addFee("SEMANUFACTUR","CC-PLANNING","FINAL",1,"N");
}
if ((wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') && (AInfo["Special Exception Request Type"] != "Temporary Manufactured Home")){
	addFee("SEOTHER","CC-PLANNING","FINAL",1,"N");
}