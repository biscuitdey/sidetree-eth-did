import * as crypto from "crypto";

export class Wallet {
  privKey!: Buffer;
  pubKey!: Buffer;

  async generateKey(): Promise<unknown> {
    const curv = crypto.createECDH("secp256k1");
    curv.generateKeys();

    //Generate private key
    this.privKey = curv.getPrivateKey();

    //Generate public key
    this.pubKey = curv.getPublicKey();

    this.storeKeys(this.privKey, this.pubKey);

    return {"publicKey" : this.pubKey} ;
  }

  //TODO
  private storeKeys(privKey: Buffer, pubKey: Buffer) {}

  //TODO
  private retrieveKeys() {
    return this.privKey;
  }

  async signMessage(msg: string): Promise<Buffer> {
    const privateKey = this.retrieveKeys();
    const sign = crypto.createSign("ES256K");
    sign.update(Buffer.from(msg)).end();

    const signature = sign.sign(privateKey);
    return signature;
  }

  async verifyMessage(msg: string, signature: Buffer, publicKey: Buffer): Promise<boolean> {
    const verify = crypto.createVerify("ES256K");
    verify.update(Buffer.from(msg)).end();
    return verify.verify(publicKey, signature);
  }
}
