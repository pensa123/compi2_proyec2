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
        n = mbatch(n);
        if (n.tipo <= 3) {
            if (n.tipo != this.tipo[0]) {
                if (!compImplicito(this.tipo, n.tipo)) {
                    return this.niuerror("No se puede asignar un " + getTipo(n.tipo) + " a un " + getTipo(this.tipo[0]));
                }
            }
        } else if (n.tipo == vtipo.string) {
            if (this.tipo[0] != vtipo.string) {
                print(this.tipo);
                return this.niuerror("Una cadena debe de ser ingresada a un Stirng");
            }
        } else {
            return this.niuerror("No se puede asignar un " + getTipo(n.tipo) + " a un " + getTipo(this.tipo[0]));
        }

        if (this.tipo.length == 2) {
            if (typeof n.esarr == "undefined" && n.esarr) {
                print(n);
                return this.niuerror("No se puede asignar un valor normal a un arreglo.");
            }
        }

        if (typeof n.esarr != "undefined" && n.esarr) {
            if (this.tipo.length == 1) {
                return this.niuerror("No se le puede asignar un arreglo a una variable no arreglo.");
            }
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

    recorrer(bool, ts) {
        var nvar
        if (this.tipo == vddi.global) {
            nvar = new mivar(tglobal.nombre);
        } else {
            nvar = new mivar(ts.nombre);
        }

        nvar.nombre = this.id;
        nvar.tipo = null;
        nvar.esArreglo = false;
        nvar.declaracionFila = this.fila;
        nvar.declaracionColumna = this.columna;
        nvar.a = 0;
        nvar.tvar = this.tipo; //var , const , global 
        if (this.tipo == vddi.global) {
            if (!tglobal.agregarVar(nvar)) {
                this.niuerror("No se puede agregar variables con el mismo nombre " + nvar.nombre);
            }
        } else {
            if (!ts.agregarVar(nvar)) {
                this.niuerror("No se puede agregar variables con el mismo nombre " + nvar.nombre);
            } else {
                print("_---------------------");
                print(ts);
            }
        }
    }

    traducir(ts) {
        var nvar = null;
        if (this.tipo == vddi.global) {
            nvar = tglobal.obtenerVar(this.id);
        } else {
            nvar = ts.obtenerVar(this.id);
        }
        if (nvar == null) {
            return this.niuerror("No se ha encontrado la variable " + this.id);
        }

        var n = this.hijos[0].traducir(ts);
        if (n == null) {
            return null;
        }
        var st = n.cadena;

        nvar.tipo = n.tipo;

        if (typeof n.esarr != "undefined") {
            nvar.esArreglo = true;
        }

        if (nvar.refHeap) {
            st += "Heap[" + nvar.ref + "] = " + n.valor + ";\n";
        } else {
            var t = salto_temp.nextTemp();
            st += t + " = p + " + nvar.ref + ";\n";
            st += "Stack[" + t + "] =  " + n.valor + ";\n";
            ts.nvarDeclaradas++;
        }
        nvar.declarada = true;
        nvar.instanciada = true;
        return st;
    }

}


class decfunc extends Nodo {
    //tipo, id, parametros en los hijos
    //inst las instrucciones (agregarlo al dibujar)

