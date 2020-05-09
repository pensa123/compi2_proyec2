class If extends Nodo {
    //en sus hijos tiene todo (hay que comparar si tiene tres, si el tercero es if o instruccion)

    recorrer(bool, ts) {
        this.ts = [new Tabla_Sim(ts, "if")];
        this.hijos[0].recorrer(bool, ts);
        this.hijos[1].recorrer(bool, this.ts[0]);
        if (this.hijos.length == 3) {
            if (this.hijos[2] instanceof If) {
                this.ts.push(new Tabla_Sim(ts, "if"));
            } else {
                this.ts.push(new Tabla_Sim(ts, "if"));
            }
            this.hijos[2].recorrer(bool, this.ts[1]);
        }
        //this.recorrerHijos(bool, ts);
    }

    traducir(ts) {

        this.hijos[0].estaEnUnIf = true;
        var n = this.hijos[0].traducir(ts);

        if (n == null) {
            return null;
        }

        var st = n.cadena;
        var ssalida = null;


        if (typeof n.etV == "undefined") {
            var s1 = salto_temp.nextSalto();
            var s2 = salto_temp.nextSalto();
            st += "if( " + n.valor + ") goto " + s1 + ";\n";
            st += "goto " + s2 + ";\n";
            n.etV = [s1];
            n.etF = [s2];
        }
        for (var a = 0; a < n.etV.length; a++) {
            st += n.etV[a] + ":\n";
        }

        var n2 = this.hijos[1].traducir(this.ts[0]);
        st += n2.textContent;

        if (typeof this.ssalida != "undefined") {
            ssalida = this.ssalida;
        } else {
            ssalida = salto_temp.nextSalto();
        }
        st += "goto " + ssalida + ";\n";


        for (var a = 0; a < n.etF.length; a++) {
            st += n.etF[a] + ":\n";
        }

        if (this.hijos.length == 3) {
            if (this.hijos[2] instanceof If) {
                this.hijos[2].ssalida = ssalida;
                var h3 = this.hijos[2].traducir(this.ts[1]);
                st += h3;
            } else {
                var h3 = this.hijos[2].traducir(this.ts[1]);
                st += h3.textContent;
            }
        }
        if (typeof this.ssalida == "undefined") {
            st += ssalida + ":\n";
        }
        return st;
    }

}

class Switch extends Nodo {


}