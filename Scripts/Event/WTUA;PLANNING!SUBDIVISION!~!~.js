//48P
	if ((matches(wfTask,"Review Consolidation")) && (matches(wfStatus,"Move to CPC"))){
	activateTask("CPC Hearing");
	activateTask("CPC Staff Report");
	deactivateTask("Review Consolidation");
	}