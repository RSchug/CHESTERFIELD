try {
    // Create Conditions from proffers on Zoning Case Record
	if (wfTask == 'BOS Hearing' && matches(wfStatus, 'Approved')) {

		var sum = 0;
		var tempAsit = loadASITable("PROFFER CONDITIONS");
		if (tempAsit) {
			for (a in tempAsit) {
				if (tempAsit[a]["Approved"] == 'CHECKED') {
					var cType = tempAsit[a]["Department"];
					var cDesc = tempAsit[a]["Department"]+' - '+tempAsit[a]["Record Type"];
					var cComment = tempAsit[a]["Proffer Condition"];
					addParcelStdCondition(null,cType,cDesc,cComment);
				}
			}//for all rows
		}
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}