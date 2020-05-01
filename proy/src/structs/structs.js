class estructura extends Nodo{
    soy(){
        return "Estruct " + this.id; 
    }
}



class atributoEst extends Nodo{
    soy(){
        var st = this.id; 
        if (Number.isInteger(this.tipo[0])) {
            st += " [" + v_tipo[this.tipo[0]] + "]";
        } else {
            st += " -[" + this.tipo[0] + "]-";
        }
        if (this.tipo.length == 2) {
            st += "[]";
        }

        return st;
    }

}