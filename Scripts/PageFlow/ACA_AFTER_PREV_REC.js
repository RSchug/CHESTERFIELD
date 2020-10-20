/*------------------------------------------------------------------------------------------------------/
| Program : ACA_Onload_ASI_APO.js
| Event   : ASI on  1st Pageflow
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Client  : N/A
| Action# : N/A
|
| Notes   : M Becker 12/06/2018 - Created this onload to load existing LP, Applicant, and Site Contact so they do not have to reenter if existing.
|
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; // Set to true to see results in popup window
var showDebug = false; // Set to true to see debug messages in popup window
var debugEmailTo = "";
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var cancel = false;
var useCustomScriptFile = true; // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var scrubApplicant = false;
var scrubContacts = false;
var scrubLPs = true;
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var vScriptName = aa.env.getValue("ScriptCode");
var vEventName = aa.env.getValue("EventName");
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
if (typeof debug === 'undefined') {
    var debug = ""; // Debug String, do not re-define if calling multiple
}
var br = "<BR>"; // Break Tag
var feeSeqList = new Array(); // invoicing fee list
var paymentPeriodList = new Array(); // invoicing pay periods

var SCRIPT_VERSION = 9.0;
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
    if (bvr3.getSuccess()) {
        if (bvr3.getOutput().getDescription() == "No")
            useCustomScriptFile = false
    };
}

if (SA) {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
    eval(getScriptText(SAScript, SA));
} else {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode)
        servProvCode = aa.getServiceProviderCode();
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

if (true) { // override logDebug
    function logDebug(dstr) {
        debug += dstr + br;
        aa.print(dstr);
    }
}
/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
//Log All Environmental Variables as  globals
var params = aa.env.getParamValues();
var keys = params.keys();
var key = null;
while (keys.hasMoreElements()) {
    key = keys.nextElement();
    eval("var " + key + " = aa.env.getValue(\"" + key + "\");");
    logDebug("Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
}

var capModelInited = aa.env.getValue("CAP_MODEL_INITED");
var capModel = aa.env.getValue("CapModel");
if (capModel == "")
    capModel = null;
var currentUserID = aa.env.getValue("CurrentUserID"); // Current User
if (currentUserID == "")
    currentUserID = "ADMIN";
/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
var serverName = java.net.InetAddress.getLocalHost().getHostName(); // Host Name
// From INCLUDES_ACCELA_GLOBALS
var systemUserObj = null; // Current User Object
var currentUserGroup = null; // Current User Group
var publicUserID = null;
var publicUser = false;

if (currentUserID.indexOf("PUBLICUSER") == 0) {
    publicUserID = currentUserID;
    currentUserID = "ADMIN";
    publicUser = true;
}
// Get Public User Email Address
var publicUserEmail = "";
if (publicUserID) {
    var publicUserModelResult = aa.publicUser.getPublicUserByPUser(publicUserID);
    if (publicUserModelResult.getSuccess() || !publicUserModelResult.getOutput()) {
        publicUserEmail = publicUserModelResult.getOutput().getEmail();
        logDebug("publicUserEmail: " + publicUserEmail + " for " + publicUserID)
    } else {
        publicUserEmail = null;
        logDebug("publicUserEmail: " + publicUserEmail);
    }
}
if (publicUserEmail)
    publicUserEmail = publicUserEmail.toLowerCase();

if (currentUserID != null) {
    systemUserObj = aa.person.getUser(currentUserID).getOutput(); // Current User Object
}
// User Email Addresses
var systemUserEmail = "";
if (systemUserObj != null) {
    systemUserEmail = systemUserObj.getEmail();
} else if (currentUserID != null) {
    systemUserObj = aa.person.getUser(currentUserID).getOutput(); // Current User Object
    if (systemUserObj != null) {
        systemUserEmail = systemUserObj.getEmail();
    } else {
        logDebug("User not found: " + currentUserID);
    }
}
if (systemUserEmail)
    systemUserEmail = systemUserEmail.toLowerCase();

var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var servProvCode = aa.getServiceProviderCode();

logDebug("EMSE Script Framework Versions");
logDebug("EVENT TRIGGERED: " + vEventName);
logDebug("SCRIPT EXECUTED: " + vScriptName);
//logDebug("INCLUDE VERSION: " + INCLUDE_VERSION);
logDebug("SCRIPT VERSION : " + SCRIPT_VERSION);
logDebug("GLOBAL VERSION : " + GLOBAL_VERSION);
/*------------------------------------------------------------------------------------------------------*/

var cap = null,
capId = null,
appTypeResult = null,
appTypeAlias = "",
appTypeString = "",
appTypeArray = new Array(),
capName = null,
capStatus = null,
fileDateObj = null,
fileDate = null,
fileDateYYYYMMDD = null,
AInfo = new Array(),
parentCapId = null;

errorMessage = "",
errorCode = "0";

//var currentUserID = aa.env.getValue("CurrentUserID");
//if (currentUserID.indexOf("PUBLICUSER") == 0) { currentUserID = "ADMIN" ; publicUser = true }  // ignore public users

if (capModel != null) {
    cap = capModel;
    capId = capModel.getCapID();
    capIDString = capId.getCustomID();
    appTypeResult = capModel.getCapType();
    appTypeAlias = appTypeResult.getAlias();
    appTypeString = appTypeResult.toString();
    appTypeArray = appTypeString.split("/");

    loadAppSpecific4ACA(AInfo);

    parentCapIdString = "" + cap.getParentCapID();
    if (parentCapIdString) {
        pca = parentCapIdString.split("-");
        parentCapId = aa.cap.getCapID(pca[0], pca[1], pca[2]).getOutput();
    }
    if (parentCapId) {
        parentCap = aa.cap.getCapViewBySingle4ACA(parentCapId);
    }
    logDebug("<B>EMSE Script Results for " + capIDString + "</B>");
    logDebug("capId = " + capId.getClass());
    logDebug("cap = " + cap.getClass());
    logDebug("currentUserID = " + currentUserID + ", email: " + systemUserEmail);
    logDebug("currentUserGroup = " + currentUserGroup);
    logDebug("systemUserObj = " + systemUserObj.getClass());
    logDebug("publicUser = " + publicUserID + ", email: " + publicUserEmail)
    logDebug("appTypeString = " + appTypeString);
    logDebug("appTypeAlias = " + appTypeAlias);
    logDebug("capName = " + capName);
    logDebug("capStatus = " + capStatus);
    logDebug("fileDate = " + fileDate);
    logDebug("fileDateYYYYMMDD = " + fileDateYYYYMMDD);
    logDebug("sysDate = " + sysDate.getClass());
    logDebug("parcelArea = " + parcelArea);
    logDebug("estValue = " + estValue);
    logDebug("calcValue = " + calcValue);
    logDebug("feeFactor = " + feeFactor);
    logDebug("houseCount = " + houseCount);
    logDebug("feesInvoicedTotal = " + feesInvoicedTotal);
    logDebug("balanceDue = " + balanceDue);
    if (parentCapId)
        logDebug("parentCapId = " + parentCapId.getCustomID());

    logGlobals(AInfo);
}
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
// page flow custom code begin
try {
    	showMessage = false; showDebug = false;
    if (capModel && capModelInited != "TRUE" && fromReviewPage != "Y") {
        logDebug("===== capModel ===== ");
        logCapModel(capModel);
        load_lp_contacts(capId);
    }
} catch (err) {
    handleError(err, "Page Flow Script: " + vScriptName);
}
// page flow custom code end

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ErrorCode", "1");
    aa.env.setValue("ErrorMessage", debug);
} else {
    if (cancel) {
        aa.env.setValue("ErrorCode", "-2");
        if (showMessage)
            aa.env.setValue("ErrorMessage", message);
        if (showDebug)
            aa.env.setValue("ErrorMessage", debug);
    } else {
        aa.env.setValue("ErrorCode", "0");
        if (showMessage)
            aa.env.setValue("ErrorMessage", message);
        if (showDebug)
            aa.env.setValue("ErrorMessage", debug);
    }
}

