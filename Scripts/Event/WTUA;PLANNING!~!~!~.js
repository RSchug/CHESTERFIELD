try {
//07-2020 Boucher 11p  and 82p - updated per Word Doc on 9-2020
// for all Planning records - updating the Reviewers Due date based on the Special Consideration field, only those active Reviews (can get overwritten by TRC Set Hearing Date)
	if (matches(wfTask,'Review Distribution') && matches(wfStatus,'Routed for Review','Routed for Commercial Review','Routed for Residential Review','Routed for Residential and Commercial','Routed for Towers Review','Manual Routing')) {
		if ((appMatch('*/Subdivision/*/*') || appMatch('*/SitePlan/*/*')) && !appMatch('*/SitePlan/Minor/*')) {
			var workflowTasks = aa.workflow.getTasks(capId).getOutput();
			var taskAuditArray = ['Airport Review','Assessor Review','Building Inspection Review','Budget Review','Community Enhancement Review','County Library Review','Chesterfield Historical Society Review','Department of Health Review','CDOT Review','Economic Development Review','Environmental Engineering Review','Fire and Life Safety Review','GIS-EDM Utilities Review','GIS-IST Review','Parks and Recreation Review','Planning Review','Police Review','Real Property Review','School Research and Planning Review','County Attorney Review','Utilities Review','VDOT Review','Water Quality Review'];
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
	//1P and 6p Activate Adhoc Tasks that are not Active based on above Rev Distribution Status - 8/2020 change, add 'Manual Routing' and chuncked it up into Record groupings
		if (appMatch('*/LandUse/*/*') && !appMatch('*/LandUse/CertificateofAppropriateness/*') && !appMatch('*/LandUse/WrittenDetermination/*') && !appMatch('*/LandUse/ZoningOpinion/*')) {
			
			if (!isTaskActive("Public Notices") && !isTaskComplete_TPS("Public Notices")) {
				addAdHocTask("ADHOC_WF","Public Notices","");
			}
			if (isTaskComplete_TPS("Public Notices")) {
				activateTask("Public Notices");
			}
			if (!isTaskActive("Adjacents") && !isTaskComplete_TPS("Adjacents")){
				addAdHocTask("ADHOC_WF","Adjacents","");
			}
			if (isTaskComplete_TPS("Adjacents")) {
				activateTask("Adjacents");
			}
			if (!isTaskActive("IVR Message") && !isTaskComplete_TPS("IVR Message")){
				addAdHocTask("ADHOC_WF","IVR Message","");
			}
			if (isTaskComplete_TPS("IVR Message")) {
				activateTask("IVR Message");
			}			
			if (!isTaskActive("Sign Posting") && !isTaskComplete_TPS("Sign Posting")){
				addAdHocTask("ADHOC_WF","Sign Posting","");
			}
			if (isTaskComplete_TPS("Sign Posting")) {
				activateTask("Sign Posting");
			}
	//Only AdminVariance does not have Maps ad hoc		
			if (!appMatch('*/*/AdminVariance/*')) {
				if (!isTaskActive("Maps") && !isTaskComplete_TPS("Maps")){
					addAdHocTask("ADHOC_WF","Maps","");
				}
				if (isTaskComplete_TPS("Maps")) {
					activateTask("Maps");
				}
			}
			if (appMatch('*/*/ZoningCase/*') || appMatch('*/*/SubstantialAccord/*') || appMatch('*/*/HistoricPreservation/*')) {
				if (!isTaskActive("CPC Staff Report") && !isTaskComplete_TPS("CPC Staff Report")){
					addAdHocTask("ADHOC_WF","CPC Staff Report","");
				}
				if (isTaskComplete_TPS("CPC Staff Report")) {
					activateTask("CPC Staff Report");
				}
				if (!isTaskActive("BOS Staff Report") && !isTaskComplete_TPS("BOS Staff Report")){
					addAdHocTask("ADHOC_WF","BOS Staff Report","");
				}
				if (isTaskComplete_TPS("BOS Staff Report")) {
					activateTask("BOS Staff Report");
				}
			}
			if (appMatch('*/*/ManufacturedHomes/*') || appMatch('*/*/RPAException/*')) {
				if (!isTaskActive("BOS Staff Report") && !isTaskComplete_TPS("BOS Staff Report")){
					addAdHocTask("ADHOC_WF","BOS Staff Report","");
					activateTask("BOS Hearing");
				}
				if (isTaskComplete_TPS("BOS Staff Report")) {
					activateTask("BOS Staff Report");
				}
			}
			if (appMatch('*/*/Appeal/*') || appMatch('*/*/Variance/*') || appMatch('*/*/SpecialException/*')) {
				if (!isTaskActive("BZA Staff Report") && !isTaskActive("BZA Hearing")){
					activateTask("BZA Staff Report");
					activateTask("BZA Hearing");
				}
			}
		}
		else if (appMatch('*/SitePlan/Major/*') || appMatch('*/SitePlan/Schematics/*') || appMatch('*/Subdivision/ConstructionPlan/*') || appMatch('*/Subdivision/ExceptiontoPreliminary/*') 
		      || appMatch('*/Subdivision/OverallConceptualPlan/*') || appMatch('*/Subdivision/Preliminary/*')) {
				  
			if (!isTaskActive("IVR Message") && !isTaskComplete_TPS("IVR Message")){
				addAdHocTask("ADHOC_WF","IVR Message","");
			}
			if (isTaskComplete_TPS("IVR Message")) {
				activateTask("IVR Message");
			}
			if (!isTaskActive("Sign Posting") && !isTaskComplete_TPS("Sign Posting")){
				addAdHocTask("ADHOC_WF","Sign Posting","");
			}
			if (isTaskComplete_TPS("Sign Posting")) {
				activateTask("Sign Posting");
			}
			if (AInfo['Review Type'] == 'Administrative Review') {
				if (!isTaskActive("Public Notices") && !isTaskComplete_TPS("Public Notices")) {
					addAdHocTask("ADHOC_WF","Public Notices","");
				}
				if (isTaskComplete_TPS("Public Notices")) {
					activateTask("Public Notices");
				}				
				if (!isTaskActive("Adjacents") && !isTaskComplete_TPS("Adjacents")){
					addAdHocTask("ADHOC_WF","Adjacents","");
				}
				if (isTaskComplete_TPS("Adjacents")) {
					activateTask("Adjacents");
				}
			}
			else if (AInfo['Review Type'] == 'Planning Commission Public Hearing') {
				if (!isTaskActive("Public Notices") && !isTaskComplete_TPS("Public Notices")) {
					addAdHocTask("ADHOC_WF","Public Notices","");
				}
				if (isTaskComplete_TPS("Public Notices")) {
					activateTask("Public Notices");
				}				
				if (!isTaskActive("Adjacents") && !isTaskComplete_TPS("Adjacents")){
					addAdHocTask("ADHOC_WF","Adjacents","");
				}
				if (isTaskComplete_TPS("Adjacents")) {
					activateTask("Adjacents");
				}
				if (!isTaskActive("Maps") && !isTaskComplete_TPS("Maps")){
					addAdHocTask("ADHOC_WF","Maps","");
				}
				if (isTaskComplete_TPS("Maps")) {
					activateTask("Maps");
				}
				if (!isTaskActive("CPC Staff Report") && !isTaskComplete_TPS("CPC Staff Report")){
					addAdHocTask("ADHOC_WF","CPC Staff Report","");
				}
				if (isTaskComplete_TPS("CPC Staff Report")) {
					activateTask("CPC Staff Report");
				}
			}
		}
	
	//09-2020 Boucher per the ELM Planning DueDate Doc and in chart for Admin Review and these record types update ad hoc due dates - and based on Rev Dist. and Routed from above
		if (AInfo['Review Type'] == 'Administrative Review') {
			
			if (appMatch('*/SitePlan/Major/*') || appMatch('*/SitePlan/Schematics/*')) {
				if (isTaskActive('Public Notices')) {
					editTaskDueDate('Public Notices', dateAdd(getTaskDueDate('Review Distribution'),3,true));
				}
				if (isTaskActive('Adjacents')) {
					editTaskDueDate('Adjacents', dateAdd(getTaskDueDate('Review Distribution'),5,true));
				}
				if (isTaskActive('IVR Message')) {
					editTaskDueDate('IVR Message', dateAdd(getTaskDueDate('Review Distribution'),6,true));
				}
				if (isTaskActive('Sign Posting')) {
					editTaskDueDate('Sign Posting', dateAdd(getTaskDueDate('Review Distribution'),7,true));
				}
			}
			else if (appMatch('*/Subdivision/ConstructionPlan/*') || appMatch('*/Subdivision/ExceptiontoPreliminary/*') || appMatch('*/Subdivision/OverallConceptualPlan/*') || appMatch('*/Subdivision/Preliminary/*')) {
				if (isTaskActive('IVR Message')) {
					editTaskDueDate('IVR Message', dateAdd(getTaskDueDate('Review Distribution'),6,true));
				}
				if (isTaskActive('Sign Posting')) {
					editTaskDueDate('Sign Posting', dateAdd(getTaskDueDate('Review Distribution'),7,true));
				}
			}
		}
		if (appMatch("*/*/AdminVariance/*")) {	
			if (isTaskActive('Public Notices')) {
				editTaskDueDate('Public Notices', dateAdd(getTaskDueDate('Review Distribution'),13));
			}
			if (isTaskActive('Adjacents')) {
				editTaskDueDate('Adjacents', dateAdd(getTaskDueDate('Review Distribution'),13));
			}
			if (isTaskActive('IVR Message')) {
				editTaskDueDate('IVR Message', dateAdd(getTaskDueDate('Review Distribution'),13));
			}
			if (isTaskActive('Sign Posting')) {
				editTaskDueDate('Sign Posting', dateAdd(getTaskDueDate('Review Distribution'),13));
			}
		}
	}

//09-2020 Boucher per ELM Planning DueDates for any record with TRC - No due dates are updated for Staff and Developer Meeting
	if (matches(wfTask,'Technical Review Committee','Pre-Applicaiton Meeting','Staff and Developer Meeting') && matches(wfStatus,'Set Hearing Date','Set Meeting Date')) {
		var workflowTasks = aa.workflow.getTasks(capId).getOutput();
		var taskAuditArray = ['Airport Review','Assessor Review','Building Inspection Review','Budget Review','Community Enhancement Review','County Library Review','Chesterfield Historical Society Review','Department of Health Review','CDOT Review','Economic Development Review','Environmental Engineering Review','Fire and Life Safety Review','GIS-EDM Utilities Review','GIS-IST Review','Parks and Recreation Review','Planning Review','Police Review','Real Property Review','School Research and Planning Review','County Attorney Review','Utilities Review','VDOT Review','Water Quality Review'];
		for (var ind in taskAuditArray) {
			var wfaTask = taskAuditArray[ind];
			for (var i in workflowTasks) {
				var wfbTask = workflowTasks[i];
				if (wfbTask.getActiveFlag() == 'Y' && wfTask == 'Technical Review Committee') {
					if (wfaTask == wfbTask.getTaskDescription()) {
						editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(getTaskDueDate('Technical Review Committee'),3));
					}
				}
				else if (wfbTask.getActiveFlag() == 'Y' && wfTask == 'Pre-Applicaiton Meeting') {
					if (wfaTask == wfbTask.getTaskDescription()) {
						editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(getTaskDueDate('Pre-Applicaiton Meeting'),-1));
					}
				}
			}
		}
	}

