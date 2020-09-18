try {
    // Set the Reviewers Tasks per the wfStatus choosen per REVIEW DEPTS FOR ELM Spreadsheet scritp# 60p
	if (appMatch('*/*/Variance/*') || appMatch('*/*/SpecialException/*') || appMatch('*/*/AdminVariance/*')) {
		if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
			activateTask("CDOT Review");
			activateTask("Environmental Engineering Review");
			activateTask("Fire and Life Safety Review");
			activateTask("Department of Health Review");
			activateTask("Planning Review");
			activateTask("Utilities Review");
			activateTask("VDOT Review");
			activateTask("Real Property Review");
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