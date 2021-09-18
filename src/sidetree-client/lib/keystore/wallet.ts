//const crypto =  require("crypto-browserify");
import * as crypto from "crypto";
import { indexedDatabase } from "./storage";


export class Wallet {
  privKey!: Buffer;
  pubKey!: Buffer;

  generateKey(): Buffer {
    const curv = crypto.createECDH("secp256k1");
    curv.generateKeys();

    //Generate private key
    this.privKey = curv.getPrivateKey();

    //Generate public key
    this.pubKey = curv.getPublicKey();

    this.storeKeys(this.privKey, this.pubKey);

    return this.pubKey;
  }

  private async storeKeys(privKey: Buffer, pubKey: Buffer) {

    //Create a CryptoKey and store it in IndexedDB
    var encryptionKey = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      false,
      ["encrypt", "decrypt"]
    );

    //Create the iv for encryption
    var iv = await window.crypto.getRandomValues(new Uint8Array(12));

    //Store values in the IndexedDB
    await indexedDatabase.openDB();
    await indexedDatabase.set("encryptionKey", encryptionKey);
    await indexedDatabase.set("iv", iv);

    //Encrypt given keys with the CryptoKey
    var userKeyObject = {
      privateKey: privKey,
      publicKey: pubKey
    }

    var userKeysJsonString = JSON.stringify(userKeyObject);

    var encryptedKeys = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      encryptionKey,
      Buffer.from(userKeysJsonString)
    )
    
    //Store encrypted keys in the indexedDB
    await indexedDatabase.set("encryptedKeys", encryptedKeys);
    
    await this.retrieveKeys();
  }

  private async retrieveKeys(): Promise<Buffer> {

   var encryptionKey = await indexedDatabase.get("encryptionKey");
   var iv = await indexedDatabase.get("iv");
   var encryptedKeys = await indexedDatabase.get("encryptedKeys");

   var userKeysJsonString = await window.crypto.subtle.decrypt(
     {
       name: "AES-GCM",
       iv: <Uint8Array> iv.keyValue,
     },
     <CryptoKey> encryptionKey.keyValue,
     <Buffer> encryptedKeys.keyValue
   );

   var userKeysObject = JSON.parse(Buffer.from(userKeysJsonString).toString());

   //console.log(Buffer.from(userKeysObject.privateKey).toString("base64"));
    return <Buffer> userKeysObject.privateKey;
  }

  async signMessage(msg: string): Promise<Buffer> {
    const privateKey = await this.retrieveKeys();
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
