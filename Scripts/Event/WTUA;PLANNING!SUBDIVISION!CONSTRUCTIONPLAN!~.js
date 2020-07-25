//Site Plan - Initial Submittal Fee 8.1P
if (wfTask == 'Application Submittal' && wfStatus == 'Accepted for First Glance Review') {
    addFee("SITEPLAN","CC-PLANNING","FINAL",1,"N");
//Erosion and Sediment Control Review and Enforcement Fees 8.2P
    addFee("ERSCRENFMIN","CC-PLANNING","FINAL",1,"N");
    addFee("ERSCRENFORCE","CC-PLANNING","FINAL",1,"N");
}
//Site Plan - Submittals Subsequent to First 3 Submittals Fees based on ASI Field 'Submittal Count'
//if ((wfTask == 'Review Distribution' && wfStatus == 'Revisions Received') && (AInfo["Submittal Count"] > 3)){
//    addFee("SITEPLAN2","CC-PLANNING","FINAL",1,"N")}