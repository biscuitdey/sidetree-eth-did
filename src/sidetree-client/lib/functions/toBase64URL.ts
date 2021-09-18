import base64url from "base64url";

export function encodeToBase64URL(input: Uint8Array) {
  return base64url.encode(Buffer.from(input), "utf8");
}

export function decodeFromBase64URL(input: string) {
  return base64url.decode(input);
}
