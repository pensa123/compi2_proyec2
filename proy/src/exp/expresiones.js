var voperando = {
    masmas: 00,
    menosmenos: 01,
    xor: 02,
    or: 03,
    and: 04,
    igualigual: 05,
    difigual: 06,
    trigual: 07,
    mayor: 08,
    menor: 09,
    mayorigual: 10,
    menorigual: 11,
    mas: 12,
    menos: 13,
    por: 14,
    dividido: 15,
    modulo: 16,
    potencia: 17,
    not: 18
};

var v_operando = ["++", "--",
    "xor", "or",
    "and", "==",
    "!=", "===",
    ">", "<",
    ">=", "<=",
    "+", "-",
    "*", "/",
    "%", "^",
    "!"];

var s_operando = ["++", "--",
    "xor", "||",
    "&&", "==",
    "<>", "===",
    ">", "<",
    ">=", "<=",
    "+", "-",
    "*", "/",
    "%", "^",
    "!"];

var vprim = {
    char: 0,
    integer: 1,
    double: 2,
    boolean: 3,
    string: 4,
    id: 5
};
var v_prim = ["char", "int", "double", "bool", "string", "id"];



class expresion_binaria extends Nodo {
    //this.operando es la operacion
    //va a tener dos hijos y pos ya jaja
    dibujar(c) {
        c.va += 1;
        var nodo = {}, child = [], va = c.va;
        nodo.name = "expB [" + v_operando[this.operando] + "]";
        c.comp();
        for (var a = 0; a < this.hijos.length; a++) {
            if (!(this.hijos[a] instanceof Nodo)) {
                break;
            }
            child.push(this.hijos[a].dibujar(c));
            c.va = va;
        }
        if (child.length > 0) {
            nodo.children = child;
        }
        return nodo;
    }

