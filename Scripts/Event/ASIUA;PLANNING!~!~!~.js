// ASIUA:Planning/*/*/*
try {
// 57P Summarize each row in the table data: CC - LU - TPA:
// 'Parcel Acreage' to the Custom Field: 'Total Parcel Acreage'
// 'Revised Acreage' to the Custom Field: 'Total application acreage'
// Count the number of rows to the Custom Field: Total number of parcels'

	var tempAsit = loadASITable("CC-LU-TPA");
	if (tempAsit) {
		var parcelAcreage = 0;
		var revisedAcreage = 0;
		var countParcels = 0;
		for (a in tempAsit) {
			if (!isNaN(tempAsit[a]["Parcel Acreage"])) {
				parcelAcreage += parseFloat(tempAsit[a]["Parcel Acreage"]);
			}
			if (!isNaN(tempAsit[a]["Revised Acreage"])) {
				revisedAcreage += parseFloat(tempAsit[a]["Revised Acreage"]);
				//revisedAcreage += parseInt(tempAsit[a]["Revised Acreage"]);
			}
			countParcels++;
		}//for all rows
		//editAppSpecific("CC-LU-TPA-SUM.Total application acreage", sum);
		editAppSpecific("Total Parcel Acreage", parcelAcreage);
		editAppSpecific("Total application acreage", revisedAcreage);
		editAppSpecific("Total number of parcels", countParcels);
	}
//11-2020 added code for copying Address Parcel Owner information from a Table to a Record, because we cannont have multiple parcel submission at ACA intake
	if (typeof (ParcelValidatedNumber) == "undefined") {
		ParcelValidatedNumber = null;
		loadASITables4ACA_TPS();// Load ASITables into Arrays
	}
	if (typeof (CCPLNSTMN) != "undefined") { // Check if ASITable array exists - this is site plan Major and Minor
		logDebug("ASITable: CCPLNSTMN");
		var tablename = CCPLNSTMN;
	}
	else if (typeof (CCGIS) != "undefined") { // Check if ASITable array exists - this is most others
		logDebug("ASITable: CCGIS");
		var tablename = CCGIS;
	}
	else { cancel = true; }
	for (var rr in tablename) {
		var eachRow = tablename[rr];
		var chkcreate = (eachRow["Create Address-Parcel-Owner"] ? eachRow["Create Address-Parcel-Owner"] :"");
		var BaseAddress = eachRow["Base Address"];
		logDebug("tablename["+rr+"][Create Address-Parcel-Owner]:"+chkcreate);
		if (chkcreate == 'CHECKED') {
			addParcelAndOwnerFromRefAddress(BaseAddress);
		}
	}

} catch (err) {
		logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}

function loadASITables4ACA_TPS() {
 	// Loads App Specific tables into their own array of arrays.  Creates global array objects
	// Optional parameter, cap ID to load from.  If no CAP Id specified, use the capModel
	var itemCap = capId;
	if (arguments.length == 1) {
		itemCap = arguments[0]; // use cap ID specified in args
		var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
	}
	else {
		var gm = cap.getAppSpecificTableGroupModel()
	}
	var ta = gm.getTablesMap();
	var tai = ta.values().iterator();
	while (tai.hasNext()) {
		var tsm = tai.next();
		if (tsm.rowIndex.isEmpty()) continue;  // empty table
			var tempObject = new Array();
			var tempArray = new Array();
			var tn = tsm.getTableName();
			tn = String(tn).replace(/[^a-zA-Z0-9]+/g,'');
		if (!isNaN(tn.substring(0,1))) tn = "TBL" + tn  // prepend with TBL if it starts with a number
			var tsmfldi = tsm.getTableField().iterator();
			var tsmcoli = tsm.getColumns().iterator();
			var numrows = 1;
		while (tsmfldi.hasNext()) { // cycle through fields
			if (!tsmcoli.hasNext()) { // cycle through columns
				var tsmcoli = tsm.getColumns().iterator();
				tempArray.push(tempObject);  // end of record
				var tempObject = new Array();  // clear the temp obj
				numrows++;
			}
			var tcol = tsmcoli.next();
			var tval = tsmfldi.next();  //.getInputValue();
			tempObject[tcol.getColumnName()] = tval;
		}
	tempArray.push(tempObject);  // end of record
	var copyStr = "" + tn + " = tempArray";
	logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
	eval(copyStr);  // move to table name
	}
}