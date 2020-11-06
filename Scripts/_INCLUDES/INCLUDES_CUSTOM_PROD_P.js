/*------------------------------------------------------------------------------------------------------/
| Accela Automation
| Accela, Inc.
| Copyright (C): 2012
|
| Program : INCLUDES_CUSTOM.js
| Event   : N/A
|
| Usage   : Custom Script Include.  Insert custom EMSE Function below and they will be 
|	    available to all master scripts
|
| Notes   : anything added/updated, see above the function line - db
|
/------------------------------------------------------------------------------------------------------*/

//FUNCTIONS ADDED BY TRUEPOINT/MHELVICK 04/21/2020
function loadCustomScript(scriptName) {

    try {
        scriptName = scriptName.toUpperCase();
        var emseBiz = aa.proxyInvoker.newInstance(
                "com.accela.aa.emse.emse.EMSEBusiness").getOutput();
        var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),
                scriptName, "ADMIN");
        eval(emseScript.getScriptText() + "");

    } catch (error) {
        showDebug = true;
        logDebug("<font color='red'><b>WARNING: Could not load script </b></font>" + scriptName + ". Verify the script in <font color='blue'>Classic Admin>Admin Tools>Events>Scripts</font>");
    }
}

function getVendor(sourceValue, sourceName)
{
	var _sourceVal = "STANDARD";
	if(sourceValue != null && sourceValue != '')
	{
		logDebug("sourceValue was not null or empty string.");
		_sourceVal = sourceValue;
	}
	else if(sourceName != null && sourceName != '')
	{
		logDebug("sourceName was not null or empty string.");
		var bizDomScriptResult = aa.bizDomain.getBizDomainByValue("EDMS",sourceName.toUpperCase());

		if (bizDomScriptResult.getSuccess())
	   {
			logDebug("bizDomScriptResult is successful.");
			bizDomScriptObj = bizDomScriptResult.getOutput();
			var bizDescStr = bizDomScriptObj.getDescription();
			var startPos = bizDescStr.indexOf("EDMS_VENDOR=");
			var endPos = bizDescStr.indexOf(";",startPos);
			if(startPos > -1 && endPos >-1)
			{
				_sourceVal = bizDescStr.substring(startPos+12,endPos).trim();
				logDebug("_sourceVal set to " + _sourceVal);
			}
		}
		else
			logDebug("bizDomScriptResult.getSuccess() was false.  Will not attempt to search for Vendor.");
	}
	
	logDebug("Function getVendor returns a value of " + _sourceVal);
	
	return _sourceVal;
}

