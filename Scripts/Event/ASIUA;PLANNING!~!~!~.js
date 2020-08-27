// ASIUA:Planning/*/*/*

// 57P Summarize each row in the table data: CC - LU - TPA:
// 'Parcel Acreage' to the Custom Field: 'Total Parcel Acreage'
// 'Revised Acreage' to the Custom Field: 'Total application acreage'
// Count the number of rows to the Custom Field: Total number of parcels'
// Copied from ASIUA:Planning/LANDUSE/*/*

var tempAsit = loadASITable("CC-LU-TPA");
if (tempAsit) {
    var parcelAcreage = 0;
    var revisedAcreage = 0;
    var countParcels = 0;
	for (a in tempAsit) {
        if (!isNaN(tempAsit[a]["Parcel Acreage"])) {
            parcelAcreage += float_num(tempAsit[a]["Parcel Acreage"]).toFixed(2);
        }
        if (!isNaN(tempAsit[a]["Revised Acreage"])) {
            revisedAcreage += float_num(tempAsit[a]["Revised Acreage"]).toFixed(2);
        }
        countParcels++;
	}//for all rows
	//editAppSpecific("CC-LU-TPA-SUM.Total application acreage", sum);
    editAppSpecific("Total Parcel Acreage", parcelAcreage);
    editAppSpecific("Total application acreage", revisedAcreage);
    editAppSpecific("Total number of parcels", countParcels);
}
//revisedAcreage += parseInt(tempAsit[a]["Revised Acreage"]);