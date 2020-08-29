//41P and 42.5P results
try {
    if (matches(wfTask, 'CPC Hearing') && matches(wfStatus, 'Recommend Approval','Recommend Denial')) {
    if (AInfo['CPC Conditions'] == null ) {
        showMessage = true;
    comment('You cannot advance this workflow until ALL fields in the <b>Results</b> area of the Data Fields are completely filled in.  Put in zeroes (0) for those fields that do not apply.');
        cancel = true;}
            }
    if (matches(wfTask, 'BOS Hearing') && matches(wfStatus, 'Approved','Denied')) {
    if (AInfo['BOS Conditions'] == null ) {
        showMessage = true;
    comment('You cannot advance this workflow until ALL fields in the <b>Results</b> area of the Data Fields are completely filled in.  Put in zeroes (0) for those fields that do not apply.');
        cancel = true;}
            }
    } catch (err) {
        logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
    }
    