//

if (wfTask == 'Community Enhancement' && wfStatus == 'Inspection Required PM') 
{deactivateTask("Community Enhancement"); 
newChildID = createChild("Enforcement","Property Maintenance","NA","NA","");
    saveCapId = capId;
    capId = newChildID;
    scheduleInspection("Initial",1,currentUserID,null,"Auto Scheduled");
    capId = saveCapId;
    }

if (wfTask == 'Community Enhancement' && wfStatus == 'Inspection Required ZC') 
{deactivateTask("Community Enhancement"); 
newChildID = createChild("Enforcement","Zoning Code Compliance","NA","NA","");
    saveCapId = capId;
    capId = newChildID;
    scheduleInspection("Initial",1,currentUserID,null,"Auto Scheduled");
    deactivateTask("Initiation");
    activateTask("Investigation");
    capId = saveCapId;
    }

if (wfTask == 'Community Enhancement' && wfStatus == 'Inspection Required PM and ZC') 
{deactivateTask("Community Enhancement"); 
newChildID = createChild("Enforcement","Property Maintenance","NA","NA","");
    saveCapId = capId;
    capId = newChildID;
    scheduleInspection("Initial",1,currentUserID,null,"Auto Scheduled");
    capId = saveCapId;
    }

if (wfTask == 'Community Enhancement' && wfStatus == 'Inspection Required PM and ZC') 
{newChildID = createChild("Enforcement","Zoning Code Compliance","NA","NA","");
    saveCapId = capId;
    capId = newChildID;
    scheduleInspection("Initial",1,currentUserID,null,"Auto Scheduled");
    deactivateTask("Initiation");
    activateTask("Investigation");
    capId = saveCapId;
    }
if (wfTask == 'Community Enhancement' && wfStatus == 'KCB Workorder')
{newChildID = createChild("Enforcement","KCB Workorder","NA","NA","");
    saveCapId = capId;
    capId = newChildID;
    updateTask("Initiation","Pending Review","Updated based on Concern Record","");
    capId = saveCapId;
    }