//6P
if ((matches(wfTask,"Review Consolidation")) && (matches(wfStatus,"Move to BOS"))){
	activateTask("BOS Hearing");
	activateTask("BOS Staff Report")
	deactivateTask("Review Consolidation")
	}
//48P
	if ((matches(wfTask,"Review Consolidation")) && (matches(wfStatus,"Move to CPC"))){
	activateTask("CPC Hearing");
	activateTask("CPC Staff Report")
	deactivateTask("Review Consolidation")
	}
//90P
if ((matches(wfTask,"Review Consolidation")) && (matches(wfStatus,"Ready for BZA"))){
	activateTask("BZA Hearing");
	}