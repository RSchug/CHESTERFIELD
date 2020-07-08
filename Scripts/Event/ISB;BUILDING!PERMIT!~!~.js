// ISB:BUILDING/PERMIT/*/*
// Permit must be Issued or Temporary CO Issued, except Site Visit Inspection
if (inspType != "Site Visit" && (!wasCapStatus(["Issued","Temporary CO Issued"]))) {
        showMessage = true;
        comment('<font size=small><b>Record must be Issued to schedule inspections</b></font>');
        cancel = true;
        removeInspection(inspObj); 
}