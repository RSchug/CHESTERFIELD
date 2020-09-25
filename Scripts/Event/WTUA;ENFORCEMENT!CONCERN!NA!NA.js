//
/* 1CE When: Workflow Task = 'Community Enhancement' and Task Status = 'Inspection Required PM'
 THEN:  deactive Community Enhancement Workflow Task
        create child Enforcement / Property Maintenance / NA / NA record
        schedule "Initial" inspection for next day on Child Record and assign inspection Based on Inspector GIS Layer and add the Custom Fields Data from Parent record that is checked to the Inspection Request field on the Child Record
        copy Custom Fields Data from Parent record that is checked to the Inspection Request field on the Child Record
        CC-ENF-ZONE >  CC-ENF-PROAC or CC-ENF-ZONE
*/
if (wfTask == 'Community Enhancement' && wfStatus == 'Inspection Required PM') {
    deactivateTask("Community Enhancement");
    var checkedItems = getAppSpecificFieldLabels(null, ["CC-ENF-VIOT"], null, ["CHECKED"], ["Checkbox"]);
    logDebug("Violations: " + checkedItems);
    newChildID = createChild("Enforcement","Property Maintenance","NA","NA","");
    if (newChildID) {
        var newInspId = scheduleInspection_TPS("Initial", 1, null, null, "Auto Scheduled from Concern Record: " + checkedItems, newChildID);
        var iInspector = assignInspection_CHESTERFIELD(newInspId, null, newChildID);
        //copyAppSpecific(newChildID);
    }
}

if (wfTask == 'Community Enhancement' && wfStatus == 'Inspection Required ZC') {
    deactivateTask("Community Enhancement");
    var checkedItems = getAppSpecificFieldLabels(null, ["CC-ENF-VIOT"], null, ["CHECKED"], ["Checkbox"]);
    logDebug("Violations: " + checkedItems);
    newChildID = createChild("Enforcement","Zoning Code Compliance","NA","NA","");
    if (newChildID) {
        var newInspId = scheduleInspection_TPS("Initial", 1, null, null, "Auto Scheduled from Concern Record: " + checkedItems, newChildID);
        var iInspector = assignInspection_CHESTERFIELD(newInspId, null, newChildID);
        //copyAppSpecific(newChildID);
        saveCapId = capId;
        capId = newChildID;
        deactivateTask("Initiation");
        activateTask("Investigation");
        capId = saveCapId;
        //copyAppSpecific(newChildID);
    }
}

if (wfTask == 'Community Enhancement' && wfStatus == 'Inspection Required PM and ZC') {
    deactivateTask("Community Enhancement");
    var checkedItems = getAppSpecificFieldLabels(null, ["CC-ENF-VIOT"], null, ["CHECKED"], ["Checkbox"]);
    logDebug("Violations: " + checkedItems);
    newChildID = createChild("Enforcement","Property Maintenance","NA","NA","");
    if (newChildID) {
        var newInspId = scheduleInspection_TPS("Initial", 1, null, null, "Auto Scheduled from Concern Record: " + checkedItems, newChildID);
        var iInspector = assignInspection_CHESTERFIELD(newInspId, null, newChildID);
        //copyAppSpecific(newChildID);
    }
    newChildID = createChild("Enforcement","Zoning Code Compliance","NA","NA","");
    if (newChildID) {
        var newInspId = scheduleInspection_TPS("Initial", 1, null, null, "Auto Scheduled from Concern Record: " + checkedItems, newChildID);
        var iInspector = assignInspection_CHESTERFIELD(newInspId, null, newChildID);
        //copyAppSpecific(newChildID);
        saveCapId = capId;
        capId = newChildID;
        deactivateTask("Initiation");
        activateTask("Investigation");
        capId = saveCapId;
        //copyAppSpecific(newChildID);
    }
}

if (wfTask == 'Community Enhancement' && wfStatus == 'KCB Workorder'){
    newChildID = createChild("Enforcement","KCB Workorder","NA","NA","");
    if (newChildID) {
        saveCapId = capId;
        capId = newChildID;
        updateTask("Initiation","Pending Review","Updated based on Concern Record","");
        capId = saveCapId;
        copyAppSpecific(newChildID);
    }
}
//Variables for the CE Inspector based on Parcel field "Council Dist" and Standard Choice
if (wfTask == 'Concern Intake' && matches(wfStatus,"Referred","KCB Work Order")) {
	if (isTaskActive("Community Enhancement")) {
	assignTask_CHESTERFIELD("Community Enhancement", null, null, null, "Enforcement");
	}
}