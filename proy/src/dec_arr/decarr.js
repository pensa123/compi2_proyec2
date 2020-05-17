var arrst = null;

class niu_arr extends Nodo {
    traducir(ts) {


        var n = this.hijos[0].traducir(ts);
        if (n == null) {
            return null;
        }
        var st = n.cadena;
        var taux = null;

        if (this.tipo.toLowerCase() == "string") {
            print("Si llega");
            this.tipo = vtipo.string;
            taux = salto_temp.nextTemp();
            st += taux + " = h;\n";
            st += "heap[h] = -1;";
            st += "h = h + 1;\n";
        }

        if (!(compImplicito(vtipo.integer, n.tipo))) {
            return this.niuerror("En strc[e] se espera un entero.");
        }
        var tr = salto_temp.nextTemp();
        st += tr + " = h;\n";
        st += "heap[h] = " + n.valor + ";\n";
        st += "h = h + 1;\n";
        st += "t1 = " + n.valor + ";\n";
        if (this.tipo == vtipo.string) {
            st += "t2 = " + taux + ";\n"
        } else {
            st += "t2 = 0;\n";
        }

        st += "call llenarHeapArr;\n";
        return { cadena: st, valor: tr, tipo: this.tipo, esarr: true };
    }
}

class arr_content extends Nodo {

    traducir(ts) {
        var todoNum = true;
        var datos = [];
        var tipo = null;
        var st = "";
        var unavez = true;

        for (var a = 0; a < this.hijos.length; a++) {
            var n = this.hijos[a].traducir(ts);
            if (n == null) {
                return null;
            }
            st += n.cadena;
            datos.push(n);
            if (!(n.tipo == vtipo.char || n.tipo == vtipo.integer || n.tipo == vtipo.double)) {
                todoNum = false;
            }
            if (unavez) {
                tipo = n.tipo;
                unavez = false;
            } else if (!(compImplicito(tipo, n.tipo))) {
                if (compImplicito(n.tipo, tipo)) {
                    tipo = n.tipo;
                    continue;
                }
                return this.niuerror("Arreglo con diferentes tipos [" + getTipo(tipo) + " y " + getTipo(n.tipo) + "]");
            }
        }

        var tr = salto_temp.nextTemp();
        st += tr + " = h;\n";
        st += "Heap[h] = " + this.hijos.length + ";\n";
        st += "h = h + 1;\n";
        for (var a = 0; a < datos.length; a++) {
            st += "Heap[h] = " + datos[a].valor + ";\n";
            st += "h = h + 1;\n";
        }
        print(tipo);
        return { cadena: st, valor: tr, tipo: tipo, esarr: true };
    }

}

