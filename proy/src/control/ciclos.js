class While extends Nodo {

    recorrer(bool, ts) {
        this.ts = new Tabla_Sim(ts, "While");
        this.hijos[0].recorrer(bool, ts);
        this.hijos[1].recorrer(bool, this.ts);
        this.ts.esCiclo = true;
    }

    traducir(ts) {
        this.hijos[0].estaEnUnIf = true;
        var n = this.hijos[0].traducir(ts);
        if (n == null) {
            return;
        }
        var st = "";
        var sinicio = salto_temp.nextSalto();

        n = mbatch(n);
        ts.sContinue = sinicio;
        st += sinicio + ":\n";
        st += n.cadena;
        if (typeof n.etV == "undefined") {
            var s1 = salto_temp.nextSalto();
            var s2 = salto_temp.nextSalto();
            st += "if(" + n.valor + ") goto " + s1 + ";\n";
            st += "goto " + s2 + ";\n";
            n.etV = [s1];
            n.etF = [s2];
        }

        var sfin = n.etF[0];
        ts.sBreak = sfin;
        for (var a = 0; a < n.etV.length; a++) {
            st += n.etV[a] + ":\n";
        }
        var n2 = this.hijos[1].traducir(this.ts);
        if (n2 == null) { return null; }
        st += n2.textContent;
        st += "goto " + sinicio + ";\n";
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
        this.ts.esCiclo = true;
    }

    traducir(ts) {
        var sinicio = salto_temp.nextSalto();
        var st = sinicio + ":\n";

        ts.sContinue = sinicio;
        var sfin = salto_temp.nextSalto();
        ts.sBreak = sfin;

        var n2 = this.hijos[0].traducir(this.ts);

        st += n2.textContent;

        this.hijos[1].estaEnUnIf = true;
        var n = this.hijos[1].traducir(ts);
        if (n == null) { return null; }
        n = mbatch(n);
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
        st += sfin + ":\n";
        for (var a = 0; a < n.etF.length; a++) {
            st += n.etF[a] + ":\n";
        }

        return st;
    }
}

class For extends Nodo {

    recorrer(bool, ts) {
        this.ts = new Tabla_Sim(ts, "For");
        for (var a = 0; a < this.hijos.length; a++) {
            if (this.hijos[a] != null) {
                this.hijos[a].recorrer(bool, this.ts);
            }
        }
        this.ts.esCiclo = true;
    }

    traducir(ts) {
        var st = "";

        var sinicio = salto_temp.nextSalto();
        var sContinue = sinicio;
        var sfin;
        var printSfin = true;
        var etF = [];
        if (this.hijos[0] != null) {
            var n1 = this.hijos[0].traducir(this.ts);
            st += n1;
        }
        st += sinicio + ":\n";
        if (this.hijos[1] != null) {
            this.hijos[1].estaEnUnIf = true;
            var n = this.hijos[1].traducir(this.ts);
            if (n == null) { return null; }
            n = mbatch(n);
            st += n.cadena;
            if (typeof n.etV == "undefined") {
                var s1 = salto_temp.nextSalto();
                var s2 = salto_temp.nextSalto();
                st += "if(" + n.valor + ") goto " + s1 + ";\n";
                st += "goto " + s2 + ";\n";
                n.etV = [s1];
                n.etF = [s2];
            }
            etF = n.etF;
            sfin = n.etF[0];
            printSfin = false;
            for (var a = 0; a < n.etV.length; a++) {
                st += n.etV[a] + ":\n";
            }
        } else {
            sfin = salto_temp.nextSalto();
        }

        if (this.hijos[2] != null) {
            sContinue = salto_temp.nextSalto();
        }

        this.ts.sContinue = sContinue;
        this.ts.sBreak = sfin;

        var ncuerpo = this.hijos[3].traducir(this.ts);
        st += ncuerpo.textContent;

        if (this.hijos[2] != null) {
            st += sContinue + ":\n";
            var n1 = this.hijos[2].traducir(this.ts);
            st += n1;
        }

        st += "goto " + sinicio + ";\n";
        for (var a = 0; a < etF.length; a++) {
            st += etF + ":\n";
        }
        if (printSfin) {
            st += sfin + ":\n";
        }

        return st;
    }
}