import * as anchor from '@project-serum/anchor';
import { PublicKey } from "@solana/web3.js"
import { StakingDapp } from "../target/types/staking_dapp";
import { Program, web3 } from '@project-serum/anchor';
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
const program = anchor.workspace.StakingDapp as Program<StakingDapp>;

export const getPoolInfoaddress = async (
    adminPubKey: web3.PublicKey
) => {
    const [poolInfoAddress, bump] = PublicKey.findProgramAddressSync(
        [
            anchor.utils.bytes.utf8.encode('pool'),
            adminPubKey.toBuffer()
        ],
        program.programId
    );
    return poolInfoAddress;
}

export const getUserInfoAddress = async (
    userPubKey: web3.PublicKey
) => {
    const [userInfoAddress, bump] = PublicKey.findProgramAddressSync(
        [
            anchor.utils.bytes.utf8.encode('user'),
            userPubKey.toBuffer(),
        ],
        program.programId,
    );
    return userInfoAddress;
}