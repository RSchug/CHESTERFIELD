//3P. Fee Balance = 0 THEN: closeTask = 'Fee Payment' 
if (isTaskActive("Fee Payment") && (balanceDue == 0)) {
    closeTask("Fee Payment","Payment Received","Updated based on Balance of 0","");
}