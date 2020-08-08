try {
    // Create Conditions from proffers on Zoning Case Record
	if (wfTask == 'BOS Hearing' && matches(wfStatus, 'Approved')) {

		var sum = 0;
		var tempAsit = loadASITable("PROFFER CONDITIONS");
		if (tempAsit) {
			for (a in tempAsit) {
				if (tempAsit[a]["Approved"] == 'CHECKED') {
					var cType = tempAsit[a]["Department"];
					var cDesc = tempAsit[a]["Department"]+' - '+tempAsit[a]["Record Type"];
					var cShortComment = tempAsit[a]["Proffer Condition"];
                    var cLongComment = tempAsit[a]["Long Comment"];
					addParcelStdCondition_TPS(null, cType, cDesc, cShortComment, cLongComment);
					//addParcelCondition(null,cType,'Applied',cDesc,cComment,'Notice');
				}
			}//for all rows
		}
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}
//5P Acivate Adhoc tasks based on CPC Hearing 'Deferred..'
if (matches(wfTask,"CPC Hearing") && (matches(wfStatus,"Deferred by Applicant","Deferred by CPC"))){
	addAdHocTask("ADHOC_WORKFLOW","Public Notices","");
	addAdHocTask("ADHOC_WORKFLOW","Adjacents","");
	addAdHocTask("ADHOC_WORKFLOW","IVR Message","");
	addAdHocTask("ADHOC_WORKFLOW","Sign Posting","");
	addAdHocTask("ADHOC_WORKFLOW","Maps","");
}
//Fees for Communication Tower
if ((wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') && (AInfo["Request Type"] == "Conditional Use" && AInfo["Conditional Use and Conditional Use Planned Development Type"] == "Communication Tower")){
	addFee("CTOWER","CC-PLANNING","FINAL",1,"N");
}
// Add Fees
if (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') {
	addFees_ZoneCase();
}