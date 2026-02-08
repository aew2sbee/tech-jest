import { z } from "zod";
// ユーザーオブジェクトのスキーマを定義します
// これにより、userオブジェクトがどのような形状で、各プロパティがどのような型を持つべきかを宣言します
export const UserSchema = z.object({
  id: z
    .string()
    .uuid("無効なIDフォーマットです。UUID形式である必要があります。"), // UUID形式の文字列
  name: z
    .string()
    .min(3, "名前は3文字以上である必要があります。")
    .max(50, "名前は50文字以下である必要があります。"), // 3文字以上50文字以下の文字列
  email: z.string().email("無効なメールアドレス形式です。"), // メールアドレス形式の文字列
  age: z
    .number()
    .int("年齢は整数である必要があります。")
    .positive("年齢は正の数である必要があります。")
    .min(18, "18歳以上である必要があります。"), // 18以上の正の整数
  gender: z.enum(["male", "female", "other"]).optional(), // 'male', 'female', 'other'のいずれかの文字列（オプション）
  createdAt: z.date().default(() => new Date()), // Dateオブジェクト、デフォルト値は現在時刻
});

/**
 * 検証済みのユーザーデータの型
 */
export type User = z.infer<typeof UserSchema>;