/*--------START NOTIFICATION TEMPLATE FUNCTIONS--------*/
function generateReportSavetoEDMS(reportName,parameters,rModule) 
{
	// Specific to MIS
	var itemCap = capId;
	var capIdStr = String(itemCap.getID1() + "-" + itemCap.getID2() + "-" + itemCap.getID3());
	// var capIdStr = "";
      
    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();
  
    report.setModule(rModule);
    report.setCapId(capIdStr);

	  // specific to MIS
      report.setReportParameters(parameters);
      var ed1 = report.getEDMSEntityIdModel();
      ed1.setCapId(capIdStr);
      // Needed to determine which record the document is attached
      ed1.setAltId(itemCap.getCustomID());
      // Needed to determine which record the document is attached
      report.setEDMSEntityIdModel(ed1);	

    var permit = aa.reportManager.hasPermission(reportName,currentUserID);

    if(permit.getOutput().booleanValue()) {
       var reportResult = aa.reportManager.getReportResult(report);
     
       if(reportResult) {
	       reportResult = reportResult.getOutput();
	       var reportFile = aa.reportManager.storeReportToDisk(reportResult);
			logMessage("Report Result: "+ reportResult);
	       reportFile = reportFile.getOutput();
	       return reportFile
       } else {
       		logMessage("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
       		return false;
       }
    } else {
         logMessage("No permission to report: "+ reportName + " for Admin" + systemUserObj);
         return false;
    }
}

function getAARecordParam4Notification(params,avUrl) {
	// pass in a hashtable and it will add the additional parameters to the table

	addParameter(params, "$$aaRecordUrl$$", getAARecordUrl(avUrl));
	
	return params;	
}
//db Removed 05-2020 as these did not work - see getACARecordURL 
/*function getACADeepLinkParam4Notification(params,acaUrl,pAppType,pAppTypeAlias,module) {
	// pass in a hashtable and it will add the additional parameters to the table
	addParameter(params, "$$acaDeepLinkUrl$$", getDeepLinkUrl(acaUrl, pAppType, module));
	addParameter(params, "$$acaDeepLinkAppTypeAlias$$", pAppTypeAlias);
	return params;
}
function getDeepLinkUrl(acaUrl, appType, module) {
	var acaDeepLinkUrl = "";
	
	acaDeepLinkUrl = acaUrl + "/Cap/CapApplyDisclaimer.aspx?CAPType=";
	acaDeepLinkUrl += appType;
	acaDeepLinkUrl += "&Module=" + module;
	
	return acaDeepLinkUrl;
}*/
//The one in the INCLUDES_ACCELA_FUNCTIONS and directly above does not work as a deeplink - db 5-2020
function getACARecordURL(acaSite) {
		var acaRecordUrl = "";
		var id1 = capId.ID1;
		var id2 = capId.ID2;
		var id3 = capId.ID3;
		acaRecordUrl = acaSite + "/Cap/CapDetail.aspx?";   
		acaRecordUrl += "Module=" + cap.getCapModel().getModuleName() + "&TabName=" + cap.getCapModel().getModuleName();
		acaRecordUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
		acaRecordUrl += "&agencyCode=" + aa.getServiceProviderCode();
   	return acaRecordUrl; 
}

function getAPOParams4Notification(params) {
	// pass in a hashtable and it will add the additional parameters to the table
	//Get Address Line Param
    var addressLine = "";
	adResult = aa.address.getPrimaryAddressByCapID(capId,"Y");
	if (adResult.getSuccess()) {
		ad = adResult.getOutput().getAddressModel();
		addressLine = ad.getDisplayAddress();
		}
	addParameter(params, "$$addressLine$$", addressLine);
	//Get Parcel Number Param
	var parcelNumber = "";
	paResult = aa.parcel.getParcelandAttribute(capId,null);
	if (paResult.getSuccess()) {
		Parcels = paResult.getOutput().toArray();
		for (zz in Parcels) {
			if(Parcels[zz].getPrimaryParcelFlag() == "Y") {
				parcelNumber = Parcels[zz].getParcelNumber();
			}			
		}
	}
	addParameter(params,"$$parcelNumber$$",parcelNumber);
	//Get Owner Param
	capOwnerResult = aa.owner.getOwnerByCapId(capId);
	if (capOwnerResult.getSuccess()) {
		owner = capOwnerResult.getOutput();
		for (o in owner) {
			thisOwner = owner[o];
			if (thisOwner.getPrimaryOwner() == "Y") {
				addParameter(params, "$$ownerFullName$$", thisOwner.getOwnerFullName());
				addParameter(params, "$$ownerPhone$$", thisOwner.getPhone());
				break;	
			}
		}
	}
	return params;
}

function getAARecordUrl(avUrl) {	
	var aaRecordUrl = "";
	var id1 = capId.ID1;
 	var id2 = capId.ID2;
 	var id3 = capId.ID3;

   	aaRecordUrl = avUrl + "/portlets/cap/capsummary/CapTabSummary.do?mode=tabSummary";
	aaRecordUrl += "&serviceProviderCodee=" + aa.getServiceProviderCode();	
	aaRecordUrl += "&ID1=" + id1 + "&ID2=" + id2 + "&ID3=" + id3;
	aaRecordUrl += "&requireNotice=YES";
	aaRecordUrl += "&clearForm=clearForm";
	aaRecordUrl += "&module=" + cap.getCapModel().getModuleName();

   	return aaRecordUrl;
}

function addParameter(parameters, key, value)
{
	if(key != null)
	{
		if(value == null)
		{
			value = "";
		}
		parameters.put(key, value);
        aa.print(key + " = " + value);
	}
}

/*--------END NOTIFICATION TEMPLATE FUNCTIONS--------*/
/*--------START DIGEPLAN EDR CUSTOM FUNCTIONS---------*/
function getAssignedToStaff() // option CapId
{
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ 	logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
			return false;
		}
	
	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ 	logDebug("**ERROR: No cap detail script object") ;
			return false;
		}
		
	cd = cdScriptObj.getCapDetailModel();
	
	//cd.setCompleteDept(iName.getDeptOfUser());
	var returnValue = cd.getAsgnStaff();
	//cdScriptObj.setCompleteDate(sysDate);
	
	//logDebug("Returning Assigned To Staff value: " + returnValue);
	
	return returnValue; 
}

function edrPlansExist(docGroupArray,docCategoryArray) {
	var edrPlans = false;
	
	var docArray = aa.document.getCapDocumentList(capId,currentUserID).getOutput();
	if(docArray != null && docArray.length > 0) {
		for (d in docArray) if(exists(docArray[d]["docGroup"],docGroupArray) && exists(docArray[d]["docCategory"],docCategoryArray)) edrPlans = true;
	}
	
	return edrPlans;
}

