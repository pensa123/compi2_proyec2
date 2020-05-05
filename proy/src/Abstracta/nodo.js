class Nodo {
  constructor(fila, columna) {
    this.fila = fila;
    this.columna = columna;

    this.hijos = [];
    console.log("nuevo nodo " + this.constructor.name + " " + fila + " , " + columna);
  }

  niuerror(st) {
    return nerror("Fila:" + this.fila + " Columna:" + this.columna + ", " + st);
  }

  soy() {
    return this.constructor.name;
  }

  dibujar(c) {
    c.va += 1;
    var nodo = {}, child = [], va = c.va;
    nodo.name = this.soy();
    c.comp();
    if (this.hijos.length == 0) {
      c.hojas++;
    }
    for (var a = 0; a < this.hijos.length; a++) {
      if (!(this.hijos[a] instanceof Nodo)) {
        c.hojas++;
        continue;
      }
      child.push(this.hijos[a].dibujar(c));
      c.va = va;
    }
    if (child.length > 0) {
      nodo.children = child;
    }
    return nodo;
  }


  recorrer(bool, ts) {
    //en este proceso solo obtendremos las estructuras, 
    //las variables globales y las funciones 
    //solo :( jajaja
    this.recorrerHijos(bool, ts);
  }

  recorrerHijos(bool, ts) {
    for (var a = 0; a < this.hijos.length; a++) {
      if (!(this.hijos[a] instanceof Nodo)) {
        continue;
      }
      this.hijos[a].recorrer(bool, ts);
    }
  }


  traducir(ts) {
    print("Falta traduccion en " + this.constructor.name);
    print(this);
  }
}


class Cont {
  constructor() {
    this.mayor = 1;
    this.va = 1;
    this.hojas = 0;
  }

  comp() {
    if (this.mayor < this.va) {
      this.mayor = this.va;
    }
  }
}