import { fromKeyLike } from "jose/jwk/from_key_like";

export async function publicKeyToJWK(publicKey: Uint8Array) {
  return await fromKeyLike(publicKey);
}
