function addParcelStdCondition_TPS(parcelNum,cType,cDesc,cShortComment,cLongComment)
//if parcelNum is null, condition is added to all parcels on CAP
{
	if (!parcelNum)	{
		var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
		if (capParcelResult.getSuccess()) {
			var Parcels = capParcelResult.getOutput().toArray();
			for (zz in Parcels) {
				logDebug("Adding Condition to parcel #" + zz + " = " + Parcels[zz].getParcelNumber());
				var standardConditions = aa.capCondition.getStandardConditions(cType,cDesc).getOutput();
				for (i = 0; i < standardConditions.length; i++) {
					standardCondition = standardConditions[i];
					//var cStatus = "Active", cStatusType = "Active";
					var addParcelCondResult = aa.parcelCondition.addParcelCondition(Parcels[zz].getParcelNumber(), standardCondition.getConditionType(), standardCondition.getConditionDesc(), (cShortComment? cShortComment:standardCondition.getConditionComment()), sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), standardCondition.getInheritable(), (cLongComment? cLongComment:standardCondition.getLongDescripton()), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), standardCondition.getConditionOfApproval());
					//var addCapCondResult = aa.capCondition.addCapCondition(itemCap,                                standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(),                                sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), standardCondition.getInheritable(), standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), standardCondition.getConditionOfApproval());
					if (addParcelCondResult.getSuccess()) {
						logDebug("Successfully added condition to Parcel " + Parcels[zz].getParcelNumber() + ":  " + cDesc);
					}
					else {
						logDebug( "**ERROR: adding condition to Parcel " + Parcels[zz].getParcelNumber() + ": " + addParcelCondResult.getErrorMessage());
					}
				}
			}
		}
	} else {
		logDebug("Adding Condition to parcel #" + parcelNum);
		var standardConditions = aa.capCondition.getStandardConditions(cType,cDesc).getOutput();
		for (i = 0; i < standardConditions.length; i++) {
			standardCondition = standardConditions[i];
			var addParcelCondResult = aa.parcelCondition.addParcelCondition(Parcels[zz].getParcelNumber(), standardCondition.getConditionType(), standardCondition.getConditionDesc(), (cShortComment? cShortComment:standardCondition.getConditionComment()), sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), standardCondition.getInheritable(), (cLongComment? cLongComment:standardCondition.getLongDescripton()), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), standardCondition.getConditionOfApproval());
			if (addParcelCondResult.getSuccess()) {
				logDebug("Successfully added condition to Parcel " + parcelNum + ":  " + cDesc);
			}
			else {
				logDebug( "**ERROR: adding condition to Parcel " + parcelNum + ": " + addParcelCondResult.getErrorMessage());
			}
		}
	}
}