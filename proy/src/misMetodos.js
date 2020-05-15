var misFuncs = document.createTextNode("");

/*
    imprimir    t1 -> ref al heap de lo que se quiere imprimir. 
    potencia    t3 -> base, t4 -> exponente, t5 -> resulado 
    compcadena  t6 -> cad1 , t7 -> cad2 , t10 -> resultado 1 o 0 
    doubleToSt  t11 -> el numero y se mete al heap la cadena. 
    intToSt     t11 -> el numero y se mete al heap la cadena. 
    pBool       t17 -> si es 1 imprime true sino false, 
    insCadenaEnHeap t1 -> ref al heap de la cadena que se quiere meter otra vez al heap. 
    metBoolheap     t1 -> mete true o false al heap dependiendo de t1     
*/


//Metodo imprimir t1,t2 
//L1, L2
misFuncs.appendData('proc imprimir begin\n');  //t1 es la posicion de referencia del heap. 
misFuncs.appendData('    L1: \n');
misFuncs.appendData('    t2 = heap[t1]; \n');
misFuncs.appendData('    if(t2 == -1) goto L2;\n');
misFuncs.appendData('    print("%c" , t2); \n');
misFuncs.appendData('    t1 = t1 + 1; \n');
misFuncs.appendData('    goto L1; \n');
misFuncs.appendData('    L2: \n');
misFuncs.appendData('end\n\n');

//Metodo potencia t3, t4, t5 
//L3, L4, L5, L6
//t3 base, t4 potencia, t5 resultado 
misFuncs.appendData('proc potencia begin\n');
misFuncs.appendData('    t5 = t3; \n');
misFuncs.appendData('    if(t4 == 0) goto L3; \n');
misFuncs.appendData('    if(t4 > 0) goto L4;\n');
misFuncs.appendData('        t5 = 0; \n');
misFuncs.appendData('        goto L6;\n');
misFuncs.appendData('    L3: \n');
misFuncs.appendData('        if(t3 == 0) goto L5;\n');
misFuncs.appendData('        t5 = 1; \n');
misFuncs.appendData('        goto L6;\n');
misFuncs.appendData('    L4:\n');
misFuncs.appendData('        if(t4 == 1) goto L6;\n');
misFuncs.appendData('        t5 = t5 * t3; \n');
misFuncs.appendData('        t4 = t4 - 1; \n');
misFuncs.appendData('        goto L4; \n');
misFuncs.appendData('    L5: \n');
misFuncs.appendData('        E = 1; \n');
misFuncs.appendData('    L6:\n');
misFuncs.appendData('end\n\n');

//Metodo compCadena  t6,t7,t8,t9,10 ; 
//L7, L8, L9 
misFuncs.appendData('proc compCadenas begin\n');
misFuncs.appendData('    t10 = 1; \n');
misFuncs.appendData('    L7:\n');
misFuncs.appendData('        t8 = heap[t6]; \n');
misFuncs.appendData('        t9 = heap[t7];\n');
misFuncs.appendData('        if(t8 <> t9)goto L8; \n');
misFuncs.appendData('        if(t8 == -1) goto L9;\n');
misFuncs.appendData('        t6 = t6 + 1; \n');
misFuncs.appendData('        t7 = t7 + 1; \n');
misFuncs.appendData('        goto L7;\n');
misFuncs.appendData('    L8:\n');
misFuncs.appendData('        t10 = 0; \n');
misFuncs.appendData('    L9:         \n');
misFuncs.appendData('end\n\n');

//Metodo doubleToSt y t11, t12, t13, t14, t15, t16 , t17

//t11 va el int o double y obtener h antes de llamar jejeje


misFuncs.appendData('proc doubleToSt begin \n');
misFuncs.appendData('    t12 = t11 % 1; \n');
misFuncs.appendData('    t16 = t12; \n');
misFuncs.appendData('    t17 = 0; \n');
misFuncs.appendData('    if(t12 <> 0)goto L10; \n');
misFuncs.appendData('    call intToSt; \n');
misFuncs.appendData('    goto L11; \n');
misFuncs.appendData('    L10:\n');
misFuncs.appendData('        t12 = t16 % 1;\n');
misFuncs.appendData('        t13 = t16 - t12; \n');
misFuncs.appendData('        if(t13 <> 0) goto L20; \n');
misFuncs.appendData('         t17 = t17 + 1; \n');
misFuncs.appendData('    L20:    \n');
misFuncs.appendData('        if(t12 == 0) goto L17;\n');
misFuncs.appendData('        t16 = t16 * 10; \n');
misFuncs.appendData('        goto L10; \n');
misFuncs.appendData('    L17: \n');
misFuncs.appendData('        call intToSt; \n');
misFuncs.appendData('        Heap[h] = 46;\n');
misFuncs.appendData('        h = h + 1;  \n');
misFuncs.appendData('        t11 = t16; \n');
misFuncs.appendData('    L21: \n');
misFuncs.appendData('        t17 = t17 - 1;\n');
misFuncs.appendData('        if(t17 == 0) goto L22;\n');
misFuncs.appendData('        Heap[h] = 48;\n');
misFuncs.appendData('        h = h + 1; \n');
misFuncs.appendData('        goto L21; \n');
misFuncs.appendData('    L22: \n');
misFuncs.appendData('        call intToSt; \n');
misFuncs.appendData('    L11: \n');
misFuncs.appendData('end\n\n');

// ------------------------------------------------------------------------------------------

