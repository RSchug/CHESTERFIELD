function addParcelStdCondition_TPS(parcelNum,cType,cDesc,cName,clngComment)
//if parcelNum is null, condition is added to all parcels on CAP - db 606-2020 cannot get a standard Condition to work here, so updating ever Condition field to match a Standard.
{
	if (!parcelNum) {
		var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
		if (capParcelResult.getSuccess()) {
			var Parcels = capParcelResult.getOutput().toArray();
			for (zz in Parcels) {
				logDebug("Adding Condition to parcel #" + zz + " = " + Parcels[zz].getParcelNumber());
				//var addParcelCondResult = aa.parcelCondition.addParcelCondition(Parcels[zz].getParcelNumber(), cType, cDesc, cName, null, null, 'Notice', 'Applied', sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj);
				var addParcelCondResult = aa.parcelCondition.addParcelCondition(Parcels[zz].getParcelNumber(), cType, cDesc, cName, sysDate, null, sysDate, null, null, 'Notice', systemUserObj, systemUserObj, 'Applied', currentUserID, 'A', null, 'CHECKED', 'CHECKED', 'CHECKED', 'YES', clngComment, 'CHECKED', null, null, null, null, 'Chesterfield', 'CHECKED', 'UNCHECKED', null, null);
				if (addParcelCondResult.getSuccess()) {
					logMessage("Successfully added condition to Parcel " + Parcels[zz].getParcelNumber() + " Notice " + cDesc);
					logDebug("Successfully added condition to Parcel " + Parcels[zz].getParcelNumber() +  " Notice " + cDesc);
				}
				else {
					logDebug( "**ERROR: adding condition to Parcel " + Parcels[zz].getParcelNumber() +  " Notice " + cDesc + ' ' + addParcelCondResult.getErrorMessage());
				}
			}
		}
	}
	else {
		var addParcelCondResult = aa.parcelCondition.addParcelCondition(parcelNum, cType, cDesc, cName, null, null, 'Notice', 'Applied', sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj); 
		if (addParcelCondResult.getSuccess()) {
			logMessage("Successfully added condition to Parcel " + parcelNum + "  (" + cImpact + ") " + cDesc);
			logDebug("Successfully added condition to Parcel " + parcelNum + "  (" + cImpact + ") " + cDesc);
		}
		else {
			logDebug( "**ERROR: adding condition to Parcel " + parcelNum + "  (" + cImpact + "): " + addParcelCondResult.getErrorMessage());
		}
	}
}