// Send Debug Email
debugEmailSubject = "";
debugEmailSubject += (capIDString ? capIDString + " " : "") + vScriptName + " - Debug";
if (exists(publicUserEmail, ["dboucher@truepointsolutions.com",""]))
    debugEmailTo = "dboucher@truepointsolutions.com";
else if (exists(publicUserEmail, ["dboucher@truepointsolutions.com",""]))
    debugEmailTo = publicUserEmail;
if (debugEmailTo && debugEmailTo != "")
    aa.sendMail("NoReply_Accela@accela.com", debugEmailTo, "", debugEmailSubject, "Debug: " + br + debug);

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/
function load_lp_contacts(targetCapId) {
    //----------------------------------------
    aa.debug("Debug:", "targetCapId:" + targetCapId);
    logDebug("targetCapId:" + targetCapId);

    if (targetCapId == null) {
        logError("targetCapId is null.");
        end();
        return;
    }

    // Get list of valid LP Types depending on Record Type.
    // Get permit associated with the record so contacts and lp can be loaded
    var parentCapIdField = "Case Number", //" " - if you use the code below for different record types
    parentCapIdString = null,
    parentCapId = null;
    /*if (appMatch_local("Development/Building/Pay for Approved/General Construction", targetCapId)) {
        parentCapIdField = "Case Number";
    } else if (appMatch_local("Development/Building/Pay for Approved/Sub-Permit", targetCapId)) {
        parentCapIdField = "Sub-Permit #";
    } else {
        // var parentCapId = getParent(targetCapId);
        parentCapId = capModel.getParentCapID();
        if (parentCapId)
            parentCapIdString = parentCapId.getCustomID();
    } */

	logGlobals(AInfo);
	parentCapIdString = AInfo[parentCapIdField];
	logDebug("parentCapId (" + parentCapIdField + "): " + parentCapIdString);

	if (parentCapIdString)
		parentCapId = aa.cap.getCapID(parentCapIdString).getOutput(); // Cap ID entered as future parent
	if (parentCapId && parentCapIdField != "") { // Set parentCapId
		capModel.setParentCapID(parentCapId);
		logDebug("capModel.setParentCapID(" + capModel.getParentCapID() + "):");
	}
    if (!parentCapId) {
        parentCapId = capModel.getParentCapID();
        if (parentCapId)
            parentCapIdString = parentCapId.getCustomID();
    }
    aa.debug("Debug", "parentCapId:" + parentCapId);
    logDebug("parentCapId (" + parentCapIdField + "): " + parentCapIdString + " " + parentCapId);

    var srcCapId = parentCapId;
    if (arguments.length > 1 && arguments[1])
        srcCapId = arguments[1];

    aa.debug("Debug", "srcCapId:" + srcCapId);
    logDebug("srcCapId: " + srcCapId);

    if (srcCapId == null) {
        if (arguments.length > 1 && arguments[1])
            logError("Source is null.");
        else
            logError("Parent is null.");
        end();
        return;
    }

    try {
        logDebug("===== copying ===== from " + srcCapId + " to " + targetCapId);
        //2. Remove license professionals were sequence #, type or number matches what was given.
        //removeLicenseProfessionals(targetCapId);
		//copy App Name (Project Name)
		copyApplicationName(srcCapId, targetCapId);
		//copy AST information
        copyAppSpecificTable(srcCapId, targetCapId);
        //copy ASI information
        copyAppSpecificInfo(srcCapId, targetCapId);
        //copy License information
        //copyLicenseProfessional(srcCapId, targetCapId);
        //copy Address information
        //copyAddress(srcCapId, targetCapId);
        //copy AST information
        //copyAppSpecificTable(srcCapId, targetCapId);
        //copy Parcel information
        //copyParcel(srcCapId, targetCapId);
        //copy People information
        copyPeople(srcCapId, targetCapId);
        //copy Owner information
        //copyOwner(srcCapId, targetCapId);
        //Copy CAP condition information
        //copyCapCondition(srcCapId, targetCapId);
        //Copy additional info.
        copyAdditionalInfo(srcCapId, targetCapId);
        //Copy Education information.
        // copyEducation(srcCapId, targetCapId);
        //Copy Continuing Education information.
        // copyContEducation(srcCapId, targetCapId);
        //Copy Examination information.
        // copyExamination(srcCapId, targetCapId);

        var amendCapModel = aa.cap.getCapViewBySingle4ACA(targetCapId);
        logDebug("amendCapModel.getCapType().getSpecInfoCode(): " + amendCapModel.getCapType().getSpecInfoCode());
        amendCapModel.getCapType().setSpecInfoCode(capModel.getCapType().getSpecInfoCode());
        amendCapModel.setAppSpecificInfoGroups(capModel.getAppSpecificInfoGroups());
        if (parentCapId && !amendCapModel.getParentCapID())
            amendCapModel.setParentCapID(parentCapId);

        // Fix Component Info for Contacts & Applicant
        // Get the non-Applicant contacts
        logDebug("Scrub component information for Contacts");
        contactList = amendCapModel.getContactsGroup();
        if (contactList && scrubContacts) {
            for (i = 0; i < contactList.size(); i++) {
                var capContactModel = contactList.get(i);
                // Scrub Contact List Sequence Number.
                capContactModel.setCapID(targetCapId);
                var peopleModel = capContactModel.getPeople();
                // Remove contact seq number, this is only for parent cap.
                peopleModel.setContactSeqNumber(null);
                // Update the Label Information for Contact Attributes
                peopleModel.setAttributes(updateContactAttributeFieldLabel(peopleModel.getContactType(), peopleModel.getAttributes()));
                capContactModel.setPeople(peopleModel);
                // Set Component Name based on Contact Type
                var contactType = capContactModel.getContactType();
                var contactTypeComponents = {
                    "Applicant": "Applicant",
                    "Site Contact": "Contact1",
                    "Business": "Contact2"
                };
                //if (typeof(contactTypeComponents[contactType]) != "undefined") capContactModel.setComponentName(contactTypeComponents[contactType]);
                capContactModel.setComponentName(null); // Fix from CRC for contacts not displaying in ACA
                contactList.set(i, capContactModel);
                logDebug("Scrubed contactsGroup[" + i + "]: " + +capContactModel.getCapID() + " " + capContactModel.contactSeqNumber + ", type: " + capContactModel.contactType + ", name: " + capContactModel.contactName + ", component: " + capContactModel.componentName);
            }
        }
        amendCapModel.setContactsGroup(contactList);

        // Scrub the applicant
        logDebug("Scrub component information for Applicant");
        applicantModel = amendCapModel.getApplicantModel();
        if (applicantModel && scrubApplicant) {
            applicantModel.setCapID(targetCapId);
            applicantModel.getPeople().setContactSeqNumber(null);
            //applicantModel.setComponentName("Applicant");
            applicantModel.setComponentName(null); // Fix from CRC for contacts not displaying in ACA
            amendCapModel.setApplicantModel(applicantModel);
            logDebug("Scrubed applicantModel: " + applicantModel.getPeople().getContactSeqNumber() + ", type: " + applicantModel.contactType + ", name: " + applicantModel.contactName + ", component: " + applicantModel.componentName);
        }

        // Display LPs
        logDebug("Scrub component information for License Professionals")
        logDebug("amendCapModel.getLicenseProfessionalList().isEmpty(): " + (amendCapModel.getLicenseProfessionalList() ? ".isEmpty(): " + amendCapModel.getLicenseProfessionalList().isEmpty() : ": " + amendCapModel.getLicenseProfessionalList()));
        var capLicenses = null;
        if (amendCapModel.getLicenseProfessionalList())
            capLicenses = amendCapModel.getLicenseProfessionalList().toArray();
        if (capLicenses && scrubLPs) {
            for (i in capLicenses) {
                capLicProfModel = capLicenses[i];
                if (capLicProfModel.getResLicenseType() == null)
                    capLicProfModel.setResLicenseType(capLicProfModel.getLicenseType()); // 02/14/2019 RS - 91468 Fix Missing License Type
                //capLicProfModel.setComponentName("Licensed Professional");
                //capLicProfModel.setComponentName("License");
                //capLicProfModel.setComponentName("License_697");
                capLicProfModel.setComponentName(null); // Fix for LP not displaying in ACA

                logDebug("Scrubed Licensed Professional[" + i + "]: " +
                    (capLicProfModel.getPrintFlag() == "Y" ? "Primary" : "") + " " + capLicProfModel.getAuditStatus() +
                    " License: #" + capLicProfModel.getLicSeqNbr() + " " + capLicProfModel.getLicenseType() + " " + capLicProfModel.getLicenseNbr() +
                    (capLicProfModel.getBusinessName() ? ", Business: " + capLicProfModel.getBusinessName() : "") +
                    (capLicProfModel.getFullName() ? ", Name: " + capLicProfModel.getFullName() : "") +
                    (capLicProfModel.getLicenseBoard() ? " " + capLicProfModel.getLicenseBoard() : "") +
                    ", component: " + capLicProfModel.getComponentName());

                //logDebug("capLicProfModel[" + i + "]: " + capLicProfModel + br + describe_TPS(capLicProfModel, "function", /(^get.*$)/, true));

            }
        }

        logDebug("===== amendCapModel ===== ");
        logCapModel(amendCapModel);

        aa.env.setValue("CapModel", amendCapModel);
        aa.env.setValue("CAP_MODEL_INITED", "TRUE");
    } catch (e) {
        logError("Error: " + e);
        end();
    }
}

