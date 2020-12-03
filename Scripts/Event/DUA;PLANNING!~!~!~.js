try {
//From eReview
	if (publicUser && matches(capStatus, "Pending Applicant") && matches(wfTask,'Review Distribution','Recordation')) {
        updateAppStatus("Revisions Received", "Update by Document Upload");
    }
	else if (publicUser && matches(capStatus, "Pending Applicant") && !matches(wfTask,'Review Distribution','Recordation')) {
        updateAppStatus("Additional Information Received", "Update by Document Upload");
    }
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}