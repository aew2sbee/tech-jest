describe("パラメタライズテストの評価", () => {
  // テストデータの配列を定義します
  const cases = [
    { a: 1, b: 2, expected: 3 },
    { a: 2, b: 3, expected: 5 },
    { a: 3, b: 4, expected: 7 },
  ];

  // test.each(配列)(テスト名, テスト関数) の形式で記述します
  test.each(cases)(
    "パラメタライズテスト: $a + $b = $expected",
    ({ a, b, expected }) => {
      expect(a + b).toBe(expected);
    },
  );
});
