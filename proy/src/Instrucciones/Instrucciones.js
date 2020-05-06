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
}