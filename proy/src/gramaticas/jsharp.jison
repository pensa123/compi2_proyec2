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

<INITIAL>"null"			return 'RNULL';
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

["\""](("\\""\"")|[^"\""])*["\""]	{ yytext = yytext.substr(1,yyleng-2); yytext = replaceCadena(yytext);  return 'CADENA'; }
\'[^\'']\'          	{ yytext = yytext.substr(1,yyleng-2); return 'CHAR'; } 
//\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
[0-9]+("."[0-9]+)\b   	    return 'DECIMAL';
[0-9]+\b				return 'ENTERO';


([a-zA-Z0-9_.-])+(."j") return "ARCHIVO";
([a-zA-Z])[a-zA-Z0-9_]*	return 'IDENTIFICADOR';


<<EOF>>				return 'EOF';
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
						nerror("Linea " + yylloc.first_line + " Columna " + yylloc.first_column +  ", Error lexico  '" + yytext + "' no reconocido."); 
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
%left  integer

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

instrucciones_cuerpo : instrucciones_cuerpo instruccion_c {  $1.hijos.push($2); $$ = $1;  }
		| {$$ = new Instrucciones(this._$.first_line,this._$.first_column); } ; 

instruccion_c :  declaracion fin		  { $$ = $1; } 
		| visibilidad declararfuncion { $$ = $2; }
		| declararfuncion { $$ = $1; }
		| defest {$$ = $1; }
		; 

declararfuncion : tipo IDENTIFICADOR APAR params CPAR ALLAVE instrucciones_fun CLLAVE
				{
					$$ = new decfunc(this._$.first_line,this._$.first_column);
					$$.tipo = $1;
					$$.id = $2; 
					$$.hijos = $4;
					$$.inst = $7; 
				}
				| RVOID IDENTIFICADOR APAR params CPAR  ALLAVE instrucciones_fun CLLAVE
				{
					$$ = new decfunc(this._$.first_line,this._$.first_column);
					$$.tipo = [vtipo.void];
					$$.id = $2; 
					$$.hijos = $4;
					$$.inst = $7; 
				}
	; 

params : params2 {$$ = $1;} | {$$ = [];} ;

params2 :   params2 COMA tipo IDENTIFICADOR { 
				$$ = $1; var n = new Param(this._$.first_line,this._$.first_column);
				n.tipo = $3; n.id = $4; $$.push(n); 	
			 }
		| tipo IDENTIFICADOR { 
				$$ = []; var n  = new Param(this._$.first_line,this._$.first_column); 
				n.tipo = $1; n.id = $2; $$.push(n);
	   	}
	  	;

instrucciones_fun : instrucciones_fun instruccion_f {$1.hijos.push($2); $$ = $1;      }
					|{$$ = new Instrucciones(this._$.first_line,this._$.first_column); } ; 

instruccion_f :  declaracion fin {$$ = $1; } 
				| defest {$$ = $1; }
				| si {$$ = $1; }
				| switch {$$ = $1; }
				| transferencia {$$ = $1; }
				| cases {$$ = $1; }
				| asignacion{$$ = $1; } 
				| ciclos {$$ = $1}
				| llamadaMetodo fin {$$ = $1; $$.exp = false; }
				| fprint fin {$$ = $1}
				| inc_dec fin {$$ = $1}
;


defest : RDEFINE IDENTIFICADOR RAS ACORCH  listaest   CCORCH fin 
	{
		$$ = new estructura(this._$.first_line,this._$.first_column);
		$$.hijos= ($5); 
		$$.id = $2; 
	}; 

listaest : listaest COMA aest {$1.push($3); $$ = $1; }
		|  aest { $$ = [$1];  } ; 

aest : 	  tipo IDENTIFICADOR { $$ = new atributoEst(this._$.first_line,this._$.first_column); $$.id = $2; $$.tipo = $1;  }
		| tipo IDENTIFICADOR IGUAL exp {
			$$ = new atributoEst(this._$.first_line,this._$.first_column); $$.id = $2; $$.tipo = $1; $$.hijos.push($4); 
		 }; 

fprint : RPRINT APAR exp CPAR { $$ = new Print(this._$.first_line,this._$.first_column); $$.hijos.push($3);    }  ; 

llamadaMetodo : IDENTIFICADOR  lista_params CPAR {$$ = new llamadaFunc(this._$.first_line,this._$.first_column);
						$$.hijos = $2; $$.id = $1;  };

lista_params :   APAR { $$ = [];  }
		| APAR lista_params2 {$$ = $2; } ; 

lista_params2 : param {$$ = [$1]; } | lista_params2 COMA param {$1.push($3); $$ = $1; } ; 

