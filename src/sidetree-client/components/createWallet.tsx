import { Wallet } from "../lib/keystore/wallet";
import React, { useState } from "react";


const wallet = new Wallet();
const publicKey = wallet.generateKey();

console.log(publicKey.toString("base64"))

function CreateWallet() {

	//use State returns an array with 2 elements -> the current state value and a function to update the current state.
	//If using object and need to update, get the old object elements using {...prevObject, update = old+1}
	const [pKey, getNewPKey] = useState(() => {
		const wallet = new Wallet();
		const publicKey = wallet.generateKey();
		
		return publicKey.toString("base64")	
	})

	function newPKey(){
		
		getNewPKey(() => {
			const newPublicKey = wallet.generateKey();	
			return newPublicKey.toString("base64")})

	}

	return(
		<>	
      		<h2>{pKey}</h2>
		<button onClick= {newPKey}>Create New Key</button>
		</>
	);
}

export default CreateWallet;