function logCapModel(p_CapModel) {
    logDebug("capModel.getCapID(): " + p_CapModel.getCapID() + " " + p_CapModel.getCapID().getCustomID());
    logDebug("capModel.getParentCapID(): " + p_CapModel.getParentCapID() + (p_CapModel.getParentCapID() ? " " + p_CapModel.getParentCapID().getCustomID() : ""));
    logDebug("capModel.getCapType().getSpecInfoCode(): " + p_CapModel.getCapType().getSpecInfoCode());

    capModel_AInfo = [];
    loadAppSpecific4CapModel(capModel_AInfo, p_CapModel);
    logGlobals(capModel_AInfo);

    // Display non-Applicant contacts
    contactList = p_CapModel.getContactsGroup();
    if (contactList) {
        for (var i = 0; i < contactList.size(); i++) {
            var capContactModel = contactList.get(i);
            logDebug("contactsGroup[" + i + "]: " + capContactModel.getCapID() + " " + capContactModel.contactSeqNumber + ", type: " + capContactModel.contactType +
                ", name: " + capContactModel.contactName + ", component: " + capContactModel.componentName);
        }
    }

    // Display applicant
    applicantModel = p_CapModel.getApplicantModel();
    if (applicantModel) {
        logDebug("applicantModel: " + applicantModel.getPeople().getContactSeqNumber() + ", type: " + applicantModel.contactType +
            ", name: " + applicantModel.contactName + ", component: " + applicantModel.componentName);
    }

    // Display LPs
    var capLicenses = []
    if (p_CapModel.getLicenseProfessionalList())
        capLicenses = p_CapModel.getLicenseProfessionalList().toArray();
    for (loopk in capLicenses) {
        capLicProfModel = capLicenses[loopk];
        logDebug("capLicProfModel[" + loopk + "]: " + (capLicProfModel.getPrintFlag() == "Y" ? "Primary" : "") + " " + capLicProfModel.getAuditStatus() +
            " License: #" + capLicProfModel.getLicSeqNbr() + " " + capLicProfModel.getLicenseType() + " " + capLicProfModel.getLicenseNbr() +
            (capLicProfModel.getBusinessName() ? ", Business: " + capLicProfModel.getBusinessName() : "") +
            (capLicProfModel.getFullName() ? ", Name: " + capLicProfModel.getFullName() : "") +
            (capLicProfModel.getLicenseBoard() ? " " + capLicProfModel.getLicenseBoard() : "") +
            ", component: " + capLicProfModel.getComponentName());
        logDebug("capLicProfModel[" + loopk + "]: " + br + describe_TPS(capLicProfModel, null, null, true));
    }
}

function loadAppSpecific4CapModel(thisArr) {
    // Returns an associative array of App Specific Info
    // Optional second parameter, capModel to load from

    var itemCap = capId;
    var p_CapModel = cap;
    if (arguments.length > 1)
        p_CapModel = arguments[1]; // use cap ID specified in args
    var capASI = p_CapModel.getAppSpecificInfoGroups();
    if (!capASI) {
        logDebug("No ASI for the CapModel");
    } else {
        var i = cap.getAppSpecificInfoGroups().iterator();
        while (i.hasNext()) {
            var group = i.next();
            var fields = group.getFields();
            if (fields != null) {
                var iteFields = fields.iterator();
                while (iteFields.hasNext()) {
                    var field = iteFields.next();
                    if (useAppSpecificGroupName)
                        thisArr[field.getCheckboxType() + "." + field.getCheckboxDesc()] = field.getChecklistComment();
                    else
                        thisArr[field.getCheckboxDesc()] = field.getChecklistComment();
                }
            }
        }
    }
}

