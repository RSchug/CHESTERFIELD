/*------------------------------------------------------------------------------------------------------/
| Program : ACA Page Flow Template.js
| Event   : ACA Page Flow Template
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Client  : Chesterfield
| Action# : ACA CHECK PARCEL
|
| Notes   : 09-2020 Boucher created for Multiple parcel pull and check from a table
|
/------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = true; // Set to true to see results in popup window
var showDebug = true; // Set to true to see debug messages in popup window
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var cancel = false;
var useCustomScriptFile = true; // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var debugEmailTo = "";
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag

var useAppSpecificGroupName = false;

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
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
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

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));
eval(getScriptText("INCLUDES_PAGEFLOW"));

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

var cap = aa.env.getValue("CapModel");
var parentId = cap.getParentCapID();
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString(); // Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/"); // Array of application type string
var AInfo = new Array(); // Create array for tokenized variables
var capId = cap.getCapID();
//var capId = null; // needed for next call

var serverName = java.net.InetAddress.getLocalHost().getHostName(); // Host Name

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
if (publicUserEmail) publicUserEmail = publicUserEmail.replace("TURNED_OFF","").toLowerCase();
logDebug("publicUserEmail: " + publicUserEmail);
// Set Debug User if TPS User.
if (publicUserEmail && debugEmailTo == "") {
	if (publicUserEmail.indexOf("@truepointsolutions.com") > 0) 	debugEmailTo = publicUserEmail;
}
logDebug("debugEmailTo: " + debugEmailTo);
if (debugEmailTo != "") { showDebug = true; } 

// page flow custom code begin
try {
	logDebug("Begin Custom Code");

	if (typeof (ParcelValidatedNumber) == "undefined") {
		ParcelValidatedNumber = null;
		loadASITables4ACA_TPS();// Load ASITables into Arrays
	}
	if (typeof (CCPLNSTMN) != "undefined") { // Check if ASITable array exists. 
		logDebug("ASITable: CCPLNSTMN");
		for (var rr in CCPLNSTMN) {
			var eachRow = CCPLNSTMN[rr];
			var rParcelID = (eachRow["Parcel ID"] ? eachRow["Parcel ID"] :"");
			//logDebug("CCPLNSTMN["+rr+"][Parcel ID]:"+rParcelID);
			if (!rParcelID) continue;

			showMessage = true;
			comment('<B><Font Color=RED>WARNING: Here is the Parcel Id you entered: ' + rParcelID + '.</B></Font>');

			var paArray = [];
			loadXAPOParcelAttributesTPSinternal(paArray, rParcelID);

			eachRow["Property address"] = paArray['ParcelAttribute.Subdivision'];
			eachRow["Parcel acreage"] = paArray['ParcelAttribute.ParcelArea'];
			logDebug("Parcel: " + rParcelID + ", address: " + eachRow["Property address"] + ", acres: " + eachRow["Parcel acreage"]);

			if (eachRow["Parcel acreage"] != null) {
				cancel = true;
				showMessage = true;
				comment('<B><Font Color=RED>WARNING: Here is the Parcel: ' + rParcelID + ' Address: ' + eachRow["Property address"] + ' and the Parcel Acreage: ' + eachRow["Parcel acreage"] + '.</B></Font>');
			}
		}
	}

	logDebug("End Custom Code")
} catch (err) {
    logDebug("Error in pageflow ACA_CHECK_PARCEL, err: " + err + ". " + err.stack);
	debugEmailSubject = "";
	debugEmailSubject += (capIDString ? capIDString + " " : (capModel && capModel.getCapID ? capModel.getCapID() + " " : "")) + vScriptName + " - ERROR";
	aa.sendMail("NoReply-" + servProvCode + "@accela.com", debugEmailTo, "", debugEmailSubject, "Debug: " + br + debug);
	showDebug = false;
}

// Send Debug Email
if (debugEmailTo != "") {
	debugEmailSubject = "";
	debugEmailSubject += (capIDString ? capIDString + " " : (capModel && capModel.getCapID ? capModel.getCapID() + " " : "")) + vScriptName + " - Debug";
	logDebug("Sending Debug Message to "+debugEmailTo);
	aa.sendMail("NoReply-" + servProvCode + "@accela.com", debugEmailTo, "", debugEmailSubject, "Debug: \r" + br + debug);
	showDebug = false;
}
// page flow custom code end

if (aa.env.getValue("ScriptName") == "Test") { 	// Print Debug
	var z = debug.replace(/<BR>/g, "\r"); aa.print(">>> DEBUG: \r" + z);
	showDebug = true;
}

if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", debug);
} else {
	if (cancel) {
		aa.env.setValue("ErrorCode", "-2");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		//if (showDebug)
		//	aa.env.setValue("ErrorMessage", debug);
	} else {
		aa.env.setValue("ErrorCode", "0");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		//if (showDebug)
		//	aa.env.setValue("ErrorMessage", debug);
	}
}
function loadXAPOParcelAttributesTPSinternal(thisArr) {
	try {
		// Modified version of the loadParcelAttributesTPS()
		// Returns an associative array of Parcel Attributes and XAPO data
		// Optional second parameter, parcel number to load from
		// If no parcel is passed, function is using the ParcelValidatedNumber variable defined in the "BEGIN Event Specific Variables" list in ApplicationSubmitBefore

		//var parcelNum = ParcelValidatedNumber;

		if (arguments.length == 2)
			parcelNum = arguments[1]; // use parcel number specified in args

		var fParcelObj = null;
		var parcelResult = aa.parcel.getParceListForAdmin(parcelNum, null, null, null, null, null, null, null, null, null);

		if (!parcelResult.getSuccess()) {
			logDebug("**ERROR: Failed to get Parcel object: " + parcelResult.getErrorType() + ":" + parcelResult.getErrorMessage());
			return null;
		}
		//var fParcelObj = null;
		var parcels = parcelResult.getOutput();
		for (pp in parcels) {
			logDebug("parcels[" + pp + "]: " + parcels[pp].getParcelModel().parcel);
			fParcelObj  = parcels[pp];
			break;
		}
		if (fParcelObj == null) { logDebug("Parcel #" + parcelNum + " not found."); return null; }
		var fParcelModel = fParcelObj.parcelModel;
		var parcelArea = 0;
		parcelArea += fParcelModel.getParcelArea();
		var parcelAttrObj = fParcelModel.getParcelAttribute().toArray();

		for (z in parcelAttrObj)
			thisArr["ParcelAttribute." + parcelAttrObj[z].getB1AttributeLabel()] = parcelAttrObj[z].getValue();

		// Explicitly load some standard values
		
		thisArr["ParcelAttribute.Block"] = fParcelModel.getBlock();
		thisArr["ParcelAttribute.Book"] = fParcelModel.getBook();
		thisArr["ParcelAttribute.CensusTract"] = fParcelModel.getCensusTract();
		thisArr["ParcelAttribute.CouncilDistrict"] = fParcelModel.getCouncilDistrict();
		thisArr["ParcelAttribute.ExemptValue"] = fParcelModel.getExemptValue();
		thisArr["ParcelAttribute.ImprovedValue"] = fParcelModel.getImprovedValue();
		thisArr["ParcelAttribute.InspectionDistrict"] = fParcelModel.getInspectionDistrict();
		thisArr["ParcelAttribute.LandValue"] = fParcelModel.getLandValue();
		thisArr["ParcelAttribute.LegalDesc"] = fParcelModel.getLegalDesc();
		thisArr["ParcelAttribute.Lot"] = fParcelModel.getLot();
		thisArr["ParcelAttribute.MapNo"] = fParcelModel.getMapNo();
		thisArr["ParcelAttribute.MapRef"] = fParcelModel.getMapRef();
		thisArr["ParcelAttribute.ParcelStatus"] = fParcelModel.getParcelStatus();
		thisArr["ParcelAttribute.SupervisorDistrict"] = fParcelModel.getSupervisorDistrict();
		thisArr["ParcelAttribute.Tract"] = fParcelModel.getTract();
		thisArr["ParcelAttribute.PlanArea"] = fParcelModel.getPlanArea();
		thisArr["ParcelAttribute.Subdivision"] = fParcelModel.getSubdivision();
		thisArr["ParcelAttribute.ParcelArea"] = fParcelModel.getParcelArea();
	} catch (err) {
		logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
	}
}
function loadASITables4ACA_TPS() {
 	// Loads App Specific tables into their own array of arrays.  Creates global array objects
	// Optional parameter, cap ID to load from.  If no CAP Id specified, use the capModel
	var itemCap = capId;
	if (arguments.length == 1) {
		itemCap = arguments[0]; // use cap ID specified in args
		var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
	}
	else {
		var gm = cap.getAppSpecificTableGroupModel()
	}
	var ta = gm.getTablesMap();
	var tai = ta.values().iterator();
	while (tai.hasNext()) {
		var tsm = tai.next();
		if (tsm.rowIndex.isEmpty()) continue;  // empty table
			var tempObject = new Array();
			var tempArray = new Array();
			var tn = tsm.getTableName();
			tn = String(tn).replace(/[^a-zA-Z0-9]+/g,'');
		if (!isNaN(tn.substring(0,1))) tn = "TBL" + tn  // prepend with TBL if it starts with a number
			var tsmfldi = tsm.getTableField().iterator();
			var tsmcoli = tsm.getColumns().iterator();
			var numrows = 1;
		while (tsmfldi.hasNext()) { // cycle through fields
			if (!tsmcoli.hasNext()) { // cycle through columns
				var tsmcoli = tsm.getColumns().iterator();
				tempArray.push(tempObject);  // end of record
				var tempObject = new Array();  // clear the temp obj
				numrows++;
			}
			var tcol = tsmcoli.next();
			var tval = tsmfldi.next();  //.getInputValue();
			tempObject[tcol.getColumnName()] = tval;
		}
	tempArray.push(tempObject);  // end of record
	var copyStr = "" + tn + " = tempArray";
	logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
	eval(copyStr);  // move to table name
	}
}