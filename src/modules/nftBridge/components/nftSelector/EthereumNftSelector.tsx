import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import Selector, { NftItem, OnSelectNft } from './selector';

interface EthereumNftSelectorProps {
  onSelectNft: OnSelectNft;
  className?: string;
}

const EthereumNftSelector = (props: EthereumNftSelectorProps) => {
  const { className, onSelectNft } = props;
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey } = wallet;

  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([] as Array<NftItem>);

  useEffect(() => {
    if (publicKey) fetchNFTs();
  }, [publicKey]);

  const fetchNFTs = async () => {
    if (!publicKey) return;
    try {
      const nfts = await getParsedNftAccountsByOwner({ publicAddress: publicKey.toString(), connection });
      const _nfts: Array<NftItem> = nfts.map((nft) => ({
        id: nft.mint,
        name: nft.data.name,
      }));
      setAssets(_nfts);
    } catch (e) {
      console.log('🚀 ~ file: index.js ~ line 32 ~ fetchNFTs ~ e', e);
    } finally {
      setLoading(false);
    }
  };

  return <Selector className={className} assets={assets} onSelectNft={onSelectNft} />
};

export default EthereumNftSelector;
