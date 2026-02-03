// 1秒後に`success`文字列を返します
const fetchData = () =>
  new Promise((resolve) => setTimeout(resolve, 1000, "success"));

describe("concurrentの評価", () => {
  // test.concurrent を使うことで、Jest の機能として並列実行を明示します
  test.concurrent("concurrentで100回並列処理をする", async () => {
    const results = await Promise.all(
      Array.from(new Array(100).keys()).map(() => fetchData()),
    );

    // すべての結果が 'success' であることを検証
    results.forEach((res) => expect(res).toBe("success"));
  });

  // test.skip を使うことで、このテストをスキップします
  test.concurrent.skip(
    "concurrentとskipで100回並列処理をskipする",
    async () => {
      // この中は実行されません
      const results = await Promise.all(
        Array.from(new Array(100).keys()).map(() => fetchData()),
      );

      // すべての結果が 'success' であることを検証
      results.forEach((res) => expect(res).toBe("success"));
    },
  );
});
