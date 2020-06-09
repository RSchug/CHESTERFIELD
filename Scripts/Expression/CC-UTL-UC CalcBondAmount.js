var toPrecision = function (value) {
    var multiplier = 100;
    return Math.round(value * multiplier) / multiplier;
}
function addDate(iDate, nDays) {
    if (isNaN(nDays)) {
        throw ("Day is a invalid number!");
    }
    return expression.addDate(iDate, parseInt(nDays));
}

function diffDate(iDate1, iDate2) {
    return expression.diffDate(iDate1, iDate2);
}

function parseDate(dateString) {
    return expression.parseDate(dateString);
}

function formatDate(dateString, pattern) {
    if (dateString == null || dateString == '') {
        return '';
    }
    return expression.formatDate(dateString, pattern);
}

var servProvCode = expression.getValue("$$servProvCode$$").value;
var asiFields = [];
asiFields["Associated Project 1"] = expression.getValue("ASI::CC-UTL-BOND-INFO::Associated Project 1");
asiFields["Associated Project 2"] = expression.getValue("ASI::CC-UTL-BOND-INFO::Associated Project 2");
asiFields["Associated Project 3"] = expression.getValue("ASI::CC-UTL-BOND-INFO::Associated Project 3");
asiFields["Commercial Project"] = expression.getValue("ASI::CC-UTL-PROJ-INFO::Commercial Project");
asiFields["Original Bond Amount"] = expression.getValue("ASI::CC-UTL-BOND-INFO::Original Bond Amount");
asiFields["Sewer Estimated Total Cost"] = expression.getValue("ASI::CC-UTL-BOND-INFO::Sewer Estimated Total Cost");
asiFields["Water Estimated Total Cost"] = expression.getValue("ASI::CC-UTL-BOND-INFO::Water Estimated Total Cost");
asiFields["Sewer Percent Complete"] = expression.getValue("ASI::CC-UTL-STATUS::Sewer Percent Complete");
asiFields["Water Percent Complete"] = expression.getValue("ASI::CC-UTL-STATUS::Water Percent Complete");
asiFields["Sewer Bond Override Amount"] = expression.getValue("ASI::CC-UTL-BOND-INFO::Sewer Bond Override Amount");
asiFields["Water Bond Override Amount"] = expression.getValue("ASI::CC-UTL-BOND-INFO::Water Bond Override Amount");
asiFields["Utility Bond Amount Required"] = expression.getValue("ASI::CC-UTL-BOND-INFO::Utility Bond Amount Required");

var totalRowCount = expression.getTotalRowCount();

var bondTotal = 0, bondTotalSewer = 0, bondTotalSewer = 0;
var estCostWater = 0;
if (asiFields["Water Estimated Total Cost"].value && asiFields["Water Estimated Total Cost"].value > 0)
    estCostWater = parseFloat(asiFields["Water Estimated Total Cost"].value);
var estCostSewer = 0;
if (asiFields["Sewer Estimated Total Cost"].value && asiFields["Sewer Estimated Total Cost"].value > 0)
    estCostSewer = parseFloat(asiFields["Sewer Estimated Total Cost"].value);
var percentCompleteWater = 0;
if (asiFields["Water Percent Complete"].value && asiFields["Water Percent Complete"].value > 0)
    percentCompleteWater = parseInt(asiFields["Water Percent Complete"].value);
var percentCompleteSewer = 0;
if (asiFields["Sewer Percent Complete"].value && asiFields["Sewer Percent Complete"].value > 0)
    percentCompleteSewer = parseInt(asiFields["Sewer Percent Complete"].value);
var bondOverrideWater = 0;
if (asiFields["Water Bond Override Amount"].value && asiFields["Water Bond Override Amount"].value > 0)
    bondOverrideWater = parseFloat(asiFields["Water Bond Override Amount"].value);
var bondOverrideSewer = 0;
if (asiFields["Sewer Bond Override Amount"].value && asiFields["Sewer Bond Override Amount"].value > 0)
    bondOverrideSewer = parseFloat(asiFields["Sewer Bond Override Amount"].value);
var bondAmountRequired = 0;
if (asiFields["Utility Bond Amount Required"].value && asiFields["Utility Bond Amount Required"].value > 0)
    bondAmountRequired = parseFloat(asiFields["Utility Bond Amount Required"].value);

