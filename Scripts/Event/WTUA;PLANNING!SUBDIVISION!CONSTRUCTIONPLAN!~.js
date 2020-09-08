try {
    // Set the Reviewers Tasks per the wfStatus choosen per REVIEW DEPTS FOR ELM Spreadsheet scritp# 60p
	if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
		activateTask("CDOT Review");
		activateTask("Environmental Engineering Review");
		activateTask("Fire and Life Safety Review");
		activateTask("Planning Review");
		activateTask("Utilities Review");
		activateTask("VDOT Review");
		activateTask("Water Quality Review");
		activateTask("GIS-EDM Utilities Review");
		deactivateTask("Default");
	}
	//Erosion and Sediment Control Review and Enforcement Fees 8.2P and 8.3P
	if ((wfTask == 'First Glance Consolidation' && wfStatus == 'First Glance Review Complete') && (AInfo["Total Residential Lots"] != null)) {
		addFee("ERSCRENFRLOT","CC-PLANNING","FINAL",1,"N"); 
	}
	//Construction Plan Fee
	if (wfTask == 'First Glance Consolidation' && wfStatus == 'First Glance Review Complete') {
		addFee("CONSTPLAN","CC-PLANNING","FINAL",1,"N");
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}