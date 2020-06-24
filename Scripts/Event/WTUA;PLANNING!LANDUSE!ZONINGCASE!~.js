try {
    // Create Conditions from proffers on Zoning Case Record
	if (wfTask == 'BOS Hearing' && matches(wfStatus, 'Approved')) {
		showMessage = true;
		myTable = loadASITable('PROFFER CONDITIONS');
		firstRow = myTable[0];
		columnA = firstRow{'Column A'];
		columnB = firstRow['Column B'];
		columnC = firstRow['Column C'];
		columnD = firstRow['Column D'];
		columnE = firstRow['Column E'];
		columnF = firstRow['Column F'];
		comment('value of column a is : ' + columnA.fieldValue);

	}

//            (AInfo['Temp Underground Electric'] == 'CHECKED')


} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}