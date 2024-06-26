import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { StakingDapp } from "../target/types/staking_dapp";
import { BN } from 'bn.js';
import { PublicKey, Transaction, Connection, Keypair, Account} from '@solana/web3.js';
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
export const signAndSendTx = async (
  connection: Connection,
  tx: Transaction,
  wallet: NodeWallet,
) => {
  tx.recentBlockhash = (
      await connection.getLatestBlockhash("singleGossip")
  ).blockhash

  tx.feePayer = wallet.publicKey;
  const signedTx = await wallet.signTransaction(tx)
  const rawTransaction = signedTx.serialize()
  const txSig = await connection.sendRawTransaction(rawTransaction);

  return txSig
}
describe("Staking Dapp", () => {
  function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
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
      mint = new PublicKey('4YsMVphijua4DwbZs8JRdQ9PTCXJ8HbvX9HvaragVTg3');
      // mint = await createMint(
      //   provider.connection,
      //   admin.payer,
      //   admin.publicKey,
      //   admin.publicKey,
      //   DECIMALS
      // );
      // get admin associated token account
      // userToken = await getOrCreateAssociatedTokenAccount(
      //   provider.connection,
      //   admin.payer,
      //   mint,
      //   // new PublicKey("AjiVVStFHMdzbyc7wuPB6gkVgiKEPGsgbj4ehkJotyu4")
      //   user.publicKey
      // );
      // console.log('userToken Address', userToken.address.toString());
      // adminToken = await getOrCreateAssociatedTokenAccount(
      //   provider.connection,
      //   admin.payer,
      //   mint,
      //   admin.publicKey
      // );
      //mint user
      // await mintTo (
      //   provider.connection,
      //   admin.payer,
      //   mint,
      //   userToken.address,
      //   admin.publicKey,
      //   10 * anchor.web3.LAMPORTS_PER_SOL
      // );
      userInfoAddress = await getUserInfoAddress(user.publicKey);
      poolInfoAddress = await getPoolInfoaddress(admin.publicKey);
      console.log('userInfoAddress', userInfoAddress.toString());
      console.log('poolInfoAddress', poolInfoAddress.toString());
  });
  //Test Initialized Function
  it("Is initialized!", async () => {
    // Add your test here.
    let admin_pair = Keypair.fromSecretKey(bs58.decode('4pGt9eeDwjAiSHwHhKfbu9nCn5EBjJUTtSBSqT7kSmYxr8nHRtSFr9uNHq9prpToYHKuAZqSDjqL8KQd2r9pBEu8'))
    console.log('admin', admin.publicKey);
    const ix = await program.methods.initialize()
                .accounts({
                  poolInfo: poolInfoAddress,
                  admin: admin.publicKey,
                })
                .signers([])
                .instruction();
    const tx = new Transaction();
    tx.add(ix);
    const txSig = await signAndSendTx(provider.connection, tx, admin)
    console.log("Your transaction signature", ix)
    const poolInfo = await program.account.poolInfo.fetch(poolInfoAddress)
    console.log('poolInfo', poolInfo);
  });

  // it("Staking function", async () => {
  //    const accounts = {
  //     user: user.publicKey,
  //     admin: admin.publicKey,
  //     userStakingWallet: userToken.address,
  //     adminStakingWallet: adminToken.address,
  //     stakingToken: mint
  //    }
  //    const tx = await program.methods
  //    .stake(
  //     new BN(10 * anchor.web3.LAMPORTS_PER_SOL),
  //     new BN(15),
  //    )
  //    .accounts(accounts)
  //    .signers([user, admin.payer])
  //    .rpc();
  //    console.log('transaction', tx);
  //    const userInfo = await program.account.userInfo.fetch(userInfoAddress);
  //    console.log('userInfo', userInfo);
  //    const poolInfo = await program.account.poolInfo.fetch(poolInfoAddress);
  //    console.log('poolInfo', poolInfo);
  // });

  // it('Clamin Reward', async () => {
  //   await sleep(20000);
  //   const accounts = {
  //     user: user.publicKey,
  //     admin: admin.publicKey,
  //     userStakingWallet: userToken.address,
  //     adminStakingWallet: adminToken.address,
  //     stakingToken: mint,
  //   }
  //   const tx = await program.methods
  //             .claimReward()
  //             .accounts(accounts)
  //             .signers([user, admin.payer])
  //             .rpc();
  //   console.log('transaction:', tx);
  //   const userInfo = await program.account.userInfo.fetch(userInfoAddress);
  //   console.log('userInfo', userInfo);
  //   const poolInfo = await program.account.poolInfo.fetch(poolInfoAddress);
  //   console.log('poolInfo', poolInfo);
  // });

  // it('Unstaking Function', async () => {
  //   const accounts = {
  //     user: user.publicKey,
  //     admin: admin.publicKey,
  //     userStakingWallet: userToken.address,
  //     adminStakingWallet: adminToken.address,
  //     stakingToken: mint,
  //   }
  //   const tx = await program.methods
  //             .unstake(new BN(10 * anchor.web3.LAMPORTS_PER_SOL))
  //             .accounts(accounts)
  //             .signers([user, admin.payer])
  //             .rpc();
  //   console.log('transaction:', tx);
  //   const userInfo = await program.account.userInfo.fetch(userInfoAddress);
  //   console.log('userInfo', userInfo);
  //   const poolInfo = await program.account.poolInfo.fetch(poolInfoAddress);
  //   console.log('poolInfo', poolInfo);
  // });
});
