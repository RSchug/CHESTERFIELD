/*
Purpose : checking for conditions on parcels at each record type and at their final step
Description: 
PLEASE BE ADVISED - This code also exist in the WTUB:Building for these proffer conditions on the parcels
 */
//Constants:

try {
	if (matches(wfTask, 'BOS Hearing') && matches(wfStatus, 'Approved')) {
		if ((appMatch('*/*/RPAException/*') || appMatch('*/*/ManufacturedHomes/*') || appMatch('*/*/SubstantialAccord/*') || appMatch('*/*/HistoricPreservation/*')) &&
			(parcelHasConditiontrue_TPS('CDOT', 'Applied') ||
			parcelHasConditiontrue_TPS('EE', 'Applied') ||
			parcelHasConditiontrue_TPS('Fire', 'Applied') ||
			parcelHasConditiontrue_TPS('Health', 'Applied') ||
			parcelHasConditiontrue_TPS('Parks and Rec', 'Applied') ||
			parcelHasConditiontrue_TPS('Planning', 'Applied') ||
			parcelHasConditiontrue_TPS('Utilities', 'Applied') ||
			parcelHasConditiontrue_TPS('VDOT', 'Applied'))) {
				showMessage = true;
				comment('The Parcel(s) seem to have still applied Conditions? You will need to update the Condition(s) Status to Condition Met to proceed in the workflow');
				cancel = true;
		}
		if (appMatch('*/*/RPAException/*') && (parcelHasConditiontrue_TPS('BI', 'Applied') || parcelHasConditiontrue_TPS('Real Property', 'Applied'))) {
			showMessage = true;
			comment('The Parcel(s) still have an applied BI or Real Property Condition. Someone will need to update the Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
	}

	if (matches(wfTask, 'Case Complete') && matches(wfStatus, 'Closed')) {
		if ((appMatch('*/*/Preliminary/*') || appMatch('*/*/ConstructionPlan/*') || appMatch('*/*/ParcelAcreage/*') || appMatch('*/*/AdminVariance/*') || appMatch('*/*/SpecialException/*') || appMatch('*/*/Variance/*') || appMatch('*/*/Minor/*') || appMatch('*/*/Major/*')) && 
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
		if (appMatch('*/*/Preliminary/*') && parcelHasConditiontrue_TPS('School Plan', 'Applied')) {
			showMessage = true;
				comment('The Parcel(s) still have an applied School Plan Condition. Someone will need to update the Condition Status to Condition Met to proceed in the workflow');
				cancel = true;
		}
		if ((appMatch('*/*/ConstructionPlan/*') || appMatch('*/*/ParcelAcreage/*') || appMatch('*/*/Minor/*') || appMatch('*/*/Major/*')) && parcelHasConditiontrue_TPS('Real Property', 'Applied')) {
			showMessage = true;
				comment('The Parcel(s) still have an applied Real Property Condition. Someone will need to update the Condition Status to Condition Met to proceed in the workflow');
				cancel = true;
		}
	}
} catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}