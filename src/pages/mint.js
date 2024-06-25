import { useWallet } from "@suiet/wallet-kit";
import { TransactionBlock } from '@mysten/sui.js/transactions';
function createMintNftTxnBlock() {
  // define a programmable transaction block
  const txb = new TransactionBlock();

  // note that this is a devnet contract address
  const contractAddress =
    "0xe146dbd6d33d7227700328a9421c58ed34546f998acdc42a1d05b4818b49faa2";
  const contractModule = "nft";
  const contractMethod = "mint";

  const nftName = "Suiet NFT";
  const nftDescription = "Hello, Suiet NFT";
  const nftImgUrl =
    "https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4";

  txb.moveCall({
    target: `${contractAddress}::${contractModule}::${contractMethod}`,
    arguments: [
      txb.pure(nftName),
      txb.pure(nftDescription),
      txb.pure(nftImgUrl),
    ],
  });

  return txb;
}

export default function App() {
    const wallet = useWallet();
  
    async function mintNft() {
      if (!wallet.connected) return;
  
      const txb = createMintNftTxnBlock();
      try {
        // call the wallet to sign and execute the transaction
        const res = await wallet.signAndExecuteTransactionBlock({
          transactionBlock: txb,
        });
        console.log("nft minted successfully!", res);
        alert("Congrats! your nft is minted!");
      } catch (e) {
        alert("Oops, nft minting failed");
        console.error("nft mint failed", e);
      }
    }
  
    return (
      <div className="App">
        {/* ... */}
        {wallet.status === "connected" && (
          <button onClick={mintNft}>Mint Your NFT !</button>
        )}
        {/* ... */}
      </div>
    );
  }
  