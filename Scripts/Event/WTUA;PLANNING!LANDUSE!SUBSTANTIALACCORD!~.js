//48P When Workflow Task 'Review Consolidation' Status 'Move to BOS' is submitted then close Workflow Task 'Review Consolidation' and activate Workflow Task 'BOS Staff Report'.
if (wfTask =='Review Consolidation' && wfStatus == 'Move to BOS'){
	closeTask("Review Consolidation", "Move to BOS", "","");
	activateTask("BOS Staff Report");
}
//Fees for Substantial Accord
if (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment'){
	addFee("SAOTHER","CC-PLANNING","FINAL",1,"N");
}