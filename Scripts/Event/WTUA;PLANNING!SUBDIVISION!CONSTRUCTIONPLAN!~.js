try {
    // Set the Reviewers Tasks per the wfStatus choosen per REVIEW DEPTS FOR ELM Spreadsheet scritp# 60p
	if (wfTask == 'Review Distribution' && wfStatus == 'Routed for Review') {
		activateTask("CDOT Review");
		activateTask("Environmental Engineering Review");
		activateTask("Fire and Life Safety Review");
		activateTask("Planning Review");
		activateTask("Utilities Review");
		activateTask("VDOT Review");
		activateTask("Water Quality Review");
		activateTask("GIS-EDM Utilities Review");
		deactivateTask("Default");
		
		var workflowTasks = aa.workflow.getTasks(capId).getOutput();
			var taskAuditArray = ['Airport Review','Assessor Review','Building Inspection Review','Budget and Management Review','Community Enhancement Review','County Library Review','Chesterfield Historical Society Review','Health Department Review','CDOT Review','Economic Development Review','Environmental Engineering Review','Fire and Life Safety Review','GIS-EDM Utilities Review','GIS-IST Review','Parks and Recreation Review','Planning Review','Police Review','Real Property Review','Schools Research and Planning Review','County Attorney Review','Utilities Review','VDOT Review','Water Quality Review'];
			for (var ind in taskAuditArray) {
				var wfaTask = taskAuditArray[ind];
				for (var i in workflowTasks) {
					var wfbTask = workflowTasks[i];
					if (wfbTask.getActiveFlag() == 'Y') {
						if (wfaTask == wfbTask.getTaskDescription()) {
							if (AInfo['Special Consideration'] == 'Expedited') {
							editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,10,true));
							} else if (AInfo['Special Consideration'] == 'Fast Track') {
							editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,5,true));
							} else if (AInfo['Special Consideration'] == 'Regular') {
							editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,15,true));
							}
						else { editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,15,true)); }
						}
					}
				}
			}
	}
	//Erosion and Sediment Control Review and Enforcement Fees 8.2P and 8.3P
	if ((wfTask == 'First Glance Consolidation' && wfStatus == 'First Glance Review Complete') && (AInfo["Total Residential Lots"] != null)) {
		updateFee("ERSCRENFRLOT","CC-PLANNING","FINAL",1,"N");
	}
	//Construction Plan Fee
	if (wfTask == 'First Glance Consolidation' && wfStatus == 'First Glance Review Complete') {
		updateFee("CONSTPLAN","CC-PLANNING","FINAL",1,"N");
	//56.1p 11-2020 Code Schema update for inheritence - copying Community Code and Subdivision Code, if they exist on related records - Construction then Preliminary then Major then OCP
		if (parentCapId != null) {
			var formattedparentCapId = "";
			var capScriptModel = aa.cap.getCap(parentCapId);
			formattedparentCapId = capScriptModel.getOutput().getCapModel().getAltID();
			logDebug('formattedparentCapId: ' + formattedparentCapId + ' and childcap: ' + capId);
			copyASIfromParent_TPS(capId,formattedparentCapId,'Community Code','Community Code');
			copyASIfromParent_TPS(capId,formattedparentCapId,'Subdivision Code','Subdivision Code');
		}
		else if (AInfo['Related Case Number'] != null) { 
			copyASIfromParent_TPS(capId,AInfo['Related Case Number'],'Community Code','Community Code');
			copyASIfromParent_TPS(capId,AInfo['Related Case Number'],'Subdivision Code','Subdivision Code');
		}
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}