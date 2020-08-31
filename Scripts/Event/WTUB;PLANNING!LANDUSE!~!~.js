try {
// Variances BZA
if (appMatch('Planning/LandUse/AdminVariance/NA') || appMatch('Planning/LandUse/Variance/NA') || appMatch('Planning/LandUse/SpecialException/NA')){    
    if (matches(wfTask, 'BZA Hearing') && matches(wfStatus,'Approved','Denied')) {
		if (AInfo['Conditions'] == null || AInfo['Approved time limit'] == null || AInfo['Expiration date'] == null) {
			showMessage = true;
			comment('You cannot advance this workflow until ALL fields in the <b>Results</b> area of the Data Fields are completely filled in.  Put in zeroes (0) for those fields that do not apply.');
			cancel = true;
		}
	}
}
// 42.4P Manufactured Homes and RPA Exception
if (appMatch('Planning/LandUse/ManufacturedHomes/NA') || appMatch('Planning/LandUse/RPAException/NA')){    
    if (matches(wfTask, 'BOS Hearing') && matches(wfStatus,'Approved','Denied')) {
		if (AInfo['BOS Conditions'] == null || AInfo['BOS Proffered conditions'] == null || AInfo['BOS Cash proffers'] == null || AInfo['BOS Complies with plan'] == null || AInfo['BOS Approved time limit'] == null || AInfo['BOS Expiration date'] == null) {
			showMessage = true;
			comment('You cannot advance this workflow until ALL fields in the <b>Results</b> area of the Data Fields are completely filled in.  Put in zeroes (0) for those fields that do not apply.');
			cancel = true;
		}
	}
} 
}
catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}
