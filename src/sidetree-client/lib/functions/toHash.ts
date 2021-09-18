import { sha256 } from "multiformats/hashes/sha2-browser";

export async function convertToHash(input: string) {
  const hash = await sha256.digest(convertToUInt(input));
  return hash;
}

function convertToUInt(input: string) {
  const encoder = new TextEncoder();
  return encoder.encode(input);
}
