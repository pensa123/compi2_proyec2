/**
 * Ejemplo Intérprete Sencillo con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */
%lex

%options case-insensitive

%%

\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

"null"			return 'RNULL';
"import"		return 'RIMPORT';

"false"			return 'RFALSE';
"true"			return 'RTRUE';

"switch"		return 'RSWITCH';
"continue"		return 'RCONTINUE';
"private"		return 'RPRIVATE';
"define"		return 'RDEFINE';
"try"			return 'RTRY';
"integer"		return 'RINTEGER';
"var"			return 'RVAR';
"case"			return 'RCASE';
"return"		return 'RRETURN';
"void"			return 'RVOID';
"as"			return 'RAS';
"catch"			return 'RCATCH';
"double"		return 'RDOUBLE';
"const"			return 'RCONST';
"if"			return 'RIF';
"default"		return 'RDEFAULT';
"print"			return 'RPRINT';
"for"			return 'RFOR';
"strc"			return 'RSTRC';
"throw"			return 'RTHROW';
"char"			return 'RCHAR';
"global"		return 'RGLOBAL';
"else"			return 'RELSE';
"break"			return 'RBREAK';
"public"	    return 'RPUBLIC';
"while"			return 'RWHILE';
"do"			return 'RDO'; 
"boolean"		return 'RBOOLEAN'; 



","                 return "COMA";
";"					return 'PCOMA';
"{"					return 'ALLAVE';
"}"					return 'CLLAVE';
"("					return 'APAR';
")"					return 'CPAR';
"["					return "ACORCH";
"]"					return "CCORCH";


"&&"				return 'AND'
"||"				return 'OR';


"$"				return 'DOLAR';
"++"				return 'MASMAS';
"--"				return 'MENOSMENOS';

"+"					return 'MAS';
"-"					return 'MENOS';
"*"					return 'POR';
"/"					return 'DIVIDIDO';
"^^"                return "POTENCIA";
"%"                 return "MODULO";  


":=" 				return "DOSPUNTOSIGUAL";
"<="				return 'MENORIGUAL';
">="				return 'MAYORIGUAL';
"==="				return 'TRESIGUAL';
"=="				return 'IGUALIGUAL';
"!="				return 'DIFIGUAL';

"<"					return 'MENOR';
">"					return 'MAYOR';
"="					return 'IGUAL';

"^"					return 'XOR';
"!"					return 'NOT';
":"					return 'DOSPTS';
"."					return 'PUNTO';

["\""](("\\""\"")|[^"\""])*["\""]	{ yytext = yytext.substr(1,yyleng-2); yytext = replaceCadena(yytext);  return 'CADENA'; }
\'[^\'']\'          	{ yytext = yytext.substr(1,yyleng-2); return 'CHAR'; } 
//\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
[0-9]+("."[0-9]+)\b   	    return 'DECIMAL';
[0-9]+\b				return 'ENTERO';


([a-zA-Z0-9_.-])+(".j") return "ARCHIVO";
([a-zA-Z])[a-zA-Z0-9_]*	{ yytext = yytext.toLowerCase();  return 'IDENTIFICADOR'};


<<EOF>>				return 'EOF';
.					{   //console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
						//nerror("Linea " + yylloc.first_line + " Columna " + yylloc.first_column +  ", Error lexico  '" + yytext + "' no reconocido."); 
						nerror2(yylloc.first_line , yylloc.first_column , "Lexico","'"+ yytext +"' no reconocido.");
					 }

/lex


%{

%}


/* Asociación de operadores y precedencia */
%left 'MASMAS' 'MENOSMENOS' 
%left 'XOR' 
%left 'OR' 
%left 'AND' 
%left 'IGUALIGUAL' 'DIFIGUAL' 'TRESIGUAL'
%left 'MAYOR' 'MENOR' 'MENORIGUAL' 'MAYORIGUAL'
%left 'MAS' 'MENOS'
%left 'POR' 'DIVIDIDO' , 'MODULO'
%left 'POTENCIA' 
%right UMENOS , NOT
%left APAR , CPAR
%left  ACORCH , CCORCH 

%start ini

%% /* Definición de la gramática */

ini:  
	import instrucciones_cuerpo EOF {
		var arr = [];
		// cuado se haya reconocido la entrada completa retornamos el AST
		if($1 != null){
			arr.push($1);
		}
		arr.push($2);
		return arr; 
	}
	|
	instrucciones_cuerpo EOF {
		var arr = []; 
		arr.push($1); 
		return arr;
	}

;

