var streetName, streetType, streetNumber;
var customListGroupName = "CC-UT-UC";
fillAddressParts();


var URL = encodeURI("http://auroraapp.northcentralus.cloudapp.azure.com/CISCustomerAccountNumberInterface/webservices/CISCustomerAccountNumberInterface.asmx/GetCISServiceAddress?StreetName="
		+ streetName + "&streetType=" + streetType + "&streetNumber=" + streetNumber);

var vOutObj = aa.httpClient.get(URL);
if (vOutObj.getSuccess()) {
	var result = vOutObj.getOutput();
	var JsonResult = result.replaceAll("<[^>]+>", "");
	var resultList = JSON.parse(JsonResult);
	if (resultList != null && resultList.length > 0) {
		var array = new Array();
		for ( var i in resultList) {
			var currentObj = resultList[i];
			var address = currentObj.StreetNumber + ", " + currentObj.StreetName + ", " + currentObj.ZipCode;
			var row = new Array();
			row["Account Number"] = new asiTableValObj("Account Number", currentObj.AccountNumber, "N");
			row["Address"] = new asiTableValObj("Address", address, "N");
			row["Cycle"] = new asiTableValObj("Cycle", currentObj.Cycle, "N");
			row["Route"] = new asiTableValObj("Route", currentObj.Route, "N");
			row["Water"] = new asiTableValObj("Water", currentObj.Water, "N");
			row["Sewer"] = new asiTableValObj("Sewer", currentObj.Sewer, "N");
			row["Irrigation"] = new asiTableValObj("Irrigation", currentObj.Irrigation, "N");
			row["Classification"] = new asiTableValObj("Classification", currentObj.Classification, "N");
			row["Customer Number"] = new asiTableValObj("Customer Number", currentObj.Customer, "N");
			array.push(row);
		}
		var addASIT = addASITable(customListGroupName, array, capId);
	} else {
		showMessage = true;
		comment("the provided address does not exists in the CIS system  street type =" + streetType);

	}

}
/**
 * this function will fill the address parts based on the current event
 */
function fillAddressParts() {
	if (controlString.equalsIgnoreCase("addressLookupAfter")) {
		var addressListArray = SelectedAddressList.toArray();
		if (addressListArray != null && addressListArray.length > 0) {
			streetName = addressListArray[0].getStreetName();
			streetType = (addressListArray[0].getStreetSuffix() == null) ? "" : addressListArray[0].getStreetSuffix();
			streetNumber = addressListArray[0].getHouseNumberStart();
		}
	} else if (controlString.equalsIgnoreCase("ApplicationSubmitAfter")) {
		streetName = aa.env.getValue("AddressStreetName");
		streetType = (aa.env.getValue("AddressStreetSuffix") == null) ? "" : aa.env.getValue("AddressStreetSuffix");
		streetNumber = aa.env.getValue("AddressHouseNumber");
	} else if (controlString.equalsIgnoreCase("AddressUpdateAfter") || controlString.equalsIgnoreCase("addressAddAfter")) {
		streetName = AddressModel.getStreetName();
		streetType = (AddressModel.getStreetSuffix() == null) ? "" : AddressModel.getStreetSuffix();
		streetNumber = AddressModel.getHouseNumberStart();
	}
}
if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '5/8"'){
	addFee("WATERMETER","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '5/8"'){
	addFee("WATERMETER","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '1"'){
	addFee("WATERMETER1","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '1"'){
	addFee("WATERMETER1","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '1 1/2"'){
	addFee("WATERMETER15","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '1 1/2"'){
	addFee("WATERMETER15","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '2"'){
	addFee("WATERMETER2","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '2"'){
	addFee("WATERMETER2","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Connection Type"] == "F" && AInfo["Actual Meter Size"] == '5/8"'){
	addFee("SERVICELINE","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Connection Type"] != "F" && AInfo["Actual Meter Size"] == '5/8"'){
	addFee("SERVICELINE","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Connection Type"] == "F" && AInfo["Actual Meter Size"] == '5/8"'){
	addFee("SERVICELINE","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Connection Type"] == "F" && AInfo["Actual Meter Size"] == '1"'){
	addFee("SERVICELINE1","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Connection Type"] != "F" && AInfo["Actual Meter Size"] == '1"'){
	addFee("SERVICELINE1","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Connection Type"] == "F" && AInfo["Actual Meter Size"] == '1"'){
	addFee("SERVICELINE1","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Connection Type"] == "F" && AInfo["Actual Meter Size"] == '1 1/2"'){
	addFee("SERVICELN15","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Connection Type"] != "F" && AInfo["Actual Meter Size"] == '1 1/2"'){
	addFee("SERVICELN15","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Connection Type"] == "F" && AInfo["Actual Meter Size"] == '1 1/2"'){
	addFee("SERVICELN15","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Connection Type"] == "F" && AInfo["Actual Meter Size"] == '2"'){
	addFee("SERVICELINE2","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Connection Type"] != "F" && AInfo["Actual Meter Size"] == '2"'){
	addFee("SERVICELINE2","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Connection Type"] == "F" && AInfo["Actual Meter Size"] == '2"'){
	addFee("SERVICELINE2","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '5/8"' && (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAPITAL","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '5/8"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAPITAL","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Actual Meter Size"] == '5/8"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAPITAL","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '5/8"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAPITAL","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '1"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP1","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '1"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP1","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Actual Meter Size"] == '1"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP1","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '1"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP1","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '1 1/2"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP15","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '1 1/2"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP15","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Actual Meter Size"] == '1 1/2"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP15","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '1 1/2"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP15","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '2"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP2","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '2"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP2","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Actual Meter Size"] == '2"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP2","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '2"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP2","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '3"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP3","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '3"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP3","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Actual Meter Size"] == '3"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP3","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '3"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP3","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '4"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP4","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '4"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP4","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Actual Meter Size"] == '4"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP4","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '4"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP4","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '6"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP6","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '6"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP6","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Actual Meter Size"] == '6"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP6","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '6"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP6","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '8"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP8","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '8"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP8","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Actual Meter Size"] == '8"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP8","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '8"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP8","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '10"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP10","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '10"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP10","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Actual Meter Size"] == '10"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP10","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '10"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP10","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Actual Meter Size"] == '12"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP12","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '12"'&& (AInfo["Category"] != "Multifamily")){
	addFee("WATERCAP12","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Actual Meter Size"] == '12"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP12","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Actual Meter Size"] == '12"'&& (AInfo["Category"] != "Multifamily")){
	addFee("SEWERCAP12","CC-UTL-SC","FINAL",1,"Y")}
	if (AInfo["Utility Type"] == "Water" && AInfo["Category"] == "Multifamily"){
	addFee("WATERUNIT","CC-UTL-SC","FINAL",AInfo["Number of Units"],"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Category"] == "Multifamily"){
	addFee("WATERUNIT","CC-UTL-SC","FINAL",AInfo["Number of Units"],"Y")}
	if (AInfo["Utility Type"] == "Sewer" && AInfo["Category"] == "Multifamily"){
	addFee("SEWERUNIT","CC-UTL-SC","FINAL",AInfo["Number of Units"],"Y")}
	if (AInfo["Utility Type"] == "Both" && AInfo["Category"] == "Multifamily"){
	addFee("SEWERUNIT","CC-UTL-SC","FINAL",AInfo["Number of Units"],"Y")}