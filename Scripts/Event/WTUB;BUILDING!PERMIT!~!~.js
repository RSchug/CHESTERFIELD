// WTUB:Building/Permit/*/*
try {
	if (wfTask == 'Permit Issuance' && wfStatus == 'Issued') {
		//Fees must be paid before Permit Issuance Workflow Status is Issued//
		if (balanceDue > 0) {
			showMessage = true;
			comment('<font size=small><b>Unpaid Fees:</b></font><br><br>Cannot Issue Permit until Fees are Paid, Balance Due is $ ' + balanceDue);
			cancel = true;
		}
			//Before Workflow Task 'Permit Issuance' Status is 'Issued' IF Licensed Professional is 'TBD' then Error: Licensed Professional is Required before Permit Issuance//
			if (getLicenseProf(null,['TBD'])) {
				showMessage = true;
				comment('<font size=small><b>Licensed Professional is required prior to Issuance</b></font>');
				cancel = true;
			}
		// Permit must be Issued
		if (exists(appTypeArray[3],["Boiler","Electrical","Fire","Gas","Mechanical","Plumbing"]) && parentCapId && !wasCapStatus(["Issued"],parentCapId)) {
			parentCap = aa.cap.getCap(parentCapId).getOutput();
			parentAppTypeArray = parentCap.getCapType().toString().split("/");
			logDebug("parentAppTypeArray: " + parentAppTypeArray.join("/"));
			if (appMatch("Building/Permit/Commercial/NA",parentCapId) || appMatch("Building/Permit/Residential/NA",parentCapId) || appMatch("Building/Permit/Residential/Multi-Family",parentCapId)) {
				showMessage = true;
				comment('<font size=small><b>Parent Permit must be Issued before Trade Permit can be Issued</b></font>');
				cancel = true;
			}}
		// 07-2020 Boucher 11p For Residential or Commercial here are the Proffer Conditions that need to be met on the Parcel before permit can be issued
		if ((appMatch('*/*/Residential/NA') || appMatch('*/*/Commercial/NA') || (appMatch('*/*/Residential/Multi-Family'))  && 
			(parcelHasConditiontrue_TPS('CDOT', 'Applied') ||
			parcelHasConditiontrue_TPS('EE', 'Applied') ||
			parcelHasConditiontrue_TPS('Fire', 'Applied') ||
			parcelHasConditiontrue_TPS('Parks and Rec', 'Applied') ||
			parcelHasConditiontrue_TPS('Planning', 'Applied') ||
			parcelHasConditiontrue_TPS('Utilities', 'Applied')) {
				showMessage = true;
				comment('The Parcel(s) seem to have still applied Conditions? You will need to update the Condition Status to Condition Met to proceed in the workflow');
				cancel = true;
		}
	}
		if (wfTask == 'Application Submittal' && exists(wfStatus,['Accepted - Plan Review Required','Accepted - Plan Review Not Required','Accepted'])){
		//Before Workflow Task Status can be selected - confirm that at least one Address, one Parcel and one Owner exists on Record.
		if (!addressExistsOnCap()) {          // Check if address exists
			showMessage = true;
			comment('<font size=small><b>Address is required </b></font>');
			cancel = true;
		 }
		 if (!parcelExistsOnCap()) {             // Check if address exists
			showMessage = true;
			comment('<font size=small><b>Parcel is required /b></font>');
			cancel = true;
		 }
		 if (!ownerExistsOnCap()) {            // Check if address exists
			showMessage = true;
			comment('<font size=small><b>Owner is required </b></font>');
			cancel = true;
		 }
		}
	//Temporary CO Fees must be paid before Workflow Status is Temporary CO Issued//
	//if (wfStatus == 'Temporary CO Issued' && balanceDue > 0) {
	//	showMessage = true;
	//	comment('<font size=small><b>Unpaid Fees:</b></font><br><br>Cannot Issue Temporary CO until Temporary CO Fees are Paid, Balance Due is $ ' + balanceDue);
	//	cancel = true;
	//}
	} catch (err) {
		logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
	}	