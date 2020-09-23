try {
    // Set the Reviewers Tasks per the wfStatus choosen per REVIEW DEPTS FOR ELM Spreadsheet scritp# 60p
	if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
		activateTask("Budget Review");
		activateTask("CDOT Review");
		activateTask("Environmental Engineering Review");
		activateTask("Fire and Life Safety Review");
		activateTask("Planning Review");
		activateTask("Utilities Review");
		activateTask("VDOT Review");
		activateTask("Real Property Review");
		activateTask("GIS-IST Review");
		activateTask("Assessor Review");
		activateTask("Water Quality Review");
		activateTask("GIS-EDM Utilities Review");
		deactivateTask("Default");
	}
	if (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') {
	//49P Final Plat Fee
		addFee("FINALPLAT1","CC-PLANNING","FINAL",1,"N");
	}
	if (matches(wfTask, 'Review Consolidation') && matches(wfStatus, 'Revisions Requested','Submit Signed Plat')) {
		var BlankExpireDate = AInfo['Expiration Date'];
		var months = 12 ;
			if(BlankExpireDate == null || BlankExpireDate == "") {
				var NewExpireDate = dateAddMonths(dateAdd(null,0),months);
			}
			if(BlankExpireDate != null && BlankExpireDate != "") {
				var NewExpireDate = dateAddMonths(BlankExpireDate,months);
			}
			editAppSpecific("Expiration Date",NewExpireDate);
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}