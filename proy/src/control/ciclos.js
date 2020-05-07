class While extends Nodo {

    recorrer(bool, ts) {
        this.ts = new Tabla_Sim(ts, "While");
        this.hijos[0].recorrer(bool, ts);
        this.hijos[1].recorrer(bool, this.ts);
    }

    traducir(ts) {
        this.hijos[0].estaEnUnIf = true;
        var n = this.hijos[0].traducir(ts);
        var st = "";
        var sciclo = salto_temp.nextSalto();
        st += sciclo + ":\n";
        st += n.cadena;
        if (typeof n.etV == "undefined") {
            var s1 = salto_temp.nextSalto();
            var s2 = salto_temp.nextSalto();
            st += "if(" + n.valor + ") goto " + s1 + ";\n";
            st += "goto " + s2 + ";\n";
            n.etV = [s1];
            n.etF = [s2];
        }
        for (var a = 0; a < n.etV.length; a++) {
            st += n.etV[a] + ":\n";
        }
        var n2 = this.hijos[1].traducir(this.ts);
        st += n2.textContent;
        st += "goto " + sciclo + ";\n";
        for (var a = 0; a < n.etF.length; a++) {
            st += n.etF[a] + ":\n";
        }
        return st;
    }
}

class do_while extends Nodo {

    recorrer(bool, ts) {
        this.ts = new Tabla_Sim(ts, "Do_While");
        this.hijos[0].recorrer(bool, this.ts);
        this.hijos[1].recorrer(bool, ts);
    }

    traducir(ts) {
        var sinicio = salto_temp.nextSalto();
        var st = sinicio + ":\n";

        var n2 = this.hijos[0].traducir(this.ts);

        st += n2.textContent;

        this.hijos[1].estaEnUnIf = true;
        var n = this.hijos[1].traducir(ts);
        st += n.cadena;

        if (typeof n.etV == "undefined") {
            var s1 = salto_temp.nextSalto();
            var s2 = salto_temp.nextSalto();
            st += "if(" + n.valor + ") goto " + s1 + ";\n";
            st += "goto " + s2 + ";\n";
            n.etV = [s1];
            n.etF = [s2];
        }
        for (var a = 0; a < n.etV.length; a++) {
            st += n.etV[a] + ":\n";
        }

        st += "goto " + sinicio + ";\n";

        for (var a = 0; a < n.etF.length; a++) {
            st += n.etF[a] + ":\n";
        }

        return st;
    }
}

class For extends Nodo {

}