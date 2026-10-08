import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export function newPharmaKey(): string {
  return randomBytes(32).toString("base64");
}

export function encryptText(plain: string, keyB64: string): string {
  const key = keyBytes(keyB64);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), enc.toString("base64")].join(".");
}

export function decryptText(payload: string, keyB64: string): string {
  const [ivB, tagB, dataB] = payload.split(".");
  if (!ivB || !tagB || !dataB) throw new Error("저장된 비밀번호 형식이 아닙니다.");
  const decipher = createDecipheriv("aes-256-gcm", keyBytes(keyB64), Buffer.from(ivB, "base64"));
  decipher.setAuthTag(Buffer.from(tagB, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(dataB, "base64")), decipher.final()]).toString("utf8");
}

function keyBytes(keyB64: string): Buffer {
  const key = Buffer.from(keyB64, "base64");
  if (key.length !== 32) throw new Error("비밀번호 키가 올바르지 않습니다.");
  return key;
}
