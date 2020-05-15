var opn3d = {
    MAS: 0,
    MENOS: 1,
    POR: 2,
    DIVIDIDO: 3,
    MODULO: 4
};
var opn_3d = ["+", "-", "*", "/", "%"];

var opb3d = {
    MENORIGUAL: 0,
    MAYORIGUAL: 1,
    IGUALIGUAL: 2,
    DIFIGUAL: 3,
    MENOR: 4,
    MAYOR: 5
};

var tp3d = {
    int: 1,
    double: 2,
    id: 3
};
var tp_3d = ["int", "double", "id"];

var opb_3d = ["<=", ">=", "==", "<>", "<", ">"];

class ins3d extends Nodo {

}

class decasign3d extends Nodo {
    opt3d() {
        var n = this.hijos[0].opt3d();
        return "var " + this.id + " = " + n + ";\n";
    }
}

class decarr3d extends Nodo {
    opt3d() {
        return "var " + this.id + "[];\n";
    }
}

class declaracion3d extends Nodo {
    opt3d() {
        var st = "var ";
        for (var a = 0; a < this.hijos.length; a++) {
            if (a != 0)
                st += ", ";
            st += this.hijos[a];
        }
        return st + ";\n";
    }
}

class asignacion3d extends Nodo {
    opt3d() {
        if (this.hijos.length == 1) {
            var n = this.hijos[0].opt3d();
            return this.id + " = " + n + ";\n";
        }

        var n1 = this.hijos[0].opt3d();
        var n2 = this.hijos[1].opt3d();
        var ret = this.id + " = " + n1 + " " + opn_3d[this.opn] + " " + n2 + ";\n";
        if (this.opn == opn3d.MAS) {
            if (n1 == 0) {
                if (n2 == this.id) {
                    return this.niuoptim(8, ret, "");
                }
                var ret2 = this.id + " = " + n2 + ";\n"
                return this.niuoptim(12, ret, ret2);
            }
            if (n2 == 0) {
                if (n1 == this.id) {
                    return this.niuoptim(8, ret, "");
                }
                var ret2 = this.id + " = " + n1 + ";\n";
                return this.niuoptim(12, ret, ret2);
            }

        } else if (this.opn == opn3d.DIVIDIDO) {
            if (n1 == 0) {
                var ret2 = this.id + " = 0;\n";
                return this.niuoptim(18, ret, ret2);
            }
            if (n2 == 1) {
                if (this.id == n1) {
                    var ret2 = "";
                    this.niuoptim(11, ret, "");
                    return "";
                }
                var ret2 = this.id + " = " + n1 + ";\n";
                return this.niuoptim(15, ret, ret2);
            }
        } else if (this.opn == opn3d.POR) {
            if (n1 == 0) {
                var ret2 = this.id + " = 0;\n";
                return this.niuoptim(17, ret, ret2);
            }
            if (n2 == 0) {
                var ret2 = this.id + " = 0;\n";
                return this.niuoptim(17, ret, ret2);
            }

            if (n1 == 1) {
                if (n2 == this.id) {
                    return this.niuoptim(10, ret, "");
                }
                var ret2 = this.id + " = " + n2 + ";\n";
                return this.niuoptim(14, ret, ret2);
            }
            if (n2 == 1) {
                if (n1 == this.id) {
                    this.niuoptim(10, ret, "");
                    return "";
                }
                var ret2 = this.id + " = " + n1 + ";\n";
                return this.niuoptim(14, ret, ret2);
            }

            if (n1 == 2) {
                var ret2 = this.id + " = " + n2 + " + " + n2 + ";\n";
                return this.niuoptim(16, ret, ret2);
            }
            if (n2 == 2) {
                var ret2 = this.id + " = " + n1 + " + " + n1 + ";\n";
                return this.niuoptim(16, ret, ret2);
            }
        } else if (this.opn == opn3d.MENOS) {
            if (n2 == 0) {
                if (n1 == this.id) {
                    return this.niuoptim(9, ret, "");
                }
                var ret2 = this.id + " = " + n1 + ";\n";
                return this.niuoptim(13, ret, ret2);
            }
        }
        return ret;
    }
}


class asignArr extends Nodo {
    // a = Heap[n]
    opt3d() {
        var n1 = this.hijos[0].opt3d();
        return this.id + " = " + this.id2 + "[" + n1 + "];\n";
    }
}

class arrAsign extends Nodo {
    // Heap[n] = a;
    opt3d() {
        var n1 = this.hijos[0].opt3d();
        var n2 = this.hijos[1].opt3d();

        return this.id + "[" + n1 + "] = " + n2 + ";\n";
    }
}


class opBool3d extends Nodo {
    opt3d() {
        var n1 = this.hijos[0].opt3d();
        var n2 = this.hijos[1].opt3d();
        if (n1 == n2) {
            if (this.opb == opb3d.IGUALIGUAL || this.opb == opb3d.MAYORIGUAL || this.opb == opb3d.MENORIGUAL) {
                return [n1 + " " + opb_3d[this.opb] + " " + n2, "ST"];
            } else {
                return [n1 + " " + opb_3d[this.opb] + " " + n2, "SF"];
            }
        }

        if (!isNaN(n1) && !isNaN(n2)) {
            if (this.opb == opb3d.IGUALIGUAL) {
                return [n1 + " " + opb_3d[this.opb] + " " + n2, "SF"];
            } else if (this.opb == opb3d.DIFIGUAL) {
                return [n1 + " " + opb_3d[this.opb] + " " + n2, "ST"];
            }
        }

        return [n1 + " " + opb_3d[this.opb] + " " + n2];
    }
}


class print3d extends Nodo {
    opt3d() {
        var n = this.hijos[0].opt3d();
        return "print(" + this.timp + "," + n + ");\n";
    }
}

class saltos3d extends Nodo {
    opt3d() {
        if (this.hijos.length == 1) {
            return "goto " + this.hijos[0] + ";\n";
        } else {

            var n = this.hijos[0].opt3d();
            if (n.length == 2) {
                if (n[1] == "ST") {
                    this.niuoptim(4, "if ( " + n[0] + ") goto " + this.hijos[1] + "<br/>(Siempre verdadero)", "goto " + this.hijos[1]);
                    return "goto " + this.hijos[1] + ";\n";
                } else {
                    this.niuoptim(5, "if ( " + n[0] + ") goto " + this.hijos[1] + "<br/>(Siempre falso)", "");
                    return "";
                }
            } else {
                return "if ( " + n[0] + ") goto " + this.hijos[1] + ";\n";
            }
        }
    }
}

class etiqueta3d extends Nodo {
    opt3d() {
        return this.id + ":\n";
    }
}

class tipo3d extends Nodo {
    opt3d() {
        if (this.menos) {
            if (this.val == 0) {
                return 0;
            }
            if (isNaN(this.val)) {
                return "-" + this.val;
            } else {
                return - this.val;
            }
        }
        return this.val;
    }
}

class llamadafunc3d extends Nodo {

    opt3d() {
        return "call " + this.id + ";\n";
    }
}

class decfunc3d extends Nodo {
    opt3d() {
        return "proc " + this.id + " begin\n";
    }
}

class end3d extends Nodo {
    opt3d() {
        return "end\n";
    }
}