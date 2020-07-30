//Erosion and Sediment Control Review and Enforcement Fees 8.2P and 8.3P
if ((wfTask == 'First Glance Consolidation' && wfStatus == 'First Glance Review Complete') && (AInfo["Total Residential Lots"] != null)) {
    addFee("ERSCRENFORCE","CC-PLANNING","FINAL",1,"N"); 
} 