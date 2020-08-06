//3P. Fee Balance = 0 THEN: closeTask = 'Fee Payment' and activate ad hocs (per the record types)
if (balanceDue = 0) {
    var workflowResult = aa.workflow.getTasks(capId);
if (workflowResult.getSuccess())
    var wfObj = workflowResult.getOutput();
else
     {
     logMessage("**ERROR","CAP # "+capId.getCustomID()+" Failed to get workflow object: " + workflowResult.getErrorMessage());
     return false;
     }
var fTask;
var stepnumber;
var processID;
var dispositionDate = aa.date.getCurrentDate();
var wfnote = " ";
var wftask;
for (i in wfObj)
     {
     fTask = wfObj[i];
     wftask = fTask.getTaskDescription();
     stepnumber = fTask.getStepNumber();
     processID = fTask.getProcessID();
     if (fTask.getActiveFlag().equals("Y") && fTask.getTaskDescription('Fee Payment'))
        {
    closeTask("Fee Payment","Payment Received","Updated based on Balance of 0","");
//    addAdHocTask("ADHOC_WORKFLOW","Public Notices","");
//    addAdHocTask("ADHOC_WORKFLOW","Adjacents","");
//    addAdHocTask("ADHOC_WORKFLOW","IVR Message","");
//    addAdHocTask("ADHOC_WORKFLOW","Sign Posting","");
//    addAdHocTask("ADHOC_WORKFLOW","Maps","");
}
     }}