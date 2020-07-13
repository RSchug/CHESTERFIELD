function addParcelStdCondition_TPS(null, cType, cDesc, cShortComment, cLongComment)
//if parcelNum is null, condition is added to all parcels on CAP
{
	if (!parcelNum)	{
		var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
		if (capParcelResult.getSuccess()) {
			var Parcels = capParcelResult.getOutput().toArray();
			for (zz in Parcels) {
				logDebug("Adding Condition to parcel #" + zz + " = " + Parcels[zz].getParcelNumber());
				standardConditions = aa.capCondition.getStandardConditions(cType,cDesc).getOutput();
				for (i = 0; i < standardConditions.length; i++) {
						standardCondition = standardConditions[i];
				}
				var addParcelCondResult = aa.parcelCondition.addParcelStdCondition(Parcels[zz].getParcelNumber(), standardCondition.getConditionType(), standardCondition.getConditionDesc(), clngComment, sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), standardCondition.getInheritable(), standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), standardCondition.getConditionOfApproval());
				if (addParcelCondResult.getSuccess()) {
					logMessage("Successfully added condition to Parcel " + Parcels[zz].getParcelNumber() + "  " + cDesc);
					logDebug("Successfully added condition to Parcel " + Parcels[zz].getParcelNumber() + "  " + cDesc);
				}
				else {
					logDebug( "**ERROR: adding condition to Parcel " + Parcels[zz].getParcelNumber() + ": " + addParcelCondResult.getErrorMessage());
				}
			}
		}
	}
	else {
		var addParcelCondResult = aa.parcelCondition.addParcelStdCondition(parcelNum, cType, cDesc, clngComment, null, null, 'Notice', 'Applied', sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj); 
        if (addParcelCondResult.getSuccess()) {
			logMessage("Successfully added condition to Parcel " + parcelNum + "  " + cDesc);
			logDebug("Successfully added condition to Parcel " + parcelNum + "  " + cDesc);
		}
		else {
			logDebug( "**ERROR: adding condition to Parcel " + parcelNum + ": " + addParcelCondResult.getErrorMessage());
		}
	}
}