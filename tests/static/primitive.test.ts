// --- プリミティブな値の種類（7つ） ---
// string      // 文字列
// number      // 数値
// boolean     // true / false
// null        // 何もない
// undefined   // 値が未定義
// bigint      // とても大きな整数
// symbol      // 一意な値

describe("toBeについて検証する", () => {
  test("数値について", () => {
    // 準備(Arrange)
    const expectedValue = 0;

    // 実行(Act)
    const result = 0;

    // 確認(Assert)
    expect(result).toBe(expectedValue);
  });

  test("文字列について", () => {
    // 準備(Arrange)
    const expectedValue = "Hello, TypeScript!";

    // 実行(Act)
    const result = "Hello, TypeScript!";

    // 確認(Assert)
    expect(result).toBe(expectedValue);
  });

  test("booleanについて", () => {
    // 準備(Arrange)
    const expectedValue = true;

    // 実行(Act)
    const result = true;

    // 確認(Assert)
    expect(result).toBe(expectedValue);
  });
});
