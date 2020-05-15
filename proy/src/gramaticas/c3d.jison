/**
 * Ejemplo Intérprete Sencillo con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */
%lex

%options case-insensitive

%%

\s+											// se ignoran espacios en blanco
"#".*										// comentario simple línea
[#][*][^*]*[*]+([^#*][^*]*[*]+)*[#]			// comentario multiple líneas


"call"			return 'RCALL';
"if"			return 'RIF';
"var"			return 'RVAR';
"goto"          return "RGOTO"; 

"print"        	return "RPRINT"; 
"begin"        	return "RBEGIN"; 
"proc"        	return "RPROC"; 
"end"        	return "REND"; 



","					return 'COMA';
";"					return 'PCOMA';
"("					return 'APAR';
")"					return 'CPAR';
"["					return "ACORCH";
"]"					return "CCORCH";


"&&"				return 'AND'
"||"				return 'OR';



"+"					return 'MAS';
"-"					return 'MENOS';
"*"					return 'POR';
"/"					return 'DIVIDIDO';
"%"                 return "MODULO";  


"<="				return 'MENORIGUAL';
">="				return 'MAYORIGUAL';
"=="				return 'IGUALIGUAL';
"<>"				return 'DIFIGUAL';
"<"					return 'MENOR';
">"					return 'MAYOR';

"="					return 'IGUAL';

":"					return 'DOSPTS';


'"%c"'              return "PC"; 
'"%d"'              return "PD"; 
'"%i"'              return "PI"; 

[0-9]+("."[0-9]+)\b   	    return 'DECIMAL';
[0-9]+\b				return 'ENTERO';

([a-zA-Z])[a-zA-Z0-9_]*	return 'IDENTIFICADOR';


<<EOF>>				return 'EOF';
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
						nerror("Linea " + yylloc.first_line + " Columna " + yylloc.first_column +  ", Error lexico  '" + yytext + "' no reconocido."); 
					}
/lex


%{

%}


/* Asociación de operadores y precedencia */

%start ini

%% /* Definición de la gramática */

ini:  
	ldecvars instrucciones  EOF 
	| ldecvars EOF
;

ldecvars : ldecvars dvar 	{ arr3d.push($2);  }
		 | dvar  			{ arr3d.push($1); } ; 

dvar : listavar PCOMA  {$$ = $1;}      
	|  RVAR IDENTIFICADOR ACORCH CCORCH PCOMA { $$ = new decarr3d(@1.first_line , @1.first_column); $$.id = $2; }
	|  RVAR IDENTIFICADOR IGUAL tipo PCOMA {$$ = new decasign3d(@1.first_line , @1.first_column); $$.id = $2; $$.hijos.push($4);};  

tipoprint :   PC 
			| PD
			| PI ; 

tipo : tp2 		{$$ = $1; $$.menos = false; }
	| MENOS tp2 {$$ = $2; $$.menos = true;  }; 

tp2 : ENTERO {$$ = new tipo3d(@1.first_line , @1.first_column); $$.tipo = tp3d.int; $$.val = $1; }
	| DECIMAL{$$ = new tipo3d(@1.first_line , @1.first_column); $$.tipo = tp3d.double; $$.val = $1;} 
	| IDENTIFICADOR {$$ = new tipo3d(@1.first_line , @1.first_column); $$.tipo = tp3d.id; $$.val = $1}; 

listavar : listavar COMA IDENTIFICADOR  {$$ = $1; $$.hijos.push($3);}
			| RVAR IDENTIFICADOR  { $$ = new declaracion3d(@1.first_line , @1.first_column); $$.hijos.push($2); };

instrucciones :   instrucciones instruccion   {arr3d.push($2);}
			| 	  instruccion                 {arr3d.push($1);}; 

instruccion : asignacion PCOMA {$$ = $1;}
			| saltos      	{$$ = $1;}
			| metodos	  	{$$ = $1;}
			| llamadaFunc 	{$$ = $1;}
			| print    		{$$ = $1;};

print : RPRINT APAR tipoprint COMA tipo CPAR PCOMA {$$ = new print3d(@1.first_line , @1.first_column); $$.timp = $3; $$.hijos.push($5);}; 	

llamadaFunc : RCALL IDENTIFICADOR PCOMA {$$ = new llamadafunc3d(@1.first_line , @1.first_column); $$.id = $2; }; 

metodos : RPROC IDENTIFICADOR RBEGIN { $$ = new decfunc3d(@1.first_line , @1.first_column); $$.id = $2; }
		| REND { $$ = new end3d(@1.first_line , @1.first_column);  }; 

saltos :  RIF  valif  RGOTO IDENTIFICADOR PCOMA {
				$$ = new saltos3d(@1.first_line , @1.first_column); 
				$$.hijos.push($2); $$.hijos.push($4);  
				}
		| RGOTO IDENTIFICADOR PCOMA{
			$$ = new saltos3d(@1.first_line , @1.first_column); 
			$$.hijos.push($2); 
		}
		| IDENTIFICADOR DOSPTS{
			$$ = new etiqueta3d(@1.first_line , @1.first_column); $$.id = $1; 
		}
		; 

valif :  APAR tipo vif tipo CPAR{ $$ = new opBool3d(@1.first_line , @1.first_column); $$.opb = $3; 
								$$.hijos.push($2); $$.hijos.push($4);} ;

vif :   MENORIGUAL    {$$ = opb3d.MENORIGUAL}
		|MAYORIGUAL    {$$ = opb3d.MAYORIGUAL}
		|IGUALIGUAL    {$$ = opb3d.IGUALIGUAL}
		|DIFIGUAL    {$$ = opb3d.DIFIGUAL}
		|MENOR    {$$ = opb3d.MENOR}
		|MAYOR    {$$ = opb3d.MAYOR} ; 

asignacion : IDENTIFICADOR IGUAL tipo { $$ = new asignacion3d(@1.first_line , @1.first_column); $$.id = $1; $$.hijos.push($3); }
	
	
			|IDENTIFICADOR IGUAL tipo operando tipo {
				$$ = new asignacion3d(@1.first_line , @1.first_column); $$.id = $1; 
				$$.opn = $4; 
				$$.hijos.push($3); $$.hijos.push($5); 
			}
	
			|IDENTIFICADOR ACORCH tipo CCORCH 	IGUAL tipo{
				$$ = new arrAsign(@1.first_line , @1.first_column); $$.id = $1; 
				$$.hijos.push($3); 
				$$.hijos.push($6);
			}
			|IDENTIFICADOR IGUAL IDENTIFICADOR 	ACORCH tipo CCORCH {
				$$ = new asignArr(@1.first_line , @1.first_column); $$.id = $1; 
				$$.id2 = $3; 
				$$.hijos.push($5); 
			}
			; 


operando : MAS  {$$ = opn3d.MAS}
|  MENOS  {$$ = opn3d.MENOS}
|  POR  {$$ = opn3d.POR}
|  DIVIDIDO  {$$ = opn3d.DIVIDIDO}
|  MODULO    {$$ = opn3d.MODULO  } ; 

