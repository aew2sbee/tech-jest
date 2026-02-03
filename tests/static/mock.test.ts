import * as calc from "../../src/server/lib/calc";

// "../../src/server/lib/calc"モジュール全体をモックする
// ポイント: モジュールのパスが必須
jest.mock("../../src/server/lib/calc", () => ({
  // jest.requireActual()を使って、モック対象のモジュールの実際の関数をすべて取得する
  // これにより、isEven以外の関数はそのままの動作を維持する
  ...jest.requireActual("../../src/server/lib/calc"),
  // isEven関数をモックする
  // jest.fn()でモック関数を作成し、モックの実装を定義する
  // このモックされたisEvenは、引数が99の場合にのみtrueを返し、それ以外はfalseを返す
  isEven: jest.fn((num: number) => num === 99),
}));

describe("モックオブジェクトの評価", () => {
  test("jest.fn().mockImplementationで掛け算が可能か確認する", () => {
    const mockFunction = jest.fn().mockImplementation((x: number) => x * 2);
    expect(mockFunction(2)).toBe(4);
  });
  test("jest.fn().mockImplementationOnceで呼び出し回数に応じた結果が返ってくるか確認する", () => {
    const mockFunction = jest
      .fn()
      .mockImplementationOnce(() => "1回目")
      .mockImplementationOnce(() => "2回目");
    expect(mockFunction()).toBe("1回目");
    expect(mockFunction()).toBe("2回目");
    expect(mockFunction()).toBe(undefined);
  });
});

describe("isEven関数のモックテスト", () => {
  test("isEvenがモックされていることを確認する", () => {
    // モックされたisEvenは、入力が99の場合のみtrueを返す
    expect(calc.isEven(99)).toBe(true);
    expect(calc.isEven(2)).toBe(false);
    expect(calc.isEven).toHaveBeenCalledTimes(2);
  });
});
