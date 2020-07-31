// WTUA:Building/Permit/Residential/Multi-Family
// 59B: When Application Submitted is 'Accepted - Plan Review Required' or 'Accepted - Plan Review Not Required' then create Unit Records under the Structure - which is associated by the count of Number of Units. And each Unit should have Address that are listed on the Multi-Family.
if (wfTask == "Application Submitted" && exists(wfStatus,["Accepted - Plan Review Required","Accepted - Plan Review Not Required"]) && parentCapId){
    var units = parseInt(AInfo["Number of Units"]);
    if (isNaN(units)) units = 0;
    var saveCapId = capId;
    for (var uu = 0; uu < units; uu++) {
        copySections = ["Addresses", "ASI", "ASIT", "Cap Short Notes", "Conditions", "Contacts", "GIS Objects", "Owners", "Parcels"]; // Excludes Additional Info, Cap Detail, Conditions, Comments, Contacts, LPs, Detailed Description, Documents, Education, ContEducation, Examination
        var newCapId = createCap_TPS("Building/Unit/NA/NA", capName + " Unit " + uu, null, "Child", parentCapId, copySections);
        comment("New child Building Unit[" + uu + "]: " + (newCapId ? newCapId.getCustomID() : newCapId)
        + " for "+(parentCapId? parentCapId.getCustomID():parentCapId) );
        // capId = newChildID;
        // branchTask("Application Submittal", "Accepted - Plan Review Not Required", "Issued as MultiUnit", "")
        capId = saveCapId;
    }
    capId = saveCapId;
}
// 60B: When Review Consolidation is 'Approved' then create the Residential/NA Building Permit records for each Unit. Copy all information to the Building Permit.  Each Building Permit will be set to Application Submittal - Accepted - No Plan Review Required and at Permit Issuance workflow task. 
if (wfTask == "Review Consolidation" && wfStatus == "Approved" && parentCapId) {
    logDebug("Updating Units");
    var units = parseInt(AInfo["Number of Units"]);
    if (isNaN(units)) units = 0;
    var saveCapId = capId;
    var childArray = getChildren("Building/Unit/NA/NA", parentCapId);
    if (childArray == null || childArray == false) childArray = [];
    for (var uu in childArray) {
        capId = childArray[uu];
        comment("Updating child Building Unit[" + uu + "]: " + (capId ? capId.getCustomID() : capId)
            + " for " + (parentCapId ? parentCapId.getCustomID() : parentCapId));
        resultWorkflowTask("Application Submittal", "Accepted - Plan Review Not Required", "Approved as Mult-Family", "")
        capId = saveCapId;
    }
    capId = saveCapId;
}

