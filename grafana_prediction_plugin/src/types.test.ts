import {Connection, Datasource, Predictor} from './types'

describe('Connection', () => {
    describe('get', () => {
        test('id', () => {
            const connection = new Connection('1', '', [])
            expect(connection.id).toBe('1')
        })
        test('name', () => {
            const connection = new Connection('', 'asd', [])
            expect(connection.name).toBe('asd')
        })
        test('links', () => {
            const connection = new Connection('', '', [{predictor: 'asd', query: 'asd'}])
            expect(connection.links.length).toBe(1)
            expect(connection.links).toStrictEqual([{predictor: 'asd', query: 'asd'}])
        })
    })

    describe('set', () => {
        test('id', () => {
            const connection = new Connection('1', '', [])
            connection.id = '12'
            expect(connection.id).toBe('12')
        })
        test('name', () => {
            const connection = new Connection('', 'asd', [])
            connection.name = 'dsa'
            expect(connection.name).toBe('dsa')
        })
        test('links', () => {
            const connection = new Connection('', '', [{predictor: 'asd', query: 'asd'}])
            connection.links = []
            expect(connection.links.length).toBe(0)
            expect(connection.links).toStrictEqual([])
        })
    })
})

describe('Datasource', () => {
    test('get id', () => {
        const datasource = new Datasource('456','','','http://localhost','','')
        expect(datasource.id).toBe('456')
    })
    test('get database', () => {
        const datasource = new Datasource('','mydb','','http://localhost','','')
        expect(datasource.database).toBe('mydb')
    })
    test('get name', () => {
        const datasource = new Datasource('','','asd','http://localhost','','')
        expect(datasource.name).toBe('asd')
    })
    test('get url', () => {
        const datasource = new Datasource('','','','http://localhost','','')
        const url = datasource.url
        expect(url.protocol).toBe('http:')
        expect(url.hostname).toBe('localhost')
    })
    test('get user', () => {
        const datasource = new Datasource('','','','http://localhost','nome','')
        expect(datasource.user).toBe('nome')
    })
    test('get password', () => {
        const datasource = new Datasource('','','','http://localhost','','pwd')
        expect(datasource.password).toBe('pwd')
    })
})

describe('Predictor', () => {
    test('get name', () => {
        const predictor = new Predictor('asd', 0)
        expect(predictor.name).toBe('asd')
    })
    test('get value', () => {
        const value = Math.floor(Math.random() * 10)
        const predictor = new Predictor('', value)
        expect(predictor.value).toBe(value)
    })
})
