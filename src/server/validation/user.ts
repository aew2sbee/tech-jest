import { UserSchema } from "../schema/user";

/**
 * ユーザーデータを検証する関数
 * @param userData 検証するユーザーデータ
 * @returns 検証結果 (成功またはエラー)
 */
export function isValidateUser(userData: unknown): boolean {
  const result = UserSchema.safeParse(userData);

  if (!result.success) {
    console.error("バリデーションエラー:", result.error.format());
    return false;
  }

  return result.success;
}