function updateContactAttributeFieldLabel(contactType, peopleAttributes) {
    //Fixes copied contact field lables in ACA
    if (peopleAttributes == null ||
        peopleAttributes.size() == 0 ||
        contactType == null ||
        contactType == "") {

        return null;
    }

    var ejbContactAttr = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.ContactAttributeBusiness").getOutput();

    // Paramter 1: Agency Code
    // Paramter 2: Contact Type
    // Paramter 3: Status
    // Paramter 4: Caller ID
    var contactAttributes = ejbContactAttr.getContactAttrFromRContact(servProvCode, contactType, "A", "ADMIN");

    if (contactAttributes != null && contactAttributes.size() > 0) {

        var resultAttributes = aa.util.newArrayList()

            var peopleAttrList = peopleAttributes.toArray();
        var contactAttrList = contactAttributes.toArray();

        for (xx in peopleAttrList) {

            for (yy in contactAttrList) {

                if (peopleAttrList[xx].getServiceProviderCode().toLowerCase().equals(contactAttrList[yy].getServiceProviderCode().toLowerCase()) &&
                    peopleAttrList[xx].getContactType().toLowerCase().equals(contactAttrList[yy].getContactType().toLowerCase()) &&
                    peopleAttrList[xx].getAttributeName().toLowerCase().equals(contactAttrList[yy].getAttributeName().toLowerCase())) {
                    //logDebug("Updated to: " + contactAttrList[yy].getAttributeLabel());
                    peopleAttrList[xx].setAttributeLabel(contactAttrList[yy].getAttributeLabel());
                    break;
                }
            }

            resultAttributes.add(peopleAttrList[xx]);
        }
    }

    return resultAttributes;
}

function appMatch_local(ats) // optional capId or CapID string
{ // Modified from INCLUDES_ACCELA_FUNCTIONS
    //	if optional capId is null then use appTypeArray.
    //	Allow for capID to be passed as java.lang.String class.
    var matchArray = appTypeArray //default to current app
        if (arguments.length > 1 && arguments[1]) {
            matchCapParm = arguments[1];
            if (typeof(matchCapParm) == "string" || matchCapParm.getClass() == "class java.lang.String")
                matchCapId = aa.cap.getCapID(matchCapParm).getOutput(); // Cap ID to check
            else
                matchCapId = matchCapParm;
            if (!matchCapId) {
                logDebug("**WARNING: CapId passed to appMatch was not valid: " + arguments[1]);
                return false
            }
            matchCap = aa.cap.getCap(matchCapId).getOutput();
            matchArray = matchCap.getCapType().toString().split("/");
        }

        var isMatch = true;
    var ata = ats.split("/");
    if (ata.length != 4)
        logDebug("**ERROR in appMatch.  The following Application Type String is incorrectly formatted: " + ats);
    else
        for (xx in ata)
            if (!ata[xx].toUpperCase().equals(matchArray[xx].toUpperCase()) && !ata[xx].equals("*"))
                isMatch = false;
    return isMatch;
}

function logError(error) {
    aa.print(error);
    errorMessage += error + br;
    errorCode = -1;
}

function end() {
    aa.env.setValue("ErrorCode", errorCode);
    aa.env.setValue("ErrorMessage", errorMessage);
}

function getParent(targetCapId) {
    // returns the capId object of the parent.  Assumes only one parent!
    //
    var getCapResult = aa.cap.getProjectParents(targetCapId, 1);
    if (getCapResult.getSuccess()) {
        var parentArray = getCapResult.getOutput();
        if (parentArray.length)
            return parentArray[0].getCapID();
        else {
            aa.print("**WARNING: GetParent found no project parent for this application");
            return false;
        }
    } else {
        aa.print("**WARNING: getting project parents:  " + getCapResult.getErrorMessage());
        return false;
    }
}

function matches(eVal, argList) {
    for (var i = 1; i < arguments.length; i++)
        if (arguments[i] == eVal)
            return true;
}

//
// Functions from ConvertToRealCapAfter4Renew
//
function copyEducation(srcCapId, targetCapId) {
    if (srcCapId != null && targetCapId != null) {
        aa.education.copyEducationList(srcCapId, targetCapId);
    }
}

function copyContEducation(srcCapId, targetCapId) {
    if (srcCapId != null && targetCapId != null) {
        aa.continuingEducation.copyContEducationList(srcCapId, targetCapId);
    }
}

function copyExamination(srcCapId, targetCapId) {
    if (srcCapId != null && targetCapId != null) {
        aa.examination.copyExaminationList(srcCapId, targetCapId);
    }
}

function copyAppSpecificInfo(srcCapId, targetCapId) {
    //1. Get Application Specific Information with source CAPID.
    var appSpecificInfo = getAppSpecificInfo(srcCapId);
    if (appSpecificInfo == null || appSpecificInfo.length == 0) {
        return;
    }
    //2. Set target CAPID to source Specific Information.
    for (loopk in appSpecificInfo) {
        var sourceAppSpecificInfoModel = appSpecificInfo[loopk];

        sourceAppSpecificInfoModel.setPermitID1(targetCapId.getID1());
        sourceAppSpecificInfoModel.setPermitID2(targetCapId.getID2());
        sourceAppSpecificInfoModel.setPermitID3(targetCapId.getID3());
        //3. Edit ASI on target CAP (Copy info from source to target)
        aa.appSpecificInfo.editAppSpecInfoValue(sourceAppSpecificInfoModel);
    }
}

function getAppSpecificInfo(capId) {
    capAppSpecificInfo = null;
    var s_result = aa.appSpecificInfo.getByCapID(capId);
    if (s_result.getSuccess()) {
        capAppSpecificInfo = s_result.getOutput();
        if (capAppSpecificInfo == null || capAppSpecificInfo.length == 0) {
            aa.print("WARNING: no appSpecificInfo on this CAP:" + capId);
            capAppSpecificInfo = null;
        }
    } else {
        aa.print("ERROR: Failed to appSpecificInfo: " + s_result.getErrorMessage());
        capAppSpecificInfo = null;
    }
    // Return AppSpecificInfoModel[]
    return capAppSpecificInfo;
}

function copyLicenseProfessional(srcCapId, targetCapId) {
    // Modified to include additional logDebug statements.
    // Modified to copy Primary or last License Professional
    //1. Get license professionals with source CAPID.
    var capLicenses = getLicenseProfessional(srcCapId);
    if (capLicenses == null || capLicenses.length == 0) {
        logDebug("Skipping copy LP as source doesn't have licenses");
        return;
    }
    //2. Get license professionals with target CAPID.
    var targetLicenses = getLicenseProfessional(targetCapId);
    if (targetLicenses && false) {
        logDebug("Skipping copy LP as target already has " + targetLicenses.length + " licenses");
        logDebug("targetLicenses[0]: " + targetLicenses[0].getLicenseNbr() + " " + targetLicenses[0].getLicenseType());
        return;
    }
    //3. Check to see which licProf is matched in both source and target.
    for (loopk in capLicenses) {
        sourceLicProfModel = capLicenses[loopk];
        //3.1 Set target CAPID to source lic prof.
        sourceLicProfModel.setCapID(targetCapId);

        if (sourceLicProfModel.getPrintFlag() == "Y")
            break; // Only copy Primary or last License Professional
    }

    if (sourceLicProfModel) {
        lpPrimary = sourceLicProfModel.getPrintFlag();
        logDebug((sourceLicProfModel.getPrintFlag() == "Y" ? "Primary" : "") + " License: " + sourceLicProfModel.getLicenseType() + " " + sourceLicProfModel.getLicenseNbr() + " " + sourceLicProfModel.getLicenseNbr());

        targetLicProfModel = null;
        //3.2 Check to see if sourceLicProf exist.
        if (targetLicenses != null && targetLicenses.length > 0) {
            for (loop2 in targetLicenses) {
                if (isMatchLicenseProfessional(sourceLicProfModel, targetLicenses[loop2])) {
                    targetLicProfModel = targetLicenses[loop2];
                    break;
                }
            }
        }

        //3.3 It is a matched licProf model.
        if (targetLicProfModel != null) {
            //3.3.1 Copy information from source to target.
            aa.licenseProfessional.copyLicenseProfessionalScriptModel(sourceLicProfModel, targetLicProfModel);
            // 91468 Fix for missing License Nbr
            targetLicProfModel.setLicenseNbr(sourceLicProfModel.getLicenseNbr());
            if (targetLicProfModel.getLicenseType() == null)
                targetLicProfModel.setLicenseType(sourceLicProfModel.getLicenseType());
            if (targetLicProfModel.getResLicenseType() == null)
                targetLicProfModel.setResLicenseType(sourceLicProfModel.getLicenseType());
            //3.3.2 Edit licProf with source licProf information.
            aa.licenseProfessional.editLicensedProfessional(targetLicProfModel);
            logDebug("Copied LicenseProfessional: " + srcCapId + " to " + targetCapId + " " + sourceLicProfModel.getLicenseType() + " " + sourceLicProfModel.getLicenseNbr());

            //3.4 It is new licProf model.
        } else {
            //3.4.1 Create new license professional.
            aa.licenseProfessional.createLicensedProfessional(sourceLicProfModel);
            logDebug("Created " + sourceLicProfModel.getLicenseType() + " " + sourceLicProfModel.getLicenseNbr() + " to " + targetCapId);
        }
    }

}

