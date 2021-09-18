import { Wallet } from "../lib/keystore/wallet";
import { publicKeyToJWK, canonicalizeJWK, convertToHashAndEncode } from "../lib/index";


export class SidetreeApp {

	public createWallet(): Buffer {
		const wallet = new Wallet();
		const publicKey = wallet.generateKey();

		console.log(publicKey.toString("base64"))

		return publicKey;
	}

	public async generateCommitment() {
		const publicKey = this.createWallet();
		const publicKeyJWK = await publicKeyToJWK(publicKey)
		const canonicalizedPublicKeyJWK = canonicalizeJWK(publicKeyJWK)
		const revealValue = await convertToHashAndEncode(canonicalizedPublicKeyJWK)
		const publicKeyCommitment = await convertToHashAndEncode(revealValue);
		return publicKeyCommitment;	
		
	}

}

export default SidetreeApp;


