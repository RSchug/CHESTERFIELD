try {
//Fees for Special Exception
	if ((wfTask == 'Application Submittal' && wfStatus == 'Calculate Fees') && (AInfo["Special Exception Request Type"] == "Temporary Manufactured Home") && (AInfo["Application Type"] != "Amendment")) {
		addFee("SEMANUFACTUR","CC-PLANNING","FINAL",1,"N");
	}
	else if ((wfTask == 'Application Submittal' && wfStatus == 'Calculate Fees') && (AInfo["Special Exception Request Type"] != "Temporary Manufactured Home") && (AInfo["Application Type"] != "Amendment")){
		addFee("SEOTHER","CC-PLANNING","FINAL",1,"N");
	}
	else if ((wfTask == 'Application Submittal' && wfStatus == 'Calculate Fees') && (AInfo["Application Type"] == "Amendment")){
		addFee("AMEND5SE","CC-PLANNING","FINAL",1,"N");
	}
	if (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') {
		invoiceAllFees(capId);
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}