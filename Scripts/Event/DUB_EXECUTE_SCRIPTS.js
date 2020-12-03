//DUB_EXECUTE_SCRIPTS

/*-----DEFINE VARIABLES FOR DIGEPLAN SCRIPTS-----*/
//Document Specific Variables
//var showMessage = false; // Set to true to see results in popup window
//var showDebug = false; // Set to true to see debug messages in popup window
//var cancel = false;
var debugEmailTo = "";
var docGroupArrayModule = ["EREVIEW"];
var docTypeArrayModule = ["Plans","Application","Calculation","Code Modification","Plat"];

/*------------LOAD DOCUMENT ARRAY------------*/
var newDocModelArray = documentModelArray.toArray();
var doPreCache = false;

for (dl in newDocModelArray) {
logDebug("<font color='green'>*****Document Details*****</font>");
logDebug("<font color='green'>DocName: " + newDocModelArray[dl]["docName"] + " - DocID: " + newDocModelArray[dl]["documentNo"] + "</font>");
logDebug("<font color='green'>DocGroup / DocCategory: " + newDocModelArray[dl]["docGroup"] + " / " + newDocModelArray[dl]["docCategory"] + "</font>");
logDebug("<font color='green'>DocStatus: " + newDocModelArray[dl]["docStatus"] + "</font>");
logDebug("<font color='green'>DocCategoryByAction: " + newDocModelArray[dl]["categoryByAction"] + "</font>");
logDebug("<font color='green'>FileUploadBy: " + newDocModelArray[dl]["fileUpLoadBy"] + "</font>");
	if(exists(newDocModelArray[dl]["docGroup"],docGroupArrayModule) && exists(newDocModelArray[dl]["docCategory"],docTypeArrayModule)) {
		doPreCache = true;   
	}
}
if(doPreCache) {
     var docPreCache = digEplanPreCache("chesterfield",capIDString);
}
// Get Public User Email Address
var publicUserEmail = "";
if (publicUserID) {
	var publicUserModelResult = aa.publicUser.getPublicUserByPUser(publicUserID);
	if (publicUserModelResult.getSuccess() || !publicUserModelResult.getOutput()) {
		publicUserEmail = publicUserModelResult.getOutput().getEmail();
		logDebug("publicUserEmail: " + publicUserEmail + " for " + publicUserID)
	} else {
		publicUserEmail = null;
		logDebug("publicUserEmail: " + publicUserEmail);
	}
}
if (publicUserEmail) publicUserEmail = publicUserEmail.replace("TURNED_OFF","").toLowerCase();
logDebug("publicUserEmail: " + publicUserEmail);
// Set Debug User if TPS User.
if (publicUserEmail && debugEmailTo == "") {
	if (publicUserEmail.indexOf("@truepointsolutions.com") > 0) 	debugEmailTo = publicUserEmail;
	//if (exists(publicUserEmail,['rschug@truepointsolutions.com']))	debugEmailTo = publicUserEmail;
}
logDebug("debugEmailTo: " + debugEmailTo);
if (debugEmailTo && debugEmailTo != "") showDebug = true;

/*------------RUNNING SCRIPTS HERE------------*/

// Send Debug Email
if (debugEmailTo && debugEmailTo != "") {
	debugEmailSubject = "";
	debugEmailSubject += (capIDString ? capIDString + " " : (capModel && capModel.getCapID ? capModel.getCapID() + " " : "")) + vScriptName + " - Debug";
	logDebug("Sending Debug Message to "+debugEmailTo);
	aa.sendMail("NoReply-" + servProvCode + "@chesterfield.gov", debugEmailTo, "", debugEmailSubject, "Debug: \r" + br + debug);
	showDebug = false;
}
// page flow custom code end

if (aa.env.getValue("ScriptName") == "Test") { 	// Print Debug
	var z = debug.replace(/<BR>/g, "\r"); aa.print(">>> DEBUG: \r" + z);
	showDebug = true;
}

if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", debug);
} else {
	if (cancel) {
		aa.env.setValue("ErrorCode", "-2");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		if (showDebug)
			aa.env.setValue("ErrorMessage", debug);
	} else {
		aa.env.setValue("ErrorCode", "0");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		if (showDebug)
			aa.env.setValue("ErrorMessage", debug);
	}
}