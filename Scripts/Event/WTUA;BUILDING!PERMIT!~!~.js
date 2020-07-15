//Permit Issuance is Issued than updated Permit Expiration Date to 180 days from system date
if (wfTask == "Permit Issuance" && wfStatus == "Issued") { 
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
var tempcoexpdate = "Temp CO Expiration Date";
var tempcoexpdatenew = jsDateToASIDate(getTaskDueDate("Temp CO Issued"));
if (wfStatus == 'Temporary CO Issued'){
addFee("TEMPCO","CC-BLD-ADMIN","FINAL",1,"Y");
editAppSpecific(tempcoexpdate,tempcoexpdatenew);}