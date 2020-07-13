function scheduleInspection_CHESTERFIELD(inspType) {
    // TODO: Update with GIS Info based on record type or insp type.
    // 07/10/2020 RS: Modified from INCLUDES_ACCELA_FUNCTION to also identify inspector
     // optional inspector ID.  This function requires dateAdd function
    // DQ - Added Optional 4th parameter inspTime Valid format is HH12:MIAM or AM (SR5110) 
    // DQ - Added Optional 5th parameter inspComm ex. to call without specifying other options params scheduleInspection("Type",5,null,null,"Schedule Comment");
    var DaysAhead = (arguments.length > 1 && arguments[1] != null ? arguments[1] : 1);
    var inspectorId = (arguments.length > 2 && arguments[2] != null ? arguments[2] : null);
    var inspTime = (arguments.length > 3 && arguments[3] != null ? arguments[3] : null);
    var inspComm = (arguments.length > 4 && arguments[4] != null ? arguments[4] : "Scheduled via Script");
    var useWorking = (arguments.length > 5 && arguments[5] == true ? true : false);

    // Determine GIS Info to use for inspector id or inspection district.
    gisLayerField = null;
    if (appMatch("Enforcement/*/*/*")) {
        gisLayerName = "Enforcement Boundaries";
        gisLayerAbbr = "Enforcement Boundaries";
        gisLayerField = "InspectorID";
    }
    if (inspectorId == null && gisLayerField != null) { // Auto assign inspector based on GIS
        inspectionArea = getGISInfo(gisMapService, gisLayerName, gisLayerField);
        // Check for inspection district mapping to inspectors
        inspectorId = lookup("USER_DISTRICTS", gisLayerAbbr + "-" + inspectionArea);
        if (typeof (inspectorId) == "undefined") inspectorId = inspectionArea;
        if (inspectorId == "") inspectorId == null;
        // Check for valid inspector id.
        if (inspectorId) {
            iNameResult = aa.person.getUser(inspectorId);
            if (!iNameResult.getSuccess()) { 
                logDebug("ERROR: retrieving user model " + inspectorId + " : " + iNameResult.getErrorMessage());
                inspectorId = null; 
            }
        }
    }
    if (inspectorId == null && !publicUser) inspectorId = currentUserID; // Default to current user if no user found.
    inspDate = null;
    if (useWorking) {
        inspDate = dateAdd(td, amt, true);

    }
    if (inspDate) {
        logDebug("inspDate: " + inspDate);
        scheduleInspectDate(inspType, inspDate, inspectorId, inspTime, inspComm);
    } else {
        scheduleInspection(inspType, DaysAhead, inspectorId, inspTime, inspComm);
    }
    // assignCapInspector(inspectorId);
}
