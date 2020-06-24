try {
    // Create Conditions from proffers on Zoning Case Record
	if (wfTask == 'BOS Hearing' && matches(wfStatus, 'Approved')) {
		var profferTableArray = loadASITable('PROFFER CONDITIONS');
		logDebug('value of column a is : ' + columnA);
		logDebug('value of column b is : ' + columnB);
		logDebug('value of column c is : ' + columnC);
		logDebug('value of column d is : ' + columnD);
		logDebug('value of column e is : ' + columnE);
		logDebug('value of column f is : ' + columnF);
	}

//            (AInfo['Temp Underground Electric'] == 'CHECKED')


} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}