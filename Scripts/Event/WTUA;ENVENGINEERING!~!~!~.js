//Fees
var TotalLDAcreage = parseFloat(AInfo['Total Land Disturbance Acreage']);
if (appMatch('EnvEngineering/Plan Review/Linear Project/NA') && (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') && (TotalLDAcreage <=.229)) {
    addFee("ERSCRENFMIN","CC-EE","FINAL",1,"Y");
    }
if (appMatch('EnvEngineering/Plan Review/ESC Plan/NA') && (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') && (TotalLDAcreage <=.229)) {
    addFee("ERSCRENFMIN","CC-EE","FINAL",1,"Y");
    }
if (appMatch('EnvEngineering/Plan Review/Linear Project/NA') && (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') && (TotalLDAcreage >.229)) {
    addFee("ERSCRENFORCE","CC-EE","FINAL",1,"Y");
    }
if (appMatch('EnvEngineering/Plan Review/ESC Plan/NA') && (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') && (TotalLDAcreage >.229)) {
    addFee("ERSCRENFORCE","CC-EE","FINAL",1,"Y");
    }
if (appMatch('EnvEngineering/Plan Review/Timbering/NA') && (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment')) {
    addFee("ERSCRENFMIN","CC-EE","FINAL",1,"Y");
    }