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
}

class Case extends Nodo {

}

class Default extends Nodo {

}