try {
// Variances BZA
if (appMatch('Planning/LandUse/AdminVariance/NA') || appMatch('Planning/LandUse/Variance/NA') || appMatch('Planning/LandUse/SpecialException/NA') || appMatch('Planning/LandUse/Appeal/NA')){    
    if (matches(wfTask, 'BZA Hearing') && matches(wfStatus,'Approved','Denied')) {
		if (AInfo['Conditions'] == null || AInfo['Approved Time Limit'] == null) {
			showMessage = true;
			comment('You cannot advance this workflow until ALL fields in the <b>Results</b> area of the Data Fields are completely filled in.  Put in zeroes (0) for those fields that do not apply.');
			cancel = true;
		}
	}
}
// 42.4P Manufactured Homes and RPA Exception
if (appMatch('Planning/LandUse/ManufacturedHomes/NA') || appMatch('Planning/LandUse/RPAException/NA')){    
    if (matches(wfTask, 'BOS Hearing') && matches(wfStatus,'Approved','Denied')) {
		if (AInfo['Conditions'] == null || AInfo['Proffered Conditions'] == null || AInfo['Cash Proffers'] == null || AInfo['Complies with Plan'] == null ){
			showMessage = true;
			comment('You cannot advance this workflow until ALL fields in the <b>Results</b> area of the Data Fields are completely filled in.  Put in zeroes (0) for those fields that do not apply.');
			cancel = true;
		}
	}
}
if (appMatch('Planning/LandUse/ManufacturedHomes/NA') || appMatch('Planning/LandUse/RPAException/NA')){   
if (matches(wfTask, 'BOS Hearing') && matches(wfStatus, 'Approved','Denied')) {
	if (AInfo['No BOS Time Limit'] != 'CHECKED'){
		if (AInfo['Approved Time Limit'] == null) {
		showMessage = true;
		comment('You cannot advance this workflow until ALL fields in the <b>Results</b> area of the Data Fields are completely filled in.  Put in zeroes (0) for those fields that do not apply.');
		cancel = true;
		}
	}
}
}
if (appMatch('Planning/LandUse/AdminVariance/NA')){    
    if (matches(wfTask, 'Administrative Outcome') && matches(wfStatus,'Approved','Denied')) {
		if (AInfo['Conditions'] == null || AInfo['Approved Time Limit'] == null) {
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