    traducir(ts) {
        /*
            mas: 12,
            menos: 13,
            por: 14,
            dividido: 15,
            modulo: 16,
            potencia: 17
        */

        if (this.operando == voperando.mas) {
            var st = "";
            var vi = this.hijos[0].traducir(ts);
            if (vi == null) {
                return null;
            }
            if (isNaN(vi.valor)) {
                addToStack.push(vi.valor);
            }
            var vd = this.hijos[1].traducir(ts);
            if (isNaN(vi.valor)) {
                addToStack.pop();
            }
            if (vd == null) {
                return null;
            }
            var tr = salto_temp.nextTemp();
            var tipo = vtipo.integer;
            st += vi.cadena;
            st += vd.cadena;
            if (vi.tipo == vtipo.string || vd.tipo == vtipo.string) {
                //st += tr + "=" + vi.valor + s_operando[this.operando] + vd.valor + ";\n";
                st += tr + "= h;\n";
                if (vi.tipo == vtipo.string) {
                    st += "t1 = " + vi.valor + ";\n";
                    st += "call insCadenaEnHeap;\n";
                } else if (vi.tipo == vtipo.char) {
                    print(vi.valor);
                    st += "Heap[h] = " + vi.valor + ";\n";
                    st += "h = h + 1;\n";
                } else if (vi.tipo == vtipo.double || vi.tipo == vtipo.integer) {
                    st += "t11 = " + vi.valor + ";\n";
                    st += "call doubleToSt;\n";
                } else if (vi.tipo == vtipo.boolean) {
                    st += "t1 = " + vi.valor + ";\n";
                    st += "call metBoolheap;\n";
                }

                if (vd.tipo == vtipo.string) {
                    st += "t1 = " + vd.valor + ";\n";
                    st += "call insCadenaEnHeap;\n";
                } else if (vd.tipo == vtipo.char) {
                    st += "Heap[h] = " + vd.valor + ";\n";
                    st += "h = h + 1;\n";
                } else if (vd.tipo == vtipo.double || vd.tipo == vtipo.integer) {
                    st += "t11 = " + vd.valor + ";\n";
                    st += "call doubleToSt;\n";
                } else if (vd.tipo == vtipo.boolean) {
                    st += "t1 = " + vd.valor + ";\n";
                    st += "call metBoolheap;\n";
                }


                st += "Heap[h] = -1;\n";
                st += "h = h + 1;\n";
                print(st);
                return { valor: tr, tipo: vtipo.string, cadena: st };
            }

            if (!(compImplicito(vtipo.double, vi.tipo) && compImplicito(vtipo.double, vd.tipo))) {
                return this.niuerror("En " + v_operando[this.operando] + " se esperan dos numericos.");
            }

            if (vi.tipo == vtipo.double || vd.tipo == vtipo.double) {
                tipo = vtipo.double;
            }

            st += tr + "=" + vi.valor + " " + s_operando[this.operando] + " " + vd.valor + ";\n";
            return { valor: tr, tipo: tipo, cadena: st };
        } else if (this.operando == voperando.menos
            || this.operando == voperando.por || this.operando == voperando.dividido) {
            /*if (naux.tipo == vprim.integer || vprim.double) {
                if (naux.valor == 0) {
                    print("Error, no se puede dividir en 0");
                }
            }*/
            var st = "";
            var vi = this.hijos[0].traducir(ts);
            if (vi == null) {
                return null;
            }
            if (isNaN(vi.valor)) {
                addToStack.push(vi.valor);
            }
            var vd = this.hijos[1].traducir(ts);
            if (isNaN(vi.valor)) {
                addToStack.pop();
            }
            if (vd == null) {
                return null;
            }

            if (!(compImplicito(vtipo.double, vi.tipo) && compImplicito(vtipo.double, vd.tipo))) {
                return this.niuerror("En " + v_operando[this.operando] + " se esperan dos numericos.");
            }
            var tipo = vtipo.integer;
            if (this.operando == voperando.dividido) {
                tipo = vtipo.double;
            }
            if (vd.tipo == vtipo.double || vi.tipo == vtipo.double) {
                tipo = vtipo.double;
            }

            var tr = salto_temp.nextTemp();
            st += vi.cadena;
            st += vd.cadena;
            st += tr + "=" + vi.valor + s_operando[this.operando] + vd.valor + ";\n";
            print(tipo);
            return { valor: tr, tipo: tipo, cadena: st };

        } else if (this.operando == voperando.trigual) {
            var st = "";
            var vi = this.hijos[0].traducir(ts);
            if (vi == null) {
                return null;
            }
            if (isNaN(vi.valor)) {
                addToStack.push(vi.valor);
            }
            var vd = this.hijos[1].traducir(ts);
            if (isNaN(vi.valor)) {
                addToStack.pop();
            }
            if (vd == null) {
                return null;
            }

            if ((typeof vi.esarr != "undefined" && vi.esarr) || (typeof vd.esarr != "undefined" && vd.esarr)) {
                if ((typeof vi.esarr != "undefined" && vi.esarr) && (typeof vd.esarr != "undefined" && vd.esarr)) {
                    var ti = salto_temp.nextTemp();
                    var td = salto_temp.nextSalto();

                }
            } else if (vd.tipo == vtipo.string && vi.tipo == vtipo.string) {
                st += "t6 = " + vi.valor + ";\n";
                st += "t7 = " + vd.valor + ";\n";
                st += "call compCadenas;\n";
                val = "t10 " + s_operando[this.operando] + " 1";
            }
        } else if (this.operando == voperando.igualigual || this.operando == voperando.difigual) {
            var st = "";
            var vi = this.hijos[0].traducir(ts);
            if (isNaN(vi.valor)) {
                addToStack.push(vi.valor);
            }

            var vd = this.hijos[1].traducir(ts);
            if (isNaN(vi.valor)) {
                addToStack.pop();
            }
            if (vd == null) {
                return null;
            }
            st += vi.cadena;
            st += vd.cadena;
            var val = "";
            if (vd.tipo == vtipo.string && vi.tipo == vtipo.string) {
                st += "t6 = " + vi.valor + ";\n";
                st += "t7 = " + vd.valor + ";\n";
                st += "call compCadenas;\n";
                val = "t10 " + s_operando[this.operando] + " 1";
            } else {
                val = vi.valor + " " + s_operando[this.operando] + " " + vd.valor;
            }

            if (typeof this.estaEnUnIf != "undefined") {
                return { valor: val, tipo: vtipo.boolean, cadena: st };
            }

            var tr = salto_temp.nextTemp();
            var ns = salto_temp.nextSalto();
            st += tr + "= 1;\n";
            st += "if (" + val + ") goto " + ns + ";\n";
            st += tr + "= 0;\n";
            st += ns + ":\n";
            return { valor: tr, tipo: vtipo.boolean, cadena: st };
        } else if (this.operando == voperando.mayor || this.operando == voperando.mayorigual
            || this.operando == voperando.menor || this.operando == voperando.menorigual) {
            var st = "";
            var vi = this.hijos[0].traducir(ts);
            if (vi == null) {
                return null;
            }
            if (isNaN(vi.valor)) {
                addToStack.push(vi.valor);
            }
            var vd = this.hijos[1].traducir(ts);
            if (isNaN(vi.valor)) {
                addToStack.pop();
            }
            if (vd == null) {
                return null;
            }

            var tipo = null;
            if (!(compImplicito(vtipo.double, vi.tipo) && compImplicito(vtipo.double, vd.tipo))) {
                return this.niuerror("En " + v_operando[this.operando] + " se esperan comparar dos valores numericos.");
            }

            st += vi.cadena;
            st += vd.cadena;

            if (typeof this.estaEnUnIf != "undefined") {
                var val = vi.valor + " " + s_operando[this.operando] + " " + vd.valor;
                return { valor: val, tipo: vtipo.boolean, cadena: st };
            }


            var tr = salto_temp.nextTemp();
            var ns = salto_temp.nextSalto();
            st += tr + "= 1;\n";
            st += "if (" + vi.valor + " " + s_operando[this.operando] + " " + vd.valor + ") goto " + ns + ";\n";
            st += tr + "= 0;\n";
            st += ns + ":\n";
            return { valor: tr, tipo: vtipo.boolean, cadena: st };
        } else if (this.operando == voperando.or || this.operando == voperando.and) {
            //Or y and
            this.hijos[0].estaEnUnIf = true;
            this.hijos[1].estaEnUnIf = true;
            var etV = [];
            var etF = [];
            var vi = this.hijos[0].traducir(ts);
            if (vi == null) {
                return null;
            }
            if (isNaN(vi.valor)) {
                addToStack.push(vi.valor);
            }
            var vd = this.hijos[1].traducir(ts);
            if (isNaN(vi.valor)) {
                addToStack.pop();
            }
            if (vd == null) {
                return null;
            }
            var st = "";
            if (!(vi.tipo == vd.tipo && vd.tipo == vtipo.boolean)) {
                return this.niuerror("Para un " + v_operando[this.operando] + " se espera dos operandos booleanos. ");
            }
            if (this.operando == voperando.or) {
                var s1 = salto_temp.nextSalto();
                if (typeof vi.etV != "undefined") {
                    vi.cadena = replaceAll(vi.cadena, "LF", s1);
                    st += vi.cadena;
                } else {
                    st += vi.cadena;
                    st += "if ( " + vi.valor + ") goto LT;\n";
                    st += "goto " + s1 + ";\n";
                }
                st += s1 + ":\n";
                st += vd.cadena;
                if (typeof vd.etV == "undefined") {
                    st += "if ( " + vd.valor + ") goto LT;\n";
                    st += "goto LF;\n";
                }
            } else {
                var s1 = salto_temp.nextSalto();
                if (typeof vi.etV != "undefined") {
                    vi.cadena = replaceAll(vi.cadena, "LT", s1);
                    st += vi.cadena;
                } else {
                    st += vi.cadena;
                    st += "if ( " + vi.valor + ") goto " + s1 + ";\n";
                    st += "goto LF;\n";
                }
                st += s1 + ":\n";
                st += vd.cadena;
                if (typeof vd.etV == "undefined") {
                    st += "if( " + vd.valor + ") goto LT;\n";
                    st += "goto LF;\n";
                }
            }
            /*print("---------------or o and jeje----------------");
            print(st);
            print("---------------or o and jeje----------------");*/

            var midata = { tipo: vtipo.boolean, cadena: st, etV: "LT", etF: "LF" };
            return midata;

        } else if (this.operando == voperando.xor) {

            this.hijos[0].estaEnUnIf = true;
            this.hijos[1].estaEnUnIf = true;
            var etV = [];
            var etF = [];
            var vi = this.hijos[0].traducir(ts);
            if (vi == null) {
                return null;
            }
            vi = mbatch(vi);
            if (isNaN(vi.valor)) {
                addToStack.push(vi.valor);
            }
            var vd = this.hijos[1].traducir(ts);
            if (vd == null) {
                return null;
            }
            vd = mbatch(vd);
            if (isNaN(vi.valor)) {
                addToStack.pop();
            }
            var st = "";

            var etVI = [];
            var etFI = [];
            if (!(vi.tipo == vd.tipo && vd.tipo == vtipo.boolean)) {
                return this.niuerror("Para un " + v_operando[this.operando] + " se esperan dos operandos booleanos. ");
            }


            if (typeof vi.etV != "undefined") {
                var nst = "";
                var nt = salto_temp.nextTemp();
                nst = nt + "=1;\n" + vi.cadena;
                for (var a = 0; a < vi.etF.length; a++) {
                    nst += vi.etF[a] + ":\n";
                }
                nst += nt + "=0;\n";
                for (var a = 0; a < vi.etV.length; a++) {
                    nst += vi.etV[a] + ":\n";
                }
                vi = { valor: "1 == " + nt, tipo: vtipo.boolean, cadena: nst };
            }
            if (typeof vd.etV != "undefined") {
                var nst = "";
                var nt = salto_temp.nextTemp();
                nst = nt + "=1;\n" + vd.cadena;
                for (var a = 0; a < vd.etF.length; a++) {
                    nst += vd.etF[a] + ":\n";
                }
                nst += nt + "=0;\n";
                for (var a = 0; a < vd.etV.length; a++) {
                    nst += vd.etV[a] + ":\n";
                }
                vd = { valor: "1 == " + nt, tipo: vtipo.boolean, cadena: nst };

            }
            st += vi.cadena;
            st += vd.cadena;


            var s1 = salto_temp.nextSalto();
            var s2 = salto_temp.nextSalto();
            st += "if(" + vi.valor + ") goto " + s1 + ";\n";
            st += "goto " + s2 + ";\n";

            etVI.push(s1);
            etFI.push(s2);
            /*var s3 = salto_temp.nextSalto();
            var s4 = salto_temp.nextSalto();
            var s5 = salto_temp.nextSalto();
            var s6 = salto_temp.nextSalto();*/

            for (var a = 0; a < etVI.length; a++) {
                st += etVI[a] + ":\n";
            }
            st += "if(" + vd.valor + ") goto LF;\n";
            st += "goto LT;\n";
            for (var a = 0; a < etFI.length; a++) {
                st += etFI[a] + ":\n";
            }
            st += "if(" + vd.valor + ") goto LT;\n";
            st += "goto LF;\n";


            var midata = { tipo: vtipo.boolean, cadena: st, etV: "LT", etF: "LF" };
            return midata;
        } else if (this.operando == voperando.potencia) {
            var vi = this.hijos[0].traducir(ts);
            if (vi == null) {
                return null;
            }
            if (isNaN(vi.valor)) {
                addToStack.push(vi.valor);
            }
            var vd = this.hijos[1].traducir(ts);
            if (isNaN(vi.valor)) {
                addToStack.pop();
            }
            if (vd == null) {
                return null;
            }
            if (!(compImplicito(vtipo.integer, vi.tipo) && compImplicito(vtipo.integer, vd.tipo))) {
                return this.niuerror("En potencia solo se esperan dos enteros.");
            }

            var st = vi.cadena + vd.cadena;

            var tr = salto_temp.nextTemp();
            st += "t3 = " + vi.valor + ";\n";
            st += "t4 = " + vd.valor + ";\n";
            st += "call potencia;\n";
            st += tr + " = t5;\n";

            return { valor: tr, tipo: vtipo.integer, cadena: st };

        } else if (this.operando == voperando.modulo) {
            var vi = this.hijos[0].traducir(ts);
            if (vi == null) {
                return null;
            }
            if (isNaN(vi.valor)) {
                addToStack.push(vi.valor);
            }
            var vd = this.hijos[1].traducir(ts);
            if (isNaN(vi.valor)) {
                addToStack.pop();
            }
            if (vd == null) {
                return null;
            }
            if (!(compImplicito(vtipo.integer, vi.tipo) && compImplicito(vtipo.integer, vd.tipo))) {
                return this.niuerror("En modulo solo se esperan dos enteros.");
            }
            var st = vi.cadena + vd.cadena;
            var tr = salto_temp.nextTemp();
            st += tr + " = " + vi.valor + " % " + vd.valor + ";\n";

            return { valor: tr, tipo: vtipo.integer, cadena: st };
        } else {

            print("Falta traducir " + v_operando[this.operando] + " " + this.operando + " " + " en expresion_binaria(expresiones.js)");
        }
    }
}

