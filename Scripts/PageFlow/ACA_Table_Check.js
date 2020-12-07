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