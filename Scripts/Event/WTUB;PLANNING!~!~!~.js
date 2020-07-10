/*
Purpose : checking for conditions on parcels at each record type
Description : 
 */
//Constants:

try {
	//Manufactured Homes and RPA Exception Record Types and Zoning Case - !appMatch(Planning/LandUse/ZoningCase/NA) ??
	getParcelConditions('CDOT', 'Applied', null, null);
	logDebug("resultArray: " + getParcelConditions('CDOT', 'Applied', null, null));
	if (matches(wfTask, 'BOS Hearing') && matches(wfStatus, 'Approved') && 
		(getParcelConditions('BI', 'Applied', null, null) ||
		getParcelConditions('CDOT', 'Applied', null, null) ||
		getParcelConditions('EE', 'Applied', null, null) ||
		getParcelConditions('Fire', 'Applied', null, null) ||
		getParcelConditions('Health', 'Applied', null, null) ||
		getParcelConditions('Parks and Rec', 'Applied', null, null) ||
		getParcelConditions('Planning', 'Applied', null, null) ||
		getParcelConditions('Utilities', 'Applied', null, null) ||
		getParcelConditions('VDOT', 'Applied', null, null) ||
		getParcelConditions('Real Property', 'Applied', null, null))) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Conditions? You will need to update the Condition Status to Condition Met to proceed in the workflow');
			cancel = true;
	}
	//Variance and SpecialException and AdminVariance
	if (matches(wfTask, 'Case Complete') && matches(wfStatus, 'Closed') && 
		(getParcelConditions('CDOT', 'Applied', null, null) ||
		getParcelConditions('EE', 'Applied', null, null) ||
		getParcelConditions('Fire', 'Applied', null, null) ||
		getParcelConditions('Health', 'Applied', null, null) ||
		getParcelConditions('Parks and Rec', 'Applied', null, null) ||
		getParcelConditions('Planning', 'Applied', null, null) ||
		getParcelConditions('Utilities', 'Applied', null, null) ||
		getParcelConditions('VDOT', 'Applied', null, null))) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Conditions? You will need to update the Condition Status to Condition Met to proceed in the workflow');
			cancel = true;
	}
} catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}