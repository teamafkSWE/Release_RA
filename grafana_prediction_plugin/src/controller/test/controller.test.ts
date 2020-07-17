import Controller from "../controller";

describe('Controller', () => {

    beforeEach(() => {
        Controller["_controllers"] = new Map<number, Controller>()
    })

    test('added', () => {
        Controller.requireController(10);
        expect(Controller["_controllers"].size).toBe(1)
    })

    test('removed', () => {
        expect(Controller["_controllers"].size).toBe(0)
        Controller.requireController(5);
        Controller.unloadController(5);
        expect(Controller["_controllers"].size).toBe(0)
    })

    test('add connection', () => {
        const controller = Controller.requireController(1)
        controller.notifyAll = jest.fn()
        expect(controller["_connections"].length).toBe(0)
        expect(controller["_newConnectionIndex"]).toBe(0)
        controller.addConnection({name:'',links:[]})
        expect(controller["_connections"].length).toBe(1)
        expect(controller["_newConnectionIndex"]).toBe(1)
        expect(controller.notifyAll).toBeCalledTimes(1)
    })
})


test('getPredictions null', () => {
    const controller = Controller.requireController(1);

    expect(controller.getPrediction([1, 2, 3])).toBeNull();
});

test('getDatasource null', () => {
    const controller = Controller.requireController(1);
    expect(controller.getDatasource()).toBeNull();
});

