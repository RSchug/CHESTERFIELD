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

//12-2020 added code for copying Address Parcel Owner information from a Table to a Record, because we cannont have multiple parcel submission at ACA intake
		for (b in tempAsit) {
			if (tempAsit[b]["Create Address-Parcel-Owner"] == 'CHECKED') {
				var parcelTaxID = tempAsit[b]["Tax ID"];
				var BaseAddress = tempAsit[b]["Base Address"];
				addParcelFromRef_TPS(parcelTaxID);
				addAddressFromRef_TPS(BaseAddress);
				GetOwnersByParcel();
			}
		}
	}
} catch (err) {
		logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}