try {
// CPC Hearing Results Required
	if (matches(wfTask,'CPC Hearing') && matches(wfStatus,'CPC Approved','CPC Approved with Admin Review','CPC Denied')) {
			if (AInfo['CPC Conditions'] == null || AInfo['CPC Approved time limit'] == null || AInfo['CPC Expiration Date'] == null) {
				showMessage = true;
				comment('You cannot advance this workflow until ALL fields in the <b>Results</b> area of the Data Fields are completely filled in.  Put in zeroes (0) for those fields that do not apply.');
				cancel = true;
			}
        }
}
catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}