param :  sparam  {$$ = $1; $$.id = null; }
	| IDENTIFICADOR IGUAL sparam {$$ = $3;
		var n = new Id(this._$.first_line,this._$.first_column);
		n.id = $1; 
		$$.hijos.unshift(n);
	 } ; 

sparam : exp { $$ = new SParam(this._$.first_line,this._$.first_column); $$.hijos.push($1); $$.ref = false;  }
	| DOLAR exp {$$ = new SParam(this._$.first_line,this._$.first_column); $$.hijos.push($2); $$.ref = true; };


asignacion : IDENTIFICADOR IGUAL exp fin {
		$$ = new Asignacion(this._$.first_line,this._$.first_column);
		var n = new Id(this._$.first_line,this._$.first_column);
		n.id = $1; 
		$$.hijos.push(n) ; 
		$$.hijos.push($3); 
		 } 
		|
		IDENTIFICADOR ACORCH exp CCORCH IGUAL exp fin ;



ciclos:  RWHILE APAR exp CPAR ALLAVE instrucciones_fun CLLAVE {
			$$ = new While(this._$.first_line,this._$.first_column);
			$$.hijos.push($3); 
			$$.hijos.push($6); 
		}
		| RDO ALLAVE instrucciones_fun CLLAVE RWHILE APAR exp CPAR fin 
		{
			$$ = new do_while(this._$.first_line,this._$.first_column);
			$$.hijos = [$3, $7]; 

		}
		| RFOR APAR ifor PCOMA mfor PCOMA ffor CPAR ALLAVE instrucciones_fun CLLAVE
		{
			$$ = new For(this._$.first_line,this._$.first_column);
			$$.hijos = [$3 , $5 , $7 , $10]; 
		}
; 

ifor : declaracion {$$ = $1;}                   |{$$ = null; } ; 
mfor : exp {$$ = $1;}                           |{$$ = null; } ; 
ffor : asignacion{$$ = $1;} | inc_dec{$$ = $1;} |{$$ = null; } ; 

cases :  RCASE exp DOSPTS {$$ = new Case(this._$.first_line,this._$.first_column); $$.hijos.push($2); }
	|    RDEFAULT DOSPTS { $$ = new Default(this._$.first_line,this._$.first_column); };

transferencia : RBREAK fin  { $$ = new Break(this._$.first_line,this._$.first_column); }
				| RCONTINUE fin { $$ = new Continue(this._$.first_line,this._$.first_column);  }
				| RRETURN PCOMA { $$ = new Return(this._$.first_line,this._$.first_column);   }
				| RRETURN exp PCOMA {$$ = new Return(this._$.first_line,this._$.first_column); $$.hijos.push($2);  } ; 

switch : RSWITCH APAR exp CPAR ALLAVE instrucciones_fun CLLAVE
{
	$$ = new Switch(this._$.first_line,this._$.first_column);
	$$.hijos.push($3);
	$$.hijos.push($6); 
}
;



si : RIF APAR exp CPAR ALLAVE instrucciones_fun CLLAVE 
	{
		$$ = new If(this._$.first_line,this._$.first_column); 
		$$.hijos.push($3); 
		$$.hijos.push($6); 
	}
	| RIF APAR exp CPAR ALLAVE instrucciones_fun CLLAVE RELSE ALLAVE instrucciones_fun CLLAVE
	{
		$$ = new If(this._$.first_line,this._$.first_column); 
		$$.hijos.push($3); 
		$$.hijos.push($6);
		$$.hijos.push($10);
	}
	| RIF APAR exp CPAR ALLAVE instrucciones_fun CLLAVE RELSE si  
	{
		
		$$ = new If(this._$.first_line,this._$.first_column); 
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
				$$ = new Dect2_4(this._$.first_line,this._$.first_column); 
				$$.tipo = vddi.var; 
				$$.id = $2; 
				$$.hijos.push($4);
			}
			|	RCONST IDENTIFICADOR DOSPUNTOSIGUAL pvalor     //declaracion tipo 3  
			{
				$$ = new Dect2_4(this._$.first_line,this._$.first_column); 
				$$.tipo = vddi.const; 
				$$.id = $2; 
				$$.hijos.push($4);
			} 
			|	RGLOBAL IDENTIFICADOR DOSPUNTOSIGUAL pvalor    //declaracion tipo 4
			{
				$$ = new Dect2_4(this._$.first_line,this._$.first_column); 
				$$.tipo = vddi.global; 
				$$.id = $2; 
				$$.hijos.push($4);
			}
			|   tipo listaID 									//Declaracion tipo 5
			{
				var n = new Declaracion(this._$.first_line,this._$.first_column); 
				n.tipo = $1; 
				n.hijos.push($2);

				$$ = n; 
			}    
;

