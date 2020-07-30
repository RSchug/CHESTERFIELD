// ASIUA:Building/Permit/Elevator/Installation

// Update Elevator Table on Structure
// Get Commercial: Parent of Elevator Installation
var tableName = "CC-BLD-ELEVATOR";
var tableElevators = loadASITable(tableName);
if (typeof (tableElevators) != "object") tableElevators = null;
if (tableElevators && tableElevators.length > 0) {  
    // Get Structure from parent
    var capIdsStructure = getParents_TPS("Building/Structure/NA/NA");
    if (!(capIdsCommercial && capIdsCommercial.length > 0)) {
        // Get Structure from parent of Commercial
        var capIdsCommercial = getParents_TPS("Building/Permit/Commercial/NA");
        var capIdCommercial = (capIdsCommercial && capIdsCommercial.length > 0 ? capIdsCommercial[0] : null);
        logDebug("capIdCommercial: " + (capIdCommercial ? " " + capIdCommercial.getCustomID() : capIdCommercial));
        // Get Structure: Parent of Commercial.
        var capIdsStructure = (capIdCommercial ? getParents_TPS("Building/Structure/NA/NA") : null);
    }
    var capIdStructure = (capIdsStructure && capIdsStructure.length > 0 ? capIdsStructure[0] : null);
    logDebug("capIdStructure: " + (capIdStructure ? " " + capIdStructure.getCustomID() : capIdStructure));
    if (capIdStructure && appMatch("Building/Structure/NA/NA", capIdStructure)){
        removeASITable("Elevators", capIdStructure);
        addASITable(tableName, tableElevators, capIdStructure);
    }
}
