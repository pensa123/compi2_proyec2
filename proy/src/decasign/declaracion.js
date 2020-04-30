var vtipo = {
    "integer": 0,
    "double": 1,
    "char": 2,
    "boolean": 3,
    "void": 4
}

var v_tipo = ["integer", "double", "char", "boolean", "void"];

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
        }else{
            c.hojas++;
        }
        nodo.children.push(nodo2);
        nodo.children.push(this.inst.dibujar(c));
        c.va = va;


        return nodo;
    }
}

class Casteo extends Nodo{

}

class Asignacion extends Nodo{

}

class Id extends Nodo{
    dibujar(c){
        c.hojas++; 
        return {name : this.id}; 
    }
}