class expresionUnaria extends Nodo {
    //this.operando es la operacion 
    //va a tener un hijo y jackson x2 
    dibujar(c) {
        c.va += 1;
        var nodo = {}, child = [], va = c.va;
        nodo.name = "expU [" + v_operando[this.operando] + "]";
        c.comp();
        for (var a = 0; a < this.hijos.length; a++) {
            if (!(this.hijos[a] instanceof Nodo)) {
                break;
            }
            child.push(this.hijos[a].dibujar(c));
            c.va = va;
        }
        if (child.length > 0) {
            nodo.children = child;
        }
        return nodo;
    }

    traducir(ts) {

        print(this);
        var tu = this.hijos[0].traducir(ts);
        if (tu == null) { return null; }
        var st = tu.cadena;
        if (this.operando == voperando.menos) {

            if (!(tu.tipo == vtipo.integer || vtipo.double)) {
                print("Para hacer una negacion se debe de hacer de tipo integer o double. ");
            }
            var nt = salto_temp.nextTemp();
            st += nt + "= - " + tu.valor + ";\n";
            return { valor: nt, tipo: tu.tipo, cadena: st };
        } else if (this.operando == voperando.not) {
            if (tu.tipo == vtipo.boolean) {
                //falta ver lo que trae el return ya que si vienen etiquetas simplemente se cambia.

                print(tu);
                print("-------------------");
                if (typeof tu.etV != "undefined") {

                    var cad = tu.cadena;
                    cad = replaceAll(cad, "LT", "LA");
                    cad = replaceAll(cad, "LF", "LT");
                    cad = replaceAll(cad, "LA", "LF");
                    tu.cadena = cad;
                    return tu;
                }

                var nt = salto_temp.nextTemp();
                st += nt + "= " + tu.valor + " - 1;\n";
                var tn2 = salto_temp.nextTemp();
                st += tn2 + "=" + nt + "*-1;\n";
                print("_------------------------_");
                print(st);

                if (typeof this.estaEnUnIf != "undefined" && this.estaEnUnIf) {
                    return { valor: tn2 + " == 1", tipo: vtipo.boolean, cadena: st };
                }

                return { valor: tn2, tipo: vtipo.boolean, cadena: st };
            } else {
                print("Para hacer un not debe de ser de tipo booleano. ");
            }
        }
    }
}

