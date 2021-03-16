//Add Fees - 03-2021 update per new fee spec...
try {
	if ((AInfo["Nature of Work"] == "Fuel tank installation and/or removal or replacement" && !feeExists("FUELTANK")) && (!feeExists("WOODSTOVE") || !feeExists("MANUFACTURED") || !feeExists("DUCTWORK") || !feeExists("REPLCNEWDUCT") || !feeExists("REPLCNODUCT"))) {
		addFee("FUELTANK","CC-BLD-RES-MECH","FINAL",1,"Y");
		updateFee("STATELEVY","CC-BLD-RES-MECH","FINAL",1,"Y");
		
	} else if (AInfo["Nature of Work"] == "Fuel tank installation and/or removal or replacement" && (feeExists("FUELTANK") || feeExists("WOODSTOVE") || feeExists("MANUFACTURED") || feeExists("DUCTWORK") || feeExists("REPLCNEWDUCT") || feeExists("REPLCNODUCT"))) {
		addFee("ADD57","CC-BLD-RES-MECH","FINAL",1,"Y");
		updateFee("STATELEVY","CC-BLD-RES-MECH","FINAL",1,"Y");
	}
	if (AInfo["Nature of Work"] == "Woodstove Installation" && !feeExists("WOODSTOVE")){
		addFee("WOODSTOVE","CC-BLD-RES-MECH","FINAL",1,"Y");
		updateFee("STATELEVY","CC-BLD-RES-MECH","FINAL",1,"Y");
	}

	if (AInfo["Nature of Work"] == "Heating, venting and air conditioning (HVAC)" && AInfo["Type of Building"] == "Mobile or Manufactured Home on Private Property"&& !feeExists("MANUFACTURED")){
		addFee("MANUFACTURED","CC-BLD-RES-MECH","FINAL",1,"Y");
		updateFee("STATELEVY","CC-BLD-RES-MECH","FINAL",1,"Y");
	}

	if (AInfo["HVAC Type of Work"] == "New ductwork only" && !feeExists("DUCTWORK") && AInfo["Type of Building"] != "Mobile or Manufactured Home on Private Property"){
		addFee("DUCTWORK","CC-BLD-RES-MECH","FINAL",1,"Y");
		updateFee("STATELEVY","CC-BLD-RES-MECH","FINAL",1,"Y");
	}

	if (!feeExists("NEWHVAC") && (AInfo["Type of Building"] != "Mobile or Manufactured Home on Private Property") && (AInfo["Type of Building"] != "Multi-Family Dwelling") ){
		addFee("NEWHVAC","CC-BLD-RES-MECH","FINAL",1,"Y");
		updateFee("STATELEVY","CC-BLD-RES-MECH","FINAL",1,"Y");
	}

	if (AInfo["HVAC Type of Work"] == "System replacement with new ductwork" && !feeExists("REPLCNEWDUCT") && AInfo["Type of Building"] != "Mobile or Manufactured Home on Private Property"){
		addFee("REPLCNEWDUCT","CC-BLD-RES-MECH","FINAL",1,"Y");
		updateFee("STATELEVY","CC-BLD-RES-MECH","FINAL",1,"Y");
	}

	if (AInfo["HVAC Type of Work"] == "System replacement without new ductwork" && !feeExists("REPLCNODUCT") && AInfo["Type of Building"] != "Mobile or Manufactured Home on Private Property"){
		addFee("REPLCNODUCT","CC-BLD-RES-MECH","FINAL",1,"Y");
		updateFee("STATELEVY","CC-BLD-RES-MECH","FINAL",1,"Y");
	}

	if (AInfo["Nature of Work"] == "Heating, venting and air conditioning (HVAC)" && AInfo["HVAC Type of Work"] == "New system installation" && AInfo["Type of Building"] == "Multi-Family Dwelling" && !feeExists("MULTIFAMILY")){
		addFee("MULTIFAMILY","CC-BLD-RES-MECH","FINAL",houseCount,"Y");
		updateFee("STATELEVY","CC-BLD-RES-MECH","FINAL",1,"Y");
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}