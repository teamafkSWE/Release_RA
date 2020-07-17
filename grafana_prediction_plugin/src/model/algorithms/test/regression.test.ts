import {Regression} from "../regression";

it('RL test ok', function () {
    const b = -4.103581234222119
    const a = [
        0.08640900619401126,
        0.08760164313749375
    ]
    const RL = new Regression(a, b)
    const input = [40, 25]
    // TO DO: check expected
    expect(RL.predict(input)).toStrictEqual(1.542820091975675)
});

it('RL test not ok', function () {
    const b = -4.103581234222119
    const a = [
        0.08640900619401126,
        0.08760164313749375
    ]
    const RL = new Regression(a, b)
    const input = [40, 25]
    expect(RL.predict(input)).not.toBe(1)
});

it('RL test input exceed', function () {
    const b = -4.103581234222119
    const a = [
        0.08640900619401126,
        0.08760164313749375
    ]
    const RL = new Regression(a, b)
    const input = [40, 25, 1]
    expect(() => RL.predict(input)).toThrowError(Error("The number of inputs is greater than expected"))
});

it('RL test input inferior', function () {
    const b = -4.103581234222119
    const a = [
        0.08640900619401126,
        0.08760164313749375
    ]
    const RL = new Regression(a, b)
    const input = [40]
    expect(() => RL.predict(input)).toThrowError(Error("The number of inputs is less than expected"))
});