misFuncs.appendData('proc intToSt begin \n');
misFuncs.appendData('    if(t11 <> 0) goto L16;\n');
misFuncs.appendData('        Heap[h] = 48; \n');
misFuncs.appendData('        h = h + 1;\n');
misFuncs.appendData('        goto L15; \n');
misFuncs.appendData('    L16:\n');
misFuncs.appendData('        if(t11 >= 0) goto L12;  ##t11 es el numero\n');
misFuncs.appendData('            Heap[H] = 45; \n');
misFuncs.appendData('            H = h + 1; \n');
misFuncs.appendData('            t11 = 0 - t11;\n');
misFuncs.appendData('    L12:\n');
misFuncs.appendData('        t12 = 0; ## Contador 1\n');
misFuncs.appendData('        t13 = 1; ## n \n');
misFuncs.appendData('    L13: ## inicio del while \n');
misFuncs.appendData('        t14 = t13 * 10; \n');
misFuncs.appendData('        if(t14 > t11) goto L14;\n');
misFuncs.appendData('            t13 = t13 * 10; \n');
misFuncs.appendData('            t12 = t12 + 1; \n');
misFuncs.appendData('        goto L13; \n');
misFuncs.appendData('    L14:  ## Fin del while e inicio del siguiente while jejeje\n');
misFuncs.appendData('        if(t13 <= 0) goto L15; \n');
misFuncs.appendData('            t14 = t11 / t13; ## t14 es a \n');
misFuncs.appendData('            t15 = t14 % 1; ## a % 1\n');
misFuncs.appendData('            t14 = t14 - t15;  ## a = a - (a % 1)\n');
misFuncs.appendData('            t15 = t14 * t13;\n');
misFuncs.appendData('            t11 = t11 - t15;\n');
misFuncs.appendData('            t14 = t14 + 48; \n');
misFuncs.appendData('            Heap[h] = t14; \n');
misFuncs.appendData('            h = h + 1; \n');
misFuncs.appendData('            t13 = t13 / 10; \n');
misFuncs.appendData('            if(t12 == 0) goto L15;\n');
misFuncs.appendData('            t12 = t12 - 1;\n');
misFuncs.appendData('        goto L14; \n');
misFuncs.appendData('    L15:  ## fin del segundo while \n');
misFuncs.appendData('end\n\n');


//Continuamos en t17 y L18


//T17 se mete el booleano 
misFuncs.appendData('proc pBool begin \n');
misFuncs.appendData('if(t17 == 0) goto L18;\n');
misFuncs.appendData('    print("%c",84);\n');
misFuncs.appendData('    print("%c",114);\n');
misFuncs.appendData('    print("%c",117);\n');
misFuncs.appendData('    print("%c",101);\n');
misFuncs.appendData('goto L19; \n');
misFuncs.appendData('L18: \n');
misFuncs.appendData('    print("%c",70);\n');
misFuncs.appendData('    print("%c",97);\n');
misFuncs.appendData('    print("%c",108);\n');
misFuncs.appendData('    print("%c",115);\n');
misFuncs.appendData('    print("%c",101);\n');
misFuncs.appendData('L19: \n');
misFuncs.appendData('end\n\n');


misFuncs.appendData('proc insCadenaEnHeap begin \n');
misFuncs.appendData('    L23: \n');
misFuncs.appendData('        t2 = heap[t1]; \n');
misFuncs.appendData('        if(t2 == -1)goto L24;\n');
misFuncs.appendData('        Heap[h] = t2; \n');
misFuncs.appendData('        h = h +1; \n');
misFuncs.appendData('        t1 = t1 + 1; \n');
misFuncs.appendData('        goto L23; \n');
misFuncs.appendData('    L24: \n');
misFuncs.appendData('end\n\n');


misFuncs.appendData('proc metBoolheap begin \n');
misFuncs.appendData('    if(t1 <> 1) goto L25;\n');
misFuncs.appendData('        Heap[h] =84;\n');
misFuncs.appendData('        h = h + 1;\n');
misFuncs.appendData('        Heap[h] =114;\n');
misFuncs.appendData('        h = h + 1;\n');
misFuncs.appendData('        Heap[h] =117;\n');
misFuncs.appendData('        h = h + 1;\n');
misFuncs.appendData('        Heap[h] =101;\n');
misFuncs.appendData('        h = h + 1;\n');
misFuncs.appendData('    goto L26; \n');
misFuncs.appendData('    L25: \n');
misFuncs.appendData('        Heap[h] =70;\n');
misFuncs.appendData('        h = h + 1;\n');
misFuncs.appendData('        Heap[h] =97;\n');
misFuncs.appendData('        h = h + 1;\n');
misFuncs.appendData('        Heap[h] =108;\n');
misFuncs.appendData('        h = h + 1;\n');
misFuncs.appendData('        Heap[h] =115;\n');
misFuncs.appendData('        h = h + 1;\n');
misFuncs.appendData('        Heap[h] =101;\n');
misFuncs.appendData('        h = h + 1;\n');
misFuncs.appendData('    L26: \n');
misFuncs.appendData('end \n\n');


misFuncs.appendData('proc compIndiceArr begin\n'); 
misFuncs.appendData('    t3 = 1; \n'); 
misFuncs.appendData('    if(t1 < 0) goto L27; \n'); 
misFuncs.appendData('    if(t1 >= t2) goto L27;\n'); 
misFuncs.appendData('    goto L28; \n'); 
misFuncs.appendData('    L27: \n'); 
misFuncs.appendData('        E = 2;\n'); 
misFuncs.appendData('        t3 = 0; \n'); 
misFuncs.appendData('    L28: \n'); 
misFuncs.appendData('end\n'); 

//continuamos en t18  Y L29




class temp_salto {
    constructor() {
        this.nt = 18;
        this.ns = 29;
    }

    nextTemp() {
        return "t" + this.nt++;
    }

    nextSalto() {
        return "L" + this.ns++;
    }
}