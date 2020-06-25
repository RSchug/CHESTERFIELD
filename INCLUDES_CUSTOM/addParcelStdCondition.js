function addParcelStdCondition(parcelNum, cType, cDesc, cComment)
//if parcelNum is null, condition is added to all parcels on CAP
{
    if (!parcelNum) {
        var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
        if (capParcelResult.getSuccess()) {
            var Parcels = capParcelResult.getOutput().toArray();
            for (zz in Parcels) {
				logDebug("Adding Standard Condition to parcel #" + zz + " = " + Parcels[zz].getParcelNumber());
				standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
				for (i = 0; i < standardConditions.length; i++) {
					standardCondition = standardConditions[i]
						var addCapCondResult = aa.capCondition.addCapCondition(Parcels[zz].getParcelNumber(), standardCondition.getConditionType(), standardCondition.getConditionDesc(), cComment, sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A")
						if (addCapCondResult.getSuccess()) {
							logDebug("Successfully added condition (" + standardCondition.getConditionDesc() + ")");
						} else {
							logDebug("**ERROR: adding condition (" + standardCondition.getConditionDesc() + "): " + addCapCondResult.getErrorMessage());
						}
				}
			}
		} else {
        var addParcelCondResult = aa.parcelCondition.addParcelCondition(parcelNum, cType, cDesc, cComment, null, null, cImpact, cStatus, sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj);

        if (addParcelCondResult.getSuccess()) {
            logMessage("Successfully added condition to Parcel " + parcelNum + "  (" + cImpact + ") " + cDesc);
            logDebug("Successfully added condition to Parcel " + parcelNum + "  (" + cImpact + ") " + cDesc);
        } else {
            logDebug("**ERROR: adding condition to Parcel " + parcelNum + "  (" + cImpact + "): " + addParcelCondResult.getErrorMessage());
        }
		}
	}
}