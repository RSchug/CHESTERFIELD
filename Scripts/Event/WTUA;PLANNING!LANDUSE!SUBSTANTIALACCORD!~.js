try {
	//Fees for Substantial Accord
if (wfTask == 'Application Submittal' && wfStatus == 'Calculate Fees' && AInfo['Request type'] == 'Communication Tower') {
		addFee("SACTOWER","CC-PLANNING","FINAL",1,"N");
	}
	if (wfTask == 'Application Submittal' && wfStatus == 'Calculate Fees' && AInfo['Request type'] != 'Communication Tower'){
		addFee("SAOTHER","CC-PLANNING","FINAL",1,"N");
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}