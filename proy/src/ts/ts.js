class ts {
    constructor() {
        this.padre = null;
        this.hijos = [];
        this.vars = [];
        this.funcs = [];
        this.esMetodo = false;
        this.esCiclo = false;
        this.esSwitch = false;
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
    constructor() {
        this.ambito = "";
        this.ref = "";
        this.tipo = "";
        this.declaracion = 0;
        this.usadaEn = [];
        this.tvar = 0;
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
        return this.nt++;
    }

    nextSalto() {
        return this.ns++;
    }
}
