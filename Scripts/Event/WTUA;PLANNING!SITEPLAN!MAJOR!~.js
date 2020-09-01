try {
    // Set the Reviewers Tasks per the wfStatus choosen per REVIEW DEPTS FOR ELM Spreadsheet scritp# 60p
	if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
		activateTask("Building Inspection Review");
		activateTask("CDOT Review");
		activateTask("Environmental Engineering Review");
		activateTask("Fire and Life Safety Review");
		activateTask("Planning Review");
		activateTask("Police Review");
		activateTask("Utilities Review");
		activateTask("VDOT Review");
		activateTask("Real Property Review");
		activateTask("GIS-IST Review");
		activateTask("Water Quality Review");
	}
	
//Site Plan - Initial Submittal Fee 8.1P
if (wfTask == 'First Glance Consolidation' && wfStatus == 'First Glance Review Complete') {
    addFee("SITEPLAN","CC-PLANNING","FINAL",1,"N");
}
//Erosion and Sediment Control Review and Enforcement Fees 8.2P
var TotalLDAcreage = parseFloat(AInfo['Total Land Disturbance Acreage']);
if ((wfTask == 'First Glance Consolidation' && wfStatus == 'First Glance Review Complete') && (TotalLDAcreage <=.229)) {
    addFee("ERSCRENFMIN","CC-PLANNING","FINAL",1,"N");
}
if ((wfTask == 'First Glance Consolidation' && wfStatus == 'First Glance Review Complete') && (TotalLDAcreage >.229)) {
    addFee("ERSCRENFORCE","CC-PLANNING","FINAL",1,"N");
}
if ((wfTask == 'First Glance Consolidation' && wfStatus == 'First Glance Review Complete') && (AInfo["Total Residential Lots"] != null)) {
    addFee("ERSCRENFRLOT","CC-PLANNING","FINAL",1,"N"); 
}    
//Site Plan - Submittals Subsequent to First 3 Submittals Fees based on ASI Field 'Submittal Count'
//if ((wfTask == 'Review Distribution' && wfStatus == 'Revisions Received') && (AInfo["Submittal Count"] > 3)){
//    addFee("SITEPLAN2","CC-PLANNING","FINAL",1,"N")}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}