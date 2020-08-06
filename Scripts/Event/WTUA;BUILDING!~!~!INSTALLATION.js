//Alex Charlton added for renewals 092619
//RS Fixed for all installation records ()
// 8B: For Elevator Installation Record when Workflow Task 'Certificate of Inspection' is 'Completed' then create a related 'Building/Permit/Elevator/Annual' Record as the Parent.
var newCapId = null, newCapAppType = null;
today = new Date(aa.util.now());
if (typeof (startDate) != "undefined") today = startDate;
thisMonth = today.getMonth();
thisYear = today.getFullYear();
nextYear = thisYear + 1;
logDebug("Today: " + today + ", month: " + thisMonth + ", year: " + thisYear + ", Next Year: " + nextYear);

var newCapId = null, newAppTypeString = null, newAppTypeArray = null;
if (wfTask == 'Certificate of Inspection' && wfStatus == 'Completed') {
      var newCapId = null, newAppTypeString = null, newAppTypeArray = null;
      logDebug("Checking what License to Create");
      var newAppTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + "License";
      var newCapName = capName;
      var newCapIdString = null; // capIDString.substr(0, (capIDString.length - 1)) + 'L';
      if (newCapIdString) logDebug("newCapIdString: " + newCapIdString);
      var newCapRelation = "Parent";
      var srcCapId = capId;
      var copySections = null; // Use Default (most common sections).
      var initStatus = "Active";
      var expField = null;
      var expFieldValue = null;
      var expType = 'Annual'
      var expMonths = 12;
      var expDateField = "Permit Expiration Date";
      var expDate = null;
      var capIdStructure = null;
      if (appMatch("Building/Permit/AmusementDevice/Installation")) {
            newAppTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + "NA";
            newCapIdString = null;
            newCapRelation = "Parent";
            annualQuarter = null;
      } else if (appMatch("Building/Permit/Elevator/Installation")
            && AInfo["Commercial or Residential"] == "Commercial") {
            newAppTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + "Master";
            newCapIdString = null;
            copySections = ["Addresses", "ASI", "ASIT", "Cap Name", "Cap Short Notes", "Conditions", "GIS Objects", "Owners", "Parcels"]; // Excludes Additional Info, Cap Detail, Conditions, Contacts, LPs, Comments, Detailed Description, Documents, Education, ContEducation, Examination

            expField = 'Annual Quarter'
            expType = 'Annual'
            if (today.getMonth() < 3) {
                  expFieldValue = 'Q1 - March';
                  expDate = "03/31/" + thisYear;
            } else if (today.getMonth() < 6) {
                  expFieldValue = 'Q2 - June';
                  expDate = "06/30/" + thisYear;
            } else if (today.getMonth() < 9) {
                  expFieldValue = 'Q3 - September';
                  expDate = "09/30/" + thisYear;
            } else {
                  expFieldValue = 'Q4 - December';
                  expDate = "12/31/" + thisYear; //nextYear
            }
      }
      logDebug("Expiration Date: " + expDate);
      expDate = (expMonths ? dateAddMonths(expDate, expMonths) : expDate);
      logDebug("New Expiration Date: " + expDate);

      if (newAppTypeString) newAppTypeArray = newAppTypeString.split("/");
      if (newAppTypeArray.length == 4) {
            var newCapId = createCap_TPS(newAppTypeString, newCapName, newCapIdString, newCapRelation, srcCapId, copySections, initStatus, sysDateMMDDYYYY, sysDateMMDDYYYY);
      }
      var newCapIdString = null;
      if (newCapId) {
            // This code gives the License the same # as tha APP 
            newCapIdString = newCapId.getCustomID();
            var editIdString = capIDString.substr(0, 14) + 'A';
            logDebug("newCapId: " + newCapId + ", newCapIdString: " + newCapIdString + ", editIdString: " + editIdString);
            if (editIdString) {   // Update Record ID
                  aa.cap.updateCapAltID(newCapId, editIdString);
                  // get newCapId object with updated capId.
                  var s_capResult = aa.cap.getCapID(editIdString);
                  if (s_capResult.getSuccess() && s_capResult.getOutput()) {
                        newCapId = s_capResult.getOutput();
                        newCapIdString = newCapId.getCustomID();
                  } else {
                        logDebug("ERROR: updating Cap ID " + newCapIdString + " to " + editIdString + ": " + s_capResult.getErrorMessage());
                  }
            } else {
                  newCapIdString = newCapId.getCustomID();
            }

            // ************START expiration Date code Options 
            logDebug("Setting expiration info");
            if (expField) { // Update expiration field: Annual Quarter or License Duration
                  editAppSpecific(expField, expFieldValue, newCapId)
            }
            var expFieldValue = getAppSpecific(expField, newCapId);

            if (expDate) {              // set the expiration date
                  if (expDateField) {     // set custom field with expiration date
                        editAppSpecific(expDateField, expDate, newCapId)
                  } else {                // set expiration Info
                        try {
                              logDebug("NEW expiration Status: Active, Date: " + expDate);
                              var thisLic = new licenseObject(newCapIdString, newCapId);
                              if (thisLic) {
                                    thisLic.setStatus("Active");
                                    thisLic.setExpiration(dateAdd(expDate, 0));
                              }
                        } catch (err) {
                              logDebug("ERROR: Updating expiration Status: Active, Date: " + expDate + ": " + err);
                        }
                  }
            }

      }
      // ******************END expiration Date code Options
      updateTask('Annual Status','In Service','','');
      if (newCapId && appMatch("Building/Permit/Elevator/Installation")
            && AInfo["Commercial or Residential"] == "Commercial") {
            // Update Elevator Table on Structure
            // Get Commercial: Parent of Elevator Installation
            var tableName = "CC-BLD-ELEVATOR";
            var tableElevators = loadASITable(tableName);
            if (typeof (tableElevators) != "object") tableElevators = null;
            if (tableElevators && tableElevators.length > 0) {
                  // Check for Commercial as parent of current
                  var capIdsCommercial = (parentCapId && appMatch("Building/Permit/Commercial/NA", parentCapId) ? [parentCapId] : getParents_TPS("Building/Permit/Commercial/NA"));
                  var capIdCommercial = (capIdsCommercial && capIdsCommercial.length > 0 ? capIdsCommercial[0] : null);
                  logDebug("capIdCommercial: " + (capIdCommercial ? " " + capIdCommercial.getCustomID() : capIdCommercial));
                  // Check for Structure as parent of current
                  var capIdsStructure = (parentCapId && appMatch("Building/Structure/NA/NA", parentCapId) ? [parentCapId] : getParents_TPS("Building/Structure/NA/NA"));
                  var capIdStructure = (capIdsStructure && capIdsStructure.length > 0 ? capIdsStructure[0] : null);
                  if (!capIdStructure) {
                        // Check for Structure as parent of Commercial
                        var capIdsStructure = (capIdCommercial ? getParents_TPS("Building/Structure/NA/NA", capIdCommercial) : null);
                        var capIdStructure = (capIdsStructure && capIdsStructure.length > 0 ? capIdsStructure[0] : null);
                  }
                  logDebug("capIdStructure: " + (capIdStructure ? " " + capIdStructure.getCustomID() : capIdStructure));
                  if (capIdStructure) {
                        updateASITable_TPS(tableName, ["Name/ID#"], capIdStructure, capId);
                        // removeASITable(tableName, capIdStructure);
                        // addASITable(tableName, tableElevators, capIdStructure);
                        // Make Structure parent of Master
                        var linkResult = aa.cap.createAppHierarchy(capIdStructure, newCapId);
                        if (linkResult.getSuccess()) 
                              logDebug("Successfully linked to Parent Application : " + capIdStructure.getCustomID() + " of  " + newCapId.getCustomID());
                        else
                              logDebug("**ERROR: linking to Parent Application  : " + capIdStructure.getCustomID() + " of  " + newCapId.getCustomID() + ": " + linkResult.getErrorMessage());
                        if (newCapId && capIdCommercial) { // Remove Install from Commercial if Master exists.
                              var linkResult = aa.cap.removeAppHierarchy(capIdCommercial, capId);
                              if (linkResult.getSuccess())
                                    logDebug("Successfully removed linked to Parent Application : " + capIdCommercial.getCustomID());
                              else
                                    logDebug("**ERROR: removing linking to Parent Application  (" + capIdCommercial.getCustomID() + "): " + linkResult.getErrorMessage());
                        }
                  }

            } else {
                  comment("Elevators missing")
            }
      }
}

// If setting the License status manually from the workflow
if (wfTask == 'Annual Status' && wfStatus == 'About to Expire') {
      try {
            logDebug("Updating expiration Status: About to Expire");
            var thisLic = new licenseObject(capIDString);
            if (thisLic) {
                  thisLic.setStatus("About to Expire");
            }
      } catch (err) {
            logDebug("ERROR: Updating expiration Status: Active, Date: " + expDate + ": " + err);
      }
}
