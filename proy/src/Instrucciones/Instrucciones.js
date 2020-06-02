class Instrucciones extends Nodo {
    //Solo tiene hijos :D 

    traducir(ts) {
        var text;
        if (ts == tglobal) {
            text = tvar;
        } else {
            text = document.createTextNode("");
        }
        for (var a = 0; a < this.hijos.length; a++) {
            if (this.soloFuncs == true) {
                if (!(this.hijos[a] instanceof decfunc)) {
                    continue;
                }
            } else {
                if ((this.hijos[a] instanceof decfunc)) {
                    continue;
                }
            }
            var app = this.hijos[a].traducir(ts);
            if (app != null) {
                text.appendData(app);
            }
        }
        return text;
    }


    tradSwitch(ts, n1) {
        var text = document.createTextNode("");
        var sBreak = salto_temp.nextSalto();

        if (this.hijos.length == 0) {
            return text;
        }
        var n = this.hijos[0];
        if (!(n instanceof Case) || n instanceof Default) {
            return n.niuerror("La primera instruccion de un switch debe de ser un case.");
        }

        ts.sBreak = sBreak;
        var cases = [];
        var haydef = false;
        var sdef = null;
        for (var a = 0; a < this.hijos.length; a++) {
            if (this.hijos[a] instanceof Default) {
                if (haydef) {
                    return n.niuerror("no se puede tener mas de un default.");
                }
                haydef = true;
                sdef = salto_temp.nextSalto();
            }
            if (this.hijos[a] instanceof Case) {
                var nn = this.hijos[a].traducir(ts);
                text.appendData(nn.cadena);
                var ns = salto_temp.nextSalto();
                cases.push(ns);

                if (nn.tipo != n1.tipo) {
                    print("Verificar tipos o marcar error :D");
                }

                if (nn.tipo == vtipo.string && n1.tipo == vtipo.string) {
                    text.appendData("t6 = " + n1.valor + ";\n");
                    text.appendData("t7 = " + nn.valor + ";\n");
                    text.appendData("call compCadenas;\n");
                    text.appendData("if( t10 == 1) goto " + ns + ";\n");
                } else {
                    text.appendData("if( " + nn.valor + " == " + n1.valor + ") goto " + ns + ";\n");
                }
            }
        }

        if (haydef) {
            text.appendData("goto " + sdef + ";\n");
        } else {
            text.appendData("goto " + sBreak + ";\n");
        }


        for (var a = 0; a < this.hijos.length; a++) {
            if (this.hijos[a] instanceof Default) {
                text.appendData(sdef + ": ## DEF \n");
            } else if (this.hijos[a] instanceof Case) {
                var ns = cases.shift();
                text.appendData(ns + ":\n");
            } else {
                var app = this.hijos[a].traducir(ts);
                if (app != null) {
                    text.appendData(app);
                }
            }
        }


        text.appendData(sBreak + ": \n");
        return text;
    }
}