instrucciones_cuerpo : instrucciones_cuerpo instruccion_c { if($2 != null){ $1.hijos.push($2);} $$ = $1;  }
		| {$$ = new Instrucciones(@1.first_line,@1.first_column); } ; 

instruccion_c :  declaracion fin		  { $$ = $1; } 
		| visibilidad declararfuncion { $$ = $2; }
		| declararfuncion { $$ = $1; }
		| defest {$$ = $1; }
		| error PCOMA { 
					//nerror("Linea " + @1.first_line + " Columna " + @1.first_column +  ", Error sintactico recuperado en.'" + $1 + "'\n" + lastNodo); $$ = null; 
					nerror2(@1.first_line , @1.first_column , "Sintactico" , "Error sintactico recuperado en.'" + $1 + "'\n" + lastNodo);
					$$ = null; 
				}
		; 

declararfuncion : tipo IDENTIFICADOR APAR params CPAR ALLAVE instrucciones_fun CLLAVE
				{
					$$ = new decfunc(@1.first_line,@1.first_column);
					$$.tipo = $1;
					$$.id = $2; 
					$$.hijos = $4;
					$$.inst = $7; 
				}
				| RVOID IDENTIFICADOR APAR params CPAR  ALLAVE instrucciones_fun CLLAVE
				{
					$$ = new decfunc(@1.first_line,@1.first_column);
					$$.tipo = [vtipo.void];
					$$.id = $2; 
					$$.hijos = $4;
					$$.inst = $7; 
				}
	; 

params : params2 {$$ = $1;} | {$$ = [];} ;

params2 :   params2 COMA tipo IDENTIFICADOR { 
				$$ = $1; var n = new Param(@1.first_line,@1.first_column);
				n.tipo = $3; n.id = $4; $$.push(n); 	
			 }
		| tipo IDENTIFICADOR { 
				$$ = []; var n  = new Param(@1.first_line,@1.first_column); 
				n.tipo = $1; n.id = $2; $$.push(n);
	   	}
	  	;

instrucciones_fun : instrucciones_fun instruccion_f {if($2 != null) {$1.hijos.push($2); } $$ = $1;      }
					|{$$ = new Instrucciones(@1.first_line,@1.first_column); } ; 

instruccion_f :  declaracion fin {$$ = $1; } 
				| defest {$$ = $1; }
				| si {$$ = $1; }
				| switch {$$ = $1; }
				| transferencia {$$ = $1; }
				| cases {$$ = $1; }
				| asignacion fin{$$ = $1; } 
				| ciclos {$$ = $1}
				| llamadaMetodo fin {$$ = $1; $$.exp = false; }
				| fprint fin {$$ = $1}
				| inc_dec fin {$$ = $1}
				| try_catch {$$ = $1;}
				| error PCOMA { 
					//nerror("Linea " + @1.first_line + " Columna " + @1.first_column +  ", Error sintactico recuperado en.'" + $1 + "'\n" + lastNodo); $$ = null; 
					nerror2(@1.first_line , @1.first_column , "Sintactico" , "Error sintactico recuperado en.'" + $1 + "'\n" + lastNodo);
					$$ = null; 
				}
;


try_catch : RTRY  ALLAVE instrucciones_fun CLLAVE RCATCH APAR IDENTIFICADOR IDENTIFICADOR CPAR ALLAVE instrucciones_fun CLLAVE{
	$$ = new Try_catch(@1.first_line , @1.first_column);
	$$.hijos.push($3); 
	$$.hijos.push($7); 
	$$.hijos.push($8); 
	$$.hijos.public($9);
} ;  


defest : RDEFINE IDENTIFICADOR RAS ACORCH  listaest   CCORCH fin 
	{
		$$ = new estructura(@1.first_line,@1.first_column);
		$$.hijos= ($5); 
		$$.id = $2; 
	}; 

listaest : listaest COMA aest {$1.push($3); $$ = $1; }
		|  aest { $$ = [$1];  } ; 

aest : 	  tipo IDENTIFICADOR { $$ = new atributoEst(@1.first_line,@1.first_column); $$.id = $2; $$.tipo = $1;  }
		| tipo IDENTIFICADOR IGUAL exp {
			$$ = new atributoEst(@1.first_line,@1.first_column); $$.id = $2; $$.tipo = $1; $$.hijos.push($4); 
		 }; 

fprint : RPRINT APAR exp CPAR { $$ = new Print(@1.first_line,@1.first_column); $$.hijos.push($3);    }  ; 