class inc_dec extends Nodo {
    //operando y id seran sus variables. 
    dibujar(c) {
        var nodo = {};
        nodo.name = this.id + v_operando[this.operando];
        c.va += 1;
        c.hojas++;
        c.comp();
        return nodo;
    }


    traducir(ts) {
        var mvar = ts.obtenerVar(this.id);
        if (mvar == null) {
            return this.niuerror("No se ha encontrado la variable " + mvar.id);
        }
        if (!mvar.declarada) {
            return this.niuerror("No se ha declarado la variable " + mvar.id);
        }

        if (!(mvar.tipo == vtipo.integer || mvar.tipo == vtipo.double)) {
            return this.niuerror("Solo se puede hacer incremento y decremento con variables numericas. ");
        }

        var t1 = salto_temp.nextTemp();
        var t2 = salto_temp.nextTemp();
        var signo = this.operando == voperando.masmas ? "+" : "-";

        var st = "";
        if (mvar.refHeap) {
            st += t1 + " = Heap[" + mvar.ref + "];\n";
            st += t2 + " = " + t1 + " " + signo + " 1;\n";
            st += "Heap[" + mvar.ref + "]" + t2 + ";\n";
        } else {
            var tref = salto_temp.nextTemp();
            st += tref + " = p + " + mvar.ref + ";\n"
            st += t1 + " = Stack[" + tref + "];\n";
            st += t2 + " = " + t1 + " " + signo + " 1;\n";
            st += "Stack[" + tref + "] = " + t2 + ";\n";
        }


        if (this.retValor) {
            return { cadena: st, valor: t1, tipo: mvar.tipo };
        }
        print(st);
        return st;
    }
}

