try {
    // Create Conditions from proffers on Zoning Case Record - 59p
	if (wfTask == 'BOS Hearing' && matches(wfStatus, 'Create Conditions and Close Case')) {

		var sum = 0;
		var tempAsit = loadASITable("PROFFER CONDITIONS");
		if (tempAsit) {
			for (a in tempAsit) {
				if (tempAsit[a]["Approved"] == 'CHECKED') {
					var cType = tempAsit[a]["Department"];
					var cDesc = tempAsit[a]["Department"]+' - '+tempAsit[a]["Record Type"];
					var cShortComment = tempAsit[a]["Proffer Condition"];
                    var cLongComment = tempAsit[a]["Long Comment"];
					addParcelStdCondition_TPS(null, cType, cDesc, cShortComment, cLongComment);
					//addParcelCondition(null,cType,'Applied',cDesc,cComment,'Notice');
				}
			}//for all rows
		}
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}
// Add Fees
if (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') {
	addFees_ZoneCase();
}