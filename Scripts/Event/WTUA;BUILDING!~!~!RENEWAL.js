// WTUA;BUILDING!~!~!RENEWAL.js

//Alex Charlton added for Renewal of Conveyance Permit.
if (wfStatus == 'Renewed') {
	saveId = capId;
	var parentLicenseCapID = getParentCapIDForReview(capId);
	logDebug('ParentLic CAPID = ' + parentLicenseCapID);
	if (parentLicenseCapID) {
		var pCapIdSplit = String(parentLicenseCapID).split('-');
		var pCapIdObj = aa.cap.getCapID(pCapIdSplit[0], pCapIdSplit[1], pCapIdSplit[2]).getOutput();
		var parentLicenseCustomID = pCapIdObj.getCustomID();
		logDebug('ParentLic CustomID: ' + parentLicenseCustomID);

		saveId = capId;
		capId = parentLicenseCapID;
		var wfCommentParent = "Renewal Approved By: " + capIDString;
		//7B: For Elevator Renewal Record when Workflow Task 'Renewal Issuance' is 'Renewed', then update parent Elevator Permit Record Workflow Task 'Annual Status' to 'In Service' and Record Status to 'Active'
		if (appMatch("Building/Permit/Elevator/Renewal")) {
			resultWorkflowTask("Annual Status", "In Service", wfCommentParent, "");
		}
		updateAppStatus('Active', wfCommentParent, parentLicenseCapID);

        // Figure out new EXPIRATION Date
		lic = new licenseObject(null, capId);
		lic.setStatus('Active'); logDebug("Set Lic Exp Status to Active");
		parentb1ExpResult = aa.expiration.getLicensesByCapID(parentLicenseCapID);
		parentb1Exp = parentb1ExpResult.getOutput();
		tmpDate = parentb1Exp.getExpDate();
		if (tmpDate) {
			tmpExpDate = tmpDate.getMonth() + "/" + tmpDate.getDayOfMonth() + "/" + tmpDate.getYear();
			logDebug("Lic Expires on " + tmpExpDate);
			//default to 12 months from date
			numberOfMonths = 12; // 0 months because the EXP Code bumps it up 12 months
			//7B: For Elevator Renewal Record when Workflow Task 'Renewal Issuance' is 'Renewed', then update the Permit Expiration Date, based on Quarter on the Elevator Permit Record (Building/Permit/Elevator/Annual).
			if (appMatch("Building/Permit/Elevator/Renewal")) {
				// Override if Annual Quarter set
				var annualQuarter = getAppSpecific("Annual Quarter");
				if (annualQuarter == "Q1 - March") {
					tmpExpDate = "03/31/" + tmpDate.getYear();
				} else if (annualQuarter == "Q2 - June") {
					tmpExpDate = "06/30/" + tmpDate.getYear();
				} else if (annualQuarter == "Q3 - September") {
					tmpExpDate = "09/30/" + tmpDate.getYear();
				} else if (annualQuarter == "Q4 - December") {
					tmpExpDate = "12/31/" + tmpDate.getYear();
				}
				comment("tmpExpDate: " + tmpExpDate);
			} else if (AInfo['License Duration'] == 'Semi-Annual') {
	        	// if Semi, change to 6 months form today
				numberOfMonths = -6;  // -6 because the EXP Code bumps it up 12 months
			}
			newExpDate = dateAddMonths(tmpExpDate, numberOfMonths);
			// Check if less than today if so add another period.
			if ((new Date(newExpDate)).getTime() < (new Date(aa.util.now())).getTime())
				newExpDate = dateAddMonths(newExpDate, numberOfMonths);
			comment("newExpDate: " + newExpDate);
			lic.setExpiration(newExpDate);
		}
		capId = saveId;

        logDebug('Running WTUA4Renewal');
		aa.runScript('WORKFLOWTASKUPDATEAFTER4RENEW');
		logDebug('Messages in WTUA4Renewal:<br>' + aa.env.getValue('ScriptReturnMessage'));
	} 
}
//commented out as this is included in lines above aa.runScript("WORKFLOWTASKUPDATEAFTER4RENEW");