function emailReviewCompleteNotification(ResubmitStatus, ApprovedStatus, docGroupArrayModule) {
    showMessageDefault = showMessage;
    //populate email notification parameters
    var emailSendFrom = "";
    var emailSendTo = "";
    var emailCC = "";
    var emailParameters = aa.util.newHashtable();
    var fileNames = [];

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
    var assignedTo = getAssignedToStaff();
    var assignedToEmail = "";
    var assignedToFullName = "";
    var contObj = {};
    contObj = getContactArray(capId);
    if (typeof(contObj) == "object") {
        for (co in contObj) {
            if (contObj[co]["contactType"] == "Applicant" && contObj[co]["email"] != null)
                applicantEmail += contObj[co]["email"] + ";";
        }
    }

    addParameter(emailParameters, "$$applicantEmail$$", applicantEmail);

    if (assignedTo != null) {
        assignedToFullName = aa.person.getUser(assignedTo).getOutput().getFirstName() + " " + aa.person.getUser(assignedTo).getOutput().getLastName();
        if (!matches(aa.person.getUser(assignedTo).getOutput().getEmail(), undefined, "", null)) {
            assignedToEmail = aa.person.getUser(assignedTo).getOutput().getEmail();
        }
    }
    addParameter(emailParameters, "$$assignedToFullName$$", assignedToFullName);
    addParameter(emailParameters, "$$assignedToEmail$$", assignedToEmail);

    if (applicantEmail != "") {
        if (matches(wfStatus, ResubmitStatus)) {
            if (appMatch("eReview/*/*/*"))
                var emailTemplate = "WTUA_CONTACT NOTIFICATION_RESUBMIT";

            var fileNameArray = [];
            var fileNameString = "";
            docArray = aa.document.getCapDocumentList(capId, currentUserID).getOutput();
            if (docArray != null && docArray.length > 0) {
                for (d in docArray) {
                    601
                    if (exists(docArray[d]["docGroup"], docGroupArrayModule) && docArray[d]["docStatus"] == "Review Complete" && docArray[d]["fileUpLoadBy"] == digEplanAPIUser && docArray[d]["allowActions"] != null && docArray[d]["allowActions"].indexOf("RESUBMIT") >= 0) { // docArray[d]["docStatus"] == reviewCompleteDocStatus
                        //fileNameArray.push(docArray[d]["fileName"]);
                        getResubmitFileName(docArray[d], fileNameArray);
                    }
                }
            }
            if (fileNameArray.length > 0)
                fileNameString = "Document(s) requiring correction: " + fileNameArray;
				addParameter(emailParameters, "$$correctionFileNames$$", fileNameString);
        }
        if (matches(wfStatus, ApprovedStatus)) {
            if (appMatch("eReview/*/*/*"))
                var emailTemplate = "WTUA_CONTACT NOTIFICATION_APPROVED";
        }
        sendNotification(emailSendFrom, emailSendTo, emailCC, emailTemplate, emailParameters, fileNames);
    } else {
        if (applicantEmail == "" && assignedToEmail != "") {
            var emailTemplate = "WTUA_INTERNAL NOTIFICATION_REVIEWCOMPLETE";
            sendNotification(emailSendFrom, emailSendTo, emailCC, emailTemplate, emailParameters, fileNames);
            showMessage = true;
            comment("There is no applicant email associated to this permit. Permit Coordinator has been notified via email to contact this applicant directly.");
            showMessage = showMessageDefault;
        }
    }
}

function getResubmitFileName(documentModel,fileNameArray) {
	logDebug(documentModel["fileName"]);
	var parentFileName = "";
	var parentDocSeq = documentModel.getParentSeqNbr();
	var parentDocModel = aa.document.getDocumentByPK(parentDocSeq);
	if(parentDocModel != null && parentDocModel.getOutput() != null) {
		//Get parent document fileName
		parentFileName = parentDocModel.getOutput().getFileName();
		logDebug("<font color='blue'>The original document file name is " + parentFileName + "</font>");
	}
	if (parentFileName != "") fileNameArray.push(parentFileName);
	return fileNameArray;
}

