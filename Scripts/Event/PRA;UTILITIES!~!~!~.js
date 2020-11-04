if ((appMatch("Utilities/ServiceConnection/NA/NA")||appMatch("Utilities/ResidentialCompanionMeter/NA/NA")) && (balanceDue == 0)) {
    updateAppStatus("Ready for CIS","Balance Due is zero indicating ready to update CIS via batch interface process.");
}