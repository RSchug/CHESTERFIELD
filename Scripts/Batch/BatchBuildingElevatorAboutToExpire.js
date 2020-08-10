/*------------------------------------------------------------------------------------------------------/
| Program: BatchBuildingElevatorAboutToExpire  Trigger: Batch
| Client : Chesterfield County
|
| Version 1.0 - Ray Schug - TruePoint Solutions
|
|   On Building/Permit/Elevator/Master Records based on Quarter:
|       Quarter 1 (Q1 - March) runs on what Dec 1 of every year.
|   	Quarter 2 (Q2 - June) runs on March 1 of every year.
|       Quarter 3 (Q3 - September) runs on June 1 of every year.
|       Quarter 4 (Q4 - December) runs on Sept 1 of every year.
|   When Building/Permit/Elevator/Master Records 'Quarter' field matches date run above then
|       Set the Workflow Task 'Annual Status' to Status of 'Annual Renewal'.
|       Set the Record Status to 'Active-Pending Renewal'.
|
|   A new Task Management Filter will be available to select 'Annual Renewal' Elevators.
|   A new Record List Filter will be available to select 'Active-Pending Renewal' Elevators.
|
|   User can manually update the Elevator Master record based on filter above.  Contacts can be added,
|    Elevator Table can be updated if Out of Service.
/------------------------------------------------------------------------------------------------------*/
function logDebug(dstr) {
    aa.print(dstr);
}
if (aa.env.getValue("ScriptName") == "Test") {
    aa.env.setValue("batchJobName", "Test");
    aa.env.setValue("CurrentUserID", "ADMIN");
    aa.env.setValue("maxRecords", 10);
    aa.env.setValue("Quarter", "Q3 - September");
}
logDebug("batchJobName: " + aa.env.getValue("batchJobName"));
logDebug("CurrentUserID: " + aa.env.getValue("CurrentUserID"));
logDebug("ScriptName: " + aa.env.getValue("ScriptName"));
logDebug("ScriptCode: " + aa.env.getValue("ScriptCode"));
logDebug("EventName: " + aa.env.getValue("EventName"));
/*------------------------------------------------------------------------------------------------------/
| START: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var showDebug = true;					                                  // Set to true to see debug messages in event log and email confirmation
var maxSeconds = 5 * 60;				                                  // Number of seconds allowed for batch run, usually < 5*60
var maxRecords = aa.env.getValue("maxRecords");
if (maxRecords == "" || isNaN(maxRecords)) maxRecords = null;
if (maxRecords) maxRecords = parseInt(maxRecords);

var currentUserID = aa.env.getValue("CurrentUserID");   		// Current User


//Variables needed to log parameters below in eventLog
var sysDate = aa.date.getCurrentDate();
var batchJobID = aa.batchJob.getJobID().getOutput();
var batchJobName = "" + aa.env.getValue("batchJobName");
var agencyName = aa.getServiceProviderCode();

//Global variables
var startDate = new Date(aa.util.now());
var startTime = startDate.getTime();
var batchStartDate = new Date(aa.util.now());                                                         // System Date
var batchStartTime = batchStartDate.getTime();                                           // Start timer
var partialProcessCompletion = false;                                                                 // Variable to identify if batch script has timed out. Defaulted to "false".

var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var capId;                                                  // Variable used to hold the Cap Id value.
var senderEmailAddr = "noreply@accela.com".replace("@","-"+agencyName+"@");                 // Email address of the sender
var emailAddress = "rschug@truepointsolutions.com";         // Email address of the person who will receive the batch script log information
var emailAddress2 = "";                                     // CC email address of the person who will receive the batch script log information
var emailText = "";                                         // Email body

if (isEmptyOrNull(emailAddress) && !isEmptyOrNull(batchJobName)) {
    var batchEngineObj = aa.proxyInvoker.newInstance("com.accela.v360.batchjob.BatchEngineBusiness");
    if (batchEngineObj.getSuccess()) {
        logDebug("agencyName:" + agencyName + " batchJobName:" + batchJobName);
        var batchJob = batchEngineObj.getOutput().getBatchJobByName(agencyName, batchJobName);
        if (batchJob != null) {
            var jobEmailID = batchJob.getEmailID();
            logDebug("fetch email from job details:" + jobEmailID)
            if (!isEmptyOrNull(jobEmailID)) {
                emailAddress = jobEmailID;
            }
        }
    }
}


//Parameter variables
var paramsOK = true;
var paramsAppGroup = "Building";        // Per Group value of the Cap Type that the batch script should process.
var paramsAppType = "Permit";           // Per Type of the Cap Type that the batch script should process.
var paramsAppSubType = "Elevator";      // Per SubType of the Cap Type that the batch script should process.
var paramsAppCategory = "Master";       // Per Category of the Cap Type that the batch script should process.

var paramsAppStatusValid = ["Active", "Active-Pending Renewal"]
// Cap Status that the batch script is supposed to ignore.
var paramsAppStatusInvalid = ["Completed", "Cancelled", "Expired", "Withdrawn", "Revoked", "Suspended"];

var paramsAppSpecInfoLabel = null;
var paramsAppSpecInfoValue = null;

/*
var capSearchBy = "CapModel";
var paramsAppStatus = "Active";         // Cap Status that the batch script is suppose to process.
var capSearchBy = "ASIDate";
var paramsAppSubGroupName = "GENERAL INFORMATION";                      // ASI Subgroup Name that the ASI field is associated to.
var paramsAppSpecInfoLabel = "Permit Expiration Date";      // ASI field name that the batch script is to search.
//var paramsDateFrom = dateAdd(startDate, 150);
//var paramsDateTo = dateAdd(paramsDateFrom, 30);
var paramsDateFrom = dateAdd(startDate, -35);
var paramsDateTo = dateAdd(paramsDateFrom, 5);
var paramsDateTo = "01/01/2022"
*/
var capSearchBy = "ASIField";
var paramsAppSubGroupName = "CC-BLD-CV-WD";               // ASI Subgroup Name that the ASI field is associated to.
var paramsAppSpecInfoLabel = "Annual Quarter";            // ASI field name that the batch script is to search.
var paramsAppSpecInfoValue = aa.env.getValue("Quarter");
if (paramsAppSpecInfoValue == "") paramsAppSpecInfoValue = null;
if (paramsAppSpecInfoValue == null) { // Default based on start Date
    // On Building / Permit / Elevator / Master Records based on Quarter:
    // Quarter 1(Q1 - March) runs on what Dec 1 of every year.
    // Quarter 2(Q2 - June) runs on March 1 of every year.
    // Quarter 3(Q3 - September) runs on June 1 of every year.
    // Quarter 4(Q4 - December) runs on Sept 1 of every year.
    if (startDate.getMonth() == 2) { // March
        paramsAppSpecInfoValue = "Q2 - June";
    } else if (startDate.getMonth() == 5) { // June
        paramsAppSpecInfoValue = "Q3 - September";
    } else if (startDate.getMonth() == 8) { // Sept
        paramsAppSpecInfoValue = "Q4 - December";
    } else if (startDate.getMonth() == 11) { // Dec
        paramsAppSpecInfoValue = "Q1 - March";
    }
}
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 9.0;
var useCustomScriptFile = true;  // if true, use Events->Custom Script and Master Scripts, else use Events->Scripts->INCLUDES_*
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
    useSA = true;
    SA = bzr.getOutput().getDescription();
    bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
    if (bzr.getSuccess()) {
        SAScript = bzr.getOutput().getDescription();
    }
}

