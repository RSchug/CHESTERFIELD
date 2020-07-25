logDebug("Entering IRSA:BUILDING/*/*/*");
var inspBillable = inspObj.getInspection().getActivity().getInspBillable();
logDebug("Inspection Billable checkbox = " + inspBillable + ". And Inspection Result = " + inspResult);
if (inspBillable == "Y" && matches(inspResult,"Corrections Required","Approved")) {
	addFeeWithExtraData("REINSPECTION","CC-BLD-ADMIN","FINAL",1,"Y",capId,inspType+" ("+Math.round(inspTotalTime)+")");
}
//52B:If Inspection Result = Corrections Required, and 'Not Ready Fee' is checked, then add Not Ready Fee("CC-BLD-ADMIN", "NOTREADY"). Inspection Detail Page field is called 'Overtime'
var inspOvertime = inspObj.getInspection().getActivity().getOvertime();
logDebug("Inspection Not Ready (Overtime) checkbox = " + inspOvertime + ". And Inspection Result = " + inspResult);
if (matches(inspResult, "Corrections Required") && inspOvertime == "Y") {
	addFeeWithExtraData("NOTREADY", "CC-BLD-ADMIN", "FINAL", 1, "Y", capId, inspType);
}
//If Inspection Result is "Approved" for Inspection Type "Building Final" close the Inspections Workflow Task.//
if (appMatch("Building/Permit/Residential/NA") && inspType.equals("Building Final") && inspResult.equals("Approved")){
	closeTask("Inspections","CO Ready to Issue","Updated based on Completed Inspection Result","");
	activateTask("Certificate of Occupancy");
	}
if (appMatch("Building/Permit/Residential/Demolition") && inspType.equals("Building Final") && inspResult.equals("Approved")){
	closeTask("Inspections","CO Ready to Issue","Updated based on Completed Inspection Result","");
	}
if (appMatch("Building/Permit/Commercial/NA") && inspType.equals("Building Final") && inspResult.equals("Approved")){
	closeTask("Inspections","CO Ready to Issue","Updated based on Completed Inspection Result","");
	activateTask("Certificate Issuance");
	}
if (appMatch("Building/Permit/Commercial/Demolition") && inspType.equals("Building Final") && inspResult.equals("Approved")){
	closeTask("Inspections","CO Ready to Issue","Updated based on Completed Inspection Result","");
	}
//If Inspection Result is "Approved" for Inspection Type "Property Conversion Inspection" close the Inspections Workflow Task.//
if (inspType.equals("Property Conversion Inspection") && inspResult.equals("Approved")){
	closeTask("Inspections","Approved","Updated based on Completed Inspection Result","");
	}
//If Inspection Result is "Approved" for Inspection Type "Home Inspection" close the Inspections Workflow Task.//
if (inspType.equals("Home Inspection") && inspResult.equals("Approved")){
	closeTask("Inspections","Approved","Updated based on Completed Inspection Result","");
	}
//If Inspection Result is "Approved" for Inspection Type "Rental Inspection" close the Inspections Workflow Task.//
if (inspType.equals("Rental Inspection") && inspResult.equals("Approved")){
	closeTask("Inspections","Approved","Updated based on Completed Inspection Result","");
	}
//If Inspection Result is "Approved" for Inspection Type "Amusement Final" close the Inspections Workflow Task.//
if (inspType.equals("Amusement Final") && inspResult.equals("Approved")){
	closeTask("Inspections","Completed","Updated based on Completed Inspection Result","");
	}
//If Inspection Result is "Approved" for Inspection Type "Boiler" close the Inspections Workflow Task.//
if (inspType.equals("Boiler") && inspResult.equals("Approved")){
	closeTask("Inspections","Completed","Updated based on Completed Inspection Result","");
	}
//If Inspection Result is "Approved" for Inspection Type "Electrical Final" close the Inspections Workflow Task.//
if (inspType.equals("Electrical Final") && inspResult.equals("Approved")){
	closeTask("Inspections","Completed","Updated based on Completed Inspection Result","");
	}
//If Inspection Result is "Approved" for Inspection Type "Gas Final" close the Inspections Workflow Task.//
if (inspType.equals("Gas Final") && inspResult.equals("Approved")){
	closeTask("Inspections","Completed","Updated based on Completed Inspection Result","");
	}
//If Inspection Result is "Approved" for Inspection Type "Mechanical Final" close the Inspections Workflow Task.//
if (inspType.equals("Mechanical Final") && inspResult.equals("Approved")){
	closeTask("Inspections","Completed","Updated based on Completed Inspection Result","");
	}
//If Inspection Result is "Approved" for Inspection Type "Plumbing Final" close the Inspections Workflow Task.//
if (inspType.equals("Plumbing Final") && inspResult.equals("Approved")){
	closeTask("Inspections","Completed","Updated based on Completed Inspection Result","");
	}
//If Inspection Result is "Approved" for Inspection Type "Elevator Final" close the Inspections Workflow Task.//
if (inspType.equals("Elevator Final") && inspResult.equals("Approved")){
	closeTask("Inspections","Completed","Updated based on Completed Inspection Result","");
	}
//If Inspection Result is "Approved" for Inspection Type "Sign Final" close the Inspections Workflow Task.//
if (inspType.equals("Sign Final") && inspResult.equals("Approved")){
	closeTask("Inspections","Completed","Updated based on Completed Inspection Result","");
	}
