//WTUA_EXECUTE_DIGEPLAN_SCRIPTS
logDebug("Inside WTUA_EXECUTE_DIGEPLAN_SCRIPTS_PLAN");

/*-----DEFINE VARIABLES FOR DIGEPLAN SCRIPTS-----*/
//Document Specific Variables for PLANNING
var docGroupArrayModule = ["PLANNING"];
var docTypeArrayModule = ["Plans","Survey Plat","Elevations or Renderings","Site Plan/Master Plan","Other","Access Plan","Improvement Plan","Legal Documentation","Plat","Validation Plan Advisory Certificate","Final Plans","Plats"];

//Workflow Specific variables for Planning
var reviewTasksArray = ["PLANNING REVIEW", "AIRPORT REVIEW", "ASSESSOR REVIEW", "BUILDING INSPECTION REVIEW", "COUNTY LIBRARY REVIEW", "HEALTH DEPARTMENT REVIEW", "CDOT REVIEW", "ECONOMIC DEVELOPMENT REVIEW", "ENVIRONMENTAL ENGINEERING", "FIRE AND LIFE SAFETY REVIEW", "GIS-IST REVIEW", "GIS-EDM UTILITIES REVIEW", "PARKS AND RECREATION REVIEW", "POLICE REVIEW", "REAL PROPERTY REVIEW", "SCHOOLS CONSTRUCTION REVIEW", "SCHOOLS RESEARCH AND PLANNING REVIEW", "UTILITIES REVIEW", "VDOT REVIEW", "WATER QUALITY REVIEW", "CHESTERFIELD HISTORICAL SOCIETY REVIEW", "COMMUNITY ENHANCEMENT REVIEW"];
var taskStatusArray = ["APPROVED", "APPROVED WITH CONDITIONS", "REVISIONS REQUESTED", "SUBSTANTIAL APPROVAL", "TABLE REVIEW ELIGIBLE"];
var routingTask = "Review Distribution";
var routingStatusArray = ["Routed for Review"];
var resubmittalRoutedStatusArray = ["Routed for Review"];
var reviewTaskResubmittalReceivedStatus = "Revisions Received";
var reviewTaskResubmitStatus = ["REVISIONS REQUESTED", "SUBSTANTIAL APPROVAL", "TABLE REVIEW ELIGIBLE"];
var reviewTaskApprovedStatusArray = ["Approved", "Approved with Conditions"]; //Not currently used, but could be for a review task approval email notification
var reviewTaskStatusPendingArray = [null, "", undefined, "Revisions Received", "In Review"];
var consolidationTask = "Review Consolidation";
if (matches(wfStatus, 'RR-Substantial Approval', 'RR-Table Review', 'RR-Revisions Requested', 'RR-Staff and Developer Meeting')) {
var ResubmitStatus = wfStatus; }
var ApprovedStatus = 'Review Complete';

/*-----START DIGEPLAN EDR SCRIPTS-----*/

//Set "Uploaded" documents by group/category to inReviewDocStatus on routing
if (edrPlansExist(docGroupArrayModule, docTypeArrayModule) && matches(wfTask, routingTask) && exists(wfStatus, routingStatusArray)) {
    logDebug("<font color='blue'>Update document statuses to " + inReviewDocStatus + "</font>");
    var docArray = aa.document.getCapDocumentList(capId, currentUserID).getOutput();
    if (docArray != null && docArray.length > 0) {
        for (d in docArray) {
            if (exists(docArray[d]["docGroup"], docGroupArrayModule) && exists(docArray[d]["docCategory"], docTypeArrayModule) && docArray[d]["docStatus"] == "Uploaded" && docArray[d]["fileUpLoadBy"] != digEplanAPIUser) {
                docArray[d].setDocStatus(inReviewDocStatus);
                docArray[d].setRecStatus("A");
                docArray[d].setSource(getVendor(docArray[d].getSource(), docArray[d].getSourceName()));
                updateDocResult = aa.document.updateDocument(docArray[d]);
            }
        }
    }
}

//Update Document Statuses/Category to Approved on consolidationTask/ApprovedStatus
if (edrPlansExist(docGroupArrayModule, docTypeArrayModule) && matches(wfTask, consolidationTask) && matches(wfStatus, ApprovedStatus)) {
    docArray = aa.document.getCapDocumentList(capId, currentUserID).getOutput();
    if (docArray != null && docArray.length > 0) {
        for (d in docArray) {
            //logDebug("DocumentID: " + docArray[d]["documentNo"]);
            //logDebug("DocumentGroup: " + docArray[d]["docGroup"]);
            //logDebug("DocName: " + docArray[d]["docName"]);
            //logDebug("DocumentID: " + docArray[d]["documentNo"]);
            if ((exists(docArray[d]["docGroup"], docGroupArrayModule) || docArray[d]["docGroup"] == null) && matches(docArray[d]["docStatus"], reviewCompleteDocStatus)) {
				if(matches(getParentDocStatus(docArray[d]),approvedDocStatus,approvedPendingDocStatus)) {
					updateCheckInDocStatus(docArray[d],revisionsRequiredDocStatus,approvedDocStatus,approvedFinalDocStatus);
                    updateDocPermissionsbyCategory(docArray[d], docInternalCategory);
                }
                if (docArray[d]["docName"].indexOf("Sheet Report") == 0 && docArray[d]["docStatus"] == "Uploaded") {
                    logDebug("<font color='green'>*Sheet Report DocumentID: " + docArray[d]["documentNo"] + "</font>");
                    docArray[d].setDocGroup("CC-PLN");
                    docArray[d].setDocStatus(approvedPendingDocStatus);
                    docArray[d].setDocCategory(docInternalCategory);
                    docArray[d].setDocName(capIDString + "_Approved_Plans_Report.pdf");
                    docArray[d].setRecStatus("A");
                    docArray[d].setSource(getVendor(docArray[d].getSource(), docArray[d].getSourceName()));
                    updateDocResult = aa.document.updateDocument(docArray[d]);
                    logDebug("<font color='blue'>Document " + docArray[d]["documentNo"] + " updated </font>");
                }
            }
        }
    }
}

//Update Doc Type to Commnents and send email to Applicant on consolidationTask Resubmit
if (wfTask == consolidationTask && matches(wfStatus, ResubmitStatus)) {
    emailReviewCompleteNotification(ResubmitStatus, ApprovedStatus, docTypeArrayModule);
    //Update the mark up report to Comment Doc Type
	if(edrPlansExist(docGroupArrayModule,docTypeArrayModule)) {
		var docArray = aa.document.getCapDocumentList(capId,currentUserID).getOutput();
		if(docArray != null && docArray.length > 0) {
			for (d in docArray) {
				if(docArray[d]["docStatus"] == "Review Complete") {
					updateDocPermissionsbyCategory(docArray[d],"Comments");
				}
			}
		}
	}
}
synchronizeDocFileNames();
/*-----END DIGEPLAN EDR SCRIPTS-----*/