var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
var doStdChoices = true; // compatibility default
var doScripts = false;
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
    var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE");
    doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
    var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT");
    doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
    var bvr3 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "USE_MASTER_INCLUDES");
    if (bvr3.getSuccess()) { if (bvr3.getOutput().getDescription() == "No") useCustomScriptFile = false };
}

if (SA) {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
    eval(getScriptText(SAScript, SA));
} else {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_BATCH"));

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}

var showDebug = true;					                                  // Set to true to see debug messages in event log and email confirmation

/*------------------------------------------------------------------------------------------------------/
| END: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var paramsCapType = ""
    + (paramsAppGroup && paramsAppGroup != "" ? paramsAppGroup : "*") + "/"
    + (paramsAppType && paramsAppType != "" ? paramsAppType : "*") + "/"
    + (paramsAppSubType && paramsAppSubType != "" ? paramsAppSubType : "*") + "/"
    + (paramsAppCategory && paramsAppCategory != "" ? paramsAppCategory : "*");
logDebug("paramsCapType: " + paramsCapType);
logDebug("paramsAppStatusValid: " + paramsAppStatusValid);
logDebug("paramsAppStatusInvalid: " + paramsAppStatusInvalid);

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/------------------------------------------------------------------------------------------------------*/
if (paramsOK) {
    logDebug("Start of " + batchJobName + " Batch Job.");

    mainProcess();

    logDebug("Number of Records processed: " + count["cap"] + ".");
    logDebug("End of " + batchJobName + " Batch Job, Elapsed Time : " + elapsed() + " Seconds.");
}