function emailCorrectionsRequiredNotification(wfTask,wfStatus,wfComment) {
		//populate email notification parameters
		var emailSendFrom = "";
		var emailSendTo = "";
		var emailCC = "";
		var emailParameters = aa.util.newHashtable();
		var fileNames = [];		
		
		getRecordParams4Notification(emailParameters);
		getAPOParams4Notification(emailParameters);
		var acaSite = lookup("ACA_CONFIGS","ACA_SITE");
		acaSite = acaSite.substr(0,acaSite.toUpperCase().indexOf("/ADMIN"));
		//getACARecordParam4Notification(emailParameters, acaSite);
		addParameter(emailParameters, "$$acaRecordUrl$$", getACARecordURL(acaSite));
		addParameter(emailParameters, "$$wfComment$$", wfComment);
		addParameter(emailParameters, "$$wfStatus$$", wfStatus);
		addParameter(emailParameters, "$$ShortNotes$$", getShortNotes());

		var applicantEmail = "";
		var assignedTo = currentUserID;
		var assignedToEmail = "";
		var assignedToFullName = "";
		var contObj = {};
		contObj = getContactArray(capId);
		if(typeof(contObj) == "object") {
			for (co in contObj) {
				if(contObj[co]["contactType"] == "Applicant" && contObj[co]["email"] != null) applicantEmail += contObj[co]["email"] + ";";
			}
		}
		
		addParameter(emailParameters,"$$applicantEmail$$",applicantEmail);

		if(assignedTo != null) {
				assignedToFullName = aa.person.getUser(assignedTo).getOutput().getFirstName() + " " + aa.person.getUser(assignedTo).getOutput().getLastName();
				if(!matches(aa.person.getUser(assignedTo).getOutput().getEmail(),undefined,"",null)) {
					assignedToEmail =  aa.person.getUser(assignedTo).getOutput().getEmail();
				}
		}
		addParameter(emailParameters,"$$assignedToFullName$$",assignedToFullName);
		addParameter(emailParameters,"$$assignedToEmail$$",assignedToEmail);

		if(applicantEmail != "") {
			if(appMatch("eReview/*/*/*")) var emailTemplate = "WTUA_CONTACT NOTIFICATION_INTERIM";
			sendNotification(emailSendFrom,emailSendTo,emailCC,emailTemplate,emailParameters,fileNames);
		}
		else {
			if(applicantEmail == "" && assignedToEmail != "") {
			var emailTemplate = "WTUA_INTERNAL NOTIFICATION_INTERIM";
			sendNotification(emailSendFrom,emailSendTo,emailCC,emailTemplate,emailParameters,fileNames);
			showMessage = true;
			comment("There is no applicant email associated to this permit. A notification regarding this workflow task status update has not been sent via email. Please contact this applicant directly.");
			}
		}
}
//05-2020 not using this - be careful of what gets passed into this function - see emailReviewCompleteNotification
function emailReviewConsolidationNotification(wfStatus,revisionStatus,approvedStatus,completeStatus,docGroupArray) {
		showMessageDefault = showMessage;
		//populate email notification parameters
		var emailSendFrom = "";
		var emailSendTo = "";
		var emailCC = "";
		var emailParameters = aa.util.newHashtable();
		var fileNames = [];		
		
		getRecordParams4Notification(emailParameters);
		getAPOParams4Notification(emailParameters);

		var assignedTo = getAssignedToStaff();
		var assignedToEmail = "";
		var assignedToFullName = "";

		if(assignedTo != null) {
				assignedToFullName = aa.person.getUser(assignedTo).getOutput().getFirstName() + " " + aa.person.getUser(assignedTo).getOutput().getLastName();
				if(!matches(aa.person.getUser(assignedTo).getOutput().getEmail(),undefined,"",null)) {
					assignedToEmail =  aa.person.getUser(assignedTo).getOutput().getEmail();
				}
		}
		addParameter(emailParameters,"$$assignedToFullName$$",assignedToFullName);
		addParameter(emailParameters,"$$assignedToEmail$$",assignedToEmail);

		if(assignedToEmail != "") {
		var emailTemplate = "WTUA_INTERNAL NOTIFICATION_REVIEWCONSOLIDATION";
		sendNotification(emailSendFrom,emailSendTo,emailCC,emailTemplate,emailParameters,fileNames);			
		}
}
//05-2020 added for Pending Applicant - for wfComment to work, do not pass it into the function.
function emailPendingApplicantNotification(wfTask, wfStatus) {
    //populate email notification parameters
    var emailSendFrom = "";
    var emailSendTo = "";
    var emailCC = "";
    var emailParameters = aa.util.newHashtable();
    var fileNames = [];

    getRecordParams4Notification(emailParameters);
    getAPOParams4Notification(emailParameters);
    var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
    acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));
    //getACARecordParam4Notification(emailParameters, acaSite);
    addParameter(emailParameters, "$$acaRecordUrl$$", getACARecordURL(acaSite));
    addParameter(emailParameters, "$$wfComment$$", wfComment);
    addParameter(emailParameters, "$$wfStatus$$", wfStatus);
    addParameter(emailParameters, "$$ShortNotes$$", getShortNotes());

    var applicantEmail = "";
    var assignedTo = currentUserID;
    var assignedToEmail = "";
    var assignedToFullName = "";
    var contObj = {};
    contObj = getContactArray(capId);
    if (typeof(contObj) == "object") {
        for (co in contObj) {
            if (contObj[co]["contactType"] == "Applicant" && contObj[co]["email"] != null)
                applicantEmail += contObj[co]["email"] + ";";
        }
    }

    addParameter(emailParameters, "$$applicantEmail$$", applicantEmail);

    if (assignedTo != null) {
        assignedToFullName = aa.person.getUser(assignedTo).getOutput().getFirstName() + " " + aa.person.getUser(assignedTo).getOutput().getLastName();
        if (!matches(aa.person.getUser(assignedTo).getOutput().getEmail(), undefined, "", null)) {
            assignedToEmail = aa.person.getUser(assignedTo).getOutput().getEmail();
        }
    }
    addParameter(emailParameters, "$$assignedToFullName$$", assignedToFullName);
    addParameter(emailParameters, "$$assignedToEmail$$", assignedToEmail);

    if (applicantEmail != "") {
        if (appMatch("eReview/*/*/*"))
            var emailTemplate = "WTUA_CONTACT NOTIFICATION_PEND APPL";
        sendNotification(emailSendFrom, emailSendTo, emailCC, emailTemplate, emailParameters, fileNames);
    } else {
        if (applicantEmail == "" && assignedToEmail != "") {
            var emailTemplate = "WTUA_INTERNAL NOTIFICATION_INTERIM";
            sendNotification(emailSendFrom, emailSendTo, emailCC, emailTemplate, emailParameters, fileNames);
            showMessage = true;
            comment("There is no applicant email associated to this permit. A notification regarding this workflow task status update has not been sent via email. Please contact this applicant directly.");
        }
    }
}
function doResubmitActions(documentModel,docGroups,docCategories,routingTask,routingResubmittalStatus,originalDocStatusOnResubmit,parentDocStatusOnResubmit,resubmitDocStatusOnResubmit) {
	afterResubmitParentDocument(originalDocStatusOnResubmit,parentDocStatusOnResubmit,resubmitDocStatusOnResubmit);
	disableToBeResubmit(documentModel["documentNo"]);
        //5-2020 per business updated to not send emails internally, and added Record Status update for ease of Record filtering - db   
        //emailDocResubmitNotification(docGroups,docCategories);
        //updateTask(routingTask,routingResubmittalStatus,"","");
        //updateAppStatus("Revisions Received","Update by Document Upload");
        if (matches(capStatus,"Pending Applicant")) {
             updateTask("Review Distribution","Revisions Received");
             updateAppStatus("Revisions Received","Update by Document Upload");
         }
}

