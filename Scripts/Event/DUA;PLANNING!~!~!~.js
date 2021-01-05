try {
//From eReview - but was wrapped in a different function.  There is no wfTask in DUA or DUB... Also, we update AppStatus in DUA_EXECUTE_DIGEPLAN_SCRIPTS, and this script should fire after.
	//Any Planning Record with attachments creates an ADHOC task 'Document Submitted Online'
	if (publicUser && (!matches(capStatus,'Revisions Received',null) || capIDString.indexOf("TMP") == -1) && appMatch('Planning/LandUse/*/*')) {
		addAdHocTask("ADHOC_WF","Document Submitted Online","");
    }
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}

// Get Public User Email Address
var debugEmailTo = "";
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
	if (exists(publicUserEmail,['bushatos@hotmail.com']))	debugEmailTo = publicUserEmail;
}
logDebug("debugEmailTo: " + debugEmailTo);
if (debugEmailTo && debugEmailTo != "") showDebug = true;

// Send Debug Email
if (debugEmailTo && debugEmailTo != "") {
	debugEmailSubject = "";
	debugEmailSubject += (capIDString ? capIDString + " " : (capModel && capModel.getCapID ? capModel.getCapID() + " " : "")) + vScriptName + " - Debug";
	logDebug("Sending Debug Message to "+debugEmailTo);
	aa.sendMail("NoReply-" + servProvCode + "@accela.com", debugEmailTo, "", debugEmailSubject, "Debug: \r" + br + debug);
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

function addAdHocTask(adHocProcess, adHocTask, adHocNote)
{
//adHocProcess must be same as one defined in R1SERVER_CONSTANT
//adHocTask must be same as Task Name defined in AdHoc Process
//adHocNote can be variable
//Optional 4 parameters = Assigned to User ID must match an AA user
//Optional 5 parameters = CapID
	var thisCap = capId;
	var thisUser = currentUserID;
	if(arguments.length > 3)
		thisUser = arguments[3]
	if(arguments.length > 4)
		thisCap = arguments[4];
	var userObj = aa.person.getUser(thisUser);
	if (!userObj.getSuccess())
	{
		logDebug("Could not find user to assign to");
		return false;
	}
	var taskObj = aa.workflow.getTasks(thisCap).getOutput()[0].getTaskItem()
	taskObj.setProcessCode(adHocProcess);
	taskObj.setTaskDescription(adHocTask);
	taskObj.setDispositionNote(adHocNote);
	taskObj.setProcessID(0);
	taskObj.setAssignmentDate(aa.util.now());
	taskObj.setDueDate(aa.util.now());
	taskObj.setAssignedUser(userObj.getOutput());
	wf = aa.proxyInvoker.newInstance("com.accela.aa.workflow.workflow.WorkflowBusiness").getOutput();
	wf.createAdHocTaskItem(taskObj);
	return true;
}