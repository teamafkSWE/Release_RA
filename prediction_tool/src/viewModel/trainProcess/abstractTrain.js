class  Train{
    #algorithm=null;
    constructor() {
        if (this.constructor === Train) {
            throw new TypeError("Can not construct abstract class.");
        }
    }
    train =()=> {
        throw new TypeError(
            "Do not call abstract method train from child."
        );
    };
    getCoefficients =()=> {
        throw new TypeError(
            "Do not call abstract method getCoefficients from child."
        );
    };

    getJSON =()=> {
        throw new TypeError(
            "Do not call abstract method getJSON from child."
        );
    }


}

export default Train;
