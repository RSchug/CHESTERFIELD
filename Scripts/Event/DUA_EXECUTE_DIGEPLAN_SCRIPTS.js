//DUA_EXECUTE_DIGEPLAN_SCRIPTS
showDebug = 3;
logDebug("Inside DUA_EXECUTE_DIGEPLAN_SCRIPTS");

/*-----DEFINE VARIABLES FOR DIGEPLAN SCRIPTS-----*/
//Document Specific Variables
var docGroupArrayModule = ["EREVIEW","BUILDING","PLANNING","ENVENGINEERING","ENFORCEMENT","UTILITIES"];
var docTypeArrayModule = ["Plans","Supporting Documents","Application","Calculation","Correspondance","Code Modification","Image","Legal Documentation","Plat"];
var originalDocStatusOnResubmit = "Resubmitted";
var parentDocStatusOnResubmit = "Resubmitted";
var resubmitDocStatusOnResubmit = "Uploaded";

//Workflow Specific variables
var routingTask = "Review Distribution";
var routingStatus = "Routed for Review";
var routingResubmittalStatus = "Revisions Received";

/*------------START EDR UPLOAD/RESUBMITTAL ACTIONS------------*/
var newDocModelArray = documentModelArray.toArray();
var doPreCache = false;
//db updated per business request 4-27-2020
//if(/*publicUser &&*/ capIDString.indexOf("TMP") == -1) emailDocUploadNotification(docGroupArrayModule,docTypeArrayModule);

if (capIDString.indexOf("TMP") == -1) {
	for (dl in newDocModelArray) {
	logDebug("<font color='green'>*****Document Details*****</font>");
	logDebug("<font color='green'>DocName: " + newDocModelArray[dl]["docName"] + " - DocID: " + newDocModelArray[dl]["documentNo"] + "</font>");
	logDebug("<font color='green'>DocGroup / DocCategory: " + newDocModelArray[dl]["docGroup"] + " / " + newDocModelArray[dl]["docCategory"] + "</font>");
	logDebug("<font color='green'>DocStatus: " + newDocModelArray[dl]["docStatus"] + "</font>");
	logDebug("<font color='green'>DocCategoryByAction: " + newDocModelArray[dl]["categoryByAction"] + "</font>");
	logDebug("<font color='green'>FileUploadBy: " + newDocModelArray[dl]["fileUpLoadBy"] + "</font>");
		if(exists(newDocModelArray[dl]["docGroup"],docGroupArrayModule) && exists(newDocModelArray[dl]["docCategory"],docTypeArrayModule)) doPreCache = true;   
		if(newDocModelArray[dl]["categoryByAction"] == "RESUBMIT") {
			doResubmitActions(newDocModelArray[dl],docGroupArrayModule,docTypeArrayModule,routingTask,routingResubmittalStatus,originalDocStatusOnResubmit,parentDocStatusOnResubmit,resubmitDocStatusOnResubmit);
		}
	}
}
if(doPreCache) {
     var docPreCache = digEplanPreCache("chesterfield",capIDString);
}
/*------------END EDR UPLOAD/RESUBMITTAL ACTIONS------------*/