import SupportRl from "../../model/support_rl"
import Train from "./abstractTrain";
class RLTrain extends Train {
    #algorithm=null;
    constructor(dataRl) {
        super();
        this.#algorithm=new SupportRl(dataRl);
    }
    train =()=> {
        this.#algorithm.insert();
        if(this.#algorithm.trainRl()){
            alert("Training done correctly.");
            return true;
        }
        else{
            alert("Training failed.");
            return false;
        }
    }
    getCoefficients =()=> {
       return  this.#algorithm.getCoefficientsRl();
    }
    getJSON =()=> {
        return this.#algorithm.JSONData();
    }
}

export default RLTrain;