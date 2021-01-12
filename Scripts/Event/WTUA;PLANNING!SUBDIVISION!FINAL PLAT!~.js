try {
    // Set the Reviewers Tasks per the wfStatus choosen per REVIEW DEPTS FOR ELM Spreadsheet scritp# 60p
	if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
		activateTask("Budget and Management Review");
		activateTask("CDOT Review");
		activateTask("Environmental Engineering Review");
		activateTask("Fire and Life Safety Review");
		activateTask("Planning Review");
		activateTask("Utilities Review");
		activateTask("VDOT Review");
		activateTask("Real Property Review");
		activateTask("GIS-IST Review");
		activateTask("Assessor Review");
		activateTask("Water Quality Review");
		activateTask("GIS-EDM Utilities Review");
		deactivateTask("Default");
		
	//per the ELM Planning Due Dates Doc
		var workflowTasks = aa.workflow.getTasks(capId).getOutput();
		var taskAuditArray = ['Airport Review','Assessor Review','Building Inspection Review','Budget and Management Review','Community Enhancement Review','County Library Review','Chesterfield Historical Society Review','Health Department Review','CDOT Review','Economic Development Review','Environmental Engineering Review','Fire and Life Safety Review','GIS-EDM Utilities Review','GIS-IST Review','Parks and Recreation Review','Planning Review','Police Review','Real Property Review','Schools Research and Planning Review','County Attorney Review','Utilities Review','VDOT Review','Water Quality Review'];
		for (var ind in taskAuditArray) {
			var wfaTask = taskAuditArray[ind];
			for (var i in workflowTasks) {
				var wfbTask = workflowTasks[i];
				if (wfbTask.getActiveFlag() == 'Y') {
					if (capStatus == 'Submit Signed Plat') {
						editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,5,true));
					}
					else { editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,10,true)); }
				}
			}
		}
	}
	if (wfTask == 'Application Submittal' && wfStatus == 'Calculate Fees') {
	//49P Final Plat Fee
		if (AInfo['Case Type'] == 'Amended Plat' || AInfo['Case Type'] == 'Line Modification'){
		addFee("FINALPLAT2","CC-PLANNING","FINAL",1,"N");
		}
		else if (AInfo['Case Type'] == 'New' || AInfo['Plat Type'] == 'Adjustment'){
		addFee("FINALPLAT1","CC-PLANNING","FINAL",1,"N");
		}
	}

	//56.1p 11-2020 Code Schema update for inheritence - copying Community Code, Subdivision Code, and Section Code if they exist on related records, whatever is related, then filter on the ASI
		if (parentCapId != null) {
			copyASIfromParent_TPS(capId,parentCapId,'Community Code','Community Code');
			copyASIfromParent_TPS(capId,parentCapId,'Subdivision Code','Subdivision Code');
			copyASIfromParent_TPS(capId,parentCapId,'Section Code','Section Code');
		}
		else if (AInfo['Related Case Number'] != null) {
			if (AInfo['Related Case Number'].toUpperCase().indexOf("CP") >= 0) {
				var recType = "Planning/Subdivision/ConstructionPlan/NA"; }
			else if (AInfo['Related Case Number'].toUpperCase().indexOf("PP") >= 0) {
				var recType = "Planning/Subdivision/Preliminary/NA"; }	
		}
		copyASIfromParent(capId,recType,'Community Code','Community Code');
		copyASIfromParent(capId,recType,'Subdivision Code','Subdivision Code');
		copyASIfromParent(capId,recType,'Section Code','Section Code');
	}
	
	if (matches(wfTask, 'Review Consolidation') && matches(wfStatus, 'Revisions Requested','Submit Signed Plat')) {
		var BlankExpireDate = AInfo['Expiration Date'];
		var months = 12 ;
			if(BlankExpireDate == null || BlankExpireDate == "") {
				var NewExpireDate = dateAddMonths(dateAdd(null,0),months);
			}
			if(BlankExpireDate != null && BlankExpireDate != "") {
				var NewExpireDate = dateAddMonths(BlankExpireDate,months);
			}
			editAppSpecific("Expiration Date",NewExpireDate);
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}