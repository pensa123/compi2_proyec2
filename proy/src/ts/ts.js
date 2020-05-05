class ts {
    constructor(padre, nombre) {
        this.padre = padre;
        this.nombre = nombre;
        this.hijos = [];
        this.vars = [];   //arreglo de mivar 
        this.nvars = [];  //nombre de variables del arreglo de arriba
        this.funcs = [];  //arreglo de func 
        this.nfuncs = []; //nombres de la sfunciones 

        this.structs = [];   //arreglo de structs 
        this.nstructs = [];  //nombre  de structs 

        this.esMetodo = false;
        this.esCiclo = false;
        this.esSwitch = false;

        this.indiceStack = 0;
        this.indiceHeap = 0;
    }

    obtenerVar(st) {
        var n = this.nvars.indexOf(st);
        if (n != -1) {
            return this.vars[n];
        } else {
            return null;
        }
    }

    agregarVar(nvar) {
        if (this.nvars.indexOf(nvar.nombre) == -1) {
            this.vars.push(nvar);
            this.nvars.push(nvar.nombre);
            return true;
        } else {
            return false;
        }
    }
}

class mivar {
    //ambito al que pertence
    //tipo de varialbe var, const o global 
    //si es global su posicion en el stack 
    //tipo de la variable 
    //si es local el temporal que le hace referencia 
    //linea en la que fue asignada
    //lineas en las que fue modificada o llamada 
    //creo que solo
    constructor(ambito) {
        this.ambito = ambito;
        this.ref = "";
        this.tipo = "";
        this.esArreglo = false;
        this.refHeap = false;
        this.declaracion = 0;
        this.a = 0;
        this.usadaEn = [];
        this.tvar = 0;
        this.nombre = "";
        this.instanciada = false;
        this.declarada = false;
    }
}

class func {
    //nombre de la funcion, valor de retorno 
    //tamaño de la funcion (cuantas variables) 
    //cantidad de parametros
    //tipos de maparametros 
    //y creo que solo 
    constructor() {

    }
}


class temp_salto {
    constructor() {
        this.nt = 1;
        this.ns = 1;
    }

    nextTemp() {
        return "t" + this.nt++;
    }

    nextSalto() {
        return "L" + this.ns++;
    }
}