if (emailAddress.length) {
    logDebug("Sending " + batchJobName + " Results to " + emailAddress);
    aa.sendMail(senderEmailAddr, emailAddress, emailAddress2, batchJobName + " Results", emailText);
}

aa.print("emailText: " + emailText);
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/
function mainProcess() {
    //Initialize Counters
    count = [];
    count["cap"] = 0;

    /*
    | Note: Start Date and End Date are defaulted to use the current System Date.
    |       To set the Start Date and End Date to specific values for a manual run
    |       replace the following syntax dateAdd(null,-1) to a string date value
    |       in the following format "MM/DD/YYYY".
    */
    if (capSearchBy == "CapModel") {
        capTypeModel = aa.cap.getCapTypeModel().getOutput();
        capTypeModel.setGroup("ODA");
        capTypeModel.setType("Pre App");
        capTypeModel.setSubType("NA");
        capTypeModel.setCategory("NA");
        // Getting Cap Model
        capModel = aa.cap.getCapModel().getOutput();
        capModel.setCapType(capTypeModel);

        var capTypeModel = aa.cap.getCapTypeModel().getOutput();
        if (paramsAppGroup) capTypeModel.setGroup(paramsAppGroup);
        if (paramsAppType) capTypeModel.setType(paramsAppType);
        if (paramsAppSubType) capTypeModel.setSubType(paramsAppSubType);
        if (paramsAppCategory) capTypeModel.setCategory(paramsAppCategory);
        var capModel = aa.cap.getCapModel().getOutput();
        capModel.setCapType(capTypeModel);
        if (paramsAppStatus) capModel.setCapStatus(paramsAppStatus);
        var capIdResult = aa.cap.getCapIDListByCapModel(capModel);
        //var capIdResult = aa.cap.getByAppType(paramsAppGroup, paramsAppType,paramsAppSubType,paramsAppCategory);
        logDebug("Looking for "
            + (paramsAppGroup ? paramsAppGroup : "*") + "/"
            + (paramsAppType ? paramsAppType : "*") + "/"
            + (paramsAppSubType ? paramsAppSubType : "*") + "/"
            + (paramsAppCategory ? paramsAppCategory : "*") + " CAPS"
            + " with Status: " + paramsAppStatus);
    } else if (capSearchBy == "ASIDate") {
        var dateFrom = aa.date.parseDate(paramsDateFrom);        // Start Date for the batch script to select ASI data on.
        var dateTo = aa.date.parseDate(paramsDateTo);               // End Date for the batch script to select ASI data on.
        logDebug("Looking for "
            + (paramsAppGroup ? paramsAppGroup : "*") + "/"
            + (paramsAppType ? paramsAppType : "*") + "/"
            + (paramsAppSubType ? paramsAppSubType : "*") + "/"
            + (paramsAppCategory ? paramsAppCategory : "*") + " CAPS"
            + " with " + paramsAppSubGroupName + "." + paramsAppSpecInfoLabel
            + " Date Range: " + paramsDateFrom + " - " + paramsDateTo);
        var capIdResult = aa.cap.getCapIDsByAppSpecificInfoDateRange(paramsAppSubGroupName, paramsAppSpecInfoLabel, dateFrom, dateTo);
    } else if (capSearchBy == "ASIField" && paramsAppSpecInfoValue) {
        logDebug("Looking for "
            + (paramsAppGroup ? paramsAppGroup : "*") + "/"
            + (paramsAppType ? paramsAppType : "*") + "/"
            + (paramsAppSubType ? paramsAppSubType : "*") + "/"
            + (paramsAppCategory ? paramsAppCategory : "*") + " CAPS"
            + " with " + paramsAppSpecInfoLabel
            + " of " + paramsAppSpecInfoValue);
        var capIdResult = aa.cap.getCapIDsByAppSpecificInfoField(paramsAppSpecInfoLabel, paramsAppSpecInfoValue);
    } else {
        var capIdResult = false;
    }
    if (capIdResult && !capIdResult.getSuccess()) {
        logDebug("**ERROR: Retreiving Cap Id's by Application Specific field date range: " + capIdResult.getErrorMessage() + ".");
        return false;
    }

    var capIdArray = capIdResult.getOutput(); //Array of CapIdScriptModel Objects
    logDebug("capIdArray.length: " + capIdArray.length);

    for (i in capIdArray) {
        if (maxSeconds && elapsed() > maxSeconds) { // Only continue if time hasn't expired
            logDebug("WARNING: Partial completion of this process caused by script timeout.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
            partialProcessCompletion = true;
            break;
        }
        if (maxRecords && count["cap"] >= maxRecords) { // Only continue if max # of records hasn't been reached.
            logDebug("WARNING: Partial Completion of this process because maximum records reached.  Please re-run.  " + count["cap"] + " records, " + maxRecords + " allowed.");
            partialProcessCompletion = true;
            break;
        }

        capId = capIdArray[i].getCapID(); // CapIDModel Object
        if (capId == null) continue;
        capGroup = null;
        capType = null;
        getCapGlobals(capId);
        //eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
        if (capId != null) {
            capGroup = cap.getCapType().getGroup(); // Cap Type Group
            capType = cap.getCapType().getType(); // Cap Per Type
        }
        count["cap"]++;

        var capIDsFiltered = [];
        var filterReasons = [];
        if (paramsCapType && !appMatch(paramsCapType)) filterReasons.push("CapType");
        if (paramsAppStatusValid && !exists(capStatus, paramsAppStatusValid)) filterReasons.push("CapStatusValid");
        if (paramsAppStatusInvalid && exists(capStatus, paramsAppStatusInvalid)) filterReasons.push("CapStatusInvalid");
        if (false && filterReasons && filterReasons.length > 0) {
            logDebug("Skipped Record: " + capIDString + ", appType: " + appTypeString + ", capStatus: " + capStatus + ", "
                + (paramsAppSpecInfoLabel ? paramsAppSpecInfoLabel + ": " + AInfo[paramsAppSpecInfoLabel] : "")
                + " Reasons: "+filterReasons);
            //capIDsFiltered[capId.getCustomID()]=filterReasons;
            continue;
        }


        if (paramsCapType && !appMatch(paramsCapType)) continue;
        if (paramsAppStatusValid && !exists(capStatus, paramsAppStatusValid)) continue;
        if (paramsAppStatusInvalid && exists(capStatus, paramsAppStatusInvalid)) continue;
        logDebug("Processing Record: " + capIDString + ", appType: " + appTypeString + ", capStatus: " + capStatus + ", "
            + (paramsAppSpecInfoLabel ? paramsAppSpecInfoLabel + ": " + AInfo[paramsAppSpecInfoLabel] : ""));
        count["cap"]++;

        //Set the Workflow Task 'Annual Status' to Status of 'Annual Renewal'.
        //Set the Record Status to 'Active-Pending Renewal'.

        var wfTask = "Annual Status";
        var wfStatus = "Annual Renewal";
        var wfTaskComment = "Updated via Batch Script";
        var wfNote = "";
        var capStatusNew = "Active-Pending Renewal";
        if (wfTask) {
            if (wfStatus && wfStatus != "" && wfStatus != taskStatus(wfTask))
                updateTask(wfTask, wfStatus, wfTaskComment, wfNote);
            cap = aa.cap.getCap(capId).getOutput();
            capStatus = cap.getCapStatus();
            if (capStatus != capStatusNew)
                updateAppStatus(capStatusNew, wfTaskComment);
        }
    }
    return count["cap"];
}

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/

function elapsed() {
    var thisDate = new Date(aa.util.now());
    var thisTime = thisDate.getTime();
    return ((thisTime - batchStartTime) / 1000)
}

// exists:  return true if Value is in Array
function exists(eVal, eArray) {
    for (ii in eArray)
        if (eArray[ii] == eVal) return true;
    return false;
}

function matches(eVal, argList) {
    for (var i = 1; i < arguments.length; i++)
        if (arguments[i] == eVal)
            return true;

}

function isNull(pTestValue, pNewValue) {
    if (pTestValue == null || pTestValue == "")
        return pNewValue;
    else
        return pTestValue;
}

function isEmptyOrNull(value) {
    return value == null || value === undefined || String(value) == "";
}


function logMessage(etype, edesc) {
    aa.eventLog.createEventLog(etype, "Batch Process", batchJobName, sysDate, sysDate, "", edesc, batchJobID);
    aa.print(etype + " : " + edesc);
    emailText += etype + " : " + edesc + "<br />";
}

function logDebug(edesc) {
    if (showDebug) {
        aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, sysDate, sysDate, "", edesc, batchJobID);
        aa.print(edesc);
        emailText += "DEBUG : " + edesc + " <br />";
    }
}

