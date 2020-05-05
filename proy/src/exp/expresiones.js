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
    "!=", "===",
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

        if (this.operando == voperando.mas || this.operando == voperando.menos
            || this.operando == voperando.por || this.operando == voperando.modulo
            || this.operando == voperando.dividido) {
            /*if (naux.tipo == vprim.integer || vprim.double) {
                if (naux.valor == 0) {
                    print("Error, no se puede dividir en 0");
                }
            }*/
            var st = "";
            var vi = this.hijos[0].traducir(ts);
            var vd = this.hijos[1].traducir(ts);
            var tr = salto_temp.nextTemp();
            var tipo = null;

            st += vi.cadena;
            st += vd.cadena;
            st += tr + "=" + vi.valor + s_operando[this.operando] + vd.valor + ";\n";

            return { valor: tr, tipo: vi.tipo, cadena: st };
        } else if (this.operando == voperando.igualigual || this.operando == voperando.difigual) {
            var st = "";
            var vi = this.hijos[0].traducir(ts);
            var vd = this.hijos[1].traducir(ts);
            var tipo = null;



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
        } else if (this.operando == voperando.mayor || this.operando == voperando.mayorigual
            || this.operando == voperando.menor || this.operando == voperando.menorigual) {
            var st = "";
            var vi = this.hijos[0].traducir(ts);
            var vd = this.hijos[1].traducir(ts);
            var tipo = null;

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
            var vd = this.hijos[1].traducir(ts);
            var st = "";


            if (!(vi.tipo == vd.tipo && vd.tipo == vtipo.boolean)) {
                return this.niuerror("Para un " + v_operando[this.operando] + " se espera dos operandos booleanos. ");
            }

            st += vi.cadena;
            if (typeof vi.etV != "undefined") {
                for (var a = 0; a < vi.etV.length; a++) {
                    if (this.operando == voperando.and) {
                        st += vi.etV[a] + ":\n";
                    } else {
                        etV.push(vi.etV[a]);
                    }
                }
                for (var a = 0; a < vi.etF.length; a++) {
                    if (this.operando == voperando.and) {
                        etF.push(vi.etF[a]);
                    } else {
                        st += (vi.etF[a]) + ":\n";
                    }
                }
            } else {
                var s1 = salto_temp.nextSalto();
                var s2 = salto_temp.nextSalto();
                st += "if (" + vi.valor + ") goto " + s1 + ";\n";
                st += "goto " + s2 + ";\n";
                st += (this.operando == voperando.or ? s2 : s1) + ":\n";
                if (this.operando == voperando.and) {
                    etF.push(s2);
                } else {
                    etV.push(s1);
                }
            }

            st += vd.cadena;
            if (typeof vd.etV != "undefined") {
                for (var a = 0; a < vd.etV.length; a++) {
                    etV.push(vd.etV[a]);
                }
                for (var a = 0; a < vd.etF.length; a++) {
                    etF.push(vd.etF[a]);
                }
            } else {
                var s3 = salto_temp.nextSalto();
                var s4 = salto_temp.nextSalto();
                st += "if ( " + vd.valor + ") goto " + s3 + ";\n";
                st += "goto " + s4 + ";\n";
                etV.push(s3);
                etF.push(s4);
            }

            var midata = { tipo: vtipo.boolean, cadena: st, etV: etV, etF: etF };

            return midata;

        } else if (this.operando == voperando.xor) {

            this.hijos[0].estaEnUnIf = true;
            this.hijos[1].estaEnUnIf = true;
            var etV = [];
            var etF = [];
            var vi = this.hijos[0].traducir(ts);
            var vd = this.hijos[1].traducir(ts);
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
            var s3 = salto_temp.nextSalto();
            var s4 = salto_temp.nextSalto();
            var s5 = salto_temp.nextSalto();
            var s6 = salto_temp.nextSalto();

            for (var a = 0; a < etVI.length; a++) {
                st += etVI[a] + ":\n";
            }
            st += "if(" + vd.valor + ") goto " + s3 + ";\n";
            etF.push(s3);
            st += "goto " + s4 + ";\n";
            etV.push(s4);
            for (var a = 0; a < etFI.length; a++) {
                st += etFI[a] + ":\n";
            }
            st += "if(" + vd.valor + ") goto " + s5 + ";\n";
            etV.push(s5);
            st += "goto " + s6 + ";\n";
            etF.push(s6);

            var midata = { tipo: vtipo.boolean, cadena: st, etV: etV, etF: etF };
            return midata;
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

        var tu = this.hijos[0].traducir(ts);
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
                var nt = salto_temp.nextTemp();
                st += nt + "= " + tu.valor + " -1;\n";
                var tn = salto_temp.nextTemp();
                st += tn + "= -1;\n";
                var tn2 = salto_temp.nextTemp();
                st += tn2 + "=" + nt + "*" + tn;
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
            print(this.valor);
            var st = "";
            var nvar = ts.obtenerVar(this.valor);
            if (nvar == null) {
                return "";
            }

            if (!nvar.declarada) {
                return this.niuerror("Variable " + this.valor + " no declarada");
            }
            var tn = salto_temp.nextTemp();
            if (nvar.refHeap) {
                st += tn + "= Heap[" + nvar.ref + "];\n";
                return { valor: tn, tipo: nvar.tipo, cadena: st };
            } else {
                print("aun falta con el stack por que hay que hacer referencia a la posicion relativa :D");
            }
        } else {
            print("Falta traducir de " + v_prim[this.tipo] + " en primitivo (expresiones.js)");
        }
    }

}

class llamadaFunc extends Nodo {
    soy() {
        return "LlamadaFunc [" + this.id + "]";
    }
}

class SParam extends Nodo {
    soy() {
        return "Param " + (this.ref ? "R" : "V ");
    }
}