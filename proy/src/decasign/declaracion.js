var vtipo = {
    "char": 0,
    "integer": 1,
    "double": 2,
    "boolean": 3,
    "string": 4,
    "void": 5
}

var v_tipo = ["char", "integer", "double", "boolean", "string", "void"];

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
    //tipo 1 o tipo 5 



    recorrer(bool, ts) {
        if (this.tipo[0].toString().toLowerCase() == "string") {
            this.tipo[0] = vtipo.string;
        }
        var lid = this.hijos[0];
        for (var a = 0; a < lid.hijos.length; a++) {
            var nvar = new mivar(ts.nombre);
            nvar.nombre = lid.hijos[a];
            nvar.tipo = this.tipo[0];
            nvar.esArreglo = this.tipo.length == 2;
            nvar.declaracionFila = this.fila;
            nvar.declaracionColumna = this.columna;
            nvar.a = a;
            nvar.tvar = vddi.var; //var , const , global 
            if (!ts.agregarVar(nvar)) {
                this.niuerror("No se puede agregar variables con el mismo nombre " + nvar.nombre);
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
                if (!(mivar.declaracionFila == this.fila && mivar.a == a && mivar.declaracionColumna == this.columna)) {
                    continue;
                }
                mivar.declarada = true;
                ts.nvarDeclaradas++;
            }
            return "";
        }
        var n = this.hijos[1].traducir(ts);
        if (n == null) { return ""; }
        if (n.tipo <= 3) {
            if (n.tipo != this.tipo) {
                print("Comparar casteo implicito o marcar error " + n.tipo + " " + this.tipo);
            }
        } else if (n.tipo == vtipo.string) {
            if (this.tipo != vtipo.string) {
                return this.niuerror("Una cadena debe de ser ingresada a un Stirng");
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
        var almenosUno = false;
        for (var a = 0; a < lid.hijos.length; a++) {
            var nombre = lid.hijos[a];
            var pos = ts.nvars.indexOf(nombre);
            if (pos == -1) {
                print("no se ha encontrado " + nombre);
                continue;
            }
            var mivar = ts.vars[pos];
            if (!(mivar.declaracionFila == this.fila && mivar.a == a && mivar.declaracionColumna == this.columna)) {
                continue;
            }
            if (mivar.refHeap) {
                st += "Heap[" + mivar.ref + "] = " + n.valor + ";\n";
            } else {
                //print("Aun falta hacer referencia a stack por que hay que sacar le valor relativo.");
                var nt = salto_temp.nextTemp();
                st += nt + "= p + " + mivar.ref + ";\n";
                st += "Stack[" + nt + "] = " + n.valor + ";\n";
            }
            mivar.instanciada = true;
            mivar.declarada = true;
            ts.nvarDeclaradas++;
            almenosUno = true;
        }
        if (almenosUno) {
            return st;
        } else {
            return "";
        }
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

    traducir(ts) {
        if (this.n3d == null) {
            return "";
        }

        var st = "";

        var sreturn = salto_temp.nextSalto();
        this.ts.sreturn = sreturn;
        st += "proc " + this.n3d + " begin\n";

        var n = this.inst.traducir(this.ts);
        st += n.textContent;

        st += sreturn + ":\n";
        st += "end\n\n";
        return st;
    }

    recorrer(bool, ts) {
        this.n3d = null;
        var name = this.id;
        for (var a = 0; a < this.hijos.length; a++) {
            var tp = this.hijos[a].tipo;
            name += "_" + (tp.length == 2 ? "arr" : "n");
            if (Number.isInteger(tp[0])) {
                name += v_tipo[tp[0]];
            } else {
                name += tp[0];
            }
        }
        if (this.hijos.length == 0) {
            name += "_sin_params";
        }
        var mf = new func();
        mf.nombre = "gen_" + this.id;
        mf.nombre3d = "gen_" + name;
        mf.params = this.hijos;
        mf.cuerpo = this.inst;
        mf.tiporetorno = this.tipo[0];
        mf.devuelveArr = this.tipo.length == 2;
        mf.declaradaEnF = this.fila;
        mf.declaradaEnC = this.columna;


        if (!ts.agregarFunc(mf)) {
            this.ts = null;
            return this.niuerror("No se pueden declarar funciones con el mismo nombre y tipo de parametros.");
        }
        this.n3d = "gen_" + name;
        this.ts = new Tabla_Sim(ts, this.n3d);

        if (this.tipo[0] != vtipo.void) {
            this.ts.tipoRetorno = this.tipo[0];
            this.ts.retornoEsArr = this.tipo.length == 2;
            this.ts.indiceStack++;
            this.ts.nvarDeclaradas = 1;
        }

        for (var a = 0; a < this.hijos.length; a++) {
            this.hijos[a].recorrer(false, this.ts);
        }
        this.inst.recorrer(false, this.ts);
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
    traducir(ts) {
        var n1 = this.hijos[0].traducir(ts);
        if (n1 == null) {
            return null;
        }
        var n2 = this.hijos[1].traducir(ts);
        if (n2.tipo <= 3) {
            if (n2.tipo != n1.tipo) {
                print("Comparar casteo implicito o marcar error " + n2.tipo + " " + n1.tipo);
            }
        } else if (n2.tipo == vtipo.string) {
            if (n1.tipo != vtipo.string) {
                return this.niuerror("Una cadena debe de ser ingresada a un Stirng");
            }
        } else {
            print("Falta traducir de " + v_prim[n2.valor]);
            return null;
        }

        var st = "";
        st += n1.cadena;
        st += n2.cadena;
        if (typeof n2.etV != "undefined") {
            var nt = salto_temp.nextTemp();
            st = nt + "=1;\n" + st;
            for (var a = 0; a < n2.etF.length; a++) {
                st += n2.etF[a] + ":\n";
            }
            st += nt + "=0;\n";
            for (var a = 0; a < n2.etV.length; a++) {
                st += n2.etV[a] + ":\n";
            }
            n2.valor = nt;
        }
        st += n1.valor + "= " + n2.valor + ";\n";

        if (typeof n1.nvar != "undefined") {
            var mivar = n1.nvar;
            mivar.llamadaEn.push({ fila: this.fila, columna: this.columna });
            mivar.instanciada = true;
        }

        return st;
    }
}

class Id extends Nodo {
    dibujar(c) {
        c.hojas++;
        return { name: this.id };
    }

    traducir(ts) {
        var nvar = ts.obtenerVar(this.id);
        if (nvar == null) {
            return this.niuerror("Variable " + this.id + " no encontrada");
        }
        if (!nvar.declarada) {
            return this.niuerror("Variable " + this.id + " no declarada");
        }
        var st = "";
        var val = "";
        if (nvar.refHeap) {
            val = "Heap[" + nvar.ref + "]";
            return { valor: val, tipo: nvar.tipo, cadena: st, var: nvar };
        } else {
            var tn = salto_temp.nextTemp();
            st += tn + " = p + " + nvar.ref + ";\n";
            val = "Stack[" + tn + "]";
            return { valor: val, tipo: nvar.tipo, cadena: st, var: nvar };
        }
    }
}