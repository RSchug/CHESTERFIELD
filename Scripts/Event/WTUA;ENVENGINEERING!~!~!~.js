//Fees
var TotalLDAcreage = parseFloat(AInfo['Total Land Disturbance Acreage']);
if ((appMatch('EnvEngineering/Plan Review/Linear Project/NA') || appMatch('EnvEngineering/Plan Review/ESC Plan/NA')) && (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') && (TotalLDAcreage <=.229)) {
    addFee("ERSCRENFMIN","CC-PLANNING","FINAL",1,"N");
    }
if ((appMatch('EnvEngineering/Plan Review/Linear Project/NA') || appMatch('EnvEngineering/Plan Review/ESC Plan/NA')) && (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment') && (TotalLDAcreage >.229)) {
    addFee("ERSCRENFMIN","CC-PLANNING","FINAL",1,"N");
    }
if (appMatch('EnvEngineering/Plan Review/Timbering/NA') && (wfTask == 'Application Submittal' && wfStatus == 'Ready for Payment')) {
    addFee("ERSCRENFMIN","CC-PLANNING","FINAL",1,"N");
    }