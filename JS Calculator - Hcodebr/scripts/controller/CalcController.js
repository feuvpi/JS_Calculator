class CalcController {

    constructor(){

        this._lastOperatorWasResult = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateCalcEl = document.querySelector("#data");
        this._timeCalcEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents(); 
        //this.addEventListenerAll();
    }



    initialize(){

        this.setDisplayDateTime();

        setInterval(() => {
           this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
 
     }

     setDisplayDateTime(){
         
        this.displayDate = this.currentDate.toLocaleDateString(this._locale)
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)

     }


     addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
     }

     clearAll(){
        this._operation = [0];
        this.setLastNumberToDisplay();
     }

     cancelEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
     }

     isOperator(value){
        return ['+', '-', '*', '/', '%'].indexOf(value) > -1;
     }

    setLastOperation(value){

        this._operation[this._operation.length-1] = value;

    }

    countDecimals(value){
        let number_string = value.toString();
        //console.log("number_string", number_string);
        let index = number_string.indexOf(".");
        //console.log("index", index);
        let decimals = number_string.length - index - 1;
        //console.log("decimals", decimals);
        return decimals;
    }

    getResult(){
        if(parseFloat(this.countDecimals((eval(this._operation.join(""))))) > 5){
            console.log("decimais achadas", this.countDecimals((eval(this._operation.join("")))))
            return (eval(this._operation.join(""))).toFixed(5)
        }else{
            console.log("decimais achadas", parseFloat(this.countDecimals((eval(this._operation.join(""))))))
            return (eval(this._operation.join("")))
        }
        //criarconsole.log("numero de decimais", this.countDecimals((eval(this._operation.join("")))))
        
    }

    calc(){

        if(this._operation.length > 3){
            let last = this._operation.pop();
            this._lastOperator = this.getLastItem();
            this._lastNumber = this.getLastItem(false);
            let result = this.getResult();
            
            if(last == '%'){
    
                result = result / 100;
                this._operation = [result];
                this.setLastNumberToDisplay();
    
            }
    
            else{
                
                this._operation = [result, last];
        
                this.setLastNumberToDisplay();
            }

        }
        
        else if (this._operation.length == 3){ 

            this._lastOperator = this.getLastItem();
            this._lastNumber = this.getLastItem(false);
        
            this._operation = [this.getResult()];
            this.setLastNumberToDisplay();
           
        }

        else{
            //criar funcionalidade para utilizar o mesmo numero caso seja um numero e um operador
            this.pushOperation(this._lastOperator);
            this.pushOperation(this._lastNumber);
            this._operation = [this.getResult()];
            this.setLastNumberToDisplay();
           
        }
       
    }

    pushOperation(value){

        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc();

        }

    }
    
    getLastItem(isOperator = true){

        let lastItem;

            for(let i = this._operation.length-1; i >=0; i--){
                if(this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i];
                    break;
                }

            }

        return lastItem;

    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

          
        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;    
        console.log(this._operation);
        
        

    }

    addPonto(){

        let lastOperation = this.getLastOperation();

        console.log(lastOperation);

        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else if(this._lastOperatorWasResult == true){
            this._operation.pop();
            this.pushOperation('0.');
            this.setLastNumberToDisplay();
            this._lastOperatorWasResult = false;
        }
         else{
            this.setLastOperation(lastOperation.toString() + '.');
            this.setLastNumberToDisplay();
        }

    }

     addOperation(value){

        if(isNaN(this.getLastOperation())){
            if(this.isOperator(value)){
                this._operation[this._operation.length-1] = value;
            }

            else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        }

        else{
            if(this.isOperator(value)){
                this.pushOperation(value);
            }  
            else{

               if(this._lastOperatorWasResult == true){
                    this._operation.pop();
                    this.pushOperation(value);
                    this.setLastNumberToDisplay();
                    this._lastOperatorWasResult = false;
               }else{
                    //criar funcionalidade para evitar que um numero inserido apos o resultado pelo botao de resultado nao continue concatenando
                    let updatedValue = this.getLastOperation().toString() + value.toString();
                    this.setLastOperation(updatedValue);
                    this.setLastNumberToDisplay();
               } 

               
            } 
            
             
        }
        
        console.log(this._operation);
     }

     getLastOperation(){
         return this._operation[this._operation.length-1];
     }
    

     setError(){
         this.displayCalc = "Error";
     }

     getResultado(){
         this.calc();
         //this._continueOperation = true;

     }
    
     execBtn(value){
         switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.cancelEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
             case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                this._lastOperatorWasResult = true;
                break;
            case 'ponto':
                this.addPonto();
                break;
            
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseFloat(value));
                break;

            default:
                this.setError();
                break;
         }
     }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn,"click drag", e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
        });

       
        });

    }







    get displayTime(){
        return this._timeCalcEl.innerHTML;
    }

   set displayTime(value){
        return this._timeCalcEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateCalcEl.innerHTML;
    }

   set displayDate(value){
        return this._dateCalcEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){

        this._currentDate = value;
    }


    


}