function isMatchLicenseProfessional(licProfScriptModel1, licProfScriptModel2) {
    if (licProfScriptModel1 == null || licProfScriptModel2 == null) {
        return false;
    }
    if (licProfScriptModel1.getLicenseType().equals(licProfScriptModel2.getLicenseType()) &&
        licProfScriptModel1.getLicenseNbr().equals(licProfScriptModel2.getLicenseNbr())) {
        return true;
    }
    return false;
}

function getLicenseProfessional(capId) {
    capLicenseArr = null;
    var s_result = aa.licenseProfessional.getLicenseProf(capId);
    if (s_result.getSuccess()) {
        capLicenseArr = s_result.getOutput();
        if (capLicenseArr == null || capLicenseArr.length == 0) {
            aa.print("WARNING: no licensed professionals on this CAP:" + capId);
            capLicenseArr = null;
        }
    } else {
        aa.print("ERROR: Failed to license professional: " + s_result.getErrorMessage());
        capLicenseArr = null;
    }
    return capLicenseArr;
}

function copyAddress(srcCapId, targetCapId) {
    //1. Get address with source CAPID.
    var capAddresses = getAddress(srcCapId);
    if (capAddresses == null || capAddresses.length == 0) {
        return;
    }
    //2. Get addresses with target CAPID.
    var targetAddresses = getAddress(targetCapId);
    //3. Check to see which address is matched in both source and target.
    for (loopk in capAddresses) {
        sourceAddressfModel = capAddresses[loopk];
        //3.1 Set target CAPID to source address.
        sourceAddressfModel.setCapID(targetCapId);
        targetAddressfModel = null;
        //3.2 Check to see if sourceAddress exist.
        if (targetAddresses != null && targetAddresses.length > 0) {
            for (loop2 in targetAddresses) {
                if (isMatchAddress(sourceAddressfModel, targetAddresses[loop2])) {
                    targetAddressfModel = targetAddresses[loop2];
                    break;
                }
            }
        }
        //3.3 It is a matched address model.
        if (targetAddressfModel != null) {

            //3.3.1 Copy information from source to target.
            aa.address.copyAddressModel(sourceAddressfModel, targetAddressfModel);
            //3.3.2 Edit address with source address information.
            aa.address.editAddressWithAPOAttribute(targetCapId, targetAddressfModel);
        }
        //3.4 It is new address model.
        else {
            //3.4.1 Create new address.
            aa.address.createAddressWithAPOAttribute(targetCapId, sourceAddressfModel);
        }
    }
}

function isMatchAddress(addressScriptModel1, addressScriptModel2) {
    if (addressScriptModel1 == null || addressScriptModel2 == null) {
        return false;
    }
    var streetName1 = addressScriptModel1.getStreetName();
    var streetName2 = addressScriptModel2.getStreetName();
    if ((streetName1 == null && streetName2 != null) ||
        (streetName1 != null && streetName2 == null)) {
        return false;
    }
    if (streetName1 != null && !streetName1.equals(streetName2)) {
        return false;
    }
    return true;
}

function getAddress(capId) {
    capAddresses = null;
    var s_result = aa.address.getAddressByCapId(capId);
    if (s_result.getSuccess()) {
        capAddresses = s_result.getOutput();
        if (capAddresses == null || capAddresses.length == 0) {
            aa.print("WARNING: no addresses on this CAP:" + capId);
            capAddresses = null;
        }
    } else {
        aa.print("ERROR: Failed to address: " + s_result.getErrorMessage());
        capAddresses = null;
    }
    return capAddresses;
}

function copyAppSpecificTable(srcCapId, targetCapId) {
    var tableNameArray = getTableName(srcCapId);
    if (tableNameArray == null) {
        return;
    }
    for (loopk in tableNameArray) {
        var tableName = tableNameArray[loopk];
        //1. Get appSpecificTableModel with source CAPID
        var targetAppSpecificTable = getAppSpecificTable(srcCapId, tableName);

        //2. Edit AppSpecificTableInfos with target CAPID
        var aSTableModel = null;
        if (targetAppSpecificTable == null) {
            return;
        } else {
            aSTableModel = targetAppSpecificTable.getAppSpecificTableModel();
        }
        aa.appSpecificTableScript.editAppSpecificTableInfos(aSTableModel,
            targetCapId,
            null);
    }

}

function getTableName(capId) {
    var tableName = null;
    var result = aa.appSpecificTableScript.getAppSpecificGroupTableNames(capId);
    if (result.getSuccess()) {
        tableName = result.getOutput();
        if (tableName != null) {
            return tableName;
        }
    }
    return tableName;
}

function getAppSpecificTable(capId, tableName) {
    appSpecificTable = null;
    var s_result = aa.appSpecificTableScript.getAppSpecificTableModel(capId, tableName);
    if (s_result.getSuccess()) {
        appSpecificTable = s_result.getOutput();
        if (appSpecificTable == null || appSpecificTable.length == 0) {
            aa.print("WARNING: no appSpecificTable on this CAP:" + capId);
            appSpecificTable = null;
        }
    } else {
        aa.print("ERROR: Failed to appSpecificTable: " + s_result.getErrorMessage());
        appSpecificTable = null;
    }
    return appSpecificTable;
}

