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


    recorrer(bool, ts) {
        if (this.tipo[0].toString().toLowerCase() == "string") {
            this.tipo[0] = vtipo.string;
        }
        var nvar = new mivar(ts.nombre);
        nvar.nombre = this.id;
        nvar.tipo = this.tipo[0];
        nvar.esArreglo = this.tipo.length == 2;
        nvar.declaracionFila = this.fila;
        nvar.declaracionColumna = this.columna;
        nvar.a = -1;
        nvar.tvar = vddi.var; //var , const , global 
        nvar.instanciada = true;
        nvar.declarada = true;

        this.todoOk = true;
        if (!ts.agregarVar(nvar)) {
            this.todoOk = false;
            return this.niuerror("No se puede agregar parametros con el mismo nombre " + nvar.nombre);
        }

        this.gref = nvar.ref;
        ts.nvarDeclaradas++;
    }

    traducir(ts) {
        return "";
    }

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