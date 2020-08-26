//1P Activate Adhoc Tasks that are already not Active based on Workflow 'Review Distribution' Status of 'Routed for Review'
	if ((matches(wfTask,'Review Distribution') && matches (wfStatus,'Routed for Review')) && !isTaskActive("Public Notices")){
		addAdHocTask("ADHOC_WORKFLOW","Public Notices","");
	}
	if ((matches(wfTask,'Review Distribution') && matches (wfStatus,'Routed for Review')) && !isTaskActive("Adjacents")){
		addAdHocTask("ADHOC_WORKFLOW","Adjacents","");
	}
	if ((matches(wfTask,'Review Distribution') && matches (wfStatus,'Routed for Review')) && !isTaskActive("IVR Message")){
		addAdHocTask("ADHOC_WORKFLOW","IVR Message","");
	}
	if ((matches(wfTask,'Review Distribution') && matches (wfStatus,'Routed for Review')) && !isTaskActive("Sign Posting")){
		addAdHocTask("ADHOC_WORKFLOW","Sign Posting","");
	}
	if ((matches(wfTask,'Review Distribution') && matches (wfStatus,'Routed for Review')) && !isTaskActive("Maps")){
		addAdHocTask("ADHOC_WORKFLOW","Maps","");
	}
//4.1P When Workflow Task 'CPC Hearing' Status' 'Recommend Denial' or 'Recommend Approval' is submitted then re-activate AdHoc Tasks; 'Public Notices', 'Adjacents', 'IVR Message', 'Sign Posting' and 'Maps'.
	if ((matches(wfTask,'CPC Hearing') && matches(wfStatus,'Recommend Denial','Recommend Approval')) && !isTaskActive("Public Notices")){
		addAdHocTask("ADHOC_WORKFLOW","Public Notices","");
	}
	if ((matches(wfTask,'CPC Hearing') && matches(wfStatus,'Recommend Denial','Recommend Approval')) && !isTaskActive("Adjacents")){
		addAdHocTask("ADHOC_WORKFLOW","Adjacents","");
	}
		if ((matches(wfTask,'CPC Hearing') && matches(wfStatus,'Recommend Denial','Recommend Approval')) && !isTaskActive("Maps")){
		addAdHocTask("ADHOC_WORKFLOW","Maps","");
	}
