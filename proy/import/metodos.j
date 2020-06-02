	public void principal(){
		print(par(10)); 
		print(par(11)); 
		print(par(20));
		print(factorial(5)); 
		print(ackermann(3,3)); //Da 61
		concat(); 
		integer[] arr = {4,3,2,1,6,7,8};
		burbuja($arr);
		print("-- -- -- -- --");
		for(integer a = 0; a < arr.length; a++){
			print(arr[a]); 
		}
	}

	integer factorial(integer n){
		if( n <= 1 ){
			return 1; 
		}
		return n * factorial(n-1); 
	}

	public integer impar (integer numero){
		if (numero==0){
			return 0;
		}
		return par(numero-1);
	}

	public integer par (integer numero){
		if (numero==0){
			return 1;
		}
		return impar(numero-1);
	}
	
	
public integer ackermann(integer m, integer n) {
	if (m == 0){ 
		return n + 1;
	}
	if (n == 0){ 
		return ackermann(m - 1, 1);
	}
	return ackermann(m - 1, 0+ ackermann(m, n - 1));
}

public void burbuja(integer[] arr){
	print("antes:"); 
	for(integer a = 0; a < arr.length; a++){
    	print(arr[a]); 
	}
	print("--------------Salida"); 
	for(integer i = 0; i < arr.length - 1; i++){
    	for(integer j = 0; j < arr.length - 1; j++){
                if (arr[j] < arr[j + 1]){
                    integer tmp = arr[j+1];
                    arr[j+1] = arr[j];
                    arr[j] = tmp;
                }
		}
   	}
    for(integer a = 0; a < arr.length; a++){
    	print(arr[a]); 
    }
}

void concat(){
	String a = "HoLaZ";
	print(a + " to lower " + a.tolowercase() + " to upper " + a.touppercase() + " conc con numero " + 22 + " con char " + 'F' + " double " + 2.4 + " boolean " +  true);
}