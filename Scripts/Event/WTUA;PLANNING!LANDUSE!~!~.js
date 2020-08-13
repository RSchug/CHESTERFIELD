//6P
if ((matches(wfTask,"Review Consolidation")) && (matches(wfStatus,"Move to BOS"))){
	activateTask("BOS Hearing");
	activateTask("BOS Staff Report")
	deactivateTask("Review Consolidation")
	}