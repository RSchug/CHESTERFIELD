try {
// If setting the License status manually from the workflow
	if (wfTask == 'Annual Status' && wfStatus == 'About to Expire') {
		lic = new licenseObject(capIDString);
		lic.setStatus('About to Expire');
	}
//For DigEplan
	loadCustomScript("WTUA_EXECUTE_DIGEPLAN_SCRIPTS_BUILD");
} catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}