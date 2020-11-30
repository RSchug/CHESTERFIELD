try {
//48P - Moved to WTUA:Planning and workflow takes care of it

 // Create Conditions from proffers - 59p (added additional record types)
	if (wfTask == 'Case Complete' && matches(wfStatus, 'Create Conditions and Close Case')) {
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
				}
			} //for all rows
		}
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}