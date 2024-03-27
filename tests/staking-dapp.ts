import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { StakingDapp } from "../target/types/staking_dapp";
import { BN } from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
	createMint,
	getMint,
	getOrCreateAssociatedTokenAccount,
	mintTo,
	TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { NodeWallet } from '@project-serum/common';
import { getPoolInfoaddress, getUserInfoAddress } from "./utils";
import bs58 from 'bs58';

describe("Staking Dapp", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  //@ts-ignore
  const admin: NodeWallet = provider.wallet;

  const DECIMALS = 8;
  const program = anchor.workspace.StakingDapp as Program<StakingDapp>;
  
  let mint: PublicKey;
  let adminToken;
  let userToken;
  
  let user = anchor.web3.Keypair.generate();
  let userInfoAddress: anchor.web3.PublicKey;
  let poolInfoAddress: anchor.web3.PublicKey;
  console.log('user PublicKey: ', user.publicKey.toString());
  console.log('user PrivateKey: ', bs58.encode(user.secretKey));
  before(async () => {
      //mint
      // mint = new PublicKey('4YsMVphijua4DwbZs8JRdQ9PTCXJ8HbvX9HvaragVTg3');
      mint = await createMint(
        provider.connection,
        admin.payer,
        admin.publicKey,
        admin.publicKey,
        DECIMALS
      );
      // get admin associated token account
      userToken = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        admin.payer,
        mint,
        // new PublicKey("AjiVVStFHMdzbyc7wuPB6gkVgiKEPGsgbj4ehkJotyu4")
        user.publicKey
      );
      console.log('userToken Address', userToken.address.toString());
      adminToken = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        admin.payer,
        mint,
        admin.publicKey
      );
      //mint user
      await mintTo (
        provider.connection,
        admin.payer,
        mint,
        userToken.address,
        admin.publicKey,
        10 * anchor.web3.LAMPORTS_PER_SOL
      );
      userInfoAddress = await getUserInfoAddress(user.publicKey);
      poolInfoAddress = await getPoolInfoaddress(admin.publicKey);
      console.log('userInfoAddress', userInfoAddress.toString());
      console.log('poolInfoAddress', poolInfoAddress.toString());
  });
  //Test Initialized Function
  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize()
                .accounts({
                  admin: admin.publicKey,
                  stakingToken: mint,
                  // tokenProgram: TOKEN_PROGRAM_ID,
                  // systemProgram: anchor.web3.SystemProgram.programId
                })
                .rpc();
    const poolInfo = await program.account.poolInfo.fetch(poolInfoAddress);
    console.log('poolInfo', poolInfo);
    console.log("Your transaction signature", tx);
  });

  it("Staking function", async() => {
     const accounts = {
      user: user.publicKey,
      admin: admin.publicKey,
      userStakingWallet: userToken.address,
      adminStakingWallet: adminToken.address,
      stakingToken: mint
     }
  });
});
