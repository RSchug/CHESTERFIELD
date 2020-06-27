// WTUA:Building/Permit/Elevator/Renewal

//7B: For Elevator Renewal Record when Workflow Task 'Renewal Issuance' is 'Renewed', then update parent Elevator Permit Record Workflow Task 'Annual Status' to 'In Service' and Record Status to 'Active' and update the Permit Expiration Date, based on Quarter on the Elevator Permit Record (Building/Permit/Elevator/Annual).
if (wfTask == "Renewal Issuance" && wfStatus == "Renewed") { 
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
        resultWorkflowTask("Annual Status", "In Service", wfCommentParent, "");
        updateAppStatus('Active', wfCommentParent, parentLicenseCapID);

        lic = new licenseObject(null, capId); comment("Get License Object");
        lic.setStatus('Active'); comment("Set Lic Exp Status to Active");
        parentb1ExpResult = aa.expiration.getLicensesByCapID(parentLicenseCapID);
        parentb1Exp = parentb1ExpResult.getOutput();
        tmpDate = parentb1Exp.getExpDate();
        if (tmpDate) {
            parentb1ExpDate = tmpDate.getMonth() + "/" + tmpDate.getDayOfMonth() + "/" + tmpDate.getYear();
            comment("In Building/Permit/Elevator/Renewal. This Lic Expires on " + parentb1ExpDate);
            // Override if Annual Quarter set
            var tmpExpDate = parentb1ExpDate;
            if (AInfo["Annual Quarter"] == "Q1 - March") {
                tmpExpDate = "03/30/" + tmpDate.getYear();
            } else if (AInfo["Annual Quarter"] == "Q2 - June") {
                tmpExpDate = "06/30/" + tmpDate.getYear();
            } else if (AInfo["Annual Quarter"] == "Q3 - September") {
                tmpExpDate = "09/30/" + tmpDate.getYear();
            } else if (AInfo["Annual Quarter"] == "Q4 - December") {
                tmpExpDate = "12/31/" + tmpDate.getYear();
            }
            comment("tmpExpDate: " + tmpExpDate);
            //default to 12 months from date
            numberOfMonths = 12; // 0 months because the EXP Code bumps it up 12 months
            newExpDate = dateAddMonths(tmpExpDate, numberOfMonths);
            // Check if less than today if so add another cycle.
            if ((new Date(newExpDate)).getTime() < (new Date(aa.util.now())).getTime()) 
                newExpDate = dateAddMonths(newExpDate, numberOfMonths);
            comment("newExpDate: " + newExpDate);
            lic.setExpiration(newExpDate);
        }

        capId = saveId;     // Restore CapId
	}
}
