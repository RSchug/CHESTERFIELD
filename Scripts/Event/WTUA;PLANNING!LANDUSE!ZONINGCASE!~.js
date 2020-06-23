try {
    // Create Conditions from proffers on Zoning Case Record
    if (wfTask == 'BOS Hearing' && matches(wfStatus, 'Approved') && balanceDue = 0) {
		//var a = e,
		r = aa.appSpecificTableScript.getAppSpecificTableGroupModel(a).getOutput(),
		s = r.getTablesArray(),
		n = s.iterator(),
		i = (new Array, new Array),
		o = !1;
		for (arguments.length > 2 && (i = arguments[2], o = !0); n.hasNext(); ) {
			var g = n.next(),
			u = new Array,
			c = new Array,
			l = g.getTableName() + "",
			p = 0;
			if (o) {
				for (var d = !1, f = 0; f < i.length; f++)
					if (i[f] == l) {
						d = !0;
						break
					}
				if (d)
					continue
			}
			if (!g.rowIndex.isEmpty()) {
				for (var m = g.getTableField().iterator(), C = g.getColumns().iterator(), b = g.getAppSpecificTableModel().getReadonlyField().iterator(), p = 1; m.hasNext(); ) {
					if (!C.hasNext()) {
						var C = g.getColumns().iterator();
						c.push(u);
						var u = new Array;
						p++
					}
					var D = C.next(),
					A = m.next(),
					v = "N";
					b.hasNext() && (v = b.next());
					var y = new asiTableValObj(D.getColumnName(), A, v);
					u[D.getColumnName()] = y
				}
				c.push(u)
			}
			logDebug("ASI Table Array : " + l + " (" + p + " Rows)");
		}
	}

//            (AInfo['Temp Underground Electric'] == 'CHECKED')
//            createPendingInspection('ELEC_COM', '208 Electric TUG Service');

} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " In Line " + err.lineNumber + " of " + err.fileName + " Stack " + err.stack);
}