var commercialProject = true;
if (asiFields["Commercial Project"].value == null || asiFields["Commercial Project"].value == "") commercialProject = null;
else if ((asiFields["Commercial Project"].value.equalsIgnoreCase('NO') || asiFields["Commercial Project"].value.equalsIgnoreCase('N') || asiFields["Commercial Project"].value.equalsIgnoreCase('UNCHECKED') || asiFields["Commercial Project"].value.equalsIgnoreCase('UNSELECTED') || asiFields["Commercial Project"].value.equalsIgnoreCase('FALSE') || asiFields["Commercial Project"].value.equalsIgnoreCase('OFF')))
    commercialProject = false;

// For Utility Construction Project calculate Bond Amount
/*
if (stateRoadAcceptDate.getTime() > minValue.getTime()) {
	bondTotalSewer = 0;
	bondTotalWater = 0;
} else { */
if (true) {
    if (percentCompleteSewer >= 90)
        bondTotalSewer = estCostSewer * 0.1
    else
        bondTotalSewer = estCostSewer * ((100 - percentCompleteSewer) * 0.01)
    if (percentCompleteWater >= 90)
        bondTotalWater = estCostWater * 0.1
    else
        bondTotalWater = estCostWater * ((100 - percentCompleteWater) * 0.01)
}

// check for associated projects
/*
var associatedProjects = []
for (var i = 1; i < 4; i++) {
	if (asiFields["Associated Project "+i].value || AInfo["Associated Project "+i].value != "") continue;
	// If lblRdAcpt1.Text = "R" Or lblAsPrj1Com.Text = "C" Then continue // Do not add to bond amount
	var projectID = AInfo["Associated Project "+i].value; 
	var projEstCostSewer = parseFloat(asiFields["Sewer Est Total Cost "+i].value);
	var projEstCostWater = parseFloat(asiFields["Water Est Total Cost "+i].value);
	var projPercentCompleteSewer = parseInt(asiFields["Sewer % Project " + i].value);
	var projPercentCompleteWater = parseInt(asiFields["Water % Project " + i].value);
	if (projPercentCompleteSewer >= 90)
		bondTotalSewer = bondTotalWater + projEstCostSewer * 0.1
	else
		bondTotalSewer = bondTotalWater + projEstCostSewer * ((100 - projPercentCompleteSewer) * 0.01)
	if (projPercentCompleteWater >= 90)
		bondTotalWater = bondTotalWater + projEstCostWater * 0.1
	else
		bondTotalWater = bondTotalWater + projEstCostWater * ((100 - projPercentCompleteWater) * 0.01)
}
*/

// If have override amount, add water and sewer together to get bond amount - txtbondamt
if (bondOverrideWater > 0) bondTotalWater = bondOverrideWater;
if (bondOverrideSewer > 0) bondTotalSewer = bondOverrideSewer;

// Total bond amounts
bondTotal = toPrecision(bondTotalSewer + bondTotalWater);

// if project is commercial, set bond amt to 0 and display label
if (commercialProject) {
    asiFields["Original Bond Amount"].value = 0;
    asiFields["Original Bond Amount"].message = "Commercial";
    asiFields["Original Bond Amount"].readOnly = true;
    expression.setReturn(asiFields["Original Bond Amount"]);
    asiFields["Utility Bond Amount Required"].value = 0;
    asiFields["Utility Bond Amount Required"].readOnly = true;
    expression.setReturn(asiFields["Utility Bond Amount Required"]);
} else if (bondTotal > 0) {
    asiFields["Utility Bond Amount Required"].value = bondTotal;
    asiFields["Utility Bond Amount Required"].message = "Water $" + bondTotalWater + " + Sewer $" + bondTotalSewer;
    asiFields["Utility Bond Amount Required"].readOnly = true;
    expression.setReturn(asiFields["Utility Bond Amount Required"]);
}

// Set Original Bond Amount
if (estCostWater > 0 || estCostSewer > 0) {
    asiFields["Original Bond Amount"].value = toPrecision(estCostWater * 1 + estCostSewer * 1);
    asiFields["Original Bond Amount"].readOnly = true;
    expression.setReturn(asiFields["Original Bond Amount"]);
}
