try {
// CPC and BOS results
	if (matches(wfTask, 'CPC Hearing') && matches(wfStatus, 'Recommend Approval','Recommend Denial')) {
			if (AInfo['CPC Conditions'] == null || AInfo['CPC Complies with Plan'] == null) {
				showMessage = true;
				comment('You cannot advance this workflow until ALL fields in the <b>Results</b> area of the Data Fields are completely filled in.  Put in zeroes (0) for those fields that do not apply.');
				cancel = true;
			}
		}
//    if (matches(wfTask, 'BOS Hearing') && matches(wfStatus,'Approved','Denied')) {
//		if (AInfo['BOS Conditions'] == null || AInfo['BOS Proffered Conditions'] == null || AInfo['BOS Cash Proffers'] == null || AInfo['BOS Complies with Plan'] == null || AInfo['BOS Approved Time Limit'] == null || AInfo['BOS Expiration Date'] == null
//		|| AInfo['BOS Residential - Single Family Unit Approved'] == null || AInfo['BOS Residential - Multi Family Unit Approved'] == null || AInfo['BOS Age Restricted Units'] == null) {
//			showMessage = true;
//			comment('You cannot advance this workflow until ALL fields in the <b>Results</b> area of the Data Fields are completely filled in.  Put in zeroes (0) for those fields that do not apply.');
//			cancel = true;
//		}
//	}
} catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}