//07-2020 Boucher 21p  using ELM Planning Due Date Doc for setting Due Dates on Ad Hocs
	if (matches(wfTask,'CPC Hearing') && matches(wfStatus,'Set Hearing Date','Set Meeting Date')) {
		if (appMatch('*/LandUse/ZoningCase/*') || appMatch('*/LandUse/HistoricPreservation/*') || appMatch('*/LandUse/SubstantialAccord/*')) {
			if (isTaskActive('Maps')) {
				editTaskDueDate('Maps', dateAdd(getTaskDueDate('CPC Hearing'),-35));
			}
			if (isTaskActive('Public Notices')) {
				editTaskDueDate('Public Notices', dateAdd(getTaskDueDate('CPC Hearing'),-34));
			}
			if (isTaskActive('Adjacents')) {
				editTaskDueDate('Adjacents', dateAdd(getTaskDueDate('CPC Hearing'),-28));
			}
			if (isTaskActive('IVR Message')) {
				editTaskDueDate('IVR Message', dateAdd(getTaskDueDate('CPC Hearing'),-23));
			}
			if (isTaskActive('Sign Posting')) {
				editTaskDueDate('Sign Posting', dateAdd(getTaskDueDate('CPC Hearing'),-22));
			}
			if (isTaskActive('CPC Staff Report')) {
				editTaskDueDate('CPC Staff Report', dateAdd(getTaskDueDate('CPC Hearing'),-15));
			}
			if (appMatch('*/LandUse/HistoricPreservation/*') && isTaskActive('HPC Hearing')) {
				editTaskDueDate('HPC Hearing', dateAdd(getTaskDueDate('CPC Hearing'),0));
			}
		}
	//These Due Date timing are the same as above, but split out so if there is any changes
		else if ((appMatch('*/SitePlan/Major/*') || appMatch('*/SitePlan/Schematics/*') || appMatch('*/Subdivision/ConstructionPlan/*') || appMatch('*/Subdivision/ExceptiontoPreliminary/*') 
		      || appMatch('*/Subdivision/OverallConceptualPlan/*') || appMatch('*/Subdivision/Preliminary/*')) && AInfo['Review Type'] == 'Planning Commission Public Hearing') {
			if (isTaskActive('Maps')) {
				editTaskDueDate('Maps', dateAdd(getTaskDueDate('CPC Hearing'),-35));
			}
			if (isTaskActive('Public Notices')) {
				editTaskDueDate('Public Notices', dateAdd(getTaskDueDate('CPC Hearing'),-34));
			}
			if (isTaskActive('Adjacents')) {
				editTaskDueDate('Adjacents', dateAdd(getTaskDueDate('CPC Hearing'),-28));
			}
			if (isTaskActive('IVR Message')) {
				editTaskDueDate('IVR Message', dateAdd(getTaskDueDate('CPC Hearing'),-23));
			}
			if (isTaskActive('Sign Posting')) {
				editTaskDueDate('Sign Posting', dateAdd(getTaskDueDate('CPC Hearing'),-22));
			}
			if (isTaskActive('CPC Staff Report')) {
				editTaskDueDate('CPC Staff Report', dateAdd(getTaskDueDate('CPC Hearing'),-15));
			}
		}	  
	}
