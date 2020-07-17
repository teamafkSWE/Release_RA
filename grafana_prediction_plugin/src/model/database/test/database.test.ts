import Influx from '../influx'
// import Axios from "axios";

test('connection true', async () => {
    expect.assertions(1)
    const influx = await Influx.connect('localhost', 8086, 'mydb')
    expect(influx).not.toBe(null)
})

test('connection false', async () => {
    expect.assertions(1)
    const influx = await Influx.connect('host', 0, 'mydb')
    expect(influx).toBe(null)
})

test('write error', async () => {
    expect.assertions(1)
    const influx = await Influx.connect('localhost', 8086, 'mydb')
    if (influx != null)
        expect(() => influx.write(100)).toThrowError(Error('No measurement setted.'))
})

test('write', async () => {
    expect.assertions(1)
    const influx = await Influx.connect('localhost', 8086, 'mydb')
    if (influx != null) {
        influx.measurement = 'testmeas'
        expect(() => influx.write(100)).not.toThrowError()
    }
})

test('query', async (done) => {
    expect.assertions(2)
    const influx = await Influx.connect('localhost', 8086, 'mydb')
    if (influx != null) {
        influx.measurement = 'testmeas'
        const value = Math.random()
        influx.write(value).then(async () => {
            const results = await influx.query('select value from testmeas order by time desc limit 1')
            expect(results.length).toBe(1)
            results.forEach(row => expect(row.value).toBe(value))
            done()
        })
    }
})