try {
	var pLicCap  = aa.cap.getCapID(["Case Number"]).getOutput();
	addParent(AInfo["Case Number"]);
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}