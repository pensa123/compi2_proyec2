class Print extends Nodo {

    traducir(ts) {
        var n = this.hijos[0].traducir(ts);
        if (n == null || n == "") { return null; }


        var st = n.cadena;
        if (n.tipo == vtipo.string) {
            st += "t1 = " + n.valor + ";\n";
            st += "call imprimir;\n";
        } else if (n.tipo == vtipo.boolean) {
            st += 'print("%i",' + n.valor + ');\n';
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