llamadaMetodo : IDENTIFICADOR  lista_params CPAR {$$ = new llamadaFunc(@1.first_line,@1.first_column);
						$$.hijos = $2; $$.id = $1;  };

lista_params :   APAR { $$ = [];  }
		| APAR lista_params2 {$$ = $2; } ; 

lista_params2 : param {$$ = [$1]; } | lista_params2 COMA param {$1.push($3); $$ = $1; } ; 

param :  sparam  {$$ = $1; $$.id = null; }
	| IDENTIFICADOR IGUAL sparam {$$ = $3;
		var n = new Id(@1.first_line,@1.first_column);
		n.id = $1; 
		$$.hijos.unshift(n);
	 } ; 

sparam : exp { $$ = new SParam(@1.first_line,@1.first_column); $$.hijos.push($1); $$.ref = false;  }
	| DOLAR exp {$$ = new SParam(@1.first_line,@1.first_column); $$.hijos.push($2); $$.ref = true; };


asignacion : IDENTIFICADOR  IGUAL pvalor  {
		$$ = new Asignacion(@1.first_line,@1.first_column);
		var n = new Id(@1.first_line, @1.first_column);
		n.id = $1; 
		$$.hijos.push(n) ; 
		$$.hijos.push($3); 
		 } 
		|
		otro IGUAL pvalor {
			$$ = new Asignacion(@1.first_line , @1.first_column); 
			var n = new laccesos(@2.first_line , @2.first_column);
			n.hijos = $1; 
			$$.hijos.push(n); 
			$$.hijos.push($3); 			
		} ;
otro :  otro PUNTO otro2 {  
			$$ = $1; 
			for(var a = 0; a < $3.length; a++){
				$$.push($3[a]); 
			}
		}
		| otrofin {$$ = $1;}; 

otro2 : IDENTIFICADOR ACORCH exp CCORCH {
	var n  = new  AccesoArr(@2.first_line , @2.first_column); 
	var n2 = new Id(@1.first_line, @1.first_column);
	n2.id = $1; 
	n.hijos.push($3); 
	$$ = [n2 , n];
	}
	|
	IDENTIFICADOR {
		var n = new Id(@1.first_line , @1.first_column);
		n.id = $1; 
		$$= [n]; 	
	}
	|
	IDENTIFICADOR  lista_params CPAR {
		var n = new accesofunc(@1.first_line , @1.first_column);
		n.id = $1; 
		$$= [n];
	}
	; 


otrofin : IDENTIFICADOR ACORCH exp CCORCH {
	var n  = new  AccesoArr(@2.first_line , @2.first_column); 
	var n2 = new Id(@1.first_line, @1.first_column);
	n2.id = $1; 
	n.hijos.push($3); 
	$$ = [n2 , n];
	}
	|
	IDENTIFICADOR PUNTO IDENTIFICADOR{
		var n = new Id(@1.first_line , @1.first_column);
		n.id = $1; 
		var n2 = new Id(@3.first_line , @3.first_column);
		n2.id = $3; 
		$$ = [n , n2];
	}
	|
	IDENTIFICADOR PUNTO IDENTIFICADOR  lista_params CPAR {
		var n = new Id(@1.first_line , @1.first_column);
		n.id = $1; 
		var n2 = new accesofunc(@3.first_line , @3.first_column);
		n2.id = $3; 
		$$ = [n , n2];
	}
	; 

ciclos:  RWHILE APAR exp CPAR ALLAVE instrucciones_fun CLLAVE {
			$$ = new While(@1.first_line,@1.first_column);
			$$.hijos.push($3); 
			$$.hijos.push($6); 
		}
		| RDO ALLAVE instrucciones_fun CLLAVE RWHILE APAR exp CPAR fin 
		{
			$$ = new do_while(@1.first_line,@1.first_column);
			$$.hijos = [$3, $7]; 

		}
		| RFOR APAR ifor PCOMA mfor PCOMA ffor CPAR ALLAVE instrucciones_fun CLLAVE
		{
			$$ = new For(@1.first_line,@1.first_column);
			$$.hijos = [$3 , $5 , $7 , $10]; 
		}
; 

ifor : declaracion {$$ = $1;}                   
	|asignacion{$$ = $1;} | inc_dec{$$ = $1;}
	|{$$ = null; } ; 
mfor : exp {$$ = $1;}                           |{$$ = null; } ; 
ffor : asignacion{$$ = $1;} | inc_dec{$$ = $1;} |{$$ = null; } ; 

