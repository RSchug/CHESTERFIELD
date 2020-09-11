try {
    // Create Conditions from proffers on Zoning Case Record - 59p
	if (wfTask == 'BOS Hearing' && matches(wfStatus, 'Create Conditions and Close Case')) {

		var sum = 0;
		var tempAsit = loadASITable("PROFFER CONDITIONS");
		if (tempAsit) {
			for (a in tempAsit) {
				if (tempAsit[a]["Approved"] == 'CHECKED') {
					var cType = tempAsit[a]["Department"];
					var cDesc = tempAsit[a]["Department"]+' - '+tempAsit[a]["Record Type"];
					var cShortComment = tempAsit[a]["Proffer Condition"];
                    var cLongComment = tempAsit[a]["Long Comment"];
					addParcelStdCondition_TPS(null, cType, cDesc, cShortComment, cLongComment);
					//addParcelCondition(null,cType,'Applied',cDesc,cComment,'Notice');
				}
			}//for all rows
		}
	}
	 // Set the Reviewers Tasks per the wfStatus choosen per REVIEW DEPTS FOR ELM Spreadsheet scritp# 60p
	if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Commercial Review') {
		activateTask("CDOT Review");
		activateTask("Community Enhancement Review");
		activateTask("Environmental Engineering Review");
		activateTask("Fire and Life Safety Review");
		activateTask("Planning Review");
		activateTask("Utilities Review");
		activateTask("VDOT Review");
		activateTask("Technical Review Committee");
		deactivateTask("Default");
	}
	if (wfTask == 'Review Distribution' && (wfStatus == 'Routed for Residential and Commercial' || wfStatus == 'Routed for Residential Review')) {
		activateTask("Budget Review");
		activateTask("CDOT Review");
		activateTask("Community Enhancement Review");
		activateTask("Department of Health Review");
		activateTask("Environmental Engineering Review");
		activateTask("Fire and Life Safety Review");
		activateTask("County Library Review");
		activateTask("Parks and Recreation Review");
		activateTask("Planning Review");
		activateTask("Utilities Review");
		activateTask("VDOT Review");
		activateTask("School Research and Planning Review");
		activateTask("Technical Review Committee");
		if (wfStatus == 'Routed for Residential and Commercial') {
			activateTask("General Services");
		}
		deactivateTask("Default");
	}
	if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Towers Review') {
		activateTask("Airport Review");
		activateTask("CDOT Review");
		activateTask("Community Enhancement Review");
		activateTask("Environmental Engineering Review");
		activateTask("Fire and Life Safety Review");
		activateTask("Planning Review");
		activateTask("Utilities Review");
		activateTask("VDOT Review");
		activateTask("General Services");
		activateTask("Radio Shop");
		activateTask("Technical Review Committee");
		deactivateTask("Default");
	}
// Add Fees
	if (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') {
		addFees_ZoneCase();
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}