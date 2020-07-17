import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {cleanup, render} from "@testing-library/react";
import Renderer from 'react-test-renderer'
import FormEdit from "../../components/form_edit";
import Controller from "../../../controller/controller";
import {Connection} from "../../../types";
import {AppEvents} from "@grafana/data";

class EmitterMock {
    emit = jest.fn()
}

const mockGetConnection = jest.fn().mockImplementation(() => {
    return [new Connection('1', 'x', [{query: 'cpu', predictor: 'y'}])]
})
const mockEditConnection = jest.fn()


describe('Form edit', () => {
    const queries = [{name: 'xy', fields: [], length: 0}, {name: 'yx', fields: [], length: 0}]
    const close = jest.fn()
    const controller = Controller.requireController(1)
    controller.getConnections = mockGetConnection
    controller.editConnection = mockEditConnection
    const emitter = new EmitterMock()
    beforeEach(() => {
        close.mockClear()
        emitter.emit.mockClear()
        mockGetConnection.mockClear()
        mockEditConnection.mockClear()
    })

    afterEach(() => {
        cleanup()
    })

    afterAll(() => Controller.unloadController(1))

    test('render', () => {
        const {asFragment,} = render(<FormEdit queries={queries} closeEdit={close} idConnection={'1'} controller={controller} emitter={emitter}/>)
        expect(asFragment()).toMatchSnapshot()
    })

    test('update name', () => {
        const instance: any = Renderer.create(<FormEdit queries={queries} closeEdit={close} idConnection={'1'} controller={controller} emitter={emitter}/>).getInstance()
        expect(instance.connectionName).toBe('x')
        instance.updateName({target: {value: 'xA'}})
        expect(instance.connectionName).toBe('xA')
    })

    test('update links', () => {
        const instance: any = Renderer.create(<FormEdit queries={queries} closeEdit={close} idConnection={'1'} controller={controller} emitter={emitter}/>).getInstance()
        expect(instance.connectionLinks).toStrictEqual([{query: 'cpu', predictor: 'y'}])
        instance.updateLinks({target: {value: 'gpu', id: 'y'}})
        expect(instance.connectionLinks).toStrictEqual([{query: 'gpu', predictor: 'y'}])
    })

    test('update connection empty name', () => {
        const instance: any = Renderer.create(<FormEdit queries={queries} closeEdit={close} idConnection={'1'} controller={controller} emitter={emitter}/>).getInstance()
        instance.connectionName = ''
        instance.updateConnection()
        expect(emitter.emit).toBeCalledTimes(1)
        expect(emitter.emit).toBeCalledWith(AppEvents.alertWarning, ["Enter a name for the connection:"])
    })

    test('update connection not empty name', () => {
        const instance: any = Renderer.create(<FormEdit queries={queries} closeEdit={close} idConnection={'1'} controller={controller} emitter={emitter}/>).getInstance()
        instance.updateConnection()
        expect(controller.editConnection).toBeCalledTimes(1)
        expect(controller.editConnection).toBeCalledWith('1', {name: 'x', list: [{query: 'cpu', predictor: 'y'}]})
        expect(close).toBeCalledTimes(1)
        expect(emitter.emit).toBeCalledTimes(1)
        expect(emitter.emit).toBeCalledWith(AppEvents.alertSuccess, ["Connection changed."])
    })
})