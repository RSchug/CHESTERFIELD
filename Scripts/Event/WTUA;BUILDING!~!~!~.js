// If setting the Licecense status manually from the workflow

	if (wfTask == 'Annual Status' && wfStatus == 'About to Expire') {
		lic = new licenseObject(capIDString);
		lic.setStatus('About to Expire');
	}
//For DigEplan
	loadCustomScript("WTUA_EXECUTE_DIGEPLAN_SCRIPTS_BUILD");
//Adhoc task updated to Amendment then update Status 'Amendment Submitted' on Inspections, Certificate Issuance or Certificate of Occupancy
if (wfTask =='Document Submitted Online' && wfStatus == 'Amendment'){
	if (isTaskActive('Inspections')){
		updateTask("Inspections", "Amendment Submitted", "Updated based on Document Submitted Online 'Amendment' Status", "");
			var newAppTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + "Amendment";
			if (appMatch("Building/Permit/Residential/NA"))
				var newAppTypeString = "Building/Permit/Residential/Amendment";
			var newCapName = capName;
			var newCapIdString = getNextChildCapId(capId, newAppTypeString, "-");
			var newCapRelation = "Child";
			var srcCapId = capId;
			var newCapId = createCap_TPS(newAppTypeString, newCapName, newCapIdString, newCapRelation, srcCapId);
			if (newCapId) {
				showMessage = true;
				comment("<b>Created " + (newCapRelation ? newCapRelation + " " : "")
					+ "Amendment: <b>" + newCapId.getCustomID() + "</b> " + newAppTypeString);
				if (wfComment && wfComment != "") {
					cWorkDesc = workDescGet(capId);
					nWorkDesc = cWorkDesc + ", " + wfComment;
					updateWorkDesc(nWorkDesc, newCapId);
				}
				// set the Permit Expiration Date to 180 days from Application Date.
				var expDateField = "Permit Expiration Date";
				var expDate = jsDateToASIDate(new Date(dateAdd(null, 180)));
				editAppSpecific(expDateField, expDate, newCapId);
			}
			addFee("ADMIN", "CC-BLD-ADMIN", "FINAL", 1, "Y");
	}
}
if (wfTask =='Document Submitted Online' && wfStatus == 'Amendment'){
	if (isTaskActive('Certificate Issuance')){
		updateTask("Certificate Issuance", "Amendment Submitted", "Updated based on Document Submitted Online 'Amendment' Status", "");
	}
}
if (wfTask =='Document Submitted Online' && wfStatus == 'Amendment'){
	if (isTaskActive('Certificate of Occupancy')){
		updateTask("Certificate of Occupancy", "Amendment Submitted", "Updated based on Document Submitted Online 'Amendment' Status", "");
	}
}
//Adhoc task updated to Revision then activate 'Review Distribution' and status of 'Corrections Received'
if (wfTask =='Document Submitted Online' && wfStatus == 'Revision'){
	if (isTaskActive('Review Distribution')){
		updateTask("Review Distribution", "Corrections Received", "Updated based on Docucent Submitted Online 'Revision' Status", "");
	}}