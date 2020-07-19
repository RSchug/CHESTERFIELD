//5P Acivate Adhoc tasks based on CPC Hearing 'Deferred..'
if (matches(wfTask,"CPC Hearing") && (matches(wfStatus,"Deferred by Applicant","Deferred by CPC"))){
	addAdHocTask("ADHOC_WORKFLOW","Public Notices","");
	addAdHocTask("ADHOC_WORKFLOW","Adjacents","");
	addAdHocTask("ADHOC_WORKFLOW","IVR Message","");
	addAdHocTask("ADHOC_WORKFLOW","Sign Posting","");
	addAdHocTask("ADHOC_WORKFLOW","Maps","");
}