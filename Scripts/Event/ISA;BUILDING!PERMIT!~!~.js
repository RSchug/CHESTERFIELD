comment("Test form ISA");
comment("Get the Inspection Count for this type");
var inspResult = aa.inspection.getInspection(capId,inspId); 
inspObj = inspResult.getOutput(); 
inspObj.setTimeTotal(Number(getinsptypecount(capId,inspType)));
var result = aa.inspection.editInspection(inspObj);

if(getLastInspectioncomment(inspType) != "No Comments")
{
    var reqcomment = getInspectionComment(capId,inspId);
	if(reqcomment != "No Comment" && reqcomment != null)
	{
		inspcomment = reqcomment + " Last Result: " + getLastInspectioncomment(inspType);
		editInspectionComment(capId, inspId, inspcomment); 
	}
	else
	{
		editInspectionComment(capId, inspId, getLastInspectioncomment(inspType));
	}
}
//When Framing Inspection Type is scheduled, schedule a VSMP Inspection Type for the following day and assign to EE Inspector
if(matches(inspType,"Framing")){
	scheduleInspectDate("VSMP",dateAdd(inspSchedDate,1),currentUserID,null,"Auto Scheduled from Scheduled Framing Inspection");
	}