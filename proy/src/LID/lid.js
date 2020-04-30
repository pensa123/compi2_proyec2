class ListaId extends Nodo {
    dibujar(c) {
        var nodo = {};
        nodo.name = "ListaId";
        nodo.children = [];

        c.va += 2;
        for (var a = 0; a < this.hijos.length; a++) {
            nodo.children.push({ "name": this.hijos[a] });
            c.hojas++;
        }
        c.comp();
        return nodo;
    }
}

class Param extends Nodo {

    dibujar(c) {
        var nodo = {};
        c.va += 1;
      
        c.comp(); 
        
        var st = "";
        if (Number.isInteger(this.tipo[0])) {
            st += " " + v_tipo[this.tipo[0]] + "";
        } else {
            st += " " + this.tipo[0] + "";
        }
        if (this.tipo.length == 2) {
            st += "[]";
        }


        nodo.name = st + "-" + this.id;
        c.hojas++;
        return nodo; 
    }
}