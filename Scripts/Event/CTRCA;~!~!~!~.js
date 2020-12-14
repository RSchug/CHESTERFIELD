try {
	//Add Planning/LandUse/RPAException/NA Fee
	if (publicUser && appMatch("Planning/LandUse/RPAException/NA")){
		addFee("RPAEXCEPTION","CC-PLANNING","FINAL",1,"N");
		addFee("RPAEXCEPTOTH","CC-PLANNING","FINAL",1,"N");
	}
	if (appMatch('Planning/*/*/*')) {
	//create parent relationships - any and all - firstParentName is 1st pageflow, secondParentName is in ASI
		if (AInfo["Inquiry Case Number"] != null) {
			var firstParentName = AInfo["Inquiry Case Number"];
			addParent(firstParentName);
		}
		else if (AInfo["Zoning Opinion Number"] != null) {
			var firstParentName = AInfo["Zoning Opinion Number"];
			addParent(firstParentName);
		}
		if ([AInfo["Case Number"] != null) {
			var secondParentName = [AInfo["Case Number"]
			addParent(secondParentName);
		}
		else if (AInfo["Historic Case Number"] != null) {
			var secondParentName = [AInfo["Historic Case Number"]
			addParent(secondParentName);
		}
		else if (AInfo["Previous Case Number (if applicable)"] != null) {
			var secondParentName = [AInfo["Previous Case Number (if applicable)"]
			addParent(secondParentName);
		}
		else if (AInfo["Previous case number"] != null) {
			var secondParentName = [AInfo["Previous case number"]
			addParent(secondParentName);
		}
		else if (AInfo["Related case number"] != null) {
			var secondParentName = [AInfo["Related case number"]
			addParent(secondParentName);
		}
		else if (AInfo["Related Case Number"] != null) {
			var secondParentName = [AInfo["Related Case Number"]
			addParent(secondParentName);
		}
	}
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}	
	
//showMessage = true;
//showDebug = 3;

//Add Standard Solution Includes 
// solutionInc = aa.bizDomain.getBizDomain("STANDARD_SOLUTIONS").getOutput().toArray(); 
// for (sol in solutionInc) { 
//       if (solutionInc[sol].getAuditStatus() != "I") eval(getScriptText(solutionInc[sol].getBizdomainValue(),null)); 
// }  
 
 //Add Configurable RuleSets 
    // configRules = aa.bizDomain.getBizDomain("CONFIGURABLE_RULESETS").getOutput().toArray(); 
    //for (rule in configRules) { 
       //if (configRules[rule].getAuditStatus() != "I") eval(getScriptText(configRules[rule].getBizdomainValue(),null)); 
// }