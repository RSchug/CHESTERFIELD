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
		deactivateTask("Default");
	//Set due dates to 5 days out per ELM Due Date Doc
		var workflowTasks = aa.workflow.getTasks(capId).getOutput();
		var taskAuditArray = ['Airport Review','Assessor Review','Building Inspection Review','Budget Review','Community Enhancement Review','County Library Review','Chesterfield Historical Society Review','Department of Health Review','CDOT Review','Economic Development Review','Environmental Engineering Review','Fire and Life Safety Review','GIS-EDM Utilities Review','GIS-IST Review','Parks and Recreation Review','Planning Review','Police Review','Real Property Review','School Research and Planning Review','County Attorney Review','Utilities Review','VDOT Review','Water Quality Review'];
		for (var ind in taskAuditArray) {
			var wfaTask = taskAuditArray[ind];
			for (var i in workflowTasks) {
				var wfbTask = workflowTasks[i];
				if (wfbTask.getActiveFlag() == 'Y') {
					if (wfaTask == wfbTask.getTaskDescription()) {
						editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,5));
					}
				}
			}
		}
	}
	
//33P set the Expiration Date to 1825 days 
	var expDateField = "Expiration Date";
	var expDate = jsDateToASIDate(new Date(dateAdd(null, 1825)));
	if (wfTask == 'Review Consolidation' && wfStatus == 'Approved'){
		editAppSpecific(expDateField, expDate);
	}
//80p
	if (wfTask == 'Staff and Developer Meeting' && wfStatus == 'Complete'){
		setTask("Planning Review","N","Y");
		setTask("Airport Review","N","Y");
		setTask("Assessor Review","N","Y");
		setTask("Building Inspection Review","N","Y");
		setTask("County Library Review","N","Y");
		setTask("Department of Health Review","N","Y");
		setTask("CDOT Review","N","Y");
		setTask("Economic Development Review","N","Y");
		setTask("Environmental Engineering Review","N","Y");
		setTask("Fire and Life Safety Review","N","Y");
		setTask("GIS-IST Review","N","Y");
		setTask("GIS-EDM Utilities Review","N","Y");
		setTask("Parks and Recreation Review","N","Y");
		setTask("Police Review","N","Y");
		setTask("Real Property Review","N","Y");
		setTask("County Attorney Review","N","Y");
		setTask("School Research and Planning Review","N","Y");
		setTask("Utilities Review","N","Y");
		setTask("VDOT Review","N","Y");
		setTask("Water Quality Review","N","Y");
		setTask("Chesterfield Historical Society Review","N","Y");
		setTask("Community Enhancement Review","N","Y");
		activateTask("Review Consolidation");
	}
	
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}