//per the ELM Planning Due Dates Doc
	if (matches(wfTask,'BOS Hearing') && matches(wfStatus,'Set Hearing Date')) {
		if (appMatch('*/LandUse/ZoningCase/*') || appMatch('*/LandUse/HistoricPreservation/*') || appMatch('*/LandUse/SubstantialAccord/*')) {
			
			if (isTaskActive('Public Notices')) {
				editTaskDueDate('Public Notices', dateAdd(getTaskDueDate('CPC Hearing'),1));
			}
			if (isTaskActive('Adjacents')) {
				editTaskDueDate('Adjacents', dateAdd(getTaskDueDate('CPC Hearing'),2));
			}
			if (isTaskActive('IVR Message')) {
				editTaskDueDate('IVR Message', dateAdd(getTaskDueDate('CPC Hearing'),6));
			}
			if (isTaskActive('BOS Staff Report')) {
				editTaskDueDate('BOS Staff Report', dateAdd(getTaskDueDate('CPC Hearing'),6));
			}
		}
		else if (appMatch('*/LandUse/ManufacturedHomes/*') || appMatch('*/LandUse/RPAException/*')) {
			if (isTaskActive('Maps')) {
				editTaskDueDate('Maps', dateAdd(getTaskDueDate('BOS Hearing'),-35));
			}
			if (isTaskActive('Public Notices')) {
				editTaskDueDate('Public Notices', dateAdd(getTaskDueDate('BOS Hearing'),-30));
			}
			if (isTaskActive('Adjacents')) {
				editTaskDueDate('Adjacents', dateAdd(getTaskDueDate('BOS Hearing'),-28));
			}
			if (isTaskActive('IVR Message')) {
				editTaskDueDate('IVR Message', dateAdd(getTaskDueDate('BOS Hearing'),-23));
			}
			if (isTaskActive('Sign Posting')) {
				editTaskDueDate('Sign Posting', dateAdd(getTaskDueDate('BOS Hearing'),-22));
			}
			if (isTaskActive('BOS Staff Report')) {
				editTaskDueDate('BOS Staff Report', dateAdd(getTaskDueDate('BOS Hearing'),-26));
			}	
		}
	}
	
