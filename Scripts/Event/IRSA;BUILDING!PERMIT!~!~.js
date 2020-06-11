if (exists(inspResult,["Approved","Corrections Required"]) && inspType.indexOf("Final") < 0) { 
	// Update Permit Expiration Date
	var expField = "Permit Expiration Date";
	var expDateNew = jsDateToASIDate(new Date(dateAdd(null,180)));
	logDebug("Updating " + expField + " to " + expDateNew);
	editAppSpecific(expField, expDateNew);
}
//Amusement Final 275 Days
if (inspType.equals("Amusement Final") && inspResult.equals("Approved")){
	// Update Permit Expiration Date
	var expField = "Permit Expiration Date";
	var expDateNew = jsDateToASIDate(new Date(dateAdd(null,275)));
	logDebug("Updating " + expField + " to " + expDateNew);
	editAppSpecific(expField, expDateNew);
}
// 35B: For Record Types: Residential Bldg, Residential Multi-Family and Commercial Building
// If the Inspection Result is 'Approved' on Inspection Type of 'Building Final', and the related 
// BUILDING/STRUCTURE Record Status is 'New Building' update Record Status on BUILDING/STRUCTURE to 'Existing'
if (inspType.equals("Building Final") && inspResult.equals("Approved")
&& (appMatch("Building/Permit/Residential/NA") || appMatch("Building/Permit/Residential/Multi-Family") || appMatch("Building/Permit/Commercial/NA"))) {
	if (parentCapId && appMatch("Building/Structure/NA/NA", parentCapId)) {
		var parentCapStatus = null;
		var getCapResult = aa.cap.getCap(parentCapId);
		if (getCapResult.getSuccess()) {
			var parentCap = getCapResult.getOutput();
			parentCapStatus = parentCap.getCapStatus();
		}
		if (parentCapStatus == "New Building") {
			logDebug("Updating Structure " + parentCapId.getCustomID() + " from " + parentCapStatus);
			updateAppStatus("Existing", "Updated via script from " + capId.getCustomID(), parentCapId);
		} else {
			logDebug("Keeping Structure " + parentCapId.getCustomID() + " as " + parentCapStatus);
		}
	}
}