try {
//3P. Fee Balance = 0 THEN: closeTask = 'Fee Payment' 
	if (isTaskActive("Fee Payment") && (balanceDue == 0)) {
		closeTask("Fee Payment","Payment Received","Updated based on Balance of 0","");
	}
	if (appMatch("Planning/LandUse/WrittenDetermination/NA") && matches(capStatus, "Fees Requested") && (balanceDue == 0)) {
		closeTask("Request Submitted","Request Validated","Updated based on full payment","");
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}