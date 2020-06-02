class Break extends Nodo {

    traducir(ts) {
        var n = ts.getBreak();
        if (n == null) {
            return this.niuerror("No se esperaba un break.");
        }

        return "goto " + n + ";\n";
    }
}

class Continue extends Nodo {
    traducir(ts) {
        var n = ts.getContinue();
        if (n == null) {
            return this.niuerror("No se esperaba un continue");
        }
        return "goto " + n + ";\n";
    }
}

class Return extends Nodo {
    //si tiene hijo hay return xd

    traducir(ts) {

        var ret = ts.getReturn();

        print(ret);
        if (ret == null) {
            return this.niuerror("No se esperaba un return");
        }

        print(ret); 
        print("--------------------------");
        print(ret.tipo);

        if (ret.tipo == null) {
            if (this.hijos.length != 0) {
                return this.niuerror("En funciones tipo void solo se esperan returns sin expresion.");
            }
            return "goto " + ret.goto + ";\n";
        }
        if (this.hijos.length == 0) {
            return this.niuerror("No puedes retornar vacio en un " + getTipo(ret.tipo));
        }

        var n = this.hijos[0].traducir(ts);
        if (n == null) {
            return n;
        }
        n = mbatch(n);
        var st = n.cadena;
        if (typeof n.etV != "undefined") {
            var tr = salto_temp.nextTemp();
            st = tr + " = 1;\n" + n.cadena;
            for (var a = 0; a < n.etF.length; a++) {
                st += n.etF[a] + ":\n";
            }
            st += tr + " = 0;\n";
            for (var a = 0; a < n.etV.length; a++) {
                st += n.etV[a] + ":\n";
            }
            n.valor = tr;
        }



        if (n.tipo != ret.tipo) {
            print("comparar tipos en Return :D ");
        }

        st += "Stack[p] = " + n.valor + ";\n";

        st += "goto " + ret.goto + ";\n";
        return st;
    }
}

class Case extends Nodo {
    traducir(ts) {
        var n = this.hijos[0].traducir(ts);
        if (n == null) {
            return null;
        }
        var st = "";
        n = mbatch(n);
        if (typeof n.etV != "undefined") {
            var tr = salto_temp.nextTemp();
            st = tr + " = 1;\n" + n.cadena;
            for (var a = 0; a < n.etF.length; a++) {
                st += n.etF[a] + ":\n";
            }
            st += tr + " = 0;\n";
            for (var a = 0; a < n.etV.length; a++) {
                st += n.etV[a] + ":\n";
            }
            n.cadena = st;
            n.valor = tr;
        }
        return n;
    }
}

class Default extends Nodo {

}