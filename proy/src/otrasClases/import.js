class Importar extends Nodo {

    //variables
    //hijos[]: es un arreglo de strings con cada archivo a importar. 



    dibujar(c) {
        var nodo = {};
        nodo.name = "Import";
        nodo.children = [];

        c.va += 2; 
        for (var a = 0; a < this.hijos.length; a++) {
            nodo.children.push({ "name": this.hijos[a] });
            c.hojas++;
        }
        c.comp(); 
        return nodo;
    }


}