function afterResubmitParentDocument(originalDocStatusOnResubmit,parentDocStatusOnResubmit,resubmitDocStatusOnResubmit)
{
	var docModelList = aa.env.getValue("DocumentModelList");
	//var originalDocStatusOnResubmit = "Resubmitted";
	//var parentDocStatusOnResubmit = "Resubmitted";
	//var resubmitDocStatusOnResubmit = "Uploaded";
	var it = docModelList.iterator();
	while(it.hasNext())
	{
		var docModel = it.next();
		if(docModel == null)
		{
			aa.print("docModel is null");
			break;
		}
		//Set resubmit document status as "Uploaded"
		docModel.setDocStatus(resubmitDocStatusOnResubmit);
		var affectResubmitDocNum = aa.document.updateDocument(docModel);
		if(affectResubmitDocNum != null && affectResubmitDocNum.getOutput() != null && affectResubmitDocNum.getOutput() > 0)
		{
			aa.print("The resubmit document status has been set to " + resubmitDocStatusOnResubmit);
		}
/*		//Get all original document associations by resubmit document model.
		var originalDocModel = aa.document.getOriginalDoc(docModel);
		if(originalDocModel != null && originalDocModel.getOutput() != null)
		{
		    //Set original document status as "Resubmitted"
			originalDocModel.getOutput().setDocStatus(originalDocStatusOnResubmit)
			var affectOriginalDocNum = aa.document.updateDocument(originalDocModel.getOutput());
			if(affectOriginalDocNum != null && affectOriginalDocNum.getOutput() != null && affectOriginalDocNum.getOutput() > 0)
			{
				aa.print("The original document status has been set to " + originalDocStatusOnResubmit);
			}
		}
*/		
		//Get parent document associations by resubmit document model.
		var parentDocSeq = docModel.getParentSeqNbr();
		var parentDocModel = aa.document.getDocumentByPK(parentDocSeq);
		if(parentDocModel != null && parentDocModel.getOutput() != null)
		{
		    //Set parent document status as "Resubmitted"
			parentDocModel.getOutput().setDocStatus(parentDocStatusOnResubmit)
			var affectParentDocNum = aa.document.updateDocument(parentDocModel.getOutput());
			if(affectParentDocNum != null && affectParentDocNum.getOutput() != null && affectParentDocNum.getOutput() > 0)
			{
				aa.print("The parent document status has been set to " + parentDocStatusOnResubmit);
			}
		}
	}
}

function disableToBeResubmit(documentID)
{
	//get current document model by documentID
	var adsDocumentModel = aa.document.getDocumentByPK(documentID).getOutput();
	
	if ("RESUBMIT".equals(adsDocumentModel.getCategoryByAction()))
	{
		//get parent seq number
		var checkInDocumentId = adsDocumentModel.getParentSeqNbr();
		if(checkInDocumentId != null || !"".equals(checkInDocumentId))
		{
			//get check-in document by documentID
			var checkInDocument = aa.document.getDocumentByPK(checkInDocumentId).getOutput();
			
			//set original check-in document model's resubmit is false
			checkInDocument.setResubmit(false);
			
			//update original check-in document model
			aa.document.updateDocument(checkInDocument);
		}
	}
}

