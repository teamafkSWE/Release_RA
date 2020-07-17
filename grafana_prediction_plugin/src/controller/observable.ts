import Observer from "../view/observer/observer";

abstract class Observable {
    private _observers: Observer[] = []

    public attach = (observer:Observer) =>{
        if (!this._observers.includes(observer))
            this._observers.push(observer)
    }
    public detach = (observer:Observer) => {
        this._observers = this._observers.filter((ele) => ele !== observer)
    }

    public notifyAll = () => {
        this._observers.forEach(obs => obs.update())
    }
}

export default Observable