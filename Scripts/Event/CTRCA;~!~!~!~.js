try {
	//Add Planning/LandUse/RPAException/NA Fee
	if (publicUser && appMatch("Planning/LandUse/RPAException/NA")){
		addFee("RPAEXCEPTION","CC-PLANNING","FINAL",1,"N");
		addFee("RPAEXCEPTOTH","CC-PLANNING","FINAL",1,"N");
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