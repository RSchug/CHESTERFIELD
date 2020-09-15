function generateSignPostingNumber(fieldName) {
    var inActiveCapStatuses = ["Cancelled", "Closed", "Expired", "Withdrawn"];
    // Check if Sign Posting Number is in use.
    for (var i = 100; i < 1000; i++) {
        var ASIValue = getNextSequence(fieldName);
        if (ASIValue && !isNaN(ASIValue)) {
            ASIValue = parseInt(ASIValue);
            logDebug("Checking " + fieldName + " sequence: " + ASIValueStart);
        } else {
            continue;
        }
        var ASIValue = j + "";
        var getCapResult = aa.cap.getCapIDsByAppSpecificInfoField(fieldName, ASIValue);
        if (!getCapResult.getSuccess()) { logDebug("**ERROR: getting caps by app type: " + getCapResult.getErrorMessage()); return null }
        var apsArray = getCapResult.getOutput();
        for (aps in apsArray) {
            var myCapId = apsArray[aps].getCapID();
            var myCap = aa.cap.getCap(myCapId).getOutput();
            var myCapStatus = myCap.getCapStatus();
            if (inActiveCapStatuses && exists(myCapStatus, inActiveCapStatuses)) continue; // skip inactive record.
            logDebug("Found " + fieldName + ": " + ASIValue + " " + myCap.getCapID().getCustomID() + " " + myCapStatus);
            ASIValue = null;
            break; // Active record found so get next number
        }
        if (ASIValue != null) break;
    }
    //if (ASIValue == null)
    return ASIValue;
}