function emailDocUploadNotification(docGroups,docCategories) {
	var docInfoList = [];
	var docInfoListString = "";
	var newDocModelArr = [];

	newDocModelArr = documentModelArray.toArray();
	
	for (dl in newDocModelArr) {
		if(exists(newDocModelArr[dl]["docGroup"],docGroups) && exists(newDocModelArr[dl]["docCategory"],docCategories) && matches(newDocModelArr[dl]["categoryByAction"],null)) {
			docInfoList.push(" " + newDocModelArr[dl]["docCategory"] + ": " + newDocModelArr[dl]["fileName"]);
		}
	}
	
	if (docInfoList.length >0) {
		//populate email notification parameters
		var emailSendFrom = "";
		var emailSendTo = "";
		var emailCC = "";
		var emailTemplate = "";
		var emailParameters = aa.util.newHashtable();
		var fileNames = [];		
		
		getRecordParams4Notification(emailParameters);
		getAPOParams4Notification(emailParameters);
		var assignedToFullName = "";
		var assignedToEmail = "";
		var assignedTo = getAssignedToStaff();
		if(assignedTo != null) {
				assignedToFullName = aa.person.getUser(assignedTo).getOutput().getFirstName() + " " + aa.person.getUser(assignedTo).getOutput().getLastName();
				if(!matches(aa.person.getUser(assignedTo).getOutput().getEmail(),undefined,"",null)) {
					assignedToEmail =  aa.person.getUser(assignedTo).getOutput().getEmail();
				}	
		}
		addParameter(emailParameters,"$$assignedToFullName$$",assignedToFullName);
		addParameter(emailParameters,"$$assignedToEmail$$",assignedToEmail);
		docInfoListString = docInfoList.toString();
		addParameter(emailParameters,"$$docInfoList$$",docInfoListString);

        //build paramters for DigEplan URL
		var digEplanUrl = lookup("EXTERNAL_DOC_REVIEW","WEB_SERVICE_URL");
		getDigEplanRecordUrl(digEplanUrl);
		getDigEplanRecordUrlParam4Notification(emailParameters,digEplanUrl);


		if(appMatch("eReview/*/*/*")) var emailTemplate = "DUA_INTERNAL NOTIFICATION_UPLOAD";

		sendNotification(emailSendFrom,emailSendTo,emailCC,emailTemplate,emailParameters,fileNames);
	}
}

function emailDocResubmitNotification(docGroups,docCategories) {
	var docInfoList = [];
	var docInfoListString = "";
	var newDocModelArr = [];

	newDocModelArr = documentModelArray.toArray();
	
	for (dl in newDocModelArr) {
		if(exists(newDocModelArr[dl]["docGroup"],docGroups) && exists(newDocModelArr[dl]["docCategory"],docCategories) && matches(newDocModelArr[dl]["categoryByAction"],"RESUBMIT")) {
			docInfoList.push(" " + newDocModelArr[dl]["docCategory"] + ": " + newDocModelArr[dl]["fileName"]);
		}
	}
	
	if (docInfoList.length >0) {
		//populate email notification parameters
		var emailSendFrom = "";
		var emailSendTo = "";
		var emailCC = "";
		var emailTemplate = "";
		var emailParameters = aa.util.newHashtable();
		var fileNames = [];		
		
		getRecordParams4Notification(emailParameters);
		getAPOParams4Notification(emailParameters);
		var assignedToFullName = "";
		var assignedToEmail = "";
		var assignedTo = getAssignedToStaff();
		if(assignedTo != null) {
				assignedToFullName = aa.person.getUser(assignedTo).getOutput().getFirstName() + " " + aa.person.getUser(assignedTo).getOutput().getLastName();
				if(!matches(aa.person.getUser(assignedTo).getOutput().getEmail(),undefined,"",null)) {
					assignedToEmail =  aa.person.getUser(assignedTo).getOutput().getEmail();
				}	
		}
		addParameter(emailParameters,"$$assignedToFullName$$",assignedToFullName);
		addParameter(emailParameters,"$$assignedToEmail$$",assignedToEmail);
		docInfoListString = docInfoList.toString();
		addParameter(emailParameters,"$$docInfoList$$",docInfoListString);
		//build paramters for DigEplan URL
		var digEplanUrl = lookup("EXTERNAL_DOC_REVIEW","WEB_SERVICE_URL");
		getDigEplanRecordUrl(digEplanUrl);
		getDigEplanRecordUrlParam4Notification(emailParameters,digEplanUrl);
		
		if(appMatch("eReview/*/*/*")) emailTemplate = "DUA_INTERNAL NOTIFICATION_RESUBMIT";

		sendNotification(emailSendFrom,emailSendTo,emailCC,emailTemplate,emailParameters,fileNames);
	}
}

function getDigEplanRecordUrl(digEplanUrl) {
	
	var digEplanRecordUrl = "";

   	digEplanRecordUrl = digEplanUrl;   
	digEplanRecordUrl += "" + capId.getCustomID();
	
   	return digEplanRecordUrl;
}

