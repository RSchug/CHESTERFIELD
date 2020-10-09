// set the Permit Expiration Date to 180 days from Application Date.
logDebug("fileDate: " + new Date(fileDate));
var expField = "Permit Expiration Date";
var expDateNew = jsDateToASIDate(new Date(dateAdd(fileDate,180)));
logDebug("Updating " + expField + " to " + expDateNew);
editAppSpecific(expField, expDateNew);
 
//update ASI Housing Units based on Additional Info Housing Units
editAppSpecific("Number of Units", houseCount);

//If Is a contractor to be determined? is "Yes" then add Licensed Professional Type of "Contractor" and License # of "TBD"//
if (AInfo["Is a contractor to be determined?"] == "Yes") {
var lpType = "Contractor", lpId = "TBD", lpBoard = null, lpExpirDate = null, lpFirstName = "", lpLastName = "To Be Determined";
createLP(lpId, lpType, capId, lpBoard, lpExpirDate, lpFirstName, null, lpLastName);
}

if (!publicUser) assignCap(currentUserID);

//10-2020 Boucher 105aca
	var addrArray = [];
	loadAddressAttributes4ACA(addrArray);
	var TechRev = addrArray["AddressAttribute.County"];
	
	if (TechRev != null) {
		addStdCondition('Economic Development','Eligible for Technology Zone Incentive Program');
		email('dboucher@truepointsolutions.com','noreply@chesterfield.gov','Record: ' + capId + ' submitted in the Tech Zone','Date: ' + fileDate + ' For Record Type: ' + appTypeAlias);
	}