function copyParcel(srcCapId, targetCapId) {
    //1. Get parcels with source CAPID.
    var copyParcels = getParcel(srcCapId);
    if (copyParcels == null || copyParcels.length == 0) {
        return;
    }
    //2. Get parcel with target CAPID.
    var targetParcels = getParcel(targetCapId);
    //3. Check to see which parcel is matched in both source and target.
    for (i = 0; i < copyParcels.size(); i++) {
        sourceParcelModel = copyParcels.get(i);
        //3.1 Set target CAPID to source parcel.
        sourceParcelModel.setCapID(targetCapId);
        targetParcelModel = null;
        //3.2 Check to see if sourceParcel exist.
        if (targetParcels != null && targetParcels.size() > 0) {
            for (j = 0; j < targetParcels.size(); j++) {
                if (isMatchParcel(sourceParcelModel, targetParcels.get(j))) {
                    targetParcelModel = targetParcels.get(j);
                    break;
                }
            }
        }
        //3.3 It is a matched parcel model.
        if (targetParcelModel != null) {
            //3.3.1 Copy information from source to target.
            var tempCapSourceParcel = aa.parcel.warpCapIdParcelModel2CapParcelModel(targetCapId, sourceParcelModel).getOutput();
            var tempCapTargetParcel = aa.parcel.warpCapIdParcelModel2CapParcelModel(targetCapId, targetParcelModel).getOutput();
            aa.parcel.copyCapParcelModel(tempCapSourceParcel, tempCapTargetParcel);
            //3.3.2 Edit parcel with sourceparcel.
            aa.parcel.updateDailyParcelWithAPOAttribute(tempCapTargetParcel);
        }
        //3.4 It is new parcel model.
        else {
            //3.4.1 Create new parcel.
            aa.parcel.createCapParcelWithAPOAttribute(aa.parcel.warpCapIdParcelModel2CapParcelModel(targetCapId, sourceParcelModel).getOutput());
        }
    }
}

function isMatchParcel(parcelScriptModel1, parcelScriptModel2) {
    if (parcelScriptModel1 == null || parcelScriptModel2 == null) {
        return false;
    }
    if (parcelScriptModel1.getParcelNumber().equals(parcelScriptModel2.getParcelNumber())) {
        return true;
    }
    return false;
}

function getParcel(capId) {
    capParcelArr = null;
    var s_result = aa.parcel.getParcelandAttribute(capId, null);
    if (s_result.getSuccess()) {
        capParcelArr = s_result.getOutput();
        if (capParcelArr == null || capParcelArr.length == 0) {
            aa.print("WARNING: no parcel on this CAP:" + capId);
            capParcelArr = null;
        }
    } else {
        aa.print("ERROR: Failed to parcel: " + s_result.getErrorMessage());
        capParcelArr = null;
    }
    return capParcelArr;
}

function copyPeople(srcCapId, targetCapId) {
    // Modified to allow for optional parameter of contact types to copy.
    var contactTypes = null;
    if (arguments.length > 2)
        contactTypes = arguments[2];
    //1. Get people with source CAPID.
    var capPeoples = getPeople(srcCapId);
    if (capPeoples == null || capPeoples.length == 0) {
        return;
    }
    //2. Get people with target CAPID.
    var targetPeople = getPeople(targetCapId);
    //3. Check to see which people is matched in both source and target.
    for (loopk in capPeoples) {
        sourcePeopleModel = capPeoples[loopk];
        //3.0 skip contact if not in contact types and contact types exists.
        if (contactTypes && !exists(sourcePeopleModel.getCapContactModel().getContactType(), contactTypes))
            continue;
        //3.1 Set target CAPID to source people.
        sourcePeopleModel.getCapContactModel().setCapID(targetCapId);
        targetPeopleModel = null;
        //3.2 Check to see if sourcePeople exist.
        if (targetPeople != null && targetPeople.length > 0) {
            for (loop2 in targetPeople) {
                if (isMatchPeople(sourcePeopleModel, targetPeople[loop2])) {
                    targetPeopleModel = targetPeople[loop2];
                    break;
                }
            }
        }
        logDebug("sourcePeopleModel.getPeople(): " + sourcePeopleModel.getPeople().contactSeqNumber + " " + sourcePeopleModel.getPeople().contactType + " " + sourcePeopleModel.getPeople().contactName);
        //3.3 It is a matched people model.
        if (targetPeopleModel != null) {
            //3.3.1 Copy information from source to target.
            aa.people.copyCapContactModel(sourcePeopleModel.getCapContactModel(), targetPeopleModel.getCapContactModel());
            //3.3.2 Edit People with source People information.
            aa.people.editCapContactWithAttribute(targetPeopleModel.getCapContactModel());
            //3.3.3 It is new People model.
            logDebug("Copied contact " + sourcePeopleModel.getCapContactModel().getContactType() +
                " " + sourcePeopleModel.getCapContactModel().getPeople().getFirstName() +
                " " + sourcePeopleModel.getCapContactModel().getPeople().getLastName());
        }
        //3.4 It is new People model.
        else {
            //3.4.1 Create new people.
            aa.people.createCapContactWithAttribute(sourcePeopleModel.getCapContactModel());
            //3.4.2 It is new People model.
            logDebug("Created contact " + sourcePeopleModel.getCapContactModel().getContactType() +
                " " + sourcePeopleModel.getCapContactModel().getPeople().getFirstName() +
                " " + sourcePeopleModel.getCapContactModel().getPeople().getLastName());
        }
    }
}

function isMatchPeople(capContactScriptModel, capContactScriptModel2) {
    if (capContactScriptModel == null || capContactScriptModel2 == null) {
        return false;
    }
    var contactType1 = capContactScriptModel.getCapContactModel().getPeople().getContactType();
    var contactType2 = capContactScriptModel2.getCapContactModel().getPeople().getContactType();
    var firstName1 = capContactScriptModel.getCapContactModel().getPeople().getFirstName();
    var firstName2 = capContactScriptModel2.getCapContactModel().getPeople().getFirstName();
    var lastName1 = capContactScriptModel.getCapContactModel().getPeople().getLastName();
    var lastName2 = capContactScriptModel2.getCapContactModel().getPeople().getLastName();
    var fullName1 = capContactScriptModel.getCapContactModel().getPeople().getFullName();
    var fullName2 = capContactScriptModel2.getCapContactModel().getPeople().getFullName();
    if ((contactType1 == null && contactType2 != null) ||
        (contactType1 != null && contactType2 == null)) {
        return false;
    }
    if (contactType1 != null && !contactType1.equals(contactType2)) {
        return false;
    }
    if ((firstName1 == null && firstName2 != null) ||
        (firstName1 != null && firstName2 == null)) {
        return false;
    }
    if (firstName1 != null && !firstName1.equals(firstName2)) {
        return false;
    }
    if ((lastName1 == null && lastName2 != null) ||
        (lastName1 != null && lastName2 == null)) {
        return false;
    }
    if (lastName1 != null && !lastName1.equals(lastName2)) {
        return false;
    }
    if ((fullName1 == null && fullName2 != null) ||
        (fullName1 != null && fullName2 == null)) {
        return false;
    }
    if (fullName1 != null && !fullName1.equals(fullName2)) {
        return false;
    }
    return true;
}

function getPeople(capId) {
    capPeopleArr = null;
    var s_result = aa.people.getCapContactByCapID(capId);
    if (s_result.getSuccess()) {
        capPeopleArr = s_result.getOutput();
        if (capPeopleArr == null || capPeopleArr.length == 0) {
            logDebug("WARNING: no People on this CAP:" + capId);
            capPeopleArr = null;
        }
    } else {
        logDebug("ERROR: Failed to People: " + s_result.getErrorMessage());
        capPeopleArr = null;
    }
    return capPeopleArr;
}

