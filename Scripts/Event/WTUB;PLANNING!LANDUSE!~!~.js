try {
// Variances BZA
if (appMatch('Planning/LandUse/AdminVariance/NA','Planning/LandUse/Variance/NA','Planning/LandUse/SpecialException/NA')){    
    if (matches(wfTask, 'BZA Hearing') && matches(wfStatus,'Approved','Denied')) {
		if (AInfo['Conditions'] == null || AInfo['Approved time limit'] == null || AInfo['Expiration date'] == null) {
			showMessage = true;
			comment('You cannot advance this workflow until ALL fields in the <b>Results</b> area of the Data Fields are completely filled in.  Put in zeroes (0) for those fields that do not apply.');
			cancel = true;
		}
	}
}} catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}