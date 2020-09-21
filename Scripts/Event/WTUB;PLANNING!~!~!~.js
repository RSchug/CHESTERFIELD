/*
Script# 7p
Purpose : checking for conditions on parcels at each record type and at their final step
Description:
PLEASE BE ADVISED - This code also exist in the WTUB:Building for these proffer conditions on the parcels
 */
//Constants:
try {
	if (matches(wfTask, 'BOS Hearing') && matches(wfStatus, 'Approved')) {
		if (appMatch('*/*/RPAException/*') && parcelHasConditiontrue_TPS('RPA', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied RPA Exception Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
		else if (appMatch('*/*/ManufacturedHomes/*') && parcelHasConditiontrue_TPS('Manufactured', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Manufactured Home Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
		else if (appMatch('*/*/SubstantialAccord/*') && parcelHasConditiontrue_TPS('Substantial', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Substantial Accord Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
		else if (appMatch('*/*/HistoricPreservation/*') && parcelHasConditiontrue_TPS('Historic', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Historic Preservation Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
	}
	if (matches(wfTask, 'Case Complete') && matches(wfStatus, 'Closed')) {
		if (appMatch('*/*/Preliminary/*') && parcelHasConditiontrue_TPS('Preliminary', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Preliminary Plan Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
		else if (appMatch('*/*/ConstructionPlan/*') && parcelHasConditiontrue_TPS('Construction', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Construction Plan Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
		else if (appMatch('*/*/ParcelAcreage/*') && parcelHasConditiontrue_TPS('Acreage', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Parcel Acreage Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
		else if ((appMatch('*/*/AdminVariance/*') || appMatch('*/*/SpecialException/*') || appMatch('*/*/Variance/*')) && parcelHasConditiontrue_TPS('Variance', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Variance Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
	}
	//86P
	if ((wfTask == 'Sign Posting' && wfStatus == 'Signs Removed') && (!matches(capStatus, 'Final Approval', 'Approved', 'Denied', 'Withdrawn'))) {
		showMessage = true;
		comment('<font size=small><b>Sign cannot be removed until the record status has Final Action.</b></font>');
		cancel = true;
	}
	//20P When AdHoc Task 'Signs Posted' Status is updated to Signs Posted and Adhoc Task 'IVR Message' current Status is not "Message Recorded" Then display error 'Message needs to be recorded before signs can be posted'. Do not stop the workflow, just show Message to end user.
	if (wfTask == 'Sign Posting' && wfStatus == 'Signs Posted') {
		if (!isTaskStatus_TPS('IVR Message','Message Recorded')) {
			showMessage = true;
			comment('<font size=small><b>Message needs to be recorded before signs can be posted.</b></font>');
			cancel = true;
		}
	}

} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}