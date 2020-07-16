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

		var wfCommentParent = "Renewal Approved By: " + capIDString;
		//7B: For Elevator Renewal Record when Workflow Task 'Renewal Issuance' is 'Renewed', then update parent Elevator Permit Record Workflow Task 'Annual Status' to 'In Service' and Record Status to 'Active'
		var expMonths = 12;
		var expDateField = "Permit Expiration Date";
		var expDate = getAppSpecific(expDateField, parentLicenseCapID);
		if (appMatch("Building/Permit/AmusementDevice/Renewal")) {
			resultWorkflowTask("Annual Status", "In Service", wfCommentParent, "");
		} else if (appMatch("Building/Permit/Elevator/Renewal")
			resultWorkflowTask("Annual Status", "In Service", wfCommentParent, "");
		}
		updateAppStatus('Active', wfCommentParent, parentLicenseCapID);

		logDebug("Expiration Date: " + expDate);
		expDate = (expMonths ? dateAddMonths(expDate, expMonths) : expDate);
		logDebug("New Expiration Date: " + expDate);

		// Figure out new EXPIRATION Date
		if (expDate) {              // set the expiration date
			if (expDateField) {     // set custom field with expiration date
				editAppSpecific(expDateField, expDate, parentLicenseCapID)
			} else {                // set expiration Info
				try {
					logDebug("NEW expiration Status: Active, Date: " + expDate);
					var thisLic = new licenseObject(newCapIdString, parentLicenseCapID);
					if (thisLic) {
						thisLic.setStatus("Active");
						thisLic.setExpiration(dateAdd(expDate, 0));
					}
				} catch (err) {
					logDebug("ERROR: Updating expiration Status: Active, Date: " + expDate + ": " + err);
				}
			}
		}

        logDebug('Running WTUA4Renewal');
		aa.runScript('WORKFLOWTASKUPDATEAFTER4RENEW');
		logDebug('Messages in WTUA4Renewal:<br>' + aa.env.getValue('ScriptReturnMessage'));
	} 
}
//commented out as this is included in lines above aa.runScript("WORKFLOWTASKUPDATEAFTER4RENEW");