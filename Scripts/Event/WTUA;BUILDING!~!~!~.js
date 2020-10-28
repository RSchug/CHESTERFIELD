// If setting the Licecense status manually from the workflow

	if (wfTask == 'Annual Status' && wfStatus == 'About to Expire') {
		lic = new licenseObject(capIDString);
		lic.setStatus('About to Expire');
	}
//For DigEplan
	loadCustomScript("WTUA_EXECUTE_DIGEPLAN_SCRIPTS_BUILD");
//Adhoc task updated to Amendment then update Status 'Amendment Submitted' on Inspections, Certificate Issuance or Certificate of Occupancy
if (wfTask =='Document Submitted Online' && wfStatus == 'Amendment'){
	if (isTaskActive('Inspections'){
		updateTask("Inspections", "Amendment Submitted", "Updated based on Docuent Submitted Online 'Amendment' Status", "");
	}
}
if (wfTask =='Document Submitted Online' && wfStatus == 'Amendment'){
	if (isTaskActive('Certificate Issuance'){
		updateTask("Certificate Issuance", "Amendment Submitted", "Updated based on Docuent Submitted Online 'Amendment' Status", "");
	}
}
if (wfTask =='Document Submitted Online' && wfStatus == 'Amendment'){
	if (isTaskActive('Certificate of Occupancy'){
		updateTask("Certificate of Occupancy", "Amendment Submitted", "Updated based on Docuent Submitted Online 'Amendment' Status", "");
	}
}
//Adhoc task updated to Revision then activate 'Review Distribution' and status of 'Corrections Received'
if (wfTask =='Document Submitted Online' && wfStatus == 'Revision'){
		updateTask("Review Distribution", "Corrections Received", "Updated based on Docuent Submitted Online 'Revision' Status", "");
	}