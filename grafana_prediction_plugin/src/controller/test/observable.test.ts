import Observable from "../observable";
import Observer from "../../view/observer/observer";

class ObservableTest extends Observable {
}

class ObserverTest implements Observer {
    update(): void {
    }
}

describe('Observable', () => {

    let observable: Observable;
    let observer: Observer;

    beforeAll(() => {
        //moc class
        observable = new ObservableTest()
        observer = new ObserverTest()
    })

    test('attach', () => {
        expect.assertions(1)

        observable.attach(observer)
        expect(observable["_observers"].length).toBe(1)
    })

    test('attach twice', () => {
        expect.assertions(1)

        observable.attach(observer)
        observable.attach(observer)

        expect(observable["_observers"].length).toBe(1)
    })

    test('detach', () => {
        expect.assertions(1)

        observable.attach(observer)
        observable.detach(observer)

        expect(observable["_observers"].length).toBe(0)
    })

    test('notify', () => {
        expect.assertions(1)
        observer.update = jest.fn()

        observable.attach(observer)
        observable.notifyAll()

        expect(observer.update).toBeCalledTimes(1)
    })
})
