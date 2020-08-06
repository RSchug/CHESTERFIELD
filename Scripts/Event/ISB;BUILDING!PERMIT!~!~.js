//Temporarily turned off until Selectron and ACA in place to use these
// ISB:BUILDING/PERMIT/*/*
// Permit must be Issued or Temporary CO Issued, except Site Visit Inspection
if (inspType != "Site Visit" && (!wasCapStatus(["Issued", "Temporary CO Issued"]))) {
        showMessage = true;
        comment('<font size=small><b>Record must be Issued to schedule inspections</b></font>');
        // if (!exists(vEventName, ["InspectionMultipleScheduleAfter", "InspectionMultipleScheduleBefore"])) 
        cancel = true;
}
// Parent Permit must be Issued
if (inspType != "Site Visit") {
        var parentAppTypes = null;
        if (exists(appTypeArray[3], ["Boiler", "Fire", "Gas", "Mechanical", "Plumbing"])) {
                var parentAppTypes = ["Building/Permit/Commercial/NA", "Building/Permit/Residential/NA", "Building/Permit/Residential/Multi-Family"];
        } else if (exists(appTypeArray[3], ["Electrical"])) { // Includes Elevator & Sign 
                var parentAppTypes = ["Building/Permit/Commercial/NA", "Building/Permit/Residential/NA", "Building/Permit/Residential/Multi-Family", "Building/Permit/Elevator/Installation", "Building/Permit/Sign/NA"];
        } else if (appMatch("Building/Permit/Elevator/Installation")) {
                var parentAppTypes = ["Building/Permit/Commercial/NA", "Building/Permit/Residential/NA", "Building/Permit/Residential/Multi-Family"];
        }
        if (parentAppTypes) {
                logDebug("Checking parentCap: " + (parentCapId ? parentCapId.getCustomID() : parentCapId) + " was issued");
        }
        if (parentAppTypes && parentCapId && !wasCapStatus(["Issued", "Temporary CO Issued"], parentCapId)) {
                showMessage = true;
                comment('<font size=small><b>Parent Record ' + (parentCapId ? parentCapId.getCustomID() : parentCapId) + ' must be Issued to schedule inspections</b></font>');
                // if (!exists(vEventName, ["InspectionMultipleScheduleAfter", "InspectionMultipleScheduleBefore"])) 
                cancel = true;
        }
}
