try {
	showDebug = true;				
	var sessiontabledata = _loadASITable('CC-LU-TPA');
	if (sessiontabledata) {
		/*for (b in sessiontabledata) {
			if (sessiontabledata[b]["Tax ID"] > 0) {
				logDebug('There is data in Tax ID');
			} else {
				showMessage = true;
				comment('You need to enter at least 1 Tax ID in the table to continue.');
				cancel = true;
			}
		}*/
		logDebug('There is data in Tax ID');
	} else if (sessiontabledata == false) { showMessage = true; comment('There is no table avaialable to pull data from'); cancel = true; }
	
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}
function _loadASITable(tname) {
    // Returns a single ASI Table array of arrays
    // Optional parameter, cap ID to load from
    var itemCap = (arguments.length > 1 ? arguments[1] : capId); // use cap ID specified in args

    var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
    var ta = gm.getTablesArray()
    var tai = ta.iterator();
    while (tai.hasNext()) {
        var tsm = tai.next();
        var tn = tsm.getTableName();

        if (!tn.equals(tname)) continue;
        if (tsm.rowIndex.isEmpty()) {
            logDebug("Couldn't load ASI Table " + tname + " it is empty");
            return false;
        }

        var tempObject = new Array();
        var tempArray = new Array();

        var tsmfldi = tsm.getTableField().iterator();
        var tsmcoli = tsm.getColumns().iterator();
        var readOnlyi = tsm.getAppSpecificTableModel().getReadonlyField().iterator(); // get Readonly filed
        var numrows = 1;

        while (tsmfldi.hasNext()) { // cycle through fields
            if (!tsmcoli.hasNext()) { // cycle through columns
                var tsmcoli = tsm.getColumns().iterator();
                tempArray.push(tempObject);  // end of record
                var tempObject = new Array();  // clear the temp obj
                numrows++;
            }
            var tcol = tsmcoli.next();
            var tval = tsmfldi.next();
            var readOnly = 'N';
            if (readOnlyi.hasNext()) {
                readOnly = readOnlyi.next();
            }
            var fieldInfo = new asiTableValObj(tcol.getColumnName(), tval, readOnly);
            tempObject[tcol.getColumnName()] = fieldInfo;
        }
        tempArray.push(tempObject);  // end of record
    }
    return tempArray;
}
	// Get Public User Email Address
	var debugEmailTo = "";
	var publicUserEmail = "";
	if (publicUserID) {
		var publicUserModelResult = aa.publicUser.getPublicUserByPUser(publicUserID);
		if (publicUserModelResult.getSuccess() || !publicUserModelResult.getOutput()) {
			publicUserEmail = publicUserModelResult.getOutput().getEmail();
			logDebug("publicUserEmail: " + publicUserEmail + " for " + publicUserID)
		} else {
			publicUserEmail = null;
			logDebug("publicUserEmail: " + publicUserEmail);
		}
	}
	if (publicUserEmail) publicUserEmail = publicUserEmail.replace("TURNED_OFF","").toLowerCase();
	logDebug("publicUserEmail: " + publicUserEmail);
	// Set Debug User if TPS User.
	if (publicUserEmail && debugEmailTo == "") {
		if (publicUserEmail.indexOf("@truepointsolutions.com") > 0) 	debugEmailTo = publicUserEmail;
		if (exists(publicUserEmail,['bushatos@hotmail.com']))	debugEmailTo = publicUserEmail;
	}
	logDebug("debugEmailTo: " + debugEmailTo);
	if (debugEmailTo && debugEmailTo != "") showDebug = true;

	// Send Debug Email
	if (debugEmailTo && debugEmailTo != "") {
		debugEmailSubject = "";
		debugEmailSubject += (capIDString ? capIDString + " " : (capModel && capModel.getCapID ? capModel.getCapID() + " " : "")) + vScriptName + " - Debug";
		logDebug("Sending Debug Message to "+debugEmailTo);
		aa.sendMail("NoReply-" + servProvCode + "@accela.com", debugEmailTo, "", debugEmailSubject, "Debug: \r" + br + debug);
		showDebug = false;
	}