/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import { Wallet } from "../../services/wallet/wallet.service";

/**
 * Router Definition
 */
export const walletRouter = express.Router();

/**
 * Controller Definitions
 */

//Create wallet - POST
walletRouter.post("/", async(req: Request, res: Response) => {
	try{
		const wallet = new Wallet();
		const publicKey = await wallet.generateKey();
		res.status(200).json(publicKey);
	}catch (e) {
		res.status(500).send(e.message);
	}
})

//Sign Messages - POST (message)


//Verify Messages - GET