//per the ELM Planning Due Dates Doc
	if (matches(wfTask,'BZA Hearing') && matches(wfStatus,'Set Hearing Date')) {
		if (appMatch("*/*/Variance/*") || appMatch("*/*/SpecialException/*") || appMatch("*/*/Appeal/*")) {
			if (isTaskActive('Maps')) {
				editTaskDueDate('Maps', dateAdd(getTaskDueDate('BZA Hearing'),-35));
			}
			if (isTaskActive('Public Notices')) {
				editTaskDueDate('Public Notices', dateAdd(getTaskDueDate('BZA Hearing'),-26));
			}
			if (isTaskActive('Adjacents')) {
				editTaskDueDate('Adjacents', dateAdd(getTaskDueDate('BZA Hearing'),-22));
			}
			if (isTaskActive('IVR Message')) {
				editTaskDueDate('IVR Message', dateAdd(getTaskDueDate('BZA Hearing'),-26));
			}
			if (isTaskActive('Sign Posting')) {
				editTaskDueDate('Sign Posting', dateAdd(getTaskDueDate('BZA Hearing'),-22));
			}
			if (isTaskActive('BZA Staff Report')) {
				editTaskDueDate('BZA Staff Report', dateAdd(getTaskDueDate('BZA Hearing'),-12));
			}
		}
		else if (appMatch("*/*/AdminVariance/*")) {
			if (isTaskActive('Public Notices')) {
				editTaskDueDate('Public Notices', dateAdd(getTaskDueDate('BZA Hearing'),13));
			}
			if (isTaskActive('Adjacents')) {
				editTaskDueDate('Adjacents', dateAdd(getTaskDueDate('BZA Hearing'),13));
			}
			if (isTaskActive('IVR Message')) {
				editTaskDueDate('IVR Message', dateAdd(getTaskDueDate('BZA Hearing'),13));
			}
			if (isTaskActive('Sign Posting')) {
				editTaskDueDate('Sign Posting', dateAdd(getTaskDueDate('BZA Hearing'),13));
			}
		}
	}
//per the ELM Planning Due Dates Doc for Final Plat and Parcel Acreage
	if ((appMatch('*/*/Final Plat/*') || appMatch('*/*/ParcelAcreage/*')) && wfTask =='Review Distribution' && wfStatus == 'Routed for Review') {
		var workflowTasks = aa.workflow.getTasks(capId).getOutput();
		var taskAuditArray = ['Airport Review','Assessor Review','Building Inspection Review','Budget Review','Community Enhancement Review','County Library Review','Chesterfield Historical Society Review','Department of Health Review','CDOT Review','Economic Development Review','Environmental Engineering Review','Fire and Life Safety Review','GIS-EDM Utilities Review','GIS-IST Review','Parks and Recreation Review','Planning Review','Police Review','Real Property Review','School Research and Planning Review','County Attorney Review','Utilities Review','VDOT Review','Water Quality Review'];
		for (var ind in taskAuditArray) {
			var wfaTask = taskAuditArray[ind];
			for (var i in workflowTasks) {
				var wfbTask = workflowTasks[i];
				if (wfbTask.getActiveFlag() == 'Y') {
					if (capStatus == 'Submit Signed Plat') {
						editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,5,true));
					}
					else if (!capStatus == 'Submit Signed Plat') {
						if (AInfo['Special Consideration'] == 'Expedited') {
							editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,10,true));
						} else if (AInfo['Special Consideration'] == 'Fast Track') {
							editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,5,true));
						} else if (AInfo['Special Consideration'] == 'Regular') {
							editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,10,true));
						}
					}
					else { editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,10,true)); }
				}
			}
		}
	}

//4.1P and 5p and 9p and 95p any Hearing task and Denial or Approval or deferred is submitted then activate the Hearing task, and follow ELM Planning Due Date doc for ad hocs
	if (matches(wfTask,'CPC Hearing','BOS Hearing','BZA Hearing') && matches(wfStatus,'Deferred','Remanded','Deferred by Applicant','Deferred by CPC','Deferred by BOS','Deferred by BZA')){
		if (capStatus == 'Deferred from CPC' && !isTaskActive("CPC Hearing")) {
			activateTask("CPC Hearing");
		}
		else if ((capStatus == 'Deferred from BOS' || capStatus == 'Remanded from BOS') && !isTaskActive("BOS Hearing")) {
			activateTask("BOS Hearing");
		}
		else if (capStatus == 'Deferred from BZA' && !isTaskActive("BZA Hearing")){
			activateTask("BZA Hearing");
		}
	}
	
//07-2020 Boucher 40p - Land use Record do not have submittal count
	if (matches(wfTask,'Review Distribution') && matches(wfStatus,'Revisions Received') && AInfo['Submittal Count'] != null) {
		var subNum = parseInt(AInfo['Submittal Count']) + 1;
		editAppSpecific('Submittal Count',subNum);
	}
	
