class CalcController {

    constructor(){

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
        this._operation = [];
        this.displayCalc = "";
     }

     cancelEntry(){
        this._operation.pop();
     }

     isOperator(value){
        return ['+', '-', '*', '/', '%'].indexOf(value) > -1;
     }

    setLastOperation(value){

        this._operation[this._operation.length-1] = value;

    }

    calc(){

        let last = this._operation.pop();

        let result = eval(this._operation.join(""));
        
        this._operation = [result, last];

    }

    pushOperation(value){

        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc();

        }

    }


     addOperation(value){

        if(isNaN(this.getLastOperation())){
            if(this.isOperator(value)){
                this._operation[this._operation.length-1] = value;
            }

            else if (isNaN(value)){

            }

            else {
                this.pushOperation(value);
            }
        }

        else{
            if(this.isOperator(value)){
                this.pushOperation(value);
            }  
            else{
                let updatedValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(updatedValue));
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
            case 'percentual':
                this.addOperation('%');
                break;
            case 'resultado':
                this.addOperation('=');
                break;
            case 'ponto':
                this.addOperation('.');
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
                this.addOperation(parseInt(value));
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


