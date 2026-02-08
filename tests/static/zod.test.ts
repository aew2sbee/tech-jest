import * as sut from "@/server/validation/user";

describe("Zodライブラリーの評価", () => {
  test("バリデーション内のデータであることを確認する", () => {
    // 準備(Arrange)
    const expectedValue = true;
    const arg = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "山田太郎",
      email: "taro.yamada@example.com",
      age: 30,
      gender: "male",
      createdAt: new Date("2023-01-01T00:00:00Z"),
    };
    // 実行(Act)
    const result = sut.isValidateUser(arg);
    // 確認(Assert)
    expect(result).toBe(expectedValue);
  });
});
