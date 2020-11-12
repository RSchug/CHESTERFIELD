try {
//Fees for Special Exception
	if ((wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') && (AInfo["Special Exception Request Type"] == "Temporary Manufactured Home") && (AInfo["Application Type"] != "Amendment")) {
		addFee("SEMANUFACTUR","CC-PLANNING","FINAL",1,"Y");
	}
	else if ((wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') && (AInfo["Special Exception Request Type"] != "Temporary Manufactured Home") && (AInfo["Application Type"] != "Amendment")){
		addFee("SEOTHER","CC-PLANNING","FINAL",1,"N");
	}
	else if ((wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') && (AInfo["Application Type"] == "Amendment")){
		addFee("AMEND5","CC-PLANNING","FINAL",1,"N");
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}