//33.1p
	if (matches(wfTask, 'Administrative Approval','BZA Hearing','BOS Hearing','Administrative Outcome','CPC Hearing') && matches(wfStatus, 'Final Approval','Approved','Denied','CPC Approved','CPC Approved with Admin Review','CPC Denied')) {
		if (AInfo['No Time Limit'] != 'CHECKED'){
		var ApprovedTimeLimit = AInfo['Approved Time Limit'];
		var BlankExpireDate = AInfo['Expiration Date'];
		var months = 12 * Number(ApprovedTimeLimit);
			if(BlankExpireDate == null || BlankExpireDate == "") {
				var NewExpireDate = dateAddMonths(dateAdd(null,0),months);
			}
			if(BlankExpireDate != null && BlankExpireDate != "") {
				var NewExpireDate = dateAddMonths(BlankExpireDate,months);
			}
			editAppSpecific("Expiration Date",NewExpireDate);
	}
	}	
// -------->  FEES <------------
	if ((appMatch("Planning/SitePlan/Major/NA")) && ((wfTask.equals("Review Consolidation") && matches(wfStatus,'RR-Revisions Requested','RR-Substantial Approval','RR-Table Review','RR-Staff and Developer Meeting')) && ((AInfo['Submittal Count'] > 2) && (AInfo['Waive Submittal Fee'] != 'CHECKED')))) {
		addFee('SITEPLAN2','CC-PLANNING','FINAL',1,'Y');
	}
	if ((appMatch("Planning/Subdivision/OverallConceptualPlan/NA")) && ((wfTask.equals("Review Consolidation") && matches(wfStatus,'RR-Revisions Requested','RR-Substantial Approval','RR-Table Review','RR-Staff and Developer Meeting')) && ((AInfo['Submittal Count'] > 2) && (AInfo['Waive Submittal Fee'] != 'CHECKED')))) {
		addFee('OCPLAN2','CC-PLANNING','FINAL',1,'Y');
	}
	if ((appMatch("Planning/Subdivision/ConstructionPlan/NA")) && ((wfTask.equals("Review Consolidation") && matches(wfStatus,'RR-Revisions Requested','RR-Substantial Approval','RR-Table Review','RR-Staff and Developer Meeting')) && ((AInfo['Submittal Count'] > 2) && (AInfo['Waive Submittal Fee'] != 'CHECKED')))) {
		addFee('CONSTPLAN2','CC-PLANNING','FINAL',1,'Y');
	}

//07-2020 Boucher 24p
	if (matches(wfTask, 'CPC Meeting', 'CPC Hearing') && matches(wfStatus, 'Deferred by Applicant')) {
		var tasksHistory = getWorkflowHistory_TPS(wfTask, wfStatus, null, capId);
		logDebug("tasksHistory(" + wfTask + "," + wfStatus + "): " + tasksHistory.length);
		var feeSchedule = "CC-PLANNING", feeCode = "DEFERRALPC", feeQty = 1;
		if (tasksHistory && tasksHistory.length > 1) {
			feeQty = 2
		}
		logDebug("Adding fee: " + feeSchedule + "." + feeCode + ", Qty:" + feeQty);
		addFee(feeCode, feeSchedule, 'FINAL', feeQty, 'Y');
	}

	//When 'BOS Hearing' is "Deferred by Applicant" add DEFERRALBOS fee with 1 for first and 2 for each after first
	if (matches(wfTask, 'BOS Hearing') && matches(wfStatus, 'Deferred by Applicant')) {
		var tasksHistory = getWorkflowHistory_TPS(wfTask, wfStatus, null, capId);
		logDebug("tasksHistory(" + wfTask + "," + wfStatus + "): " + tasksHistory.length);
		var feeSchedule = "CC-PLANNING", feeCode = "DEFERRALBOS", feeQty = 1;
		if (tasksHistory && tasksHistory.length > 1) {
			feeQty = 2
		}
		logDebug("Adding fee: " + feeSchedule + "." + feeCode + ", Qty:" + feeQty);
		addFee(feeCode, feeSchedule, 'FINAL', feeQty, 'Y');
	}
	//When 'BZA Hearing' is "Deferred by Applicant" add DEFERRALBZA fee with 1
	if (matches(wfTask, 'BZA Hearing') && matches(wfStatus, 'Deferred by Applicant')
		&& (appMatch("*/*/Variance/*") || appMatch("*/*/SpecialException/*") || appMatch("*/*/Appeal/*"))) {
		var tasksHistory = getWorkflowHistory_TPS(wfTask, wfStatus, null, capId);
		logDebug("tasksHistory(" + wfTask + "," + wfStatus + "): " + tasksHistory.length);
		var feeSchedule = "CC-PLANNING", feeCode = "DEFERRALBZA", feeQty = 1;
		if (tasksHistory && tasksHistory.length > 1) {
			feeQty = 2
		}
		logDebug("Adding fee: " + feeSchedule + "." + feeCode + ", Qty:" + feeQty);
		addFee(feeCode, feeSchedule, 'FINAL', feeQty, 'Y');
	}
	
