import fs from "fs";
import { WarpFactory } from "warp-contracts";
import { EthersExtension } from "m3tering-ethers";
import { Ed25519Extension } from "m3tering-ed25519";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";

import initialState from "../initialState.json" assert { type: "json" };

const warp = WarpFactory.forMainnet()
  .use(new Ed25519Extension())
  .use(new EthersExtension())
  .use(new DeployPlugin());
const tags = [
  { name: "Contract-Label", value: "M3ters" },
  { name: "Contract-Use", value: "M3tering Protocol" },
];

async function deploy(tokenId) {
  try {
    initialState.token_id = tokenId;
    initialState.kwh_balance = 1e5;
    const contractDetails = await warp.deploy({
      wallet: new ArweaveSigner(await warp.arweave.wallets.generate()),
      src: fs.readFileSync("bundle/contract.js", "utf8"),
      initState: JSON.stringify(initialState),
      tags,
    });
    console.log(contractDetails);
  } catch (err) {
    console.log("deploy error: ", err);
  }
}

deploy(1);
