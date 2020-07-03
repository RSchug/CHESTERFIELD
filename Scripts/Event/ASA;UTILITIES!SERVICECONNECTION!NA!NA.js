if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == "5/8" && !feeExists("WATERMETER")){
	addFee("WATERMETER","CC-UTL-SC","FINAL",1,"Y")}