pvalor : exp {$$ = $1; } 
//		| valarray
		;

valarray : RSTRC tp ACORCH exp CCORCH {$$ = null;} 
		|  arrvalue; 

arrvalue : ALLAVE listavarr CLLAVE ;
 
 listavarr : listavarr COMA elemarr 
		| elemarr ; 

elemarr : arrvalue 
		| exp  {$$ = $1; }; 

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
			var n = new  ListaId(this._$.first_line,this._$.first_column);
			n.hijos.push($1); 
			$$ = n; 
		}; 

import : RIMPORT  listaimport fin { $$ = $2; }  ; 

listaimport : listaimport COMA ARCHIVO  { $1.hijos.push($3); $$ = $1;} 
	|  ARCHIVO   { var  n = new Importar(this._$.first_line,this._$.first_column); n.hijos.push($1); $$ = n;   }  ; 
   
exp
	: MENOS exp %prec UMENOS	{$$ = new expresionUnaria(this._$.first_line,this._$.first_column); 
								$$.operando = voperando.menos; $$.hijos.push($2);  }
	| NOT exp					{$$ = new expresionUnaria(this._$.first_line,this._$.first_column);
								 $$.operando = voperando.not;   $$.hijos.push($2);  }

	| exp MAS exp				{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.mas; $$.hijos.push($1); $$.hijos.push($3); }
	| exp MENOS exp	  			{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.menos; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp POR exp	  			{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.por; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp DIVIDIDO exp 			{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.dividido; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp MODULO exp   			{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.modulo; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp POTENCIA exp 			{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.potencia; $$.hijos.push($1); $$.hijos.push($3);  }

	| exp XOR exp   	 		{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.xor; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp OR  exp		    	{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.or; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp AND  exp		    	{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.and; $$.hijos.push($1); $$.hijos.push($3);  }

	| exp IGUALIGUAL exp		{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.igualigual; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp DIFIGUAL exp  		{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.difigual; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp TRESIGUAL exp 		{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.trigual; $$.hijos.push($1); $$.hijos.push($3);  }

	| exp MAYOR exp   			{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.mayor; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp MENOR exp   			{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.menor; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp MAYORIGUAL exp		{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.mayorigual; $$.hijos.push($1); $$.hijos.push($3);  }
	| exp MENORIGUAL exp		{$$ = new expresion_binaria(this._$.first_line,this._$.first_column); $$.operando = voperando.menorigual; $$.hijos.push($1); $$.hijos.push($3);  }
	
	
	| APAR exp CPAR				{ $$ = $2; }

	| RFALSE               		{ $$ = new primitivo(this._$.first_line,this._$.first_column); $$.tipo = vprim.boolean; $$.valor = false; 		}
	| RTRUE						{ $$ = new primitivo(this._$.first_line,this._$.first_column); $$.tipo = vprim.boolean; $$.valor = true; 		}
	| ENTERO					{ $$ = new primitivo(this._$.first_line,this._$.first_column); $$.tipo = vprim.integer; $$.valor = Number($1); 	}
	| DECIMAL					{ $$ = new primitivo(this._$.first_line,this._$.first_column); $$.tipo = vprim.double; $$.valor = Number($1);  	}
	| CADENA                	{ $$ = new primitivo(this._$.first_line,this._$.first_column); $$.tipo = vprim.string; $$.valor = $1;  			}
	| CHAR                		{ $$ = new primitivo(this._$.first_line,this._$.first_column); $$.tipo = vprim.char; $$.valor = $1;  			}

	| IDENTIFICADOR				{ $$ = new primitivo(this._$.first_line,this._$.first_column); $$.tipo = vprim.id; $$.valor = $1; }

	| inc_dec 					{$$ = $1; $$.retValor = true; }
	| llamadaMetodo				{$$ = $1; $$.exp = true;  }

	| APAR RINTEGER CPAR exp 	{ $$ = new Casteo(this._$.first_line,this._$.first_column); $$.tipo = vtipo.integer; $$.hijos.push($4);   }
	| APAR RCHAR CPAR exp 		{ $$ = new Casteo(this._$.first_line,this._$.first_column); $$.tipo = vtipo.char; $$.hijos.push($4);}


;


inc_dec:IDENTIFICADOR MASMAS		{ $$ = new inc_dec(this._$.first_line,this._$.first_column); $$.operando = voperando.masmas; $$.id = $1; $$.retValor = false; }
	|   IDENTIFICADOR MENOSMENOS	{ $$ = new inc_dec(this._$.first_line,this._$.first_column); $$.operando = voperando.menosmenos; $$.id = $1; $$.retValor = false; }
;

visibilidad : RPUBLIC | RPRIVATE  ;
fin : PCOMA |  ;  