function copyOwner(srcCapId, targetCapId) {
    //1. Get Owners with source CAPID.
    var capOwners = getOwner(srcCapId);
    if (capOwners == null || capOwners.length == 0) {
        return;
    }
    //2. Get Owners with target CAPID.
    var targetOwners = getOwner(targetCapId);
    //3. Check to see which owner is matched in both source and target.
    for (loopk in capOwners) {
        sourceOwnerModel = capOwners[loopk];
        //3.1 Set target CAPID to source Owner.
        sourceOwnerModel.setCapID(targetCapId);
        targetOwnerModel = null;
        //3.2 Check to see if sourceOwner exist.
        if (targetOwners != null && targetOwners.length > 0) {
            for (loop2 in targetOwners) {
                if (isMatchOwner(sourceOwnerModel, targetOwners[loop2])) {
                    targetOwnerModel = targetOwners[loop2];
                    break;
                }
            }
        }
        //3.3 It is a matched owner model.
        if (targetOwnerModel != null) {
            //3.3.1 Copy information from source to target.
            aa.owner.copyCapOwnerModel(sourceOwnerModel, targetOwnerModel);
            //3.3.2 Edit owner with source owner information.
            aa.owner.updateDailyOwnerWithAPOAttribute(targetOwnerModel);
        }
        //3.4 It is new owner model.
        else {
            //3.4.1 Create new Owner.
            aa.owner.createCapOwnerWithAPOAttribute(sourceOwnerModel);
        }
    }
}

function isMatchOwner(ownerScriptModel1, ownerScriptModel2) {
    if (ownerScriptModel1 == null || ownerScriptModel2 == null) {
        return false;
    }
    var fullName1 = ownerScriptModel1.getOwnerFullName();
    var fullName2 = ownerScriptModel2.getOwnerFullName();
    if ((fullName1 == null && fullName2 != null) ||
        (fullName1 != null && fullName2 == null)) {
        return false;
    }
    if (fullName1 != null && !fullName1.equals(fullName2)) {
        return false;
    }
    return true;
}

function getOwner(capId) {
    capOwnerArr = null;
    var s_result = aa.owner.getOwnerByCapId(capId);
    if (s_result.getSuccess()) {
        capOwnerArr = s_result.getOutput();
        if (capOwnerArr == null || capOwnerArr.length == 0) {
            aa.print("WARNING: no Owner on this CAP:" + capId);
            capOwnerArr = null;
        }
    } else {
        aa.print("ERROR: Failed to Owner: " + s_result.getErrorMessage());
        capOwnerArr = null;
    }
    return capOwnerArr;
}

function copyCapCondition(srcCapId, targetCapId) {
    //1. Get Cap condition with source CAPID.
    var capConditions = getCapConditionByCapID(srcCapId);
    if (capConditions == null || capConditions.length == 0) {
        return;
    }
    //2. Get Cap condition with target CAPID.
    var targetCapConditions = getCapConditionByCapID(targetCapId);
    //3. Check to see which Cap condition is matched in both source and target.
    for (loopk in capConditions) {
        sourceCapCondition = capConditions[loopk];
        //3.1 Set target CAPID to source Cap condition.
        sourceCapCondition.setCapID(targetCapId);
        targetCapCondition = null;
        //3.2 Check to see if source Cap condition exist in target CAP.
        if (targetCapConditions != null && targetCapConditions.length > 0) {
            for (loop2 in targetCapConditions) {
                if (isMatchCapCondition(sourceCapCondition, targetCapConditions[loop2])) {
                    targetCapCondition = targetCapConditions[loop2];
                    break;
                }
            }
        }
        //3.3 It is a matched Cap condition model.
        if (targetCapCondition != null) {
            //3.3.1 Copy information from source to target.
            sourceCapCondition.setConditionNumber(targetCapCondition.getConditionNumber());
            //3.3.2 Edit Cap condition with source Cap condition information.
            aa.capCondition.editCapCondition(sourceCapCondition);
        }
        //3.4 It is new Cap condition model.
        else {
            //3.4.1 Create new Cap condition.
            aa.capCondition.createCapCondition(sourceCapCondition);
        }
    }
}

function isMatchCapCondition(capConditionScriptModel1, capConditionScriptModel2) {
    if (capConditionScriptModel1 == null || capConditionScriptModel2 == null) {
        return false;
    }
    var description1 = capConditionScriptModel1.getConditionDescription();
    var description2 = capConditionScriptModel2.getConditionDescription();
    if ((description1 == null && description2 != null) ||
        (description1 != null && description2 == null)) {
        return false;
    }
    if (description1 != null && !description1.equals(description2)) {
        return false;
    }
    var conGroup1 = capConditionScriptModel1.getConditionGroup();
    var conGroup2 = capConditionScriptModel2.getConditionGroup();
    if ((conGroup1 == null && conGroup2 != null) ||
        (conGroup1 != null && conGroup2 == null)) {
        return false;
    }
    if (conGroup1 != null && !conGroup1.equals(conGroup2)) {
        return false;
    }
    return true;
}

function getCapConditionByCapID(capId) {
    capConditionScriptModels = null;

    var s_result = aa.capCondition.getCapConditions(capId);
    if (s_result.getSuccess()) {
        capConditionScriptModels = s_result.getOutput();
        if (capConditionScriptModels == null || capConditionScriptModels.length == 0) {
            aa.print("WARNING: no cap condition on this CAP:" + capId);
            capConditionScriptModels = null;
        }
    } else {
        aa.print("ERROR: Failed to get cap condition: " + s_result.getErrorMessage());
        capConditionScriptModels = null;
    }
    return capConditionScriptModels;
}

function copyAdditionalInfo(srcCapId, targetCapId) {
    //1. Get Additional Information with source CAPID.  (BValuatnScriptModel)
    var additionalInfo = getAdditionalInfo(srcCapId);
    if (additionalInfo == null) {
        return;
    }
    //2. Get CAP detail with source CAPID.
    var capDetail = getCapDetailByID(srcCapId);
    //3. Set target CAP ID to additional info.
    additionalInfo.setCapID(targetCapId);
    if (capDetail != null) {
        capDetail.setCapID(targetCapId);
    }
    //4. Edit or create additional infor for target CAP.
    aa.cap.editAddtInfo(capDetail, additionalInfo);
}

//Return BValuatnScriptModel for additional info.
function getAdditionalInfo(capId) {
    bvaluatnScriptModel = null;
    var s_result = aa.cap.getBValuatn4AddtInfo(capId);
    if (s_result.getSuccess()) {
        bvaluatnScriptModel = s_result.getOutput();
        if (bvaluatnScriptModel == null) {
            aa.print("WARNING: no additional info on this CAP:" + capId);
            bvaluatnScriptModel = null;
        }
    } else {
        aa.print("ERROR: Failed to get additional info: " + s_result.getErrorMessage());
        bvaluatnScriptModel = null;
    }
    // Return bvaluatnScriptModel
    return bvaluatnScriptModel;
}