// 56p Community/Subdivision/Development/Section Codes are generated here at time of Fees Received or Fees Waived - logic based on CODE SchemaDesign for GIS spreadsheet.
// Number should be generate, with padded 0 at the beginning.  No duplicates number for another active record.For: Planning/Subdivision/ Preliminary - OverallConceptualPlan - ConstructionPlan 
//  and Planning/SitePlan/ -> Schematics - Major - Minor

	var ComCodeName = "Community Code";
	var seq1CodeName = null;
	if (appMatch('*/Subdivision/Preliminary/*') || appMatch('*/Subdivision/OverallConceptualPlan/*') || appMatch('*/SitePlan/Schematics/*') || appMatch('*/SitePlan/Major/*')) {
		seq1CodeName = "Community Code";
		
		if (matches(wfTask,'Fee Payment') && matches(wfStatus,'Fees Received','Fees Waived','Payment Received')) {
		
			if (seq1CodeName && typeof (AInfo[ComCodeName]) != "undefined") {
				
				AInfo[ComCodeName] = generateCommunityCode(ComCodeName);
				if (AInfo[ComCodeName] < 10) {
					AInfo[ComCodeName] = '00'+AInfo[ComCodeName];
				}
				else if (AInfo[ComCodeName] < 100) {
					AInfo[ComCodeName] = '0'+AInfo[ComCodeName];
				}
				logDebug(ComCodeName + ": " + AInfo[ComCodeName]);
				editAppSpecific(ComCodeName, AInfo[ComCodeName]);	
			}
		}
	}
	
	var SubCodeName = "Subdivision Code";
	var seq2CodeName = null;
	if (appMatch('*/Subdivision/Preliminary/*') || appMatch('*/SitePlan/Major/*')) {
		seq2CodeName = "Subdivision Code";
		
		if (matches(wfTask,'Fee Payment') && matches(wfStatus,'Fees Received','Fees Waived','Payment Received')) {
		
			if (seq2CodeName && typeof (AInfo[SubCodeName]) != "undefined") {
				
				AInfo[SubCodeName] = generateSubdivCode(SubCodeName);
				if (AInfo[SubCodeName] < 100) {
					AInfo[SubCodeName] = '000'+AInfo[SubCodeName];
				}
				else if (AInfo[SubCodeName] < 1000) {
					AInfo[SubCodeName] = '00'+AInfo[SubCodeName];
				}
				else if (AInfo[SubCodeName] < 10000) {
					AInfo[SubCodeName] = '0'+AInfo[SubCodeName];
				}
				logDebug(SubCodeName + ": " + AInfo[SubCodeName]);
				editAppSpecific(SubCodeName, AInfo[SubCodeName]);	
			}
		}
	}
	
	var DevCodeName = "Development Code";
	var seq3CodeName = null;
	if (appMatch('*/SitePlan/Minor/*') || appMatch('*/SitePlan/Major/*')) {
		seq3CodeName = "Development Code";
		
		if (matches(wfTask,'Fee Payment') && matches(wfStatus,'Fees Received','Fees Waived','Payment Received')) {
		
			if (seq3CodeName && typeof (AInfo[DevCodeName]) != "undefined") {
				
				AInfo[DevCodeName] = generateDevCode(DevCodeName);
				if (AInfo[DevCodeName] < 100) {
					AInfo[DevCodeName] = '000'+AInfo[DevCodeName];
				}
				else if (AInfo[DevCodeName] < 1000) {
					AInfo[DevCodeName] = '00'+AInfo[DevCodeName];
				}
				else if (AInfo[DevCodeName] < 10000) {
					AInfo[DevCodeName] = '0'+AInfo[DevCodeName];
				}
				logDebug(DevCodeName + ": " + AInfo[DevCodeName]);
				editAppSpecific(DevCodeName, AInfo[DevCodeName]);	
			}
		}
	}

	var SecCodeName = "Section Code";
	var seq4CodeName = null;
	if (appMatch('*/Subdivision/ConstructionPlan/*')) {
		seq4CodeName = "Section Code";
		
		if (matches(wfTask,'Fee Payment') && matches(wfStatus,'Fees Received','Fees Waived','Payment Received')) {
		
			if (seq4CodeName && typeof (AInfo[SecCodeName]) != "undefined") {
				
				AInfo[SecCodeName] = generateSecCode(SecCodeName);
				if (AInfo[SecCodeName] < 100) {
					AInfo[SecCodeName] = '00'+AInfo[SecCodeName];
				}
				else if (AInfo[SecCodeName] < 1000) {
					AInfo[SecCodeName] = '0'+AInfo[SecCodeName];
				}
				logDebug(SecCodeName + ": " + AInfo[SecCodeName]);
				editAppSpecific(SecCodeName, AInfo[SecCodeName]);	
			}
		}
	}
	//Still need data from GIS to finish this requirement - not sure why this is not generating...
	var SubIDName = "Subdivision ID";
	var seq5CodeName = null;
	if (appMatch('*/Subdivision/Final Plat/*')) {
		seq5CodeName = "Subdividion ID";
		
		if (matches(wfTask,'Fee Payment') && matches(wfStatus,'Fees Received','Fees Waived','Payment Received')) {
		
			//if (seq5CodeName && typeof (AInfo[SubIDName]) != "undefined") {
				
				AInfo[SubIDName] = 'ComCode-SubCode-' + AInfo['ParcelAttribute.CensusTract'];
				logDebug(SubIDName + ": " + AInfo[SubIDName]);
				editAppSpecific(SubIDName, AInfo[SubIDName]);	
			//}
		}
	}

