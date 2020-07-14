/*
Purpose : checking for conditions on parcels at each record type
Description : 
 */
//Constants:

try {
	//Manufactured Homes and RPA Exception Record Types and Zoning Case - !appMatch(Planning/LandUse/ZoningCase/NA) ??
	if (matches(wfTask, 'BOS Hearing') && matches(wfStatus, 'Approved') && 
		(parcelHasConditiontrue_TPS('BI', 'Applied') ||
		parcelHasConditiontrue_TPS('CDOT', 'Applied') ||
		parcelHasConditiontrue_TPS('EE', 'Applied') ||
		parcelHasConditiontrue_TPS('Fire', 'Applied') ||
		parcelHasConditiontrue_TPS('Health', 'Applied') ||
		parcelHasConditiontrue_TPS('Parks and Rec', 'Applied') ||
		parcelHasConditiontrue_TPS('Planning', 'Applied') ||
		parcelHasConditiontrue_TPS('Utilities', 'Applied') ||
		parcelHasConditiontrue_TPS('VDOT', 'Applied') ||
		parcelHasConditiontrue_TPS('Real Property', 'Applied'))) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Conditions? You will need to update the Condition Status to Condition Met to proceed in the workflow');
			cancel = true;
	}
	//Variance and SpecialException and AdminVariance
	if (matches(wfTask, 'Case Complete') && matches(wfStatus, 'Closed') && 
		(parcelHasConditiontrue_TPS('CDOT', 'Applied') ||
		parcelHasConditiontrue_TPS('EE', 'Applied') ||
		parcelHasConditiontrue_TPS('Fire', 'Applied') ||
		parcelHasConditiontrue_TPS('Health', 'Applied') ||
		parcelHasConditiontrue_TPS('Parks and Rec', 'Applied') ||
		parcelHasConditiontrue_TPS('Planning', 'Applied') ||
		parcelHasConditiontrue_TPS('Utilities', 'Applied') ||
		parcelHasConditiontrue_TPS('VDOT', 'Applied'))) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Conditions? You will need to update the Condition Status to Condition Met to proceed in the workflow');
			cancel = true;
	}
} catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}