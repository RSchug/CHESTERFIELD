try {
//From eReview - but was wrapped in a different function.  There is no wfTask in DUA or DUB... Also, we update AppStatus in DUA_EXECUTE_DIGEPLAN_SCRIPTS, and this script should fire after.
	if (publicUser && !matches(capStatus,'Revisions Received','Submitted',null)) { 
		updateAppStatus("Revisions Received", "Update by Document Upload from Citizen");
    }
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}