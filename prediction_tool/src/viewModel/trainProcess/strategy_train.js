 import SVMTrain from "./svm_train";
import RLTrain from "./rl_train";

class StrategyTrain  {
    #strategy=null;
    #data=null;
    constructor() {
        this.#strategy=null;
        this.#data=null;
    }
    setStrategy =(algorithm,verifyAlgorithm)=>{
        this.#strategy=null;
        if(algorithm==="svm" && verifyAlgorithm){
            this.#strategy=new SVMTrain(this.#data);
            return true;
        }
        else if(algorithm==="rl" && verifyAlgorithm){
            this.#strategy=new RLTrain(this.#data);
            return true;
        }
        else
            return false;
    }
    resetStrategy=()=>{
        this.#strategy=null;
    }
    hasStrategySet=()=>{
        if(this.#strategy===null)
            return false
        else
            return true;
    }
    setData=(data)=>{
        this.#data=data;
    }

    train=()=>{
        if(this.#strategy!==null)
            return this.#strategy.train();
        else
            return false;
    }
    getJson =()=> {
        if(this.#strategy!==null)
            return this.#strategy.getJSON();
        else
            return null

    }
    getCoeff=()=>{
        return this.#strategy.getCoefficients();
    }
}

export default StrategyTrain;