class primitivo extends Nodo {
    //tipo y valor seran sus variables 
    dibujar(c) {
        var nodo = {};
        nodo.name = v_prim[this.tipo] + " [" + this.valor + "]";
        c.va += 1;
        c.hojas++;
        c.comp();
        return nodo;
    }


    traducir(ts) {
        var val = "";
        if (this.tipo <= 3) {
            if (this.tipo == vprim.boolean) {
                val = this.valor ? 1 : 0;
                if (typeof this.estaEnUnIf != "undefined") {
                    val = "1 == " + val;
                }
            } else if (this.tipo == vprim.integer) {
                val = this.valor;
            } else if (this.tipo == vprim.char) {
                val = this.valor.charCodeAt(0);
            } else if (this.tipo == vprim.double) {
                val = this.valor;
            }
            return { tipo: this.tipo, valor: val, cadena: "" };
        } else if (this.tipo == vprim.id) {
            var st = "";
            var nvar = ts.obtenerVar(this.valor);
            if (nvar == null) {
                return this.niuerror("Variable " + this.valor + " no encontrada");
            }

            if (!nvar.declarada) {
                return this.niuerror("Variable " + this.valor + " no declarada");
            }
            var tn = salto_temp.nextTemp();
            if (nvar.refHeap) {
                st += tn + "= Heap[" + nvar.ref + "];\n";
                return { valor: tn, tipo: nvar.tipo, cadena: st };
            } else {
                var tn2 = salto_temp.nextTemp();
                st += tn + " = p + " + nvar.ref + ";\n";
                st += tn2 + " = Stack[" + tn + "];\n";
                return { valor: tn2, tipo: nvar.tipo, cadena: st };

            }
        } else if (this.tipo == vprim.string) {
            var tn = salto_temp.nextTemp();
            var st = "";
            st += tn + " = h;\n";
            for (var a = 0; a < this.valor.length; a++) {
                st += "heap[h] = " + this.valor.charCodeAt(a) + ";\n";
                st += "h = h + 1;\n";
            }
            st += "heap[h] = -1;\n";
            st += "h = h + 1;\n";

            return { tipo: this.tipo, valor: tn, cadena: st };
        } else {
            print("Falta traducir de " + v_prim[this.tipo] + " en primitivo (expresiones.js)");
        }
    }

}

