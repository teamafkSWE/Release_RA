import SupportSvm from "../../model/support_svm"
import Train from "./abstractTrain";

class SVMTrain extends Train{
    #algorithm=null;
    constructor(dataSVM) {
        super();

        this.#algorithm=new SupportSvm(dataSVM);
    }
    train =()=> {
        this.#algorithm.trainSvm();
        if(this.#algorithm.confermaPredizioneSvm()) {
            alert("Training done correctly.");
            return true;
        }
        else{
            alert("Training failed.")
            return false;
        }
    }
    getCoefficients =()=> {
       return  this.#algorithm.Weights();
    }
    getJSON =()=> {
        return this.#algorithm.JSONData();
    }


}
export default SVMTrain;