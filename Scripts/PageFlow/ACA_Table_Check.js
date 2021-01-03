try {
    var tableNames = (arguments.length > 2 ? arguments[2] : null); // list of tables
    var tableNameArray = getTableName(capId);
    if (tableNameArray == null) {
        showMessage = true;
		comment('No Table in the Pageflow.');
		cancel = true;
    }
    for (loopk in tableNameArray) {
        var tableName = tableNameArray[loopk];
        if (tableNames && !exists(tableName, tableNames))
            continue;
        
        var targetAppSpecificTable = localLoadASITable(tableName);
    }
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}

function localLoadASITable(tname) {
    // Returns a single ASI Table array of arrays
    // Optional parameter, cap ID to load from
    var itemCap = (arguments.length > 1 ? arguments[1] : capId); // use cap ID specified in args

    var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
    var ta = gm.getTablesArray()
        var tai = ta.iterator();
    while (tai.hasNext()) {
        var tsm = tai.next();
        var tn = tsm.getTableName();

        if (!tn.equals(tname))
            continue;
        if (tsm.rowIndex.isEmpty()) {
            showMessage = true;
			comment('You need to enter at least 1 Tax ID in the table to continue.');
			cancel = true;
        }
		logDebug("Table has data in it");
		return true;
    }
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