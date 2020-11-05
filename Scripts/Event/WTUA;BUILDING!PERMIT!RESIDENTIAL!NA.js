//if (wfTask == "Review Distribution" && wfStatus == "Routed for Review"){
//	deactivateTask("Structural Review");
//	activateTask("Addressing Review");
//	deactivateTask("Budget Review");
//	deactivateTask("Utilities Review");
//	deactivateTask("Environmental Engineering Review");
//}
//if (wfTask == "Application Submittal" && AInfo['Nature of Work'] == "Additions, Porches and Chimney" && (wfStatus == "Accepted - Plan Review Required" || wfStatus == "Accepted - Plan Review Not Required")){
// updateFee("CC_BLD_12","CC-BLD-RESIDENTIAL","FINAL",1,"N");
// updateFee("CC_BLD_02","CC-BLD-RESIDENTIAL","FINAL",1,"N");
// updateFee("CC-BLD-G-001","CC-BLD-GENERAL","FINAL",1,"N");
//}
//if (wfTask == "Review Distribution" && wfStatus == "Routed for Review" && AInfo['Nature of Work'] == "Additions, Porches and Chimney"){
// deactivateTask("Addressing Review");
// deactivateTask("Budget and Management Review");
//deactivateTask("Environmental Engineering Review");
// deactivateTask("Environmental Health Review");
// deactivateTask("Non Structural Review");
//deactivateTask("Planning Review");
//deactivateTask("Structural Review");
// deactivateTask("Transportation Review");
//deactivateTask("Utilities Review");
//}
// 10-13-19 Keith added to create AUX Permits when Building is issued
//if (wfTask == "Permit Issuance" && wfStatus == "Issued"){
//   newChildID = createChild("Building","Permit","Residential","AuxiliaryElectrical",""); copyAppSpecific(newChildID); comment("New Elec Permit app id = "+ newChildID);
//    saveCapId = capId;
//    capId = newChildID;
//    closeTask("Application Submittal","Accepted","Issued as MultiUnit","")
//    closeTask("Permit Issuance","Issued","Issued as MultiUnit","")
//    capId = saveCapId;
//   newChildID = createChild("Building","Permit","Residential","AuxiliaryMechanical",""); copyAppSpecific(newChildID); comment("New Mech Permit app id = "+ newChildID);
//    saveCapId = capId;
//    capId = newChildID;
//    closeTask("Application Submittal","Accepted","Issued as MultiUnit","")
//    closeTask("Permit Issuance","Issued","Issued as MultiUnit","")
//    capId = saveCapId;
//   newChildID = createChild("Building","Permit","Residential","AuxiliaryPlumbing",""); copyAppSpecific(newChildID); comment("New Plum Permit app id = "+ newChildID);
//    saveCapId = capId;
//    capId = newChildID;
//    closeTask("Application Submittal","Accepted","Issued as MultiUnit","")
//    closeTask("Permit Issuance","Issued","Issued as MultiUnit","")
//    capId = saveCapId;
//    }
if (wfTask =='Inspections' && wfStatus == 'Amendment Submitted') {
    var newAppTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + "Amendment";
    if (appMatch("Building/Permit/Residential/NA"))
        var newAppTypeString = "Building/Permit/Residential/Amendment";
    var newCapName = capName;
    var newCapIdString = getNextChildCapId(capId, newAppTypeString, "-");
    var newCapRelation = "Child";
    var srcCapId = capId;
    var newCapId = createCap_TPS(newAppTypeString, newCapName, newCapIdString, newCapRelation, srcCapId);
    if (newCapId) {
        showMessage = true;
        comment("<b>Created " + (newCapRelation ? newCapRelation + " " : "")
            + "Amendment: <b>" + newCapId.getCustomID() + "</b> " + newAppTypeString);
        if (wfComment && wfComment != "") {
            cWorkDesc = workDescGet(capId);
            nWorkDesc = cWorkDesc + ", " + wfComment;
            updateWorkDesc(nWorkDesc, newCapId);
        }
        // set the Permit Expiration Date to 180 days from Application Date.
        var expDateField = "Permit Expiration Date";
        var expDate = jsDateToASIDate(new Date(dateAdd(null, 180)));
        editAppSpecific(expDateField, expDate, newCapId);
    }
    addFee("ADMIN", "CC-BLD-ADMIN", "FINAL", 1, "Y");
}
///New EE script
if (AInfo["Type of Building"] == "Single-Family Dwelling" || AInfo["Type of Building"] == "Multi-Family Dwelling"){
    if (wfStatus == 'Issued'){
//Variables for the EE Inspector based on Parcel field "Inspection Dist" and Standard Choice 'InspectionAssignmentEnvEngineering'
var ParcelInspectorEnvEng = AInfo["ParcelAttribute.InspectionDistrict"];
//var InspAssignment = lookup("InspectionAssignmentEnvEngineering",ParcelInspectorEnvEng);
var iInspector = assignInspection_CHESTERFIELD(null); // Get Inspector
var InspAssignment = null;
    if (iInspector && iInspector.getGaUserID()) InspAssignment = iInspector.getGaUserID();
    scheduleInspection("E and SC",15,InspAssignment,null,"Auto Scheduled");
}}