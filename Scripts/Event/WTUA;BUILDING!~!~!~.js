try {
// If setting the License status manually from the workflow
	if (wfTask == 'Annual Status' && wfStatus == 'About to Expire') {
		lic = new licenseObject(capIDString);
		lic.setStatus('About to Expire');
	}
//Adhoc task updated to Revision then activate 'Review Distribution' and status of 'Corrections Received'
	if (wfTask =='Document Submitted Online' && wfStatus == 'Revision'){
		if (isTaskActive('Review Distribution')){
			updateTask("Review Distribution", "Corrections Received", "Updated based on Document Submitted Online 'Revision' Status", "");
			updateAppStatus("In Review","Updated based on Document Submitted Online 'Revision' Status.");
		}
	}
//For DigEplan
	loadCustomScript("WTUA_EXECUTE_DIGEPLAN_SCRIPTS_BUILD");
} catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}