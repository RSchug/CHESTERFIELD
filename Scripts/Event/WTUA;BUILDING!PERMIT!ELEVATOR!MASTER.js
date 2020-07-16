// WTUA:Building/Permit/Elevator/Master
// After the Submit button is selected an Administrative Fee with a Qty of 1 and Fee of $57 will automatically be added
addFee("NEWINSTALL","CC-BLD-ELEVATOR","FINAL",1,"Y");
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
if (wfTask == 'Annual Status' && wfStatus == 'Pending Renewal') {
    var newCapId = null, newAppTypeString = null, newAppTypeArray = null;
    logDebug("Checking what License to Create");
    var newAppTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + "Renewal";
    var newCapName = capName;
    var newCapIdString = null; // capIDString.substr(0, (capIDString.length - 1)) + 'L';
    if (newCapIdString) logDebug("newCapIdString: " + newCapIdString);
    var newCapRelation = "Child";
    var srcCapId = capId;
    var copySections = null; // Use Default (most common sections).
    var initStatus = null;
    var expField = null;
    var expFieldValue = null;
    var expMonths = 12;
    var expDateField = "Permit Expiration Date";
    var expDate = null;
    if (appMatch("Building/Permit/AmusementDevice/Installation")) {
        newCapRelation = "Parent";
    } else if (appMatch("Building/Permit/Elevator/Installation")) {
        expField = 'Annual Quarter'
        expFieldValue = getAppSpecific(expField, capId);
        if (expFieldValue == 'Q1 - March') {
            expDate = "03/31/" + thisYear;
        } else if (expFieldValue == 'Q2 - June') {
            expDate = "06/30/" + thisYear;
        } else if (expFieldValue == 'Q3 - September') {
            expDate = "09/30/" + thisYear;
        } else {
            expFieldValue = 'Q4 - December';
            expDate = "12/31/" + thisYear; //nextYear
        }
        expDate = getAppSpecific(expDateField, capId);
    }
    logDebug("Expiration Date: " + expDate);
    //expDate = (expMonths ? dateAddMonths(expDate, expMonths) : expDate);
    //logDebug("New Expiration Date: " + expDate);

    if (newAppTypeString) newAppTypeArray = newAppTypeString.split("/");
    if (newAppTypeArray.length == 4) {
        var newCapId = createCap_TPS(newAppTypeString, newCapName, newCapIdString, newCapRelation, srcCapId, copySections, initStatus);
    }
    var newCapIdString = null;
    if (newCapId) {
        // This code gives the License the same # as tha APP 
        newCapIdString = newCapId.getCustomID();
        var editIdString = capIDString.substr(0, 14) + 'R';
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
    updateTask('Annual Status', 'In Service', '', '');
}

// If setting the License status manually from the workflow
if (wfTask == 'Annual Status' && wfStatus == 'Pending Renewal') {
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
