try {
    // Set the Reviewers Tasks per the wfStatus choosen per REVIEW DEPTS FOR ELM Spreadsheet scritp# 60p - 09-2020 updated review due dates per ELM Planning Due Date Doc
	if (appMatch('*/*/Variance/*') || appMatch('*/*/SpecialException/*') || appMatch('*/*/AdminVariance/*')) {
		if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
			activateTask("CDOT Review");
			editTaskDueDate('CDOT Review', dateAdd(getTaskDueDate('Review Distribution'),13));
			activateTask("Environmental Engineering Review");
			editTaskDueDate('Environmental Engineering Review', dateAdd(getTaskDueDate('Review Distribution'),13));
			activateTask("Fire and Life Safety Review");
			editTaskDueDate('Fire and Life Safety Review', dateAdd(getTaskDueDate('Review Distribution'),13));
			activateTask("Department of Health Review");
			editTaskDueDate('Department of Health Review', dateAdd(getTaskDueDate('Review Distribution'),13));
			activateTask("Planning Review");
			editTaskDueDate('Planning Review', dateAdd(getTaskDueDate('Review Distribution'),13));
			activateTask("Utilities Review");
			editTaskDueDate('Utilities Review', dateAdd(getTaskDueDate('Review Distribution'),13));
			activateTask("VDOT Review");
			editTaskDueDate('VDOT Review', dateAdd(getTaskDueDate('Review Distribution'),13));
			activateTask("Real Property Review");
			editTaskDueDate('Real Property Review', dateAdd(getTaskDueDate('Review Distribution'),13));
			deactivateTask("Default");
		}
	}
	
	if ((appMatch('Planning/LandUse/AdminVariance/NA') || appMatch('Planning/LandUse/Variance/NA') || appMatch('Planning/LandUse/SpecialException/NA') || appMatch('Planning/LandUse/Appeal/NA')) &&
		matches(wfTask,'BZA Staff Report') && matches(wfStatus,'Ready for BZA','Complete') && isTaskActive('BZA Hearing')) {
		showMessage = true;
		comment('<font size=small><b>The already Set BZA Hearing Due Date was updated by the workflow process step, Please UPDATE it back to the Scheduled Hearing Date.</b></font>');	
	}
	if ((appMatch('Planning/LandUse/ManufacturedHomes/NA') || appMatch('Planning/LandUse/RPAException/NA')) && matches(wfTask,'Review Consolidation') && matches(wfStatus,'Complete','Review Complete') && isTaskActive('BOS Hearing')) {
		showMessage = true;
		comment('<font size=small><b>The already Set BOS Hearing Due Date was updated by the workflow process step, Please UPDATE it back to the Scheduled Hearing Date.</b></font>');
	}
//6P  moved to WTUA:Planning

//6.1P Not Needed - fixed in workflow

//48P  Not Needed - fixed in workflow

//90P  Not Needed - fixed in workflow

} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}