function getCapDetailByID(capId) {
    capDetailScriptModel = null;
    var s_result = aa.cap.getCapDetail(capId);
    if (s_result.getSuccess()) {
        capDetailScriptModel = s_result.getOutput();
        if (capDetailScriptModel == null) {
            aa.print("WARNING: no cap detail on this CAP:" + capId);
            capDetailScriptModel = null;
        }
    } else {
        aa.print("ERROR: Failed to get cap detail: " + s_result.getErrorMessage());
        capDetailScriptModel = null;
    }
    // Return capDetailScriptModel
    return capDetailScriptModel;
}

function getCapId() {
    var s_id1 = aa.env.getValue("PermitId1");
    var s_id2 = aa.env.getValue("PermitId2");
    var s_id3 = aa.env.getValue("PermitId3");

    var s_capResult = aa.cap.getCapIDModel(s_id1, s_id2, s_id3);
    if (s_capResult.getSuccess()) {
        return s_capResult.getOutput();
    } else {
        aa.print("ERROR: Failed to get capId: " + s_capResult.getErrorMessage());
        return null;
    }
}

// Get partial cap id
function getPartialCapID(capid) {
    if (capid == null || aa.util.instanceOfString(capid)) {
        return null;
    }
    //1. Get original partial CAPID  from related CAP table.
    var result = aa.cap.getProjectByChildCapID(capid, "EST", null);
    if (result.getSuccess()) {
        projectScriptModels = result.getOutput();
        if (projectScriptModels == null || projectScriptModels.length == 0) {
            aa.print("ERROR: Failed to get partial CAP with CAPID(" + capid + ")");
            return null;
        }
        //2. Get original partial CAP ID from project Model
        projectScriptModel = projectScriptModels[0];
        return projectScriptModel.getProjectID();
    } else {
        aa.print("ERROR: Failed to get partial CAP by child CAP(" + capid + "): " + result.getErrorMessage());
        return null;
    }
}

function getCapModel(capId, isActive) {
    var capModel = null;
    //If the isActive is true, it will return the active CAP.
    //If the isActive is false, it will return the active or inactive CAP.
    var s_result = aa.cap.getCapByPK(capId, isActive);
    if (s_result.getSuccess()) {
        capModel = s_result.getOutput();
    } else {
        logDebug("ERROR: Failed to get CapModel: " + s_result.getErrorMessage());
        capModel = null;
    }
    return capModel;
}

function removeLicenseProfessionals() {
    var itemCap = capId;
    if (arguments.length > 0 && arguments[0])
        itemCap = arguments[0];
    var licenseNbr = false;
    if (arguments.length > 1)
        licenseNbr = arguments[1];
    var licenseTypes = false;
    if (arguments.length > 2)
        licenseTypes = arguments[2];

    //1. Get license professionals
    var capLicenses = getLicenseProfessional(itemCap);
    if (capLicenses == null || capLicenses.length == 0) {
        return;
    }

    //2. Remove license professionals were sequence #, type or number matches what was given.
    for (capLic in capLicenseArr) {
        var capLicense = capLicenseArr[capLic];
        if (licenseNbr && licenseNbr == capLicense.getLicenseNbr() + "")
            continue;
        if (licenseTypes && !exists(capLicense.getLicenseType() + "", licenseTypes))
            continue;
        var removeResult = aa.licenseProfessional.removeLicensedProfessional(capLicenseArr[capLic]);
        if (removeResult.getSuccess())
            logDebug("(removeLicenseProfessionals) removed license professional: " + capLicense.getLicenseType() + " " + capLicense.getLicenseNbr() +
                " from record " + itemCap.getCustomID());
        else
            logDebug("(removeLicenseProfessionals) removed license professional: " + capLicense.getLicenseType() + " " + capLicense.getLicenseNbr() +
                " from record " + itemCap.getCustomID() + " : " + removeResult.getErrorMessage());
    }
}

function describe_TPS(obj) {
    // Modified from describe to also include typeof & class of object; seperate Properties from Functions; Sort them; additional arguments.
    var newLine = "\n";
    //	var newLine = br;
    //var newLine = "<BR>";
    var newLine = "<BR>\n";
    var ret = "";
    var oType = null;
    var oNameRegEx = /(^set.*$)/; // find set functions
    var oNameRegEx = /(^get.*$)/; // find get functions
    var oNameRegEx = null;
    var verbose = false;
    if (arguments.length > 1)
        oType = arguments[1];
    if (arguments.length > 2)
        oNameRegEx = arguments[2];
    if (arguments.length > 3)
        verbose = arguments[3];
    if (obj == null) {
        ret += ": null";
        return ret;
    }
    try {
        ret += "typeof(): " + typeof(obj) + (obj && obj.getClass ? ", class: " + obj.getClass() : "") + newLine;
        var oPropArray = new Array();
        var oFuncArray = new Array();
        if (oType == null)
            oType = "*";
        for (var i in obj) {
            if (oNameRegEx && !oNameRegEx.test(i)) {
                continue;
            }
            if ((oType == "*" || oType == "function") && typeof(obj[i]) == "function") {
                oFuncArray.push(i);
            } else if ((oType == "*" || oType == "property") && typeof(obj[i]) != "function") {
                oPropArray.push(i);
            }
        }
        // List Properties
        oPropArray.sort();
        for (var i in oPropArray) {
            n = oPropArray[i];
            oValue = obj[n];
            if (oValue && oValue.getClass) {
                //				logDebug(n + " " + oValue.getClass());
                if (oValue.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime"))
                    oValue += " " + (new Date(oValue.getEpochMilliseconds()));
                if (oValue.getClass().toString().equals("class com.accela.aa.emse.util.ScriptDateTime"))
                    oValue += " " + (new Date(oValue.getEpochMilliseconds()));
                // if (oValue.getClass().toString().equals("class java.util.Date")) oValue += " " + convertDate(oValue);
            }
            ret += "property:" + n + " = " + oValue + newLine;
        }
        // List Functions
        oFuncArray.sort();
        for (var i in oFuncArray) {
            n = oFuncArray[i];
            oDef = String(obj[n]).replace("\n", " ").replace("\r", " ").replace(String.fromCharCode(10), " ").replace(String.fromCharCode(10), " ")
                x = oDef.indexOf(n + "()", n.length + 15);
            if (x > 15)
                x = x + n.length + 1;
            oName = (verbose ? oDef : "function:" + n + "()"); // Include full definition of function if verbose
            oValue = ((n.toString().indexOf("get") == 0 && x > 0) ? obj[n]() : ""); // Get function value if "Get" function and no parameters.
            if (oValue && oValue.getClass) {
                //				logDebug(n + " " + oValue.getClass());
                if (oValue.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime"))
                    oValue += " " + (new Date(oValue.getEpochMilliseconds()));
                if (oValue.getClass().toString().equals("class com.accela.aa.emse.util.ScriptDateTime"))
                    oValue += " " + (new Date(oValue.getEpochMilliseconds()));
                // if (oValue.getClass().toString().equals("class java.util.Date")) oValue += " " + convertDate(oValue);
            }
            ret += oName + " = " + oValue + newLine;
        }
    } catch (err) {
        showDebug = 3;
        var context = "describe_TPS(" + obj + ")";
        logDebug("ERROR: An error occured in " + context + " Line " + err.lineNumber + " Error:  " + err.message);
        logDebug("Stack: " + err.stack);
    }
    return ret;
}