    traducir(ts) {
        if (this.n3d == null) { return ""; }

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

        if ((this.tipo[0].toString().toLowerCase()) == "string") {
            print("si entro aqui");
            this.tipo[0] = vtipo.string;
        }

        this.n3d = null;

        var tid = this.id;
        if (tid.toLowerCase() == "principal") {
            if (this.hijos.length == 0) {
                if (this.tipo[0] != vtipo.void) {
                    return this.niuerror("El metodo principal sin parametros debe de ser tipo void.");
                }
            }
        }

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

    soy() {
        return "Casteo (" + v_tipo[this.tipo] + ")";
    }

    traducir(ts) {
        var n = this.hijos[0].traducir(ts);
        if (this.tipo == n.tipo) {
            return n;
        }

        if (!(n.tipo == vtipo.double || n.tipo == vtipo.char || n.tipo == vtipo.integer)) {
            return this.niuerror("Solo se puede hacer caseto explicito de Double o entero.");
        }
        if (n.tipo == vtipo.double) {
            var st = n.cadena;
            if (!isNaN(n.valor)) {
                var tn = salto_temp.nextTemp();
                st += tn + " = " + n.valor + ";\n"
                n.valor = tn;
            }
            var t = salto_temp.nextTemp();
            st += t + " = " + n.valor + " % 1;\n";
            st += n.valor + " = " + n.valor + " - " + t + ";\n";
            n.cadena = st;
        }
        n.tipo = this.tipo;
        return n;
    }
}

class Asignacion extends Nodo {
    traducir(ts) {
        var n1 = this.hijos[0].traducir(ts);
        if (n1 == null) {
            return null;
        }
        var n2 = this.hijos[1].traducir(ts);
        if (n2 == null) {
            return null;
        }

        n2 = mbatch(n2);

        if (n2.tipo <= 3) {
            if (n2.tipo != n1.tipo) {
                if (!compImplicito(n1.tipo, n2.tipo)) {
                    return this.niuerror("No se puede asignar un " + getTipo(n2.tipo) + " a un " + getTipo(n1.tipo));
                }
            }
        } else if (n2.tipo == vtipo.string) {
            if (n1.tipo != vtipo.string) {
                return this.niuerror("Una cadena debe de ser ingresada a un Stirng");
            }
        } else {
            return this.niuerror("No se puede asignar un " + getTipo(n2.tipo) + " a un " + getTipo(n1.tipo));
        }
        if (n1.esarr) {
            if (typeof n2.esarr == "undefined" && n2.esarr) {
                return this.niuerror("No se puede asignar un valor normal a un arreglo.");
            }
        } else {
            if (typeof n2.esarr != "undefined" && n2.esarr) {
                return this.niuerror("No se puede asignar un arreglo a una variable de una posicion");
            }
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


        if (typeof n1.var != "undefined") {
            print(n1);
            var mivar = n1.var;
            print(mivar);
            if (mivar.tvar == vddi.const) {
                return this.niuerror("No se puede modificar la variable constante '" + mivar.nombre + "'");
            }
            mivar.usadaEn.push({ fila: this.fila, columna: this.columna });
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
            if (typeof this.exp != "undefined") {
                if (this.exp) {
                    var t = salto_temp.nextTemp();
                    st += t + "= Heap[" + nvar.ref + "];\n";
                    val = t;
                }
            }
            if (typeof this.estaEnUnIf != "undefined") {
                val = t + " == 1";
            }
            return { valor: val, tipo: nvar.tipo, cadena: st, esarr: nvar.esArreglo, var: nvar };
        } else {
            var tn = salto_temp.nextTemp();
            st += tn + " = p + " + nvar.ref + ";\n";
            val = "Stack[" + tn + "]";
            if (typeof this.exp != "undefined") {
                if (this.exp) {
                    var t = salto_temp.nextTemp();
                    st += t + " = Stack[" + tn + "];\n";
                    val = t;
                }
            }
            if (typeof this.estaEnUnIf != "undefined") {
                val = t + " == 1";
            }
            return { valor: val, tipo: nvar.tipo, cadena: st, esarr: nvar.esArreglo, var: nvar };
        }
    }
}


class laccesos extends Nodo {
    traducir(ts) {
        var aux = null;
        var esVar = false;
        //        print(this.hijos);

        var st = "";
        var n = this.hijos[0].traducir(ts);
        if (n == null) {
            return null;
        }
        st += n.cadena;
        aux = n;
        esVar = true;

        print(this);

        for (var a = 1; a < this.hijos.length; a++) {
            if (this.hijos[a] instanceof Id) {
                if (this.hijos[a].id.toLowerCase() == "length") {
                    if (esVar && aux.esarr) {
                        if (a + 1 == this.hijos.length) {
                            var t = salto_temp.nextTemp();
                            st += t + " = " + aux.valor + ";\n";
                            st += t + " = Heap[" + t + "];\n";

                            return { valor: t, tipo: vtipo.integer, cadena: st };
                        } else {
                            return this.hijos[a + 1].niuerror("no se puede hacer un acceso a un valor numerico.");
                        }
                    }
                } else {
                    return this.niuerror(this.hijos[a].id + " no se reconoce como atributo.");
                }
            }
            if (this.hijos[a] instanceof accesofunc) {
                var func = this.hijos[a].id.toLowerCase();
                if (func == "linealize") {
                    if (aux.esarr) {
                        if (a + 1 == this.hijos.length) {
                            var t = salto_temp.nextTemp();
                            st += t + " = h;\n";
                            st += "t1 = " + aux.valor + ";\n";
                            st += "t2 = Heap[t1];\n";
                            st += "t2 = t2 + 1;\n";
                            st += "call copyArrToStack;";
                            return { valor: t, tipo: aux.tipo, cadena: st, esarr: true };
                        } else {
                            return this.hijos[a + 1].niuerror("No implementamos accesos a funciones :(");
                        }
                    }
                } else if (func == "length") {
                    if (aux.esarr) {
                        return this.niuerror("length() no es una funcion para un arreglo.");
                    }
                    if (aux.tipo == vtipo.string) {
                        var t = salto_temp.nextTemp();
                        st += t + " = " + aux.valor + ";\n";
                        st += "t1 = " + t + ";\n";
                        st += "call stlength;\n";
                        st += t + " = t2;\n";
                        return { valor: t, tipo: vtipo.integer, cadena: st, esarr: false };
                    } else {
                        return this.niuerror("Length() es una funcion propia de los strings.");
                    }
                } else if (func == "tochararray") {
                    if (aux.esarr) {
                        return this.niuerror("tochararray() no es una funcion de un arreglo.");
                    }
                    if (aux.tipo == vtipo.string) {
                        var t = salto_temp.nextTemp();
                        st += t + " = " + aux.valor + ";\n";
                        st += "t1 = " + t + ";\n";
                        st += "call stlength;\n";
                        st += t + " = h;\n";
                        st += "heap[h] = t2;\n";
                        st += "h = h + 1;\n";
                        st += "t1 = " + aux.valor + ";\n";
                        st += "call tocharArray;";

                        return { valor: t, tipo: vtipo.char, cadena: st, esarr: true };
                    } else {
                        return this.niuerror("tochararray() es una funcion propia de los strings.");
                    }
                } else if (func == "tolowercase" || func == "touppercase") {
                    if (aux.esarr) {
                        return this.niuerror(func + "() no es una funcion de un arreglo");
                    }
                    if (aux.tipo == vtipo.string) {
                        var t = salto_temp.nextTemp();
                        st += "t1 = " + aux.valor + ";\n";
                        st += t + " = h;\n";
                        if (func == "touppercase") {
                            st += "call touppercase;\n";
                        } else {
                            st += "call tolowercase;\n";
                        }
                        return { valor: t, tipo: vtipo.string, cadena: st, esarr: false };
                    } else {
                        return this.niuerror(func + "() es una funcion propia de los strings.");
                    }
                } else {
                    return this.niuerror(this.hijos[a].id + " no se reconoce como funcion.");
                }
            }
            if (this.hijos[a] instanceof AccesoArr) {
                var n = this.hijos[a].traducir(ts);
                if (n == null) {
                    return null;
                }
                st += n.cadena;

                if (!esVar) {
                    return this.hijos[a].niuerror("No se puede hacer un acceso a arreglo a algo que no es una variable.");
                }
                if (!aux.esarr) {
                    return this.hijos[a].niuerror("No se puede hacer un acceso a arreglo a " + aux.nombre + " ya que esta variable no es un arreglo.");
                }

                var t = salto_temp.nextTemp();
                st += t + " = " + aux.valor + ";\n";
                st += "t2 = Heap[" + t + "];  ## Para comparar si esta en el rango.\n";
                st += "t1 = " + n.valor + ";\n";
                st += "call compIndiceArr;\n";
                st += t + " = " + t + " + " + n.valor + ";\n";
                st += t + " = " + t + " + 1;\n";

                if (typeof this.exp == "undefined") {
                    if (a + 1 == this.hijos.length) {
                        print("si entra aqui yqlgputa");
                        return { valor: "Heap[" + t + "]", tipo: aux.tipo, cadena: st };
                    }
                }
                st += t + " = Heap[" + t + "];\n";

                if (isNaN(aux.tipo)) {
                    print("Se debe de hacer algo distinto ya que es una escturcuta jejejee.");
                }

                aux = { valor: t, tipo: aux.tipo, cadena: st };
                esVar = false;

            }

        }
        if (typeof this.estaEnUnIf != "undefined") {
            aux.valor = aux.valor + " == 1";
        }


        return aux;
    }
}


class accesofunc extends Nodo {
    dibujar(c) {
        c.hojas++;
        return { name: this.id };
    }
}

class AccesoArr extends Nodo {
    traducir(ts) {
        var n = this.hijos[0].traducir(ts);
        if (!compImplicito(vtipo.integer, n.tipo)) {
            return this.niuerror("En acceso a arreglos, solo se esperan enteros. " + getTipo(n.tipo) + " no esta permitido.");
        }
        if (n.esarr) {
            return this.niuerror("En acceso a arreglos no se aceptan arreglos.");
        }
        return n;
    }
}

function getTipo(tp) {
    if (isNaN(tp)) {
        return tp;
    }
    return v_tipo[tp];
}

function compImplicito(ti, td) {
    if (ti == td) { return true; }
    if (ti == vtipo.double) {
        if (td == vtipo.integer || td == vtipo.char) {
            return true;
        }
    }
    return (ti == vtipo.integer && td == vtipo.char);
}

function mbatch(n) {
    if (typeof n.etV == "undefined") {
        return n;
    }
    if (n.etV != "LT") {
        return n;
    }
    var st = n.cadena;
    var sTrue = salto_temp.nextSalto();
    var sFalse = salto_temp.nextSalto();
    st = replaceAll(st, "LT", sTrue);
    st = replaceAll(st, "LF", sFalse);
    n.cadena = st;
    n.etV = [sTrue];
    n.etF = [sFalse];
    return n;
}