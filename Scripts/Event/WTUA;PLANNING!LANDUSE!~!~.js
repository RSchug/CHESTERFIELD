try {
    // Set the Reviewers Tasks per the wfStatus choosen per REVIEW DEPTS FOR ELM Spreadsheet scritp# 60p - 09-2020 updated review due dates per ELM Planning Due Date Doc
	if (appMatch('*/*/Variance/*') || appMatch('*/*/SpecialException/*') || appMatch('*/*/AdminVariance/*')) {
		if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
			activateTask("CDOT Review");
			if (appMatch('*/*/AdminVariance/*')) {
				editTaskDueDate('CDOT Review', dateAdd(getTaskDueDate('Review Distribution'),10));
			} else { editTaskDueDate('CDOT Review', dateAdd(getTaskDueDate('Review Distribution'),14)); }
			activateTask("Environmental Engineering Review");
			if (appMatch('*/*/AdminVariance/*')) {
				editTaskDueDate('Environmental Engineering Review', dateAdd(getTaskDueDate('Review Distribution'),10));
			} else { editTaskDueDate('Environmental Engineering Review', dateAdd(getTaskDueDate('Review Distribution'),14)); }
			activateTask("Fire and Life Safety Review");
			if (appMatch('*/*/AdminVariance/*')) {
				editTaskDueDate('Fire and Life Safety Review', dateAdd(getTaskDueDate('Review Distribution'),10));
			} else { editTaskDueDate('Fire and Life Safety Review', dateAdd(getTaskDueDate('Review Distribution'),14)); }
			activateTask("Department of Health Review");
			if (appMatch('*/*/AdminVariance/*')) {
				editTaskDueDate('Department of Health Review', dateAdd(getTaskDueDate('Review Distribution'),10));
			} else { editTaskDueDate('Department of Health Review', dateAdd(getTaskDueDate('Review Distribution'),14)); }
			activateTask("Planning Review");
			if (appMatch('*/*/AdminVariance/*')) {
				editTaskDueDate('Planning Review', dateAdd(getTaskDueDate('Review Distribution'),10));
			} else { editTaskDueDate('Planning Review', dateAdd(getTaskDueDate('Review Distribution'),14)); }
			activateTask("Utilities Review");
			if (appMatch('*/*/AdminVariance/*')) {
				editTaskDueDate('Utilities Review', dateAdd(getTaskDueDate('Review Distribution'),10));
			} else { editTaskDueDate('Utilities Review', dateAdd(getTaskDueDate('Review Distribution'),14)); }
			activateTask("VDOT Review");
			if (appMatch('*/*/AdminVariance/*')) {
				editTaskDueDate('VDOT Review', dateAdd(getTaskDueDate('Review Distribution'),10));
			} else { editTaskDueDate('VDOT Review', dateAdd(getTaskDueDate('Review Distribution'),14)); }
			activateTask("Real Property Review");
			if (appMatch('*/*/AdminVariance/*')) {
				editTaskDueDate('Real Property Review', dateAdd(getTaskDueDate('Review Distribution'),10));
			} else { editTaskDueDate('Real Property Review', dateAdd(getTaskDueDate('Review Distribution'),14)); }
			deactivateTask("Default");
		}
	}
//6P  moved to WTUA:Planning

//6.1P Not Needed - fixed in workflow

//48P  Not Needed - fixed in workflow

//90P  Not Needed - fixed in workflow

} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}