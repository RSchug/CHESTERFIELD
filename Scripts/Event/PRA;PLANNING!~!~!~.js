try {
//3P. Fee Balance = 0 THEN: closeTask = 'Fee Payment' 
	if (isTaskActive("Fee Payment") && (balanceDue == 0)) {
		closeTask("Fee Payment","Payment Received","Updated based on Balance of 0","");
	}
	if (appMatch('*/Subdivision/ConstructionPlan/*')) {
		if (parentCapId != null) {
			copyASIfromParent_TPS(capId,parentCapId,'Community Code','Community Code');
			copyASIfromParent_TPS(capId,parentCapId,'Subdivision Code','Subdivision Code');
		}
		else if (AInfo['Related Case Number'] != null) {
			if (AInfo['Related Case Number'].toUpperCase().indexOf("CP") >= 0) {
				var recType = "Planning/Subdivision/ConstructionPlan/NA"; }
			else if (AInfo['Related Case Number'].toUpperCase().indexOf("PP") >= 0) {
				var recType = "Planning/Subdivision/Preliminary/NA"; }
			else if (AInfo['Related Case Number'].toUpperCase().indexOf("PR") >= 0) {
				var recType = "Planning/SitePlan/Major/NA"; }
			else if (AInfo['Related Case Number'].toUpperCase().indexOf("OP") >= 0) {
				var recType = "Planning/Subdivision/OverallConceptualPlan/NA"; }

			copyASIfromParent(capId,recType,'Community Code','Community Code');
			copyASIfromParent(capId,recType,'Subdivision Code','Subdivision Code');
		}
	}
	if (appMatch("Planning/LandUse/WrittenDetermination/NA") && matches(capStatus, "Fees Requested") && (balanceDue == 0)) {
		closeTask("Request Submitted","Request Validated","Updated based on full payment","");
		activateTask("Inquiry Letter");
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}