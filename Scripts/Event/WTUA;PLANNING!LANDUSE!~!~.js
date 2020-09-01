try {
    // Set the Reviewers Tasks per the wfStatus choosen per REVIEW DEPTS FOR ELM Spreadsheet scritp# 60p
	if (appmatch('*/*/Variance/*') || appmatch('*/*/SpecialException/*') || appmatch('*/*/AdminVariance/*')) {
		if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
			activateTask("CDOT Review");
			activateTask("Environmental Engineering Review");
			activateTask("Fire and Life Safety Review");
			activateTask("Department of Health Review");
			activateTask("Planning Review");
			activateTask("Utilities Review");
			activateTask("VDOT Review");
			activateTask("Real Property Review");
		}
	}
//6P
if ((matches(wfTask,"Review Consolidation")) && (matches(wfStatus,"Move to BOS"))){
	activateTask("BOS Hearing");
	activateTask("BOS Staff Report");
	deactivateTask("Review Consolidation");
	}
//48P
	if ((matches(wfTask,"Review Consolidation")) && (matches(wfStatus,"Move to CPC"))){
	activateTask("CPC Hearing");
	activateTask("CPC Staff Report");
	deactivateTask("Review Consolidation");
	}
//90P
if ((matches(wfTask,"Review Consolidation")) && (matches(wfStatus,"Ready for BZA"))){
	activateTask("BZA Hearing");
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}