try {
//From eReview - but was wrapped in a different function.  There is no wfTask in DUA or DUB...
	if (publicUser && matches(capStatus, "Pending Applicant")) { // && matches(wfTask,'Review Distribution','Recordation')) {
        updateAppStatus("New Documents Uploaded", "Update by Document Upload from Cutomer");
    }
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}