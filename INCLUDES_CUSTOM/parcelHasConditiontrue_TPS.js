function parcelHasConditiontrue_TPS(pType,pStatus)
// for the Parcel Conditions, checks all parcels, and if any have an Applied Conditions with the record name in it, returns true
{
	var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
	if (!capParcelResult.getSuccess())
		{ logDebug("**WARNING: error getting cap parcels : " + capParcelResult.getErrorMessage()) ; return false }

	var Parcels = capParcelResult.getOutput().toArray();
	for (zz in Parcels)
		{
		pcResult = aa.parcelCondition.getParcelConditions(Parcels[zz].getParcelNumber());
		if (!pcResult.getSuccess())
			{ logDebug("**WARNING: error getting parcel conditions : " + pcResult.getErrorMessage()) ; return false }
		pcs = pcResult.getOutput();
		for (pc1 in pcs)
			if (pcs[pc1].getConditionDescription().indexOf(pType) && pcs[pc1].getConditionStatus().equals(pStatus)) 
				return true;
		}
}