//5P Activate Adhoc tasks based on CPC Hearing 'Deferred..'
if (matches(wfTask,"CPC Hearing") && (matches(wfStatus,"Deferred by Applicant","Deferred by CPC"))){
	addAdHocTask("ADHOC_WORKFLOW","Public Notices","");
	addAdHocTask("ADHOC_WORKFLOW","Adjacents","");
	addAdHocTask("ADHOC_WORKFLOW","IVR Message","");
	addAdHocTask("ADHOC_WORKFLOW","Sign Posting","");
	addAdHocTask("ADHOC_WORKFLOW","Maps","");
}
//48P When Workflow Task 'Review Consolidation' Status 'Move to BOS' is submitted then close Workflow Task 'Review Consolidation' and activate Workflow Task 'BOS Staff Report'.
if (wfTask =='Review Consolidation' && wfStatus == 'Move to BOS'){
	closeTask("Review Consolidation", "Move to BOS", "","");
	activateTask("BOS Staff Report");
}