class llamadaFunc extends Nodo {
    soy() {
        return "LlamadaFunc [" + this.id + "]";
    }

    traducir(ts) {

        /*print(ts.nvarDeclaradas);
        print(this);
        print(this.hijos);*/

        if (ts == tglobal) {
            return this.niuerror("No se pueden hacer llamadas a funciones en el ambito global.");
        }

        print(addToStack);
        var st = "##Inicio llamada " + this.id + "\n";
        var tret = null;
        var nsum = 0;
        var nrefNV = ts.getNvarDeclaradas();


        var nvdec = nrefNV;

        var t1;
        var nt = salto_temp.nextTemp();

        var param = [];

        var nombreFunc = this.id;


        var posnomfunc = [];
        var posnomfunc2 = [];

        posnomfunc.push("gen_" + this.id);

        addToStack.push(nt);
        for (var a = 0; a < this.hijos.length; a++) {
            this.hijos[a].prel = nt;
            this.hijos[a].nparam = a;
            var pr = this.hijos[a].traducir(ts);
            if (pr == null) {
                return null;
            }

            if (typeof pr.etV != "undefined") {
                print(pr);
                pr = mbatch(pr);
                print(pr);
                var tr = salto_temp.nextTemp();
                var staux = tr + "= 1;\n";
                staux += pr.cadena;
                for (var b = 0; b < pr.etF.length; b++) {
                    staux += pr.etF[b] + ":\n";
                }
                staux += tr + " = 0;\n";
                for (var b = 0; b < pr.etV.length; b++) {
                    staux += pr.etV[b] + ":\n";
                }
                pr.cadena = staux;
                pr.valor = tr;
                print(pr);
            }

            param.push(pr);

            var tp = pr.tipo;
            var stsum = "_n";
            if (typeof pr.esarr != "undefined" && pr.esarr) {
                stsum = "_arr";
            }
            nombreFunc += stsum;
            for (var b = 0; b < posnomfunc.length; b++) {
                posnomfunc[b] += stsum;
            }

            if (Number.isInteger(tp)) {
                nombreFunc += v_tipo[tp];
                if (tp == vtipo.char) {
                    for (var b = 0; b < posnomfunc.length; b++) {
                        posnomfunc2.push(posnomfunc[b] + v_tipo[vtipo.char]);
                        posnomfunc2.push(posnomfunc[b] + v_tipo[vtipo.integer]);
                        posnomfunc2.push(posnomfunc[b] + v_tipo[vtipo.double]);
                    }
                } else if (tp == vtipo.integer) {
                    for (var b = 0; b < posnomfunc.length; b++) {
                        posnomfunc2.push(posnomfunc[b] + v_tipo[vtipo.integer]);
                        posnomfunc2.push(posnomfunc[b] + v_tipo[vtipo.double]);
                    }
                } else {
                    for (var b = 0; b < posnomfunc.length; b++) {
                        posnomfunc2.push(posnomfunc[b] + v_tipo[tp]);
                    }
                }
            } else {
                nombreFunc += tp;
                for (var b = 0; b < posnomfunc.length; b++) {
                    posnomfunc2.push(posnomfunc[b] + tp);
                }
            }
            posnomfunc = posnomfunc2;
            posnomfunc2 = [];
            st += param[a].cadena;
            addToStack.push(pr.valor);
        }

        for (var a = 0; a < this.hijos.length; a++) {
            addToStack.pop();
        }
        addToStack.pop();

        if (this.hijos.length == 0) {
            nombreFunc += "_sin_params";
            posnomfunc[0] += "_sin_params";
        }

        var nf2 = "gen_" + nombreFunc;


        var nfunc = null;

        for (var a = 0; a < posnomfunc.length; a++) {
            nfunc = tglobal.obtenerFunc(posnomfunc[a]);
            if (nfunc != null) {
                nf2 = posnomfunc[a];
                break;
            }
        }



        if (nfunc == null) {
            return this.niuerror("No se encuentra la funcion " + nombreFunc);
        }
        if (nfunc.tiporetorno == vtipo.void && this.exp) {
            return this.niuerror("En expresion no se pueden llamar a funciones de tipo void.");
        }

        print("mi stack " + addToStack.length);

        if (addToStack.length != 0) {
            t1 = salto_temp.nextTemp();
            for (var a = 0; a < addToStack.length; a++) {
                nsum++;
                st += t1 + " = p + " + (nrefNV + a) + ";  ##Para que no se pierda el temporal " + addToStack[a] + "\n";
                st += "Stack[" + t1 + "] = " + addToStack[a] + ";\n";
            }
        }


        st += nt + " =  p + " + (nvdec + nsum) + "; ## cambio de ambito simulado. \n";

        for (var a = 0; a < param.length; a++) {
            var nref = nfunc.params[a].gref;
            var niut = salto_temp.nextTemp();
            st += niut + " = " + nt + " + " + nref + ";\n";
            st += "Stack[" + niut + "] = " + param[a].valor + ";\n";
        }


        st += "p = p + " + (nvdec + nsum) + ";\n";

        st += "call " + nf2 + ";\n";

        if (nfunc.tiporetorno != vtipo.void) {
            if (this.exp) {
                tret = salto_temp.nextTemp();
                st += tret + "= Stack[p];\n";
            }
        }

        st += "p = p - " + (nvdec + nsum) + ";\n";
        if (nsum != 0) {
            print("si entra aqui");
            for (var a = 0; a < addToStack.length; a++) {
                st += t1 + " = p + " + (nrefNV + a) + ";  ##Para recuperar el temporal " + addToStack[a] + "\n";
                st += addToStack[a] + " = Stack[" + t1 + "];\n";
            }
        }

        if (this.exp) {


            if (typeof this.estaEnUnIf != "undefined") {
                tret = tret + " == 1";
            }
            return { cadena: st, valor: tret, tipo: nfunc.tiporetorno, esarr: nfunc.devuelveArr };
        }
        return st;
    }
}

class SParam extends Nodo {
    soy() {
        return "SParam " + (this.ref ? "R" : "V ");
    }

    traducir(ts) {
        var nr = this.hijos[0].traducir(ts);
        //falta ver si es por referencia o valor :(
        if (this.ref) {
            if (typeof nr.esarr != "undefined" && nr.esarr) {
                var st = nr.cadena;
                var t = salto_temp.nextTemp();
                st += t + " = h;\n";
                st += "t1 = " + nr.valor + ";\n";
                st += "t2 = Heap[t1];\n";
                st += "t2 = t2 + 1;\n";
                st += "call copyArrToStack;";
                return { valor: t, tipo: nr.tipo, cadena: st, esarr: true };
            }
        }

        return nr;
    }
}