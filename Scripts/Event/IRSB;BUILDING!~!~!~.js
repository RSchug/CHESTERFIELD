try {
	var inspBillable = inspObj.getInspection().getActivity().getInspBillable();
	var inspOvertime = inspObj.getInspection().getActivity().getOvertime();
// Error message when Fee item selected with wrong status
if (inspResult == "Approved") && inspOvertime == "Y"{
			showMessage = true;
			comment('<font size=small><b>Not Ready Fee must be Corrections Required status</b></font>');
			cancel = true;
	}
	if (inspResult == "Cancelled" && (inspBillable =="Y" || inspOvertime=="Y")) {
			showMessage = true;
			comment('<font size=small><b>Fees are not allowed for Cancelled Status</b></font>');
			cancel = true;
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}