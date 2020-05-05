var vtipo = {
    "char": 0,
    "integer": 1,
    "double": 2,
    "boolean": 3,
    "void": 4
}

var v_tipo = ["char", "integer", "double", "boolean", "void"];

var vddi = {
    var: 0,
    const: 1,
    global: 2
};

var v_ddi = ["var", "const", "global"];

class Declaracion extends Nodo {
    //aqui iran declaración y declaracion_asignacion
    //todo dependera de la cantidad de hijos que tenga.
    //variable tipo contiene o un numerico con las cuatro opciones de arriba
    //o si no es numerico con una cadena del identificador. 

    recorrer(bool, ts) {
        if (bool) {
            var lid = this.hijos[0];
            for (var a = 0; a < lid.hijos.length; a++) {
                var nvar = new mivar(ts.nombre);
                nvar.ref = ts.indiceHeap++;
                nvar.refHeap = true;
                nvar.nombre = lid.hijos[a];
                nvar.tipo = this.tipo[0];
                nvar.esArreglo = this.tipo.length == 2;
                nvar.declaracion = this.fila;
                nvar.a = a;
                nvar.tvar = vddi.var;
                if (!ts.agregarVar(nvar)) {
                    this.niuerror("No se puede agregar variables con el mismo nombre " + nvar.nombre);
                }
            }
        }
    }

    traducir(ts) {
        var lid = this.hijos[0];
        if (this.hijos.length == 1) {

            for (var a = 0; a < lid.hijos.length; a++) {
                var nombre = lid.hijos[a];
                var pos = ts.nvars.indexOf(nombre);
                if (pos == -1) {
                    print("no se ha encontrado " + nombre);
                    continue;
                }
                var mivar = ts.vars[pos];
                if (!(mivar.declaracion == this.fila && mivar.a == a)) {
                    continue;
                }
                mivar.declarada = true;
            }

            return "";
        }
        var n = this.hijos[1].traducir(ts);
        if (n == null) { return ""; }
        if (n.tipo <= 3) {
            if (n.tipo != this.tipo) {
                print("Comparar casteo implicito o marcar error " + n.tipo + " " + this.tipo);
            }
        } else {
            print("Falta traducir de " + v_prim[n.valor]);
            return "";
        }


        var st = n.cadena;
        if (typeof n.etV != "undefined") {
            var nt = salto_temp.nextTemp();
            st = nt + "=1;\n" + st;
            for (var a = 0; a < n.etF.length; a++) {
                st += n.etF[a] + ":\n";
            }
            st += nt + "=0;\n";
            for (var a = 0; a < n.etV.length; a++) {
                st += n.etV[a] + ":\n";
            }
            n.valor = nt;
        }
        for (var a = 0; a < lid.hijos.length; a++) {
            var nombre = lid.hijos[a];
            var pos = ts.nvars.indexOf(nombre);
            if (pos == -1) {
                print("no se ha encontrado " + nombre);
                continue;
            }
            var mivar = ts.vars[pos];
            if (!(mivar.declaracion == this.fila && mivar.a == a)) {
                continue;
            }
            if (mivar.refHeap) {
                st += "Heap[" + mivar.ref + "] = " + n.valor + ";\n";
            } else {
                print("Aun falta hacer referencia a stack por que hay que sacar le valor relativo.");
                st += "Stack[" + mivar.ref + "] = " + n.valor + ";\n";
            }
            mivar.instanciada = true;
            mivar.declarada = true;
        }
        return st;
    }

    dibujar(c) {
        var nodo = {};
        nodo.name = "Dec";

        if (Number.isInteger(this.tipo[0])) {
            nodo.name += " [" + v_tipo[this.tipo[0]] + "]";
        } else {
            nodo.name += " -[" + this.tipo[0] + "]-";
        }
        if (this.tipo.length == 2) {
            nodo.name += "[]";
        }

        var child = [];
        c.va += 1;
        var va = c.va;
        c.comp();
        for (var a = 0; a < this.hijos.length; a++) {
            child.push(this.hijos[a].dibujar(c));
            c.va = va;
        }

        if (child.length > 0) {
            nodo.children = child;
        }

        return nodo;
    }
}

class Dect2_4 extends Nodo {
    //tipo, id y exp 

    dibujar(c) {
        var nodo = {};
        nodo.name = "Dec";
        nodo.name += " [" + v_ddi[this.tipo] + "]";
        var child = [];
        c.va += 1;
        var va = c.va;
        c.comp();
        c.hojas++;
        child.push({ name: "id[" + this.id + "]" });
        for (var a = 0; a < this.hijos.length; a++) {
            child.push(this.hijos[a].dibujar(c));
            c.va = va;
        }

        if (child.length > 0) {
            nodo.children = child;
        }

        return nodo;
    }
}


class decfunc extends Nodo {
    //tipo, id, parametros en los hijos
    //inst las instrucciones (agregarlo al dibujar)


    recorrer(bool, ts) {
        this.inst.recorrer(false, ts);
    }


    dibujar(c) {
        var nodo = {};
        nodo.name = "Dec_func";
        nodo.name += " [" + this.id + "]";
        var child = [];
        c.va += 1;
        var va = c.va;
        c.comp();
        c.hojas++;


        var st = "";
        if (Number.isInteger(this.tipo[0])) {
            st += " " + v_tipo[this.tipo[0]] + "";
        } else {
            st += " " + this.tipo[0] + "";
        }
        if (this.tipo.length == 2) {
            st += "[]";
        }

        var nodo2 = {};
        nodo2.name = "parametros";

        nodo.children = [];

        nodo.children.push({ name: st });

        c.va += 1;
        for (var a = 0; a < this.hijos.length; a++) {
            child.push(this.hijos[a].dibujar(c));
            c.va = va;
        }
        if (child.length > 0) {
            nodo2.children = child;
        } else {
            c.hojas++;
        }
        nodo.children.push(nodo2);
        nodo.children.push(this.inst.dibujar(c));
        c.va = va;


        return nodo;
    }
}

class Casteo extends Nodo {

}

class Asignacion extends Nodo {

}

class Id extends Nodo {
    dibujar(c) {
        c.hojas++;
        return { name: this.id };
    }
}