function getDigEplanRecordUrlParam4Notification(params,digEplanUrl) {
	// pass in a hashtable and it will add the additional parameters to the table

	addParameter(params, "$$digEplanRecordUrl$$", getDigEplanRecordUrl(digEplanUrl));
	
	return params;	
}

function synchronizeDocFileNames() {
	docArray = aa.document.getCapDocumentList(capId,currentUserID).getOutput();
	if(docArray != null && docArray.length > 0) {
		for (d in docArray) {
			//logDebug("*Document Name: " + docArray[d].getDocName());
			//logDebug("*File Name: " + docArray[d].getFileName());
			if(docArray[d].getDocName() != docArray[d].getFileName()) {
				var docNameExt = null;
				//logDebug("*-------------*");
				//logDebug("* Document Name: " + docArray[d].getDocName());
				//logDebug("* File Name: " + docArray[d].getFileName());
				
				var fileTypeIndex = docArray[d].getFileName().lastIndexOf(".");
				if(fileTypeIndex>1) var fileExt = docArray[d].getFileName().substring(docArray[d].getFileName().lastIndexOf("."));
				//logDebug("fileExt: " + fileExt);				
				
				var docTypeIndex = docArray[d].getDocName().lastIndexOf(".");
				if(docTypeIndex>1) {
					var docExt = docArray[d].getDocName().substring(docArray[d].getDocName().lastIndexOf("."));
					if(docExt != fileExt) {
						docNameExt = docArray[d].getDocName() + fileExt;
						docArray[d].setDocName(docArray[d].getDocName() + fileExt);
						//logDebug("---UPDATE DOCNAME TO : " + docNameExt);
					} else {
						docNameExt = docArray[d].getDocName();
						//logDebug("----DOCNAME DOESN'T CHANGE : " + docNameExt);
						}
				}
				if(docTypeIndex == -1) {
					docNameExt = docArray[d].getDocName() + fileExt;
					docArray[d].setDocName(docArray[d].getDocName() + fileExt);
					//logDebug(" ---UPDATE DOCNAME TO : " + docNameExt);
				}			

				if(docNameExt != docArray[d].getFileName()){
					logDebug("<font color='blue'>---UPDATE FILE NAME TO: " + docNameExt + "</font>" );
					docArray[d].setFileName(docNameExt);
				}
				docArray[d].setRecStatus("A");
				docArray[d].setSource(getVendor(docArray[d].getSource(), docArray[d].getSourceName()));
				updateDocResult = aa.document.updateDocument(docArray[d]);
			}	
			
		}
	}
}

function updateCheckInDocStatus(documentModel,revisionStatus,approvedStatus,approvedPendingStatus) {
	var docAutoStatus = documentModel["docStatus"]; //logDebug("Original Doc Status: " + docAutoStatus);
	//var docDescription = String(documentModel["docDescription"]); //logDebug("docDescription: " + docDescription);
	var docAutoStatus = getParentDocStatus(documentModel); //logDebug("Parent Doc Status: " + docAutoStatus);
	if(docAutoStatus == revisionStatus) docAutoStatus = revisionStatus;
	if(docAutoStatus == approvedStatus) docAutoStatus = approvedPendingStatus;
    if(docAutoStatus == approvedPendingStatus) docAutoStatus = approvedPendingStatus;
	//logDebug("docAutoStatus: " + docAutoStatus);
	
	if(docAutoStatus != documentModel["docStatus"]) {
		documentModel.setDocStatus(docAutoStatus);
		documentModel.setRecStatus("A");
		documentModel.setSource(getVendor(documentModel.getSource(), documentModel.getSourceName()));
		updateDocResult = aa.document.updateDocument(documentModel);
		logDebug("<font color='blue'>Document Status updated to " + docAutoStatus + "</font>");
	} else {
		logDebug("Document Status not updated.");
	}
	
}

function updateDocPermissionsbyCategory(documentModel,updateCategory) {
	if (documentModel["docCategory"] != updateCategory) {
		documentModel.setDocCategory(updateCategory);
		aa.document.updateDocument(documentModel);
		logDebug("<font color='blue'>Document Category updated to " + updateCategory + "</font>");
	} else {
		logDebug("Document Category not updated.");
	}

}


function getParentDocCategory(documentModel) {
	var parentDocCategory = null;
	var parentDocSeq = documentModel.getParentSeqNbr();
	//logDebug(documentModel.getDocumentNo() + ": " + documentModel.getDocName() + " parent seq # is " + parentDocSeq);
	var parentDocModel = aa.document.getDocumentByPK(parentDocSeq);
	if(parentDocModel != null && parentDocModel.getOutput() != null)
	{
		//Get parent document category
		parentDocCategory = parentDocModel.getOutput().getDocCategory();
		//logDebug(documentModel.getDocumentNo() + ": " + documentModel.getDocName() + " parent category is " + parentDocCategory);
		//logDebug(documentModel.getDocumentNo() + ": " + documentModel.getDocName() + " parent name is " + parentDocModel.getOutput().getDocName());
	}
	return parentDocCategory;
}

