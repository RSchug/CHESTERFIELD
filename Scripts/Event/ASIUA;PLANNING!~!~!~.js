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
				//parcelAcreage += parseInt(tempAsit[a]["Parcel Acreage"]);
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
				GetOwnersByParcel_Local(parcelTaxID);
				copyParcelGisObjects_Local(parcelTaxID);
				editAppSpecific(tempAsit[b]["Create Address-Parcel-Owner"],'UNCHECKED');
			}
		}
	}

function copyParcelGisObjects_Local(parcelTaxID) {
//Update by db for getting table data to populate a record
	var gisObjResult = aa.gis.getParcelGISObjects(parcelTaxID); // get gis object - i think from the record
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**WARNING: Getting GIS objects for Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) { // for each GIS object on the Cap 
		var gisTypeScriptModel = fGisObj[a1];
		var gisObjArray = gisTypeScriptModel.getGISObjects()
		for (b1 in gisObjArray) {
			var gisObjScriptModel = gisObjArray[b1];
			var gisObjModel = gisObjScriptModel.getGisObjectModel() ;
			var retval = aa.gis.addCapGISObject(capId,gisObjModel.getServiceID(),gisObjModel.getLayerId(),gisObjModel.getGisId());
			if (retval.getSuccess())
				{ logDebug("Successfully added Cap GIS object: " + gisObjModel.getGisId())}
			else
				{ logDebug("**WARNING: Could not add Cap GIS Object.  Reason is: " + retval.getErrorType() + ":" + retval.getErrorMessage()) ; return false }	
		}
	}
}
function GetOwnersByParcel_Local(parcelTaxID) {
//getting info from a table
	var parcels = parcelTaxID;
	if(parcels == null || parcels.length == 0) {
		aa.print("There is no any parcel for the cap.");
	}
	else {
		var parcelOwnersResult = aa.owner.getOwnersByParcel(parcelTaxID);
		if (parcelOwnersResult.getSuccess()) {
			var actuallyParcelNumber = parcelNbr != null?parcelNbr:parcelUID;
			aa.print("Successfully get owner(s) by Parcel "+actuallyParcelNumber+". Detail as follow:");
			var ownerArr = parcelOwnersResult.getOutput();
			aa.print("Size :" + ownerArr.length);
			for (j = 0; j < ownerArr.length; j++) {
				ownerArr[j].setCapID(capId);
				aa.owner.createCapOwnerWithAPOAttribute(ownerArr[j]);
			}		
		}
		else {
			aa.print("ERROR: Failed to get owner(s) by Parcel(s): " + parcelOwnersResult.getErrorMessage());
		}
	}
}

} catch (err) {
		logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}