/*
Script# 7p
Purpose : checking for conditions on parcels at each record type and at their final step
Description:
PLEASE BE ADVISED - This code also exist in the WTUB:Building for these proffer conditions on the parcels
 */
//Constants:
try {
	if (matches(wfTask, 'BOS Hearing') && matches(wfStatus, 'Approved')) {
		if (appMatch('*/*/RPAException/*') && parcelHasCondition_TPS('RPA', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied RPA Exception Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
		else if (appMatch('*/*/ManufacturedHomes/*') && parcelHasCondition_TPS('Manufactured', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Manufactured Home Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
		else if (appMatch('*/*/SubstantialAccord/*') && parcelHasCondition_TPS('Substantial', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Substantial Accord Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
		else if (appMatch('*/*/HistoricPreservation/*') && parcelHasCondition_TPS('Historic', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Historic Preservation Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
	}
	if (matches(wfTask, 'Case Complete') && matches(wfStatus, 'Closed')) {
		if (appMatch('*/*/Preliminary/*') && parcelHasCondition_TPS('Preliminary', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Preliminary Plan Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
		else if (appMatch('*/*/ConstructionPlan/*') && parcelHasCondition_TPS('Construction', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Construction Plan Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
		else if (appMatch('*/*/ParcelAcreage/*') && parcelHasCondition_TPS('Acreage', 'Applied')) {
			showMessage = true;
			comment('The Parcel(s) seem to have still applied Parcel Acreage Conditions? You will need to update those Condition(s) Status to Condition Met to proceed in the workflow');
			cancel = true;
		}
		else if ((appMatch('*/*/AdminVariance/*') || appMatch('*/*/SpecialException/*') || appMatch('*/*/Variance/*')) && parcelHasCondition_TPS('Variance', 'Applied')) {
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
	if ((appMatch('*/LandUse/AdminVariance/NA') || appMatch('*/LandUse/Variance/NA') || appMatch('*/LandUse/SpecialException/NA') || appMatch('*/LandUse/Appeal/NA')) &&
		matches(wfTask,'Review Consolidation','BZA Staff Report') && matches(wfStatus,'Ready for BZA','Complete') && isTaskActive('BZA Hearing')) {
			if (isTaskActive('BZA Staff Report')) {
				closeTask("BZA Staff Report","Complete","");  //put the cancel in the WTUB:Planning!LandUse
			}
			if (isTaskActive('Review Consolidation')) {
				closeTask("Review Consolidation","Complete","");
			}
	}
	if ((appMatch('*/LandUse/ManufacturedHomes/NA') || appMatch('*/LandUse/RPAException/NA')) && matches(wfTask,'Review Consolidation') && matches(wfStatus,'Complete','Review Complete') && isTaskActive('BOS Hearing')) {
		closeTask("Review Consolidation","Complete","");
	}

} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}