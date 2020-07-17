
const modules = require("ml-modules");
const SVM = modules.SVM;

class SupportSvm {
    #dataSVM;
    #svm
    #weights;
    constructor(dataSVM) {
        this.#dataSVM=dataSVM;
        this.options = {
            kernel: {
                linear: true,
            },
            karpathy: true,
        };
        this.#svm = new SVM();
        this.#svm.setOptions(this.options);
        this.#weights=null;
    }
    getColumnsName =()=> {
        let x = [];
        for(let i=0; i<this.#dataSVM[0].length-1; i++)
            x[i] = this.#dataSVM[0][i];
        return {w: x, b:"bias"};
    }

    getDate =()=> {
        let today = new Date();
        if(today.getMonth() < 10 && today.getDate() < 10)
            today = today.getFullYear() + "/" + "0" + (today.getUTCMonth()+1) + "/" + "0" + today.getDate();
        else if(today.getMonth() < 10)
            today = today.getFullYear() + "/" + (today.getUTCMonth()+1) + "/" + today.getDate();
        else
            today = today.getFullYear() + "/" + (today.getUTCMonth()+1) + "/" + "0" + today.getDate();
        return today;
    }

    trainSvm =()=> {
        let dataSVM=this.#dataSVM;
        let data = [this.#dataSVM.length-1];
        for(let i=0; i<this.#dataSVM.length-1; i++) {
            data[i] = new Array(dataSVM[0].length-1);
        }
        let labels = [this.#dataSVM.length-1];
        for(let i=0;i<data.length;i++){
            for (let j=0;j<data[i].length;j++) {
                data[i][j] = this.#dataSVM[i+1][j];
            }
            labels[i]=this.#dataSVM[i+1][this.#dataSVM[i+1].length-1];
        }
        this.#svm.train(data,labels);

        this.#weights ={w:this.#svm.w,b:this.#svm.b};
    }
    Weights =()=> {
        return this.#weights;
    }
    confermaPredizioneSvm =()=> {
        if(this.#weights!==null)
            return  true;
        else
            return false;
    }

    JSONData =()=> {
        if(this.confermaPredizioneSvm() === true) {
            const myData = {
                author: 'TeamAFK',
                version: '1.0.0',
                algorithm: 'SVM',
                notes: "",
                date: this.getDate(),
                predictors: this.getColumnsName(),//this.predictor(),
                result: this.#weights
            };

            return myData;
        }else {
            return false;
        }
    }


}
export default SupportSvm;