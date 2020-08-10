/*------------------------------------------------------------------------------------------------------/
| Program: BatchBuildingPermitsAboutToExpire  Trigger: Batch    
| Client : Chesterfield County
|
| Version 1.0 - Keith Hobday - TruePoint Solutions
|
|   Building/Permit/~/~
|   30 days before Permit Expiration 
|       if Record Status is not 'Issued' then add Adhoc Task 'Inactive Application',
|       if Record Status is 'Issued' then add Adhoc Task 'Inactive Permit'.
|
/------------------------------------------------------------------------------------------------------*/
if (aa.env.getValue("ScriptName") == "Test") {
    aa.env.setValue("batchJobName","Test");
    aa.env.setValue("CurrentUserID", "ADMIN");
    aa.env.setValue("maxRecords", 100);
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

//Global variables
var startDate = new Date(aa.util.now());
var startTime = startDate.getTime();
var batchStartDate = new Date(aa.util.now());                                                         // System Date
var batchStartTime = batchStartDate.getTime();                                           // Start timer
var partialProcessCompletion = false;                                                                 // Variable to identify if batch script has timed out. Defaulted to "false".

var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var capId;                                                  // Variable used to hold the Cap Id value.
var senderEmailAddr = "noreply@accela.com";                 // Email address of the sender
var emailAddress = "rschug@truepointsolutions.com";         // Email address of the person who will receive the batch script log information
var emailAddress2 = "";                                     // CC email address of the person who will receive the batch script log information
var emailText = "";                                         // Email body
//Parameter variables
var paramsOK = true;
var paramsAppGroup = "Building";        // Per Group value of the Cap Type that the batch script should process.
var paramsAppType = "Permit";           // Per Type of the Cap Type that the batch script should process.
var paramsAppSubType = "*";      // Per SubType of the Cap Type that the batch script should process.
var paramsAppCategory = "*";       // Per Category of the Cap Type that the batch script should process.

// Cap Status that the batch script is suppose to process.
var paramsAppStatusValid = ["Submitted", "Pending Applicant", "In Review", "Ready to Issue", "Issued", "Temporary CO Issued", "CO Ready to Issue", "Pending Certificate", "CO Issued", "Partial CO Issued", "Reinstated", "Extended", ""]
var paramsAppStatusValid = null;
// Cap Status that the batch script is supposed to ignore.
var paramsAppStatusInvalid = ["Completed", "Cancelled", "Expired", "Withdrawn"];

var paramsAppSubGroupName = "GENERAL INFORMATION";                                      // Application Spec Info Subgroup Name that the ASI field is associated to.
var paramsAppSpecInfoLabel = "Permit Expiration Date";                                   // ASI field name that the batch script is to search.

//var paramsDateFrom = dateAdd(startDate, 150);
//var paramsDateTo = dateAdd(paramsDateFrom, 30);
var paramsDateFrom = dateAdd(startDate, 25);
var paramsDateTo = dateAdd(paramsDateFrom, 5);

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

if (emailAddress.length)
    aa.sendMail(senderEmailAddr, emailAddress, emailAddress2, batchJobName + " Results", emailText);

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
    var dateFrom = aa.date.parseDate(paramsDateFrom);        // Start Date for the batch script to select ASI data on.
    var dateTo = aa.date.parseDate(paramsDateTo);               // End Date for the batch script to select ASI data on.
    logDebug("Looking for " + paramsAppSubGroupName + "." + paramsAppSpecInfoLabel + " with Date Range: " + paramsDateFrom + " - " + paramsDateTo);

    var getCapIdResult = aa.cap.getCapIDsByAppSpecificInfoDateRange(paramsAppSubGroupName, paramsAppSpecInfoLabel, dateFrom, dateTo);
    if (!getCapIdResult.getSuccess()) {
        logDebug("**ERROR: Retreiving Cap Id's by Application Specific field date range: " + getCapIdResult.getErrorMessage() + ".");
        return false;
    }

    var capIdArray = getCapIdResult.getOutput(); //Array of CapIdScriptModel Objects
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

        var capIDsFiltered = [];
        var filterReasons = [];
        if (paramsCapType && !appMatch(paramsCapType)) filterReasons.push("CapType");
        if (appMatch("Building/Permit/Elevator/Master")) filterReasons.push("Elevator Master");
        if (paramsAppStatusValid && !exists(capStatus, paramsAppStatusValid)) filterReasons.push("CapStatusValid");
        if (paramsAppStatusInvalid && exists(capStatus, paramsAppStatusInvalid)) filterReasons.push("CapStatusInvalid");
        if (filterReasons && filterReasons.length > 0) {
            logDebug("Skipped Record: " + capIDString + ", appType: " + appTypeString + ", capStatus: " + capStatus + ", "
                + (paramsAppSpecInfoLabel ? paramsAppSpecInfoLabel + ": " + AInfo[paramsAppSpecInfoLabel] : "")
                + " Reasons: " + filterReasons);
            //capIDsFiltered[capId.getCustomID()]=filterReasons;
            continue;
        }


        if (paramsCapType && !appMatch(paramsCapType)) continue;
        if (paramsAppStatusValid && !exists(capStatus, paramsAppStatusValid)) continue;
        if (paramsAppStatusInvalid && exists(capStatus, paramsAppStatusInvalid)) continue;
        logDebug("Processing Record: " + capIDString + ", appType: " + appTypeString + ", capStatus: " + capStatus + ", " + paramsAppSpecInfoLabel + ": " + AInfo[paramsAppSpecInfoLabel]);
        count["cap"]++;

        //Expire Building Caps that have a Cap Status of "Issued".
        var adHocProcess = "ADHOC_WORKFLOW";
        var adHocTask = "Inactive Application";
        if (capStatus == "Issued") adHocTask = "Inactive Permit";
        var adHocNote = "";
        var adHocTaskStatus = "About to Expire";
//        var adHocTaskStatus = null;
        var adHocTaskComment = "Updated via batch script";
        // If adHocTask does not exist add it.
        if (adHocTask) {
            var tasks = loadTasks(capId);
            if (typeof (tasks[adHocTask]) == "undefined") {
                logDebug("Adding Workflow Task " + adHocTask);
                addAdHocTask(adHocProcess, adHocTask, adHocNote);
            }
            if (adHocTaskStatus && adHocTaskStatus != "" && adHocTaskStatus != taskStatus(adHocTask))
                updateTask(adHocTask, adHocTaskStatus, adHocTaskComment, adHocNote)
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
