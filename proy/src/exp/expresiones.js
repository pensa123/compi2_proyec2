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
}