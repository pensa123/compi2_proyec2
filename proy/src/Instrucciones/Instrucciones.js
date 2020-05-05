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
            text.appendData(this.hijos[a].traducir(ts));
        }
    }
}