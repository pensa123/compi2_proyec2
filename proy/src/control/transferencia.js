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

        if (ret.tipo == vtipo.void) {
            if (this.hijos.length != 0) {
                return this.niuerror("En funciones tipo void solo se esperan returns sin expresion.");
            }
            return "goto " + ret.goto + ";\n";
        }

        var n = this.hijos[0].traducir(ts);

        var st = n.cadena;

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
        var nn = this.hijos[0].traducir(ts);

        return nn; 
    }
}

class Default extends Nodo {

}