// 44P: When Adhoc Workflow Task "Sign Posting" Status 'Signs Removed' is submitted, lookup the Record ID from the Standard Choice list, and then remove the Record ID.
// Makes the 3 digit number available again.This is related to what was done for 10P:
//	On Record Creation: Custom Field Sign Posting Number should be auto populated with a number of 100 - 999.  The number must not be a duplicate number for another active record.
// Sign Posting field should be auto generated number 100 - 999. when a case is active that number should be skipped - no duplicates.The sign post number is a number is related to the IVR prompt that will be recorded so that callers may get case information from calling the number.There is a specific and finite group of numbers that have been identified for the 2 case types. Accela is to provide the next available number from the list.
	if (wfTask == 'Sign Posting' && wfStatus == 'Signs Removed') {
		var seqName = "Sign Posting Number";
		var fieldName = null;
		if (appMatch("Planning/LandUse/ManufacturedHomes/NA") || appMatch("Planning/LandUse/RPAException/NA")) {
			fieldName = seqName;
		} else if (appMatch("Planning/LandUse/*/*")
			&& exists(appTypeArray[2], ["Variance", "AdminVariance", "SpecialExceptions", "HistoricPreservation", "SubstantialAccord", "Utilities Waiver", "ZoningCase"])) {
			fieldName = seqName;
		} else if (appMatch("Planning/Subdivision/ExceptiontoPreliminary/NA") || appMatch("Planning/Subdivision/Preliminary/NA")) {
			fieldName = seqName;
		} else if (appMatch("Planning/SitePlan/Schematics/NA") || appMatch("Planning/SitePlan/Major/NA")) {
			fieldName = seqName;
		}
		if (fieldName && typeof (AInfo[fieldName]) != "undefined") {
			logDebug("Releasing " + fieldName + " " + AInfo[fieldName]);
			editAppSpecific(fieldName, "Removed " + AInfo[fieldName]);
		}
	}
} catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}


/*07-2020 Boucher old 21p 
	if (matches(wfTask,'Review Consolidation','Community Meeting') && matches(wfStatus,'Move to CPC')) {
		var tsi = []
		loadTaskSpecific(tsi);
		if (tsi["CPC Due Date"] != null) {
			if (isTaskActive('Public Notices')) {
				editTaskDueDate('Public Notices',tsi["CPC Due Date"]);
			}
			if (isTaskActive('Adjacents')) {
				editTaskDueDate('Adjacents',tsi["CPC Due Date"]);
			}
			if (isTaskActive('IVR Message')) {
				editTaskDueDate('IVR Message',tsi["CPC Due Date"]);
			}
			if (isTaskActive('Sign Posting')) {
				editTaskDueDate('Sign Posting',tsi["CPC Due Date"]);
			}
			if (isTaskActive('Maps')) {
				editTaskDueDate('Maps',tsi["CPC Due Date"]);
			}
		}
	}*/
