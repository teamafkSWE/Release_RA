import {Svm} from "../svm";

it('should be 1', function () {

    const bias = 1.363618234217184
    const wheits = [
        -0.032274505797868946,
        -0.021486578304954727,
        -0.0542787381049902
    ]

    const SVM = new Svm(wheits, bias)
    const input = [-0.4326, 11.909, 3]
    expect(SVM.predict(input)).toStrictEqual(1)
});
it('should be -1', function () {
    const bias = 0
    const weights = [
        1
    ]

    const SVM = new Svm(weights, bias)
    const input = [-1]
    expect(SVM.predict(input)).toBe(-1)
});

it('should throw error - less', function () {
    const bias = 1.363618234217184
    const weights = [
        -0.032274505797868946,
        -0.021486578304954727,
        -0.0542787381049902
    ]
    const SVM = new Svm(weights, bias)
    const input: number[] = []
    expect(() => SVM.predict(input)).toThrowError(Error("The number of inputs is less than expected"))
})
;

it('should throw error - greater', function () {
    const bias = 1.363618234217184
    const weights = [
        -0.032274505797868946,
        -0.021486578304954727,
        -0.0542787381049902
    ]

    const SVM = new Svm(weights, bias)
    const input = [1, 1, 1, 1]
    expect(() => SVM.predict(input)).toThrowError(Error("The number of inputs is greater than expected"))
});