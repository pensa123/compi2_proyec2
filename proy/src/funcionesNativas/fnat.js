class Print extends Nodo {

    traducir(ts) {
        var n = this.hijos[0].traducir(ts);
        if (n == null || n == "") { return null; }

        n = mbatch(n);
        var st = "";
        if (typeof n.etV != "undefined") {
            var nt = salto_temp.nextTemp();
            st = nt + "=1;\n" + n.cadena;
            for (var a = 0; a < n.etF.length; a++) {
                st += n.etF[a] + ":\n";
            }
            st += nt + "=0;\n";
            for (var a = 0; a < n.etV.length; a++) {
                st += n.etV[a] + ":\n";
            }
            n.valor = nt;
        } else {
            st += n.cadena;
        }

        if (typeof n.esarr != "undefined" && n.esarr) {
            if (!isNaN(n.tipo)) {
                st += "t1 = " + n.tipo + ";\n";
                st += "call cimparr;\n";

                print(st);
            }
        } else if (n.tipo == vtipo.string) {
            st += "t1 = " + n.valor + ";\n";
            st += "call imprimir;\n";
        } else if (n.tipo == vtipo.boolean) {
            st += "t17 = " + n.valor + ";\n";
            st += "call pBool;\n";

            //st += 'print("%i",' + n.valor + ');\n';
        } else if (n.tipo == vtipo.integer) {
            st += "print(\"%i\"," + n.valor + ");\n";
        } else if (n.tipo == vtipo.double) {
            st += "print(\"%d\"," + n.valor + ");\n";
        } else if (n.tipo == vtipo.char) {
            st += "print(\"%c\"," + n.valor + ");\n";
        }
        st += "print(\"%c\",10);\n";
        return st;
    }
}