//5P When Workflow Task  'CPC Hearing' Status 'Deferred by Applicant' or 'Deferred by CPC' is submitted, then Re-Activate the Adhoc Tasks; 'Public Notices', 'Adjacents', 'IVR Message', 'Sign Posting' and 'Maps'
//	if ((matches(wfTask,'CPC Hearing') && matches(wfStatus,'Deferred by Applicant','Deferred by CPC')) && !isTaskActive("Public Notices")){
//		addAdHocTask("ADHOC_WORKFLOW","Public Notices","");
//	}
//	if ((matches(wfTask,'CPC Hearing') && matches(wfStatus,'Deferred by Applicant','Deferred by CPC')) && !isTaskActive("Adjacents")){
//		addAdHocTask("ADHOC_WORKFLOW","Adjacents","");
//	}
//	if ((matches(wfTask,'CPC Hearing') && matches(wfStatus,'Deferred by Applicant','Deferred by CPC')) && !isTaskActive("Maps")){
//		addAdHocTask("ADHOC_WORKFLOW","Maps","");
//	}
//9P When Workflow Task 'BOS Hearing' Status 'Deferred by BOS' or 'Deferred by Applicant' or 'Remanded' is submitted then Re-Activate the Adhoc Tasks; 'Public Notices', 'Adjacents', 'IVR Message', 'Sign Posting' and 'Maps'.
//	if ((matches(wfTask,'BOS Hearing') && matches(wfStatus,'Deferred by BOS','Deferred by Applicant')) && !isTaskActive("Public Notices")){
//		addAdHocTask("ADHOC_WORKFLOW","Public Notices","");
//	}
//	if ((matches(wfTask,'BOS Hearing') && matches(wfStatus,'Deferred by BOS','Deferred by Applicant')) && !isTaskActive("Adjacents")){
//		addAdHocTask("ADHOC_WORKFLOW","Adjacents","");
//	}
//	if ((matches(wfTask,'BOS Hearing') && matches(wfStatus,'Deferred by BOS','Deferred by Applicant')) && !isTaskActive("Maps")){
//		addAdHocTask("ADHOC_WORKFLOW","Maps","");
//	}
try {
//07-2020 Boucher 11p	
	if (matches(wfTask,'Review Distribution') && matches(wfStatus,'Routed for Review')) {
		editTaskDueDate('Sign Posting',dateAdd(null,7));
	//07-2020 Boucher script 82p
		var workflowTasks = aa.workflow.getTasks(capId).getOutput();
		var taskAuditArray = ['Public Notices','Adjacents','IVR Message','Maps','Airport Review','Assessor Review','Building Inspection Review','Budget Review','Community Enhancement Review','County Library Review','Chesterfield Historical Society Review','Department of Health Review','CDOT Review','Economic Development Review','Environmental Engineering Review','Fire and Life Safety Review','GIS-EDM Utilities Review','GIS-IST Review','Parks and Recreation Review','Planning Review','Police Review','Real Property Review','School Research and Planning Review','School Board','Utilities Review','VDOT Review','Water Quality Review','Technical Review Committe','Staff and Developer Meeting'];
		for (var ind in taskAuditArray) {
			var wfaTask = taskAuditArray[ind];
			for (var i in workflowTasks) {
				var wfbTask = workflowTasks[i];
				if (wfbTask.getActiveFlag() == 'Y') {
					//logDebug('Task from Array = ' + wfaTask + ' and the Task from Record = ' + wfbTask.getTaskDescription());
					if (wfaTask == wfbTask.getTaskDescription()) {
						if (AInfo['Special Consideration'] == 'Expedited') {
						editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,14));
						} else if (AInfo['Special Consideration'] == 'Fast Track') {
						editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,7));
						} else if (AInfo['Special Consideration'] == 'Regular') {
						editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,21));
						}
					else
						editTaskDueDate(wfbTask.getTaskDescription(),dateAdd(null,21));
					}
				}
			}
		}
	}
//07-2020 Boucher 21p
	if (matches(wfTask,'Review Consolidation') && matches(wfStatus,'Move to CPC')) {
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
	}
//07-2020 Boucher 40p
	if (matches(wfTask,'Review Distribution') && matches(wfStatus,'Revisions Received') && AInfo['Submittal Count'] != null) {
		var subNum = parseInt(AInfo['Submittal Count']) + 1;
		editAppSpecific('Submittal Count',subNum);
	}
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
		&& (appMatch("Planning/LandUse/Variance/NA") || appMatch("Planning/LandUse/SpecialException/NA" || appMatch("Planning/LandUse/Appeal/NA"))) {
		var tasksHistory = getWorkflowHistory_TPS(wfTask, wfStatus, null, capId);
		logDebug("tasksHistory(" + wfTask + "," + wfStatus + "): " + tasksHistory.length);
		var feeSchedule = "CC-PLANNING", feeCode = "DEFERRALBZA", feeQty = 1;
		if (tasksHistory && tasksHistory.length > 1) {
			feeQty = 2
		}
		logDebug("Adding fee: " + feeSchedule + "." + feeCode + ", Qty:" + feeQty);
		addFee(feeCode, feeSchedule, 'FINAL', feeQty, 'Y');
	}
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
} catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}
//20P When AdHoc Task 'Signs Posted' Status is updated to any value and Adhoc Task 'IVR Message' current Status is not "Message Recorded" Then display error 'Message needs to be recorded before signs can be posted'. Do not stop the workflow, just show Message to end user.
if (wfTask == 'Sign Posting') {
	showMessage = true;
	comment('Message needs to be recorded before signs can be posted.');
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
		editAppSpecific(fieldName, null);
	}
}