//19P IF Workflow Task = Review Coordination and Status is updated, if Data Field 'Minor Site Plan Allowed' is null, 
//THEN show Message 'Approved for Minor Site data needs to be populated.'
if ((wfTask == 'Review Consolidation') && (AInfo["11. Minor Site Plan Allow"] == null)) {
        showMessage = true;
        comment('<font size=small><b>Approved for Minor Site data needs to be populated');
        cancel = true;
}