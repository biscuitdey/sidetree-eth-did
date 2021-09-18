import { convertToHash } from "./toHash";
import { encodeToBase64URL } from "./toBase64URL";

export async function convertToHashAndEncode(input: string) {
  const hashedInput = await convertToHash(input);
  const encodedInput = encodeToBase64URL(hashedInput.digest);
  return encodedInput;
}
