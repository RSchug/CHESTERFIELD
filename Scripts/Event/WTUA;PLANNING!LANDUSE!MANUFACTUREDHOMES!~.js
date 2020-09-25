try {
    // Set the Reviewers Tasks per the wfStatus choosen per REVIEW DEPTS FOR ELM Spreadsheet scritp# 60p
	if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
		activateTask("CDOT Review");
		editTaskDueDate('CDOT Review', dateAdd(getTaskDueDate('Review Distribution'),14));
		activateTask("Community Enhancement Review");
		editTaskDueDate('Community Enhancement Review', dateAdd(getTaskDueDate('Review Distribution'),14));
		activateTask("Environmental Engineering Review");
		editTaskDueDate('Environmental Engineering Review', dateAdd(getTaskDueDate('Review Distribution'),14));
		activateTask("Fire and Life Safety Review");
		editTaskDueDate('Fire and Life Safety Review', dateAdd(getTaskDueDate('Review Distribution'),14));
		activateTask("Department of Health Review");
		editTaskDueDate('Department of Health Review', dateAdd(getTaskDueDate('Review Distribution'),14));
		activateTask("Police Review");
		editTaskDueDate('Police Review', dateAdd(getTaskDueDate('Review Distribution'),14));
		activateTask("Planning Review");
		editTaskDueDate('Planning Review', dateAdd(getTaskDueDate('Review Distribution'),14));
		activateTask("Utilities Review");
		editTaskDueDate('Utilities Review', dateAdd(getTaskDueDate('Review Distribution'),14));
		activateTask("VDOT Review");
		editTaskDueDate('VDOT Review', dateAdd(getTaskDueDate('Review Distribution'),14));
		activateTask("Real Property Review");
		editTaskDueDate('Real Property Review', dateAdd(getTaskDueDate('Review Distribution'),14));
		deactivateTask("Default");
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}