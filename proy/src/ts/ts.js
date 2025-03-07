class Tabla_Sim {
    constructor(padre, nombre) {
        this.padre = padre;

        this.nombre = nombre;
        this.hijos = [];

        this.vars = [];   //arreglo de mivar 
        this.nvars = [];  //nombre de variables del arreglo de arriba


        this.funcs = [];    //arreglo de func 
        this.nfuncs = [];   //nombres de la sfunciones 
        this.nfuncs3d = []; //nombre de las funciones en 3d (concatenados los parametros yqlg.); 


        this.structs = [];   //arreglo de structs 
        this.nstructs = [];  //nombre  de structs 

        this.esMetodo = false;
        this.esCiclo = false;
        this.esSwitch = false;

        this.indiceStack = 0;
        this.indiceHeap = 0;

        this.tipoRetorno = null;
        this.retornoEsArr = false;


        this.sContinue = null;
        this.sBreak = null;
        this.sreturn = null;

        this.nvarDeclaradas = 0;

        if (padre != null) {
            padre.hijos.push(this);
            if (padre != tglobal) {
                this.indiceStack = padre.indiceStack;
            }
        }
    }

    getNvarDeclaradas() {
        var n = this.nvarDeclaradas;
        if (this.padre != tglobal) {
            n += this.padre.getNvarDeclaradas();
        }
        return n;
    }

    getReturn() {
        if (this.sreturn != null) {
            return { goto: this.sreturn, tipo: this.tipoRetorno, esarr: this.retornoEsArr };
        }
        if (this.padre != tglobal) {
            return this.padre.getReturn();
        }
        return null;
    }

    getBreak() {
        if (this.sBreak != null) {
            return this.sBreak;
        }
        if (this.padre != tglobal) {
            return this.padre.getBreak();
        }
        return null;
    }

    getContinue() {
        if (this.sContinue != null) {
            return this.sContinue;
        }
        if (this.padre != tglobal) {
            return this.padre.getContinue();
        }
        return null;
    }

    obtenerFunc(func) {
        var n = this.nfuncs3d.indexOf(func.toLowerCase());
        return n == -1 ? null : this.funcs[n];

    }

    agregarFunc(func) {
        var n = this.nfuncs3d.indexOf(func.nombre3d);
        if (n != -1) {
            return false;
        }
        this.funcs.push(func);
        this.nfuncs.push(func.nombre.toLowerCase());
        this.nfuncs3d.push(func.nombre3d.toLowerCase());
        return true;
    }

    obtenerVar(st) {
        var n = this.nvars.indexOf(st.toLowerCase());
        if (n != -1) {
            return this.vars[n];
        } else {
            if (this.padre != null) {
                return this.padre.obtenerVar(st);
            }
            return null;
        }
    }

    agregarVar(nvar) {
        if (this.nvars.indexOf(nvar.nombre.toLowerCase()) != -1) {
            return false;
        }

        if (this == tglobal) {
            nvar.ref = this.indiceHeap++;
            nvar.refHeap = true;
        } else {
            nvar.ref = this.indiceStack++;
        }
        this.vars.push(nvar);
        this.nvars.push(nvar.nombre.toLowerCase());
        return true;

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
        this.declaracionFila = 0;
        this.declaracionColumna = 0;
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
        this.nombre = "";
        this.nombre3d = "";
        this.params = [];
        this.cuerpo = null;
        this.tiporetorno = "";
        this.devuelveArr = false;
        this.declaradaEnF = "";
        this.declaradaEnC = "";
        this.llamadaEn = [];
    }
}





/*
    t1, t2
    l1, l2 (estos se utilizan en el metodo print)

*/