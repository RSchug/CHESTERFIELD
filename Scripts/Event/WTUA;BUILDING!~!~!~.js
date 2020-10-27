// If setting the Licecense status manually from the workflow

	if (wfTask == 'Annual Status' && wfStatus == 'About to Expire') {
		lic = new licenseObject(capIDString);
		lic.setStatus('About to Expire');
	}
//For DigEplan
	loadCustomScript("WTUA_EXECUTE_DIGEPLAN_SCRIPTS_BUILD");