cases :  RCASE exp DOSPTS {$$ = new Case(@1.first_line,@1.first_column); $$.hijos.push($2); }
	|    RDEFAULT DOSPTS { $$ = new Default(@1.first_line,@1.first_column); };

transferencia : RBREAK fin  { $$ = new Break(@1.first_line,@1.first_column); }
				| RCONTINUE fin { $$ = new Continue(@1.first_line,@1.first_column);  }
				| RRETURN PCOMA { $$ = new Return(@1.first_line,@1.first_column);   }
				| RRETURN pvalor PCOMA {$$ = new Return(@1.first_line,@1.first_column); $$.hijos.push($2);  } 
				;


switch : RSWITCH APAR exp CPAR ALLAVE instrucciones_fun CLLAVE
{
	$$ = new Switch(@1.first_line,@1.first_column);
	$$.hijos.push($3);
	$$.hijos.push($6); 
}
;



si : RIF APAR exp CPAR ALLAVE instrucciones_fun CLLAVE 
	{
		$$ = new If(@1.first_line,@1.first_column); 
		$$.hijos.push($3); 
		$$.hijos.push($6); 
	}
	| RIF APAR exp CPAR ALLAVE instrucciones_fun CLLAVE RELSE ALLAVE instrucciones_fun CLLAVE
	{
		$$ = new If(@1.first_line,@1.first_column); 
		$$.hijos.push($3); 
		$$.hijos.push($6);
		$$.hijos.push($10);
	}
	| RIF APAR exp CPAR ALLAVE instrucciones_fun CLLAVE RELSE si  
	{
		
		$$ = new If(@1.first_line,@1.first_column); 
		$$.hijos.push($3); 
		$$.hijos.push($6);
		$$.hijos.push($9);
	}
	;




declaracion :   tipo listaID IGUAL pvalor                      //declaracion tipo 1
			{
				var n = new Declaracion(@1.first_line,@1.first_column); 
				n.tipo = $1; 
				n.hijos.push($2);
				n.hijos.push($4);
				$$ = n; 
			}
			|	RVAR IDENTIFICADOR DOSPUNTOSIGUAL pvalor       //declaracion tipo 2   
			{
				$$ = new Dect2_4(@1.first_line,@1.first_column); 
				$$.tipo = vddi.var; 
				$$.id = $2; 
				$$.hijos.push($4);
			}
			|	RCONST IDENTIFICADOR DOSPUNTOSIGUAL pvalor     //declaracion tipo 3  
			{
				$$ = new Dect2_4(@1.first_line,@1.first_column); 
				$$.tipo = vddi.const; 
				$$.id = $2; 
				$$.hijos.push($4);
			} 
			|	RGLOBAL IDENTIFICADOR DOSPUNTOSIGUAL pvalor    //declaracion tipo 4
			{
				$$ = new Dect2_4(@1.first_line,@1.first_column); 
				$$.tipo = vddi.global; 
				$$.id = $2; 
				$$.hijos.push($4);
			}
			|   tipo listaID 									//Declaracion tipo 5
			{
				var n = new Declaracion(@1.first_line,@1.first_column); 
				n.tipo = $1; 
				n.hijos.push($2);

				$$ = n; 
			}    
;

pvalor : exp {$$ = $1; } 
		| valarray
		;

valarray : RSTRC tp ACORCH exp CCORCH {$$ = new niu_arr(@1.first_line, @1.first_column); $$.tipo = $2; $$.hijos.push($4);  }
		| RSTRC IDENTIFICADOR ACORCH exp CCORCH {$$ = new niu_arr(@1.first_line, @1.first_column); $$.tipo = $2; $$.hijos.push($4);  }
		|  arrvalue                   {$$ = $1; }
		; 

arrvalue : ALLAVE listavarr CLLAVE { $$ = new arr_content(@1.first_line , @1.first_column); $$.hijos = $2; };
 
 listavarr : listavarr COMA elemarr {$$ = $1; $$.push($3); }
		| elemarr {$$ = []; $$.push($1); } ; 

elemarr : /*arrvalue {$$ = $1; }
		| */ exp  {$$ = $1; }; 

tipo :tp  {$$ = [$1];}
	| tp ACORCH CCORCH {$$ = [$1, 0]; }
	| IDENTIFICADOR { $$ = [$1];	}
	| IDENTIFICADOR ACORCH CCORCH {$$ = [$1, 0]; }
	
	; 

tp : RINTEGER 	{ $$ = vtipo.integer; 	}
	| RDOUBLE   	{ $$ = vtipo.double;	}
	| RCHAR     	{ $$ = vtipo.char; 		}
	| RBOOLEAN  	{ $$ = vtipo.boolean;	} 
	; 


