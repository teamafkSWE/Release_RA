import React from 'react'
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect'
// the component to test
import Collegamento from "../../components/collegamento";
import {cleanup, render, fireEvent, screen} from "@testing-library/react";


describe('Collegamento fc', () => {
    const modify = jest.fn()
    const remove = jest.fn()
    const links = [{predictor: "x", query: "cpu"}, {predictor: 'y', query: "gpu"}]

    beforeEach(() => {
        modify.mockClear()
        remove.mockClear()
    })

    afterEach(() => {
        cleanup()
    })

    test('render', () => {
        const {asFragment} = render(<Collegamento id='1' links={links} nome={'name'} onModify={modify} onRemove={remove}/>)
        expect(asFragment()).toMatchSnapshot()
    })

    test('modify call', () => {
        render(<Collegamento id='1' links={links} nome={'name'} onModify={modify} onRemove={remove}/>)
        fireEvent.click(screen.getByText('Edit'))
        expect(modify).toBeCalledTimes(1)
        expect(modify).toBeCalledWith('1')
    })

    test('remove call', () => {
        render(<Collegamento id='1' links={links} nome={'name'} onModify={modify} onRemove={remove}/>)
        fireEvent.click(screen.getByText('Disconnect'))
        expect(remove).toBeCalledTimes(1)
        expect(remove).toBeCalledWith('1')
    })
})