import * as calc from "../../src/server/lib/calc";
import User from "../../src/server/api/axios"; // Import User from axios.ts

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

// "../../src/server/api/axios"モジュール全体をモックする
// searchUserがUserクラスのstaticメソッドなので、そのようにモックする
jest.mock("../../src/server/api/axios", () => ({
  __esModule: true, // ESモジュールとして扱うことを示す
  default: {
    searchUser: jest.fn(() =>
      Promise.resolve({
        id: 1,
        name: "Mock User",
      }),
    ), // searchUserをモックし、解決済みのPromiseを返す
  },
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

describe("内部モジュールのモック化", () => {
  test("isEvenがモックされていることを確認する", () => {
    // モックされたisEvenは、入力が99の場合のみtrueを返す
    expect(calc.isEven(99)).toBe(true);
    expect(calc.isEven(2)).toBe(false);
    expect(calc.isEven).toHaveBeenCalledTimes(2);
  });
});

/**
 * 【学習用】モック実装方法の使い分けについて
 *
 * jest.fn().mockImplementation() と jest.fn().mockImplementationOnce() は、
 * どちらもモック関数の振る舞いを定義するために使用しますが、その用途には違いがあります。
 *
 * 1. 基本的なモック (jest.fn().mockImplementation() または jest.fn(() => ...))
 *    - 役割: 関数が呼ばれたときに、常に同じ動作をします。
 *    - いつ使うか: テストの中で、その関数の返り値が常に同じで良い場合に最適です。
 *                 例えば、「ユーザー情報を取得する」というテストでは、何回呼ばれても
 *                 同じユーザー情報が返ってくれば十分なことが多いです。
 *    - 利点: コードがシンプルで、関数の動作が一定であるため理解しやすいです。
 *
 * 2. mockImplementationOnce()
 *    - 役割: 呼び出されるたびに異なる動作をさせることができます。
 *            .mockImplementationOnce()で設定した動作は1回きりで、次の呼び出しでは
 *            その次の.mockImplementationOnce()の動作に移ります。
 *            全てのOnceが消費された後は、設定されたmockImplementationやデフォルトの
 *            jest.fn()の動作（undefinedを返す）にフォールバックします。
 *    - いつ使うか:
 *      - APIの再試行（リトライ）ロジックをテストするとき（1回目は失敗、2回目は成功など）。
 *      - ループの中で同じ関数を呼び出し、毎回違う結果を処理するコードをテストするとき。
 *    - 利点: より複雑で、実際のアプリケーションで起こりうるようなシナリオ（例：ネットワークの
 *            一時的なエラーからの復旧）をテストできます。
 *
 * 結論:
 * 今回のように「searchUserをモック化する」という単純な目的であれば、常に同じ値を返す
 * 基本的なモック実装の方がシンプルで分かりやすく、より適切です。
 * 「初回は失敗し、2回目のリトライで成功する」といった複雑なシナリオをテストしたい場合に、
 * mockImplementationOnceが強力なツールになります。
 */

describe("外部モジュール（axios.ts）のモック化", () => {
  // 各テストの前にモックの履歴をリセットする
  // これにより、各テストが他のテストの影響を受けないようにする
  beforeEach(() => {
    (User.searchUser as jest.Mock).mockClear();
    (calc.isEven as jest.Mock).mockClear();
  });

  test("searchUserがモックされていることを確認する", async () => {
    // jest.mockで定義したデフォルトのモック実装が使われる
    // searchUserを呼び出す
    const user = await User.searchUser();

    // モックされた値が返されることを確認
    expect(user).toEqual({ id: 1, name: "Mock User" });
    // searchUserが1回呼び出されたことを確認
    expect(User.searchUser).toHaveBeenCalledTimes(1);
  });

  test("mockImplementationOnceを使って、初回失敗・2回目成功のシナリオをテストする", async () => {
    // searchUserのモックをこのテストケース用に上書き
    (User.searchUser as jest.Mock)
      .mockImplementationOnce(() => Promise.reject(new Error("API Error")))
      .mockImplementationOnce(() =>
        Promise.resolve({ id: 2, name: "Retry User" }),
      );

    // 1回目の呼び出し（失敗することを期待）
    await expect(User.searchUser()).rejects.toThrow("API Error");

    // 2回目の呼び出し（成功することを期待）
    const user = await User.searchUser();
    expect(user).toEqual({ id: 2, name: "Retry User" });

    // 合計で2回呼び出されたことを確認
    expect(User.searchUser).toHaveBeenCalledTimes(2);
  });
});

// jest.spyOn のサンプルテストコード

// jest.mock と jest.spyOn は異なる目的で使用されます。
// jest.mock はモジュール全体または一部を置き換える（モックする）のに対し、
// jest.spyOn は既存のオブジェクトのメソッドを監視し、その呼び出しを追跡したり、
// 一時的に実装を変更したりします。jest.spyOn は元の実装を保持するため、
// 部分的なモック（partial mock）に適しています。
// 以下のテストでは、jest.mock の影響を受けないように、
// jest.requireActual を使って実際の User クラスをインポートし、
// それに対して jest.spyOn を適用しています。
// このため、User と ActualUserClass は異なる参照を持ちます。

import { default as ActualUserClass } from "../../src/server/api/axios";

describe("jest.spyOn の使用例 (実際のメソッドに対して)", () => {
  let userSearchSpy: jest.SpyInstance;

  beforeEach(() => {
    // 他のテストによる呼び出し履歴をクリアする
    (ActualUserClass.searchUser as jest.Mock).mockClear();

    // ActualUserClassの静的メソッドsearchUserをスパイ
    // これにより、実際のメソッドの呼び出しを監視し、必要に応じて一時的に振る舞いを変更できる
    userSearchSpy = jest.spyOn(ActualUserClass, "searchUser");

    // 初期モック実装を設定（通常のsearchUserの振る舞いを模倣）
    userSearchSpy.mockResolvedValue({ id: 200, name: "Spied User" });
  });

  afterEach(() => {
    // 各テストの後にスパイを復元する
    // これにより、他のテストに影響を与えず、元の実装に戻る
    userSearchSpy.mockRestore();
  });

  test("searchUserが呼び出されたことを監視できる", async () => {
    // 実際のsearchUserを呼び出す
    const user = await ActualUserClass.searchUser();

    // スパイが1回呼び出されたことを確認
    expect(userSearchSpy).toHaveBeenCalledTimes(1);
    expect(userSearchSpy).toHaveBeenCalledWith(); // 引数なしで呼ばれたことを確認

    // モックされた値が返されることを確認
    expect(user).toEqual({ id: 200, name: "Spied User" });
  });

  test("searchUserの特定の呼び出しで異なる結果を返すことができる", async () => {
    // 一度だけ異なる結果を返すように設定
    userSearchSpy.mockResolvedValueOnce({
      id: 201,
      name: "One-time Spied User",
    });

    // 1回目の呼び出し
    const user1 = await ActualUserClass.searchUser();
    expect(user1).toEqual({ id: 201, name: "One-time Spied User" });
    expect(userSearchSpy).toHaveBeenCalledTimes(1);

    // 2回目の呼び出し（mockResolvedValueOnceが消費されたので、デフォルトのモック実装に戻る）
    const user2 = await ActualUserClass.searchUser();
    expect(user2).toEqual({ id: 200, name: "Spied User" });
    expect(userSearchSpy).toHaveBeenCalledTimes(2);
  });
});
