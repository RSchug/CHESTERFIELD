try {
	var customListGroupName = "CC-UT-UC";
	var AccountNumberfield = "Service Number";
	var generateNewNumbercheckBox = "Generate New Service Number";
	if (appTypeArray[1] == "ResidentialCompanionMeter")
		AccountNumberfield = "Domestic Service Number";

	var currentASITRows = loadASITable(customListGroupName, capId);
	var accountNumber = "";

	//check all ASIT checkboxes 
	for (i in currentASITRows) {
		if (currentASITRows[i]["Select to Copy"].fieldValue == "CHECKED") {
			accountNumber = currentASITRows[i]["Account Number"].fieldValue;
			break;
		}
	}

	if (accountNumber != null && accountNumber != "") {
		editAppSpecific(AccountNumberfield, accountNumber, capId);
		removeASITable(customListGroupName, capId);
	} else {
		if (AInfo[generateNewNumbercheckBox] == "CHECKED") {
			var sequenceNumber = generateNewSerivceNumber();
			editAppSpecific(AccountNumberfield, sequenceNumber, capId);
			removeASITable(customListGroupName, capId);
		}
	}
	function generateNewSerivceNumber() {
		var Agency = servProvCode;
		var Group = appTypeArray[0];
		var Type = appTypeArray[1];
		var Subtype = appTypeArray[2];
		var Category = appTypeArray[3];
		var isTempCap = false;
		var capBiz = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapBusiness").getOutput();
		var altID = capBiz.getNextAltId(Agency, Group, Type, Subtype, Category, capId.getID1(), capId.getID2(), capId.getID3(), null, false, isTempCap, false);
		return altID;

	}
	var newTapNumber = Number(lookup("NEW_TAP_NUMBER","TAP_NUMBER"));
	var count = 1;
	editAppSpecific("Service Number",lookup("NEW_TAP_NUMBER","TAP_NUMBER"));
	editLookup("NEW_TAP_NUMBER","TAP_NUMBER",zeroPad(newTapNumber+count,8));
	if (!feeExists("CC-UTL-RM01")){
	addFee("CC-UTL-RM01","CC-UTL-RM","FINAL",1,"Y");
	addFee("CC-UTL-RM02","CC-UTL-RM","FINAL",1,"Y");
	addFee("BACKFLOW","CC-UTL-RM","FINAL",1,"Y");
	addFee("STATELEVY","CC-UTL-RM","FINAL",1,"Y");
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}