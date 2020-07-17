import Algorithm from "../algorithm";



export class Svm extends Algorithm{

    predict = (input: number[]): 1|-1 => {
        if (input.length < this.a.length)
            throw new Error("The number of inputs is less than expected")
        else if (input.length > this.a.length)
            throw new Error("The number of inputs is greater than expected")
        else if (input.length === this.a.length){
            let sum = 0
            for (let i = 0; i < input.length; i++)
                sum += input[i]*this.a[i]
            const prediction = sum + this.b
            if (prediction>=0)
                return 1
            else return -1
        }
        else
            throw new Error("You should not see this error...")
    }

}