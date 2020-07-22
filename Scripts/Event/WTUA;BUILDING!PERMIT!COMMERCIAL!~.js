if (wfStatus == 'Amendment Submitted') {
    var newAppTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + "Amendment";
    if (appMatch("Building/Permit/Commercial/NA"))
        var newAppTypeString = "Building/Permit/Commercial/Amendment";
    else if (appMatch("Building/Permit/Commercial/*"))
        var newAppTypeString = "Building/Permit/Commercial/AmendmentTrade";
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
}
