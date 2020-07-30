if (wfTask == 'BMP Certification' && (matches(wfStatus, "Received"))) {
    scheduleInspection("BMP", 30, InspAssignment, null, "Auto Scheduled");
}
