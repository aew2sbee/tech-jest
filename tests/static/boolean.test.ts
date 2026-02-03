describe("toBeTruthy: 真値 (Truthiness) の検証", () => {
  test("JavaScriptで『真』と判定される代表的なケース", () => {
    // 文字列は1文字以上あれば当然真
    expect("hello").toBeTruthy();
    // "0" (文字列のゼロ) は、数値の0と違い「真」になるので注意！
    expect("0").toBeTruthy();
    // 空の配列やオブジェクトも、JavaScriptでは「真」
    expect([]).toBeTruthy();
    expect({}).toBeTruthy();
    // 数値の 1 や負の数 -1 も真
    expect(1).toBeTruthy();
    expect(-1).toBeTruthy();
  });
});

describe("toBeFalsy: 偽値 (Falsiness) の検証", () => {
  test("JavaScriptで『偽』と判定される全6パターン", () => {
    expect(false).toBeFalsy(); // 論理値のfalse
    expect(0).toBeFalsy(); // 数値の0
    expect(-0).toBeFalsy(); // 数値のマイナス0
    expect("").toBeFalsy(); // 空文字
    expect(null).toBeFalsy(); // null
    expect(undefined).toBeFalsy(); // undefined
    expect(NaN).toBeFalsy(); // Not a Number
  });
});

describe("厳密な検証（補助）", () => {
  test("nullやundefinedをより厳密に区別する場合", () => {
    // toBeFalsyよりも意図が明確になるマッチャー
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect(undefined).not.toBeDefined();
  });
});

describe("その他の無効な演算および処理", () => {
  test("-1の平方根", () => {
    expect(Math.sqrt(-1)).toBeNaN();
  });
  test("無限大と0の乗算", () => {
    expect(Infinity * 0).toBeNaN();
  });
  test("数字以外の文字列を数値としてパース", () => {
    expect(parseInt("foo")).toBeNaN();
  });
});
