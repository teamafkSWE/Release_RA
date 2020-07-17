// import {ClientOptions, InfluxDB, Point} from '@influxdata/influxdb-client'
import {InfluxDB} from 'influx'

class Influx {

    private readonly _IDB: InfluxDB;
    // private readonly _url:string;
    private _measurement: string = '';


    private constructor(db: InfluxDB) {
        this._IDB = db
    }

    public static connect = async (host: string, port: string | number, database: string, username?: string, password?: string) => {
        const uname = username ? username : '';
        const pwd = password ? password : '';
        const url = 'http://' + uname + ':' + pwd + '@' + host + ':' + port + '/'

        const db = new InfluxDB(url + database)

        const online = await db.ping(1000).then(res => res[0].online)
        if (online) {
            return new Influx(db)
        } else
            return null
    }


    // public ping = async () => {
    //     const res = await this._IDB.ping(1000)
    //     return res[0].online
    // }

    /**
     * set the measurement to write on
     * @param measurement
     */
    set measurement(measurement: string) {
        this._measurement = measurement;
    }

    /**
     * write a point on the database with the passed value
     * the point is written in the measurement selected with setMeasurement(...)
     * @param value to write
     * @throws {Error} if a database or a measurement has not been selected
     * @return Promise<void>
     */
    public write = (value: number) => {
        if (this._measurement === '')
            throw new Error('No measurement setted.')

        return this._IDB.writePoints([
            {
                measurement: this._measurement,
                fields: {value}
            }
        ])
    }

    public query = (query: string) => {
        return this._IDB.query<{time:number, value:number}>(query)
    }
}


export default Influx;