function getParentDocStatus(documentModel) {
	var parentDocStatus = null;
	var parentDocSeq = documentModel.getParentSeqNbr();
	//logDebug(documentModel.getDocumentNo() + ": " + documentModel.getDocName() + " parent seq # is " + parentDocSeq);
	var parentDocModel = aa.document.getDocumentByPK(parentDocSeq);
	if(parentDocModel != null && parentDocModel.getOutput() != null)
	{
		//Get parent document status
		parentDocStatus = parentDocModel.getOutput().getDocStatus();
		//logDebug(documentModel.getDocumentNo() + ": " + documentModel.getDocName() + " parent status is " + parentDocStatus);
		//logDebug(documentModel.getDocumentNo() + ": " + documentModel.getDocName() + " parent name is " + parentDocModel.getOutput().getDocName());
	}
	return parentDocStatus;
}

function updateParentDocStatus(documentModel,updateDocStatus) {
	var parentDocModel = null;
	var parentDocSeq = documentModel.getParentSeqNbr();
	//logDebug(documentModel.getDocumentNo() + ": " + documentModel.getDocName() + " parent seq # is " + parentDocSeq);
	var parentDocModel = aa.document.getDocumentByPK(parentDocSeq);
	if(parentDocModel != null && parentDocModel.getOutput() != null)
	{
		logDebug("<font color='blue'>Set Parent Document Status</font>");
		//Set parent document status
		parentDocStatus = parentDocModel.getOutput().setDocStatus(updateDocStatus);
		aa.document.updateDocument(parentDocModel);

	}
}

function checkForPendingReviews(reviewTasksArray,reviewTaskStatusPendingArray) //function checks for all review tasks resulted and/or completed
	{
	var tasksPending = false;
	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
	
	for (i in wfObj)
		{
		var fTask = wfObj[i];
 		if (exists(fTask.getTaskDescription().toUpperCase(),reviewTasksArray))
			{
			//logDebug("Workflow Task: " + fTask.getTaskDescription().toUpperCase() + " Active: " + fTask.getActiveFlag() + " Status: " + fTask.getDisposition())
			if(fTask.getActiveFlag() == "Y" && exists(fTask.getDisposition(),reviewTaskStatusPendingArray)) tasksPending = true;
			}		
		}
		return tasksPending;
}

function updatePlanReviewTasks4Resubmittal(reviewTasksArray,taskStatusArray,reviewTaskResubmittalReceivedStatus) {
	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
	
	for (i in wfObj) {
		var fTask = wfObj[i];
		if (exists(fTask.getTaskDescription().toUpperCase(),reviewTasksArray) && fTask.getDisposition() != null && exists(fTask.getDisposition().toUpperCase(),taskStatusArray)) {
			if(!isTaskActive(fTask.getTaskDescription())) {activateTask(fTask.getTaskDescription());}
			if(!isTaskStatus(fTask.getTaskDescription(),reviewTaskResubmittalReceivedStatus)) updateTask(fTask.getTaskDescription(),reviewTaskResubmittalReceivedStatus,"Documents Resubmitted","Documents Resubmitted");
		}		
	}
}

function digEplanPreCache(client,capId)
{
	var soapresp = "DigEplan precache did not work";
   
	if(getEnvironment() == "NON-PROD") {
		soapresp = aa.util.httpPost('https://api.pre-prod.digeplan.com/api/precache/folders?product=app&client=' + client + '&originalFolderId=' + capId,'').getOutput();
		logDebug("<font color='green'>Calling PRE-PROD V5 API </font>");
	}
	else {
		soapresp = aa.util.httpPost('https://api.usw.digeplan.com/api/precache/folders?product=app&client=' + client + '&originalFolderId=' + capId,'').getOutput();
		logDebug("<font color='green'>Calling PROD V5 API </font>");
	}
	return soapresp;
}

function getEnvironment() {
                var environment = "";
                var acaSite = lookup("ACA_CONFIGS","ACA_SITE");
                if(acaSite.indexOf("https://aca-prod.accela.com/chesterfield/") == 0) {environment = "PROD";}
					else {environment = "NON-PROD";}

                return environment;
}

function enableToBeResubmit(documentID,docStatusArray)
{
	//get current document model by documentID
	var adsDocumentModel = aa.document.getDocumentByPK(documentID).getOutput();
	
	if (exists(adsDocumentModel.getDocStatus(),docStatusArray))
	{
		//set this doc resubmit
		adsDocumentModel.setResubmit(true);
		adsDocumentModel.setCategoryByAction("CHECK-IN");
		adsDocumentModel.setAllowActions("RESBUMIT;ACA_RESUBMIT");
		adsDocumentModel.setDocStatus("Pending Resubmittal");
			
		//update this document model
		aa.document.updateDocument(adsDocumentModel);
	}
}

/*--------END DIGEPLAN EDR CUSTOM FUNCTIONS---------*/