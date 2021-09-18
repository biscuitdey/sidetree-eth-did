import { canonicalize } from "json-canonicalize";

export function canonicalizeJWK(jwkToBeCanonicalized: any) {
  return canonicalize(jwkToBeCanonicalized);
}
