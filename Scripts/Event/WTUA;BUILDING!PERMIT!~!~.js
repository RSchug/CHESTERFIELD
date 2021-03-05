try {
	//Permit Issuance is Issued than updated Permit Expiration Date to 180 days from system date
	if ((wfTask == "Permit Issuance" && wfStatus == "Issued") || !exists(capStatus, ["Cancelled","Pending Applicant"])) { 
		
	// Update Permit Expiration Date on record, and where appropriate parent and children
		var expField = "Permit Expiration Date";
		var expDateNew = jsDateToASIDate(new Date(dateAdd(null, 180)));
		editAppSpecific(expField, expDateNew);
		if (appMatch("Building/Permit/Residential/NA") || appMatch("Building/Permit/Residential/Multi-Family") || appMatch("Building/Permit/Commercial/NA")) {
			var childRecs = getChildren("Building/Permit/*/*", capId);
		} else if (parentCapId) {
			logDebug("Updating parent " + parentCapId.getCustomID() + " " + expField + " to " + expDateNew);
			editAppSpecific(expField, expDateNew, parentCapId);
			var childRecs = getChildren("Building/Permit/*/*", parentCapId);
		} else {
			comment("Parent record missing. Could not update parent expiration date.");
			var childRecs = [];
		}
		for (var c in childRecs) {
			var childCapId = childRecs[c];
			var childCapStatus = null;
			var getCapResult = aa.cap.getCap(childCapId);
			if (getCapResult.getSuccess()) {
				var childCap = getCapResult.getOutput();
				var childCapStatus = childCap.getCapStatus();
			}
			if (childCapStatus != "Cancelled") {
				logDebug("Updating child " + childCapId.getCustomID() + " " + childCapStatus + " " + expField + " to " + expDateNew);
				editAppSpecific(expField, expDateNew, childCapId);
			}
		}
	}
	//Temp CO Dates
	var tempcoexpdate = "Temp CO Expiration Date";
	var tempcoexpdatenew = jsDateToASIDate(getTaskDueDate("Inspections"));
	if (wfStatus == 'Temporary CO Issued' && appMatch("Building/Permit/Residential/NA")) {
	addFee("TEMPCORES","CC-BLD-ADMIN","FINAL",1,"Y");
	editAppSpecific(tempcoexpdate,tempcoexpdatenew);
	}
	if (wfStatus == 'Temporary CO Issued' && appMatch("Building/Permit/Commercial/NA")) {
		addFee("TEMPCO","CC-BLD-ADMIN","FINAL",1,"Y");
		editAppSpecific(tempcoexpdate,tempcoexpdatenew);
	}
	//Variables for the EE Inspector based on Parcel field "Inspection Dist" and Standard Choice 'InspectionAssignmentEnvEngineering'
	//var ParcelInspectorEnvEng = AInfo["ParcelAttribute.InspectionDistrict"];
	//var InspAssignment = lookup("InspectionAssignmentEnvEngineering", ParcelInspectorEnvEng);
	if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
		if (isTaskActive("Environmental Engineering Review")) {
			assignTask_CHESTERFIELD("Environmental Engineering Review", null, null, null, "EnvEngineering");
		}
	}
	//Temporary Elevator Renewal Certificate Dates
	var tempcertexpdate = "Temporary Certificate Expiration Date";
	var tempcertexpdatenew = jsDateToASIDate(new Date(dateAdd(null, 30)));
	if (wfStatus == 'Temporary Certificate Issued' && appMatch("Building/Permit/Elevator/Renewal")) {
	editAppSpecific(tempcertexpdate,tempcertexpdatenew);
	}
	//Email if Payment Due 
	if (wfTask == "Application Submittal" && wfStatus == "Payment Due"){
		var address = aa.address.getAddressByCapId(capId).getOutput();
		var fileNames = [];
		var emailParameters; 
		var applicantEmail = "";
		emailParameters = aa.util.newHashtable();
		emailParameters.put("$$RecordID$$", capIDString); 
		sendNotification("noreply@chesterfield.gov","mbouquin@truepointsolutions.com","WTUA_BLDG_PAYMENT_DUE",emailParameters,fileNames);
	}

	//03-2021 Auto-emails
	if (matches(wfTask,"Application Submittal","Review Distribution") && wfStatus == "Additional Information Required") { 
		var emailSendFrom = '';
		var emailSendTo = "";
		var emailCC = "";
		var emailTemplate = "WTUA_CONTACT NOTIFICATION_ADDITIONAL_BLD";
		var fileNames = [];
		var emailParameters = aa.util.newHashtable();
		getRecordParams4Notification(emailParameters);
		getAPOParams4Notification(emailParameters);
		var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
		acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));
		//getACARecordParam4Notification(emailParameters,acaSite);
		addParameter(emailParameters, "$$acaRecordUrl$$", getACARecordURL(acaSite));
		addParameter(emailParameters, "$$wfComment$$", wfComment);
		addParameter(emailParameters, "$$wfStatus$$", wfStatus);
		addParameter(emailParameters, "$$ShortNotes$$", getShortNotes());
		var applicantEmail = "";
		var contObj = {};
		contObj = getContactArray(capId);
		if (typeof(contObj) == "object") {
			for (co in contObj) {
				if (contObj[co]["contactType"] == "Applicant" && contObj[co]["email"] != null)
					applicantEmail += contObj[co]["email"] + ";";
			}
			addParameter(emailParameters, "$$applicantEmail$$", applicantEmail);
		} else { logDebug("No contacts at all for " + capIDString); }
		if (applicantEmail != "") {
			sendNotification(emailSendFrom, emailSendTo, emailCC, emailTemplate, emailParameters, fileNames);
		} else { logDebug("No applicants for " + capIDString); }
	}
	if (matches(wfTask,"Review Consolidation","Structural Review") && wfStatus == "Corrections Required") { 
		var emailSendFrom = '';
		var emailSendTo = "";
		var emailCC = "";
		var emailTemplate = "WTUA_CONTACT NOTIFICATION_CORRECTION_BLD";
		var fileNames = [];
		var emailParameters = aa.util.newHashtable();
		getRecordParams4Notification(emailParameters);
		getAPOParams4Notification(emailParameters);
		var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
		acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));
		//getACARecordParam4Notification(emailParameters,acaSite);
		addParameter(emailParameters, "$$acaRecordUrl$$", getACARecordURL(acaSite));
		addParameter(emailParameters, "$$wfComment$$", wfComment);
		addParameter(emailParameters, "$$wfStatus$$", wfStatus);
		addParameter(emailParameters, "$$ShortNotes$$", getShortNotes());
		var applicantEmail = "";
		var contObj = {};
		contObj = getContactArray(capId);
		if (typeof(contObj) == "object") {
			for (co in contObj) {
				if (contObj[co]["contactType"] == "Applicant" && contObj[co]["email"] != null)
					applicantEmail += contObj[co]["email"] + ";";
			}
			addParameter(emailParameters, "$$applicantEmail$$", applicantEmail);
		} else { logDebug("No contacts at all for " + capIDString); }
		if (applicantEmail != "") {
			sendNotification(emailSendFrom, emailSendTo, emailCC, emailTemplate, emailParameters, fileNames);
		} else { logDebug("No applicants for " + capIDString); }
	}
	if (wfTask == "Permit Issuance" && wfStatus == "Issued") { 
		var emailSendFrom = '';
		var emailSendTo = "";
		var emailCC = "";
		var emailTemplate = "WTUA_CONTACT NOTIFICATION_APPROVED_BLD";
		var fileNames = [];
		var emailParameters = aa.util.newHashtable();
		getRecordParams4Notification(emailParameters);
		getAPOParams4Notification(emailParameters);
		var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
		acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));
		//getACARecordParam4Notification(emailParameters,acaSite);
		addParameter(emailParameters, "$$acaRecordUrl$$", getACARecordURL(acaSite));
		addParameter(emailParameters, "$$wfComment$$", wfComment);
		addParameter(emailParameters, "$$wfStatus$$", wfStatus);
		addParameter(emailParameters, "$$ShortNotes$$", getShortNotes());
		var applicantEmail = "";
		var contObj = {};
		contObj = getContactArray(capId);
		if (typeof(contObj) == "object") {
			for (co in contObj) {
				if (contObj[co]["contactType"] == "Applicant" && contObj[co]["email"] != null)
					applicantEmail += contObj[co]["email"] + ";";
			}
			addParameter(emailParameters, "$$applicantEmail$$", applicantEmail);
		} else { logDebug("No contacts at all for " + capIDString); }
		if (applicantEmail != "") {
			sendNotification(emailSendFrom, emailSendTo, emailCC, emailTemplate, emailParameters, fileNames);
		} else { logDebug("No applicants for " + capIDString); }
	}
} catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}