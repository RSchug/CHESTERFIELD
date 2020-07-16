// ASIUA:Building/Permit/Elevator/Installation
if (parentCapId && appMatch("Building/Structure/NA/NA",parentCapId)){
    removeASITable("Elevators",parentCapId); 
    copyASITables(capId, parentCapId,["Elevators"])    
}