//Below is all code from previous implementer - Not sure if these work db
/*
var recordTypesArray = new Array("Planning/Subdivision/ConstructionPlan", "Planning/Subdivision/Preliminary", "Planning/Subdivision/Overall",
		"Planning/Subdivision/Conceptual Plan", "Planning/Subdivision/ExceptiontoPreliminary", "Planning/siteplan/Major", "Planning/siteplan/Minor",
		"Planning/siteplan/Schematics");

var module = appTypeArray[0];
var type = appTypeArray[1];
var subType = appTypeArray[2];
var itemAppTypeString = module + "/" + type + "/" + subType;
var meetingDuration = 60;
var meetingType = "PLANNING COMMISSION HEARING";
var meetingSubject = "Staff and Developer Meetings";

var Priority = AInfo['Special Consideration'];
//Review Consolidation
var TaskTocheckActive = "Review Consolidation";
//Staff and Developer Meeting"
var tasktobeActive = "Staff and Developer Meeting";

for (var i in recordTypesArray) {
	if (itemAppTypeString.equals(recordTypesArray[i])) {
		if (isTaskActive(TaskTocheckActive) && !isTaskActive(tasktobeActive)) {
			activateTask(tasktobeActive);
			if ((Priority == "Fast Track" || "Expedited") && type == "Commercial") {
				editTaskDueDate(tasktobeActive, getDueDate(3, 3));
				scheduleMeeting(getDueDate(3, 3));
			} else if (Priority == "Regular" && type == "Commercial") {
				editTaskDueDate(tasktobeActive, getDueDate(28, 3));
				scheduleMeeting(getDueDate(28, 3));
			} else if ((Priority == "Fast Track" || "Expedited") && type == "Subdivision") {
				editTaskDueDate(tasktobeActive, getDueDate(3, 4));
				scheduleMeeting(getDueDate(3, 4));
			} else if (Priority == "Regular" && type == "Subdivision") {
				editTaskDueDate(tasktobeActive, getDueDate(28, 4));
				scheduleMeeting(getDueDate(28, 4));
			}
		}
	}
}

/**
 * this function to calculate the due date based on the requirement
 * @param numberofDays the minimum days that pass before the meeting is scheduled
 * @param dayId day id that need to get it Ex. 0 is Sunday and 3 is Wednesday
 * Ex.getDueDate(3,3) this will return date of the next Wednesday after the 3 days from .
 * @returns Due Date
 *
function getDueDate(numberofDays, dayId) {
	var nextDate = new Date();
	nextDate.setDate(nextDate.getDate() + parseInt(numberofDays));
	nextDate.setDate(nextDate.getDate() + (dayId - 1 - nextDate.getDay() + 7) % 7 + 1);
	var dd = nextDate.getDate();
	var mm = nextDate.getMonth() + 1;
	var yy = nextDate.getFullYear();
	var day = nextDate.getDay();
	var formatedDate = mm + '/' + dd + '/' + yy;
	return formatedDate;
}

/**
 * this function to schedule the needed meeting based on the active task
 * @param meetingDate
 *

function scheduleMeeting(meetingDate) {
	var workflowTasks = aa.workflow.getTasks(capId).getOutput();
	var contactList = getContactsListByType("Applicant", capId);
	var list = aa.meeting.getMeetingCalendars().getOutput();
	var meetingIds = aa.meeting.addMeeting(list[0].getMeetingGroupId(), meetingSubject, meetingType, meetingDate).getOutput();
	var scheduleResult = aa.meeting.scheduleMeeting(capId, list[0].getMeetingGroupId(), meetingIds.get(0), meetingDuration, meetingSubject, meetingSubject);
	var MeetingModelList = aa.meeting.getMeetingsByCAP(capId, false).getOutput();
	var MeetingAttendeeList = aa.util.newArrayList();
	var CurrentMeetingModelsList = aa.util.newArrayList();
	for (var i = 0; i < MeetingModelList.size(); i++) {

		if (MeetingModelList.get(i).getMeetingID() == meetingIds.get(0)) {
			CurrentMeetingModelsList.add(MeetingModelList.get(i))
		}
	}

	var taskAuditArray = [];
	for (var i in workflowTasks) {
		var userExists = false;
		if (workflowTasks[i].getCompleteFlag() == "Y" && workflowTasks[i].getTaskDescription().indexOf("Review") != -1 && workflowTasks[i].getTaskDescription() != "Project Manager Review" && workflowTasks[i].getTaskDescription() != "First Glance Review" && workflowTasks[i].getTaskDescription() != "Review Distribution" || (workflowTasks[i].getTaskDescription() == "Environmental Engineering")) {
			for (var ind in taskAuditArray) {
				if (taskAuditArray[ind] == workflowTasks[i].getTaskItem().getAuditID()) {
					userExists = true;
					break;
				}

			}
			if (!userExists) {
				aa.print("userExists " + userExists);
				taskAuditArray.push(workflowTasks[i].getTaskItem().getAuditID());
				var userObject = aa.people.getSysUserByID(workflowTasks[i].getTaskItem().getAuditID()).getOutput();
				var seq = userObject.getGaUserID();
				var fullName = userObject.getFullName();
				var MeetingAttendeeModel = aa.meeting.createMeetingAttendeeModel(meetingIds.get(0), list[0].getMeetingGroupId(), capId, seq, fullName, userObject.getEmail()).getOutput();
				MeetingAttendeeModel.setEntityType(com.accela.aa.meeting.meeting.attendee.AttendeeEntity.User.getEntityType());
				MeetingAttendeeModel.setEntityValue(seq);
				MeetingAttendeeList.add(MeetingAttendeeModel);
			}
		}
	}

	for (var x in contactList) {
		var seq = contactList[x]["contactSeqNumber"];
		var fullName = contactList[x]["firstName"] + " " + contactList[x]["lastName"];
		var MeetingAttendeeModel = aa.meeting.createMeetingAttendeeModel(meetingIds.get(0), list[0].getMeetingGroupId(), capId, seq, fullName, contactList[x]["email"]).getOutput();
		MeetingAttendeeList.add(MeetingAttendeeModel);

	}

	if (MeetingAttendeeList.size() > 0 && CurrentMeetingModelsList.size() > 0) {

		var attendeeBuisnessObject = aa.proxyInvoker.newInstance("com.accela.aa.meeting.meeting.attendee.MeetingAttendeeBusiness").getOutput();
		attendeeBuisnessObject.createAttendees(CurrentMeetingModelsList, MeetingAttendeeList);
	}

}

/**
 * this function is to get the cap contact by type
 * @param ContactType
 * @returns contact array if exists else returns false
 *

function getContactsListByType(ContactType) {
	var contactArray = getPeople(capId);
	var contactsArray = new Array;
	if (contactArray.length > 0) {
		for (var cc = 0; cc < contactArray.length; cc++) {
			if (contactArray[cc].getPeople().contactType == ContactType) {
				var contact = [];
				contact["lastName"] = contactArray[cc].getPeople().lastName;
				contact["firstName"] = contactArray[cc].getPeople().firstName;
				contact["middleName"] = contactArray[cc].getPeople().middleName;
				contact["businessName"] = contactArray[cc].getPeople().businessName;
				contact["contactSeqNumber"] = contactArray[cc].getPeople().contactSeqNumber;
				contact["contactType"] = contactArray[cc].getPeople().contactType;
				contact["relation"] = contactArray[cc].getPeople().relation;
				contact["phone1"] = contactArray[cc].getPeople().phone1;
				contact["phone2"] = contactArray[cc].getPeople().phone2;
				contact["email"] = contactArray[cc].getPeople().email;
				contact["addressLine1"] = contactArray[cc].getPeople().getCompactAddress().getAddressLine1();
				contact["addressLine2"] = contactArray[cc].getPeople().getCompactAddress().getAddressLine2();
				contact["city"] = contactArray[cc].getPeople().getCompactAddress().getCity();
				contact["state"] = contactArray[cc].getPeople().getCompactAddress().getState();
				contact["zip"] = contactArray[cc].getPeople().getCompactAddress().getZip();
				contact["fax"] = contactArray[cc].getPeople().getFax();
				contact["country"] = contactArray[cc].getPeople().getCountryCode();
				contact["fullName"] = contactArray[cc].getPeople().getFullName();
				contact["peopleModel"] = contactArray[cc].getPeople();
				contactsArray.push(contact);
			}
		}
		return contactsArray
	}

	return false;  }
*/