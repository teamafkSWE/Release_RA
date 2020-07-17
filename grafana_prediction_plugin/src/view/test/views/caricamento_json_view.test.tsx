import {cleanup, render} from "@testing-library/react";
import CaricamentoJsonView from "../../views/caricamento_json_view";
import React from 'react';
import Controller from "../../../controller/controller";
import Renderer from 'react-test-renderer'
import {AppEvents} from "@grafana/data";

class EmitterMock {
    emit = jest.fn()
}

const attachMock = jest.fn()
const detachMock = jest.fn()
const getJsonMock = jest.fn()
const getFileMock = jest.fn()
const setJsonMock = jest.fn()
const isMonitoringMock = jest.fn()

describe('caricamento json', () => {
    const controller = Controller.requireController(1)
    const emitter = new EmitterMock()
    controller.attach = attachMock
    controller.detach = detachMock
    controller.getJson = getJsonMock
    controller.getFile = getFileMock
    controller.setJson = setJsonMock
    controller.isMonitoring = isMonitoringMock

    beforeEach(() => {
        attachMock.mockClear()
        detachMock.mockClear()
        getJsonMock.mockClear()
        getFileMock.mockClear()
        setJsonMock.mockClear()
        isMonitoringMock.mockClear()
        emitter.emit.mockClear()
    })

    afterEach(() => cleanup())

    afterAll(() => Controller.unloadController(1))

    test('render normal', () => {
        const {asFragment} = render(<CaricamentoJsonView controller={controller} emitter={emitter}/>)
        expect(asFragment()).toMatchSnapshot()
        expect(controller.attach).toBeCalledTimes(1)
        expect(controller.getJson).toBeCalledTimes(1)
        expect(controller.getFile).toBeCalledTimes(1)
        expect(controller.isMonitoring).toBeCalledTimes(1)
    })

    test('render modify', () => {
        isMonitoringMock.mockImplementation(() => true)
        const {asFragment} = render(<CaricamentoJsonView controller={controller} emitter={emitter}/>)
        expect(asFragment()).toMatchSnapshot()
        expect(controller.attach).toBeCalledTimes(1)
        expect(controller.getJson).toBeCalledTimes(1)
        expect(controller.getFile).toBeCalledTimes(1)
        expect(controller.isMonitoring).toBeCalledTimes(1)
    })

    test('on change input', () => {
        const instance: any = Renderer.create(<CaricamentoJsonView emitter={emitter} controller={controller}/>).getInstance()
        const file = new File([], "asd")
        instance.state.file = undefined
        instance.fileUpload([file])
        window.confirm = jest.fn()
        expect(window.confirm).toBeCalledTimes(0)
        expect(controller.setJson).toBeCalledTimes(1)
        expect(controller.setJson).toBeCalledWith(file)
    })

    test('on change input confirm', () => {
        window.confirm = jest.fn().mockImplementation(() => true)
        const instance: any = Renderer.create(<CaricamentoJsonView emitter={emitter} controller={controller}/>).getInstance()
        const file = new File([], "asd")
        instance.state.file = null
        instance.fileUpload([file])
        expect(window.confirm).toBeCalledTimes(1)
        expect(window.confirm).toBeCalledWith("There is already a json file. Do you want to change it?")
        expect(controller.setJson).toBeCalledTimes(1)
        expect(controller.setJson).toBeCalledWith(file)
    })

    test('update, file not supported', () => {
        const file = new File([], 'asd')
        getFileMock.mockImplementation(() => file)
        const instance: any = Renderer.create(<CaricamentoJsonView emitter={emitter} controller={controller}/>).getInstance()
        instance.update()
        expect(emitter.emit).toBeCalledTimes(1)
        expect(emitter.emit).toBeCalledWith(AppEvents.alertWarning, ["File JSON not supported", "The file you selected is not compatible with the plugin"])
    })

    test('update, file loaded', () => {
        getFileMock.mockImplementation(() => undefined)
        const instance: any = Renderer.create(<CaricamentoJsonView emitter={emitter} controller={controller}/>).getInstance()
        const file = new File([], "asd")
        getFileMock.mockImplementation(() => file)
        JSON.stringify = jest.fn().mockImplementation(() => "{\"asd\" : \"asd\"}")
        getJsonMock.mockClear()
        instance.update()
        expect(controller.getJson).toBeCalledTimes(1)
        expect(JSON.stringify).toBeCalledTimes(1)
        expect(instance.state).toStrictEqual({jsonContent: "{\"asd\" : \"asd\"}", filename: "asd", file: file})
        expect(emitter.emit).toBeCalledTimes(1)
        expect(emitter.emit).toBeCalledWith(AppEvents.alertSuccess, ["File JSON loaded successfully"])
    })
})