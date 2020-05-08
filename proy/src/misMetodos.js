var misFuncs = document.createTextNode("");

//Metodo imprimir t1,t2 L1, L2
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

//Continuamos en t6, L7