function logDebug(dstr) {
    if (showDebug) {
        aa.print(dstr)
        emailText += dstr + "<br>";
        // disabled to cut down on event log entries.
        //aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
        //aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, aa.date.getCurrentDate(), aa.date.getCurrentDate(), "", dstr, batchJobID);
    }
}

function getCapGlobals(itemCap) {
    capId = null,
        cap = null,
        capIDString = "",
        appTypeResult = null,
        appTypeAlias = "",
        appTypeString = "",
        appTypeArray = new Array(),
        capName = null,
        capStatus = null,
        fileDateObj = null,
        fileDate = null,
        fileDateYYYYMMDD = null,
        parcelArea = 0,
        estValue = 0,
        calcValue = 0,
        houseCount = 0,
        feesInvoicedTotal = 0,
        balanceDue = 0,
        houseCount = 0,
        feesInvoicedTotal = 0,
        capDetail = "",
        AInfo = new Array(),
        partialCap = false,
        feeFactor = "",
        parentCapId = null;

    capId = itemCap;
    if (capId && capId.getCustomID() == null) {
        var s_capResult = aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3());
        if (!s_capResult.getSuccess()) {
            logDebug("**ERROR: Failed to get capId: " + s_capResult.getErrorMessage());
            return null;
        }
        capId = s_capResult.getOutput();
    }
    if (capId != null) {
        servProvCode = capId.getServiceProviderCode();
        capIDString = capId.getCustomID();
        customId = capId.getCustomID(); // Alternate Cap ID string
        cap = aa.cap.getCap(capId).getOutput();
        capGroup = cap.getCapType().getGroup(); // Cap Type Group
        capType = cap.getCapType().getType(); // Cap Per Type
        appTypeResult = cap.getCapType();
        appTypeAlias = appTypeResult.getAlias();
        appTypeString = appTypeResult.toString();
        appTypeArray = appTypeString.split("/");
        if (appTypeArray[0].substr(0, 1) != "_") {
            var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput()
            if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
        }
        capName = cap.getSpecialText();
        capStatus = cap.getCapStatus();
        partialCap = !cap.isCompleteCap();
        fileDateObj = cap.getFileDate();
        fileDate = "" + fileDateObj.getMonth() + "/" + fileDateObj.getDayOfMonth() + "/" + fileDateObj.getYear();
        fileDateYYYYMMDD = dateFormatted(fileDateObj.getMonth(), fileDateObj.getDayOfMonth(), fileDateObj.getYear(), "YYYY-MM-DD");
        var valobj = aa.finance.getContractorSuppliedValuation(capId, null).getOutput();
        if (valobj.length) {
            estValue = valobj[0].getEstimatedValue();
            calcValue = valobj[0].getCalculatedValue();
            feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
        }

        var capDetailObjResult = aa.cap.getCapDetail(capId);
        if (capDetailObjResult.getSuccess()) {
            capDetail = capDetailObjResult.getOutput();
            var houseCount = capDetail.getHouseCount();
            var feesInvoicedTotal = capDetail.getTotalFee();
            var balanceDue = capDetail.getBalance();
        }
        loadAppSpecific(AInfo);
        loadTaskSpecific(AInfo);
        loadParcelAttributes(AInfo);
        loadASITables();
    }


}

