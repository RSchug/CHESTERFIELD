function parcelHasConditiontrue_TPS(pType,pStatus)
// for the Parcel Conditions, checks all parcels, and if any have an Applied Condition, returns true
{
	var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
	if (capParcelResult.getSuccess()) {
		var Parcels = capParcelResult.getOutput().toArray();
		for (zz in Parcels) {
			logDebug("Getting Applied Conditions on parcel #" + zz + " = " + Parcels[zz].getParcelNumber());
			var condResult = aa.parcelCondition.getParcelConditions(pType,pStatus,null,null);
			if (condResult.getSuccess()) {
				var capConds = condResult.getOutput();
			} else { 
				logDebug("**ERROR: getting parcel conditions: " + condResult.getErrorMessage());
				return false;
			}
		}
	}
	var cStatus;
	var cDesc;
	for (cc in capConds) {
		var thisCond = capConds[cc];
		var cStatus = thisCond.getConditionStatus();
		var cDesc = thisCond.getConditionDescription();
		if (cStatus==null)
			cStatus = " ";
		if (cDesc==null)
			cDesc = " ";
		logDebug("The Status of the " + cDesc + " Condition is " + cStatus);
		//Look for matching condition
		if ( (pStatus==null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc==null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) )
			return true; //matching condition found
	}
	return false; //no matching condition found
}