listaID :  listaID COMA IDENTIFICADOR  { $1.hijos.push($3); $$ = $1; }
		| IDENTIFICADOR                  
		{ 
			var n = new  ListaId(@1.first_line,@1.first_column);
			n.hijos.push($1); 
			$$ = n; 
		}; 

import : RIMPORT  listaimport fin { $$ = $2; }  ; 

listaimport : listaimport COMA ARCHIVO  { $1.hijos.push($3); $$ = $1;} 
	|  ARCHIVO   { var  n = new Importar(@1.first_line,@1.first_column); n.hijos.push($1); $$ = n;   }  ; 
   
exp
	: MENOS exp %prec UMENOS	{$$ = new expresionUnaria(@1.first_line,@1.first_column); 
								$$.operando = voperando.menos; $$.hijos.push($2);  }
	| NOT exp					{$$ = new expresionUnaria(@1.first_line,@1.first_column);
								 $$.operando = voperando.not;   $$.hijos.push($2);  }

	| exp MAS exp				{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.mas; $$.hijos.push($1); $$.hijos.push($3); }
	| exp MENOS exp	  			{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.menos; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp POR exp	  			{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.por; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp DIVIDIDO exp 			{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.dividido; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp MODULO exp   			{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.modulo; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp POTENCIA exp 			{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.potencia; $$.hijos.push($1); $$.hijos.push($3);  }

	| exp XOR exp   	 		{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.xor; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp OR  exp		    	{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.or; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp AND  exp		    	{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.and; $$.hijos.push($1); $$.hijos.push($3);  }

	| exp IGUALIGUAL exp		{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.igualigual; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp DIFIGUAL exp  		{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.difigual; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp TRESIGUAL exp 		{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.trigual; $$.hijos.push($1); $$.hijos.push($3);  }

	| exp MAYOR exp   			{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.mayor; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp MENOR exp   			{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.menor; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp MAYORIGUAL exp		{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.mayorigual; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp MENORIGUAL exp		{$$ = new expresion_binaria(@1.first_line,@1.first_column); $$.operando = voperando.menorigual; $$.hijos.push($1); $$.hijos.push($3);  }
	
	
	| APAR exp CPAR				{ $$ = $2; }

	| RFALSE               		{ $$ = new primitivo(@1.first_line,@1.first_column); $$.tipo = vprim.boolean; $$.valor = false; 		}
	| RTRUE						{ $$ = new primitivo(@1.first_line,@1.first_column); $$.tipo = vprim.boolean; $$.valor = true; 		}
	| ENTERO					{ $$ = new primitivo(@1.first_line,@1.first_column); $$.tipo = vprim.integer; $$.valor = Number($1); 	}
	| DECIMAL					{ $$ = new primitivo(@1.first_line,@1.first_column); $$.tipo = vprim.double; $$.valor = Number($1);  	}
	| CADENA                	{ $$ = new primitivo(@1.first_line,@1.first_column); $$.tipo = vprim.string; $$.valor = $1;  			}
	| CHAR                		{ $$ = new primitivo(@1.first_line,@1.first_column); $$.tipo = vprim.char; $$.valor = $1;  			}

	| IDENTIFICADOR				{ $$ = new Id(@1.first_line,@1.first_column); $$.id = $1; $$.exp = true;  }
	| otro                      { var n = new laccesos(@1.first_line , @1.first_column); n.hijos = $1; $$ = n; $$.exp = true; }


	| inc_dec 					{$$ = $1; $$.retValor = true; }
	| llamadaMetodo				{$$ = $1; $$.exp = true;  }

	| APAR RINTEGER CPAR exp 	{ $$ = new Casteo(@1.first_line,@1.first_column); $$.tipo = vtipo.integer; $$.hijos.push($4);   }
	| APAR RCHAR CPAR exp 		{ $$ = new Casteo(@1.first_line,@1.first_column); $$.tipo = vtipo.char; $$.hijos.push($4);}
;


inc_dec:IDENTIFICADOR MASMAS		{ $$ = new inc_dec(@1.first_line,@1.first_column); $$.operando = voperando.masmas; $$.id = $1; $$.retValor = false; }
	|   IDENTIFICADOR MENOSMENOS	{ $$ = new inc_dec(@1.first_line,@1.first_column); $$.operando = voperando.menosmenos; $$.id = $1; $$.retValor = false; }
;

visibilidad : RPUBLIC | RPRIVATE  ;
fin : PCOMA |  ;  