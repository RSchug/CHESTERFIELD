//3P. Fee Balance = 0 THEN: closeTask = 'Fee Payment' and activate ad hocs (per the record types)
if (isTaskActive("Fee Payment") && (balanceDue == 0)) {
    closeTask("Fee Payment","Payment Received","Updated based on Balance of 0","");
//    addAdHocTask("ADHOC_WORKFLOW","Public Notices","");
//    addAdHocTask("ADHOC_WORKFLOW","Adjacents","");
//    addAdHocTask("ADHOC_WORKFLOW","IVR Message","");
//    addAdHocTask("ADHOC_WORKFLOW","Sign Posting","");
//    addAdHocTask("ADHOC_WORKFLOW","Maps","");
}