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