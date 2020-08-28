/*
Script# 7p
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
// 07-2020 Boucher 41p and 42p check that Custom data is filled in before moving to next step
	if (appMatch('*/*/Major/*')) {
		if (matches(wfTask, 'CPC Meeting','CPC Hearing','BOS Hearing') && matches(wfStatus, 'Recommend Approval','Recommend Denial','CPC Approved','CPC Approved with Admin Review','CPC Denied','Approved','Denied')) {
			if (AInfo['Approved time limit'] == null || AInfo['Conditions'] == null || AInfo['Number of Town House Units Approved'] == null || AInfo['Non-Residential Gross Building Square Feet'] == null
			|| AInfo['Expiration Date'] == null || AInfo['Number of Single Family Units Approved'] == null || AInfo['Number of Multi Family Units Approved'] == null) {
				showMessage = true;
				comment('You cannot advance this workflow until ALL fields in the <b>Results</b> area of the Data Fields are completely filled in.  Put in zeroes (0) for those fields that do not apply.');
				cancel = true;
			}
		}
	}
} catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}
//20P When AdHoc Task 'Signs Posted' Status is updated to any value and Adhoc Task 'IVR Message' current Status is not "Message Recorded" Then display error 'Message needs to be recorded before signs can be posted'. Do not stop the workflow, just show Message to end user.
if ((wfTask == 'Sign Posting') && (wfStatus == 'Signs Posted')) {
	if (wfTask == 'IVR Message' && wfStatus !='Message Recorded'){
	showMessage = true;
	comment('Message needs to be recorded before signs can be posted.');
}}
//86P
if ((wfTask == 'Sign Posting' && wfStatus == 'Signs Removed') && (!matches(capStatus,'Final Approval','Approved','Denied','Withdrawn'))){
	showMessage = true;
	comment('<font size=small><b>Sign cannot be removed until the record status has Final Action.');
	cancel = true;
}