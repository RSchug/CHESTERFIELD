//36P 
try {
    if (wfTask == 'Case Complete' && wfStatus == 'Closed') 
{
    var AdhocStatusDate = dateAdd(wfDate, 15)
    if (wfTask == 'Adjacents' && wfStatus =='Create List' && AdhocStatusDate == true)
        showMessage = true;
        comment('<font size=small><b>Need to assure that residential neighbors have had 15 days of notification');
        cancel = true;
}
    } catch (err) 
{
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}