function convertDate(thisDate) {

    if (typeof (thisDate) == "string") {
        var retVal = new Date(String(thisDate));
        if (!retVal.toString().equals("Invalid Date"))
            return retVal;
    }

    if (typeof (thisDate) == "object") {

        if (!thisDate.getClass) // object without getClass, assume that this is a javascript date already
        {
            return thisDate;
        }

        if (thisDate.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime")) {
            return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
        }

        if (thisDate.getClass().toString().equals("class com.accela.aa.emse.util.ScriptDateTime")) {
            return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
        }

        if (thisDate.getClass().toString().equals("class java.util.Date")) {
            return new Date(thisDate.getTime());
        }

        if (thisDate.getClass().toString().equals("class java.lang.String")) {
            return new Date(String(thisDate));
        }
        if (thisDate.getClass().toString().equals("class java.sql.Timestamp")) {
            return new Date(thisDate.getMonth() + "/" + thisDate.getDate() + "/" + thisDate.getYear());
        }
    }

    if (typeof (thisDate) == "number") {
        return new Date(thisDate);  // assume milliseconds
    }

    logDebug("**WARNING** convertDate cannot parse date : " + thisDate);
    return null;

}

function dateAdd(td, amt)
// perform date arithmetic on a string
// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
// amt can be positive or negative (5, -3) days
// if optional parameter #3 is present, use working days only
{

    var useWorking = false;
    if (arguments.length == 3)
        useWorking = true;

    if (!td) dDate = new Date(aa.util.now());
    else
        dDate = convertDate(td);

    var i = 0;
    if (useWorking)
        if (!aa.calendar.getNextWorkDay) {
            logDebug("getNextWorkDay function is only available in Accela Automation 6.3.2 or higher.");
            while (i < Math.abs(amt)) {
                dDate.setDate(dDate.getDate() + parseInt((amt > 0 ? 1 : -1), 10));
                if (dDate.getDay() > 0 && dDate.getDay() < 6)
                    i++
            }
        } else {
            while (i < Math.abs(amt)) {
                if (amt > 0) {
                    dDate = new Date(aa.calendar.getNextWorkDay(aa.date.parseDate(dDate.getMonth() + 1 + "/" + dDate.getDate() + "/" + dDate.getFullYear())).getOutput().getTime());
                    i++;
                } else {
                    dDate = new Date(aa.calendar.getPreviousWorkDay(aa.date.parseDate(dDate.getMonth() + 1 + "/" + dDate.getDate() + "/" + dDate.getFullYear())).getOutput().getTime());
                    i++;

                }
            }
        }
    else
        dDate.setDate(dDate.getDate() + parseInt(amt, 10));

    return (dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
} 
