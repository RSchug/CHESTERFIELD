//Permit Issuance is Issued than updated Permit Expiration Date to 180 days from system date
if ((wfTask == "Permit Issuance" && wfStatus == "Issued") || !exists(capStatus, ["Cancelled","Pending Applicant"])) { 
	// Update Permit Expiration Date on record, and where appropriate parent and children
	var expField = "Permit Expiration Date";
	var expDateNew = jsDateToASIDate(new Date(dateAdd(null, 180)));
	editAppSpecific(expField, expDateNew);
	if (appMatch("Building/Permit/Residential/NA") || appMatch("Building/Permit/Residential/Multi-Family") || appMatch("Building/Permit/Commercial/NA")) {
		var childRecs = getChildren("Building/Permit/*/*", capId);
	} else if (parentCapId) {
		logDebug("Updating parent " + parentCapId.getCustomID() + " " + expField + " to " + expDateNew);
		editAppSpecific(expField, expDateNew, parentCapId);
		var childRecs = getChildren("Building/Permit/*/*", parentCapId);
	} else {
		comment("Parent record missing. Could not update parent expiration date.");
		var childRecs = [];
	}
	for (var c in childRecs) {
		var childCapId = childRecs[c];
		var childCapStatus = null;
		var getCapResult = aa.cap.getCap(childCapId);
		if (getCapResult.getSuccess()) {
			var childCap = getCapResult.getOutput();
			var childCapStatus = childCap.getCapStatus();
		}
		if (childCapStatus != "Cancelled") {
			logDebug("Updating child " + childCapId.getCustomID() + " " + childCapStatus + " " + expField + " to " + expDateNew);
			editAppSpecific(expField, expDateNew, childCapId);
		}
	}
}
//Temp CO Dates
var tempcoexpdate = "Temp CO Expiration Date";
var tempcoexpdatenew = jsDateToASIDate(getTaskDueDate("Inspections"));
if (wfStatus == 'Temporary CO Issued' && appMatch("Building/Permit/Residential/NA")) {
addFee("TEMPCORES","CC-BLD-ADMIN","FINAL",1,"Y");
editAppSpecific(tempcoexpdate,tempcoexpdatenew);
}
if (wfStatus == 'Temporary CO Issued' && appMatch("Building/Permit/Commercial/NA")) {
	addFee("TEMPCO","CC-BLD-ADMIN","FINAL",1,"Y");
	editAppSpecific(tempcoexpdate,tempcoexpdatenew);
}
//Variables for the EE Inspector based on Parcel field "Inspection Dist" and Standard Choice 'InspectionAssignmentEnvEngineering'
var ParcelInspectorEnvEng = AInfo["ParcelAttribute.InspectionDistrict"];
//var InspAssignment = lookup("InspectionAssignmentEnvEngineering", ParcelInspectorEnvEng);
var iInspector = assignInspection_CHESTERFIELD(null); // Get Inspector
var InspAssignment = null;
if (iInspector && iInspector.getGaUserID())
    InspAssignment = iInspector.getGaUserID();

if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
	if (isTaskActive("Environmental Engineering Review")) {
    assignTask("Environmental Engineering Review",InspAssignment);
}}