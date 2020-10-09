try {
	//Add Planning/LandUse/ManufacturedHomes/NA Fee
	if (appMatch("Planning/LandUse/ManufacturedHomes/NA")){
		addFee("MANUFACTURED","CC-PLANNING","FINAL",1,"Y");
	}
	//Add Planning/LandUse/AdminVariance/NA Fee
	if (appMatch("Planning/LandUse/AdminVariance/NA")){
		addFee("VARIANCEADM","CC-PLANNING","FINAL",1,"Y");
	}
	//Add Planning/LandUse/Variance/NA Fee
	if (appMatch("Planning/LandUse/Variance/NA")){
		addFee("VARIANCEBZA","CC-PLANNING","FINAL",1,"Y");
	}
	//Add Planning/LandUse/Appeal/NA Fee
	if (appMatch("Planning/LandUse/Appeal/NA")){
		addFee("APPEAL","CC-PLANNING","FINAL",1,"Y");
	}
	//Add Planning/LandUse/WrittenDetermination/NA Fee
	if (appMatch("Planning/LandUse/WrittenDetermination/NA")){
		addFee("WRITTEN","CC-PLANNING","FINAL",1,"Y");
	}
	// Use Agency Sign Posting Number sequence to keep track of Sign Postings for Selectron.
	// 10P Custom Field Sign Posting Number should be auto populated with a number of 100 - 999.  The number must not be a duplicate number for another active record.
	// The sign post number is a number is related to the IVR prompt that will be recorded so that callers may get case information from calling the number.There is a specific and finite group of numbers that have been identified for the 2 case types. Accela is to provide the next available number from the list.
	// Initiating Record Types:
	//  Planning/LandUse/ManufacturedHomes/NA or Planning/LandUse/RPAException/NA
	//  Planning/LandUse/Variance/*/* or Planning/LandUse/AdminVariance/* or Planning/LandUse/SpecialExceptions/* or Planning/Subdivision/ExceptiontoPreliminary/NA or Planning/Subdivision/Preliminary/NA or Planning/SitePlan/Schematics/NA or Planning/SitePlan/Major/NA or Planning/LandUse/HistoricPreservation/NA or Planning/LandUse/SubstantialAccord/NA or Planning/LandUse/Utilities Waiver/NA or Planning/LandUse/ZoningCase/NA

	var fieldName = "Sign Posting Number";
	//var seqName = null;
	//if (appMatch("Planning/*/*/*") || appMatch("Planning/LandUse/RPAException/NA") || appMatch("Planning/LandUse/Appeal/NA")) {
	//	seqName = "Sign Posting Number";
	//} else if (appMatch("Planning/LandUse/*/*") 
	//	&& exists(appTypeArray[2], ["Variance", "AdminVariance", "SpecialException", "HistoricPreservation","SubstantialAccord","Utilities Waiver","ZoningCase"])) {
	//	seqName = "Sign Posting Number";
	//} else if (appMatch("Planning/Subdivision/ExceptiontoPreliminary/NA") || appMatch("Planning/Subdivision/Preliminary/NA") || appMatch("Planning/Subdivision/OverallConceptualPlan/NA")
	//			|| appMatch("Planning/Subdivision/ConstructionPlan/NA")) {
	//	seqName = "Sign Posting Number";
	//} else if (appMatch("Planning/SitePlan/Schematics/NA") || appMatch("Planning/SitePlan/Major/NA")) {
	//	seqName = "Sign Posting Number";
	//} 
	if ((AInfo[fieldName]) != "undefined") {
		//AInfo[fieldName] = getNextSequence(seqName);
		AInfo[fieldName] = generateSignPostingNumber(fieldName);
		logDebug(fieldName + ": " + AInfo[fieldName]);
		editAppSpecific(fieldName, AInfo[fieldName]);
	}
	//07-2020 Boucher 40p
	if (AInfo['Submittal Count'] == null) {
		editAppSpecific('Submittal Count',1);
	}
	//10-2020 Boucher 105aca
	var addrArray = [];
	loadAddressAttributes(addrArray);
	var TechRev = addrArray["AddressAttribute.County"];
	
	if (TechRev != null) {
		addStdCondition('Economic Development','Eligible for Technology Zone Incentive Program');
		email('dboucher@truepointsolutions.com','noreply@chesterfield.gov','Record: ' + capId + ' submitted in the Tech Zone','Date: ' + fileDate + ' For Record Type: ' + appTypeAlias);
	}
} catch (err) {
		logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}