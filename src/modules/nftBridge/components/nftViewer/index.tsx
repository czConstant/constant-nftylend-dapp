import axios from 'axios';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Tooltip } from 'react-bootstrap';
import cx from 'classnames';

import {
  ChainId,
  CHAIN_ID_AVAX,
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
  CHAIN_ID_ETHEREUM_ROPSTEN,
  CHAIN_ID_POLYGON,
  CHAIN_ID_SOLANA,
  CHAIN_ID_OASIS,
} from '../../utils/wormhole_esm';
import avaxIcon from '../../icons/avax.svg';
import bscIcon from '../../icons/bsc.svg';
import ethIcon from '../../icons/eth.svg';
import solanaIcon from '../../icons/solana.svg';
import polygonIcon from '../../icons/polygon.svg';
import oasisIcon from '../../icons/oasis-network-rose-logo.svg';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import Wormhole from '../../icons/wormhole-network.svg';
import { NFTParsedTokenAccount } from '../../store/nftSlice';
import styles from './nftViewer.module.scss';

const safeIPFS = (uri: string) =>
  uri.startsWith('ipfs://ipfs/')
    ? uri.replace('ipfs://', 'https://ipfs.io/')
    : uri.startsWith('ipfs://')
    ? uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    : uri.startsWith('https://cloudflare-ipfs.com/ipfs/') // no CORS support?
    ? uri.replace('https://cloudflare-ipfs.com/ipfs/', 'https://ipfs.io/ipfs/')
    : uri;

const LogoIcon = ({ chainId }: { chainId: ChainId }) =>
  chainId === CHAIN_ID_SOLANA ? (
    <img
      style={{
        backgroundColor: 'black',
        height: '1em',
        width: '1em',
        marginLeft: '4px',
        padding: '4px',
      }}
      src={solanaIcon}
      alt='Solana'
    />
  ) : chainId === CHAIN_ID_ETH || chainId === CHAIN_ID_ETHEREUM_ROPSTEN ? (
    <img
      style={{
        backgroundColor: 'white',
        height: '1em',
        width: '1em',
        marginLeft: '4px',
      }}
      src={ethIcon}
      alt='Ethereum'
    />
  ) : chainId === CHAIN_ID_BSC ? (
    <img
      style={{
        backgroundColor: 'rgb(20, 21, 26)',
        height: '1em',
        width: '1em',
        marginLeft: '4px',
        padding: '2px',
      }}
      src={bscIcon}
      alt='Binance Smart Chain'
    />
  ) : chainId === CHAIN_ID_POLYGON ? (
    <img
      style={{
        backgroundColor: 'black',
        height: '1em',
        width: '1em',
        marginLeft: '4px',
        padding: '3px',
      }}
      src={polygonIcon}
      alt='Polygon'
    />
  ) : chainId === CHAIN_ID_AVAX ? (
    <img
      style={{
        backgroundColor: 'black',
        height: '1em',
        width: '1em',
        marginLeft: '4px',
        padding: '3px',
      }}
      src={avaxIcon}
      alt='Avalanche'
    />
  ) : chainId === CHAIN_ID_OASIS ? (
    <img
      style={{
        backgroundColor: 'black',
        height: '1em',
        width: '1em',
        marginLeft: '4px',
        padding: '3px',
      }}
      src={oasisIcon}
      alt='Oasis'
    />
  ) : null;


const ViewerLoader = () => {
  return (
    <div className={styles.wormholePositioner}>
      {/* <Skeleton variant='rect' animation='wave' className={styles.skeleton} /> */}
      <img src={Wormhole} alt='Wormhole' className={styles.wormholeIcon} />
    </div>
  );
};

interface NftViewerProps {
  value: NFTParsedTokenAccount,
  chainId: ChainId;
}

export default function NFTViewer(props: NftViewerProps) {
  const { value, chainId } = props;

  const uri = safeIPFS(value.uri || '');
  const [metadata, setMetadata] = useState({
    uri,
    image: value.image,
    animation_url: value.animation_url,
    nftName: value.nftName,
    description: value.description,
    isLoading: !!uri,
  });
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const onLoad = useCallback(() => {
    setIsMediaLoading(false);
  }, []);
  const isLoading = isMediaLoading || metadata.isLoading;
  useEffect(() => {
    setMetadata((m) =>
      m.uri === uri
        ? m
        : {
            uri,
            image: value.image,
            animation_url: value.animation_url,
            nftName: value.nftName,
            description: value.description,
            isLoading: !!uri,
          }
    );
  }, [value, uri]);
  useEffect(() => {
    if (uri) {
      let cancelled = false;
      (async () => {
        try {
          const result = await axios.get(uri);
          if (!cancelled && result && result.data) {
            // support returns with nested data (e.g. {status: 10000, result: {data: {...}}})
            const data = result.data.result?.data || result.data;
            setMetadata({
              uri,
              image:
                data.image ||
                data.image_url ||
                data.big_image ||
                data.small_image,
              animation_url: data.animation_url,
              nftName: data.name,
              description: data.description,
              isLoading: false,
            });
          } else if (!cancelled) {
            setMetadata((m) => ({ ...m, isLoading: false }));
          }
        } catch (e) {
          if (!cancelled) {
            setMetadata((m) => ({ ...m, isLoading: false }));
          }
        }
      })();
      return () => {
        cancelled = true;
      };
    }
  }, [uri]);

  const animLower = metadata.animation_url?.toLowerCase();
  // const has3DModel = animLower?.endsWith('gltf') || animLower?.endsWith('glb')
  const hasVideo =
    !animLower?.startsWith('ipfs://') && // cloudflare ipfs doesn't support streaming video
    (animLower?.endsWith('webm') ||
      animLower?.endsWith('mp4') ||
      animLower?.endsWith('mov') ||
      animLower?.endsWith('m4v') ||
      animLower?.endsWith('ogv') ||
      animLower?.endsWith('ogg'));
  const hasAudio =
    animLower?.endsWith('mp3') ||
    animLower?.endsWith('flac') ||
    animLower?.endsWith('wav') ||
    animLower?.endsWith('oga');
  const hasImage = metadata.image;
  const copyTokenId = useCopyToClipboard(value.tokenId || '');
  const videoSrc = hasVideo && safeIPFS(metadata.animation_url || '');
  const imageSrc = hasImage && safeIPFS(metadata.image || '');
  const audioSrc = hasAudio && safeIPFS(metadata.animation_url || '');

  //set loading when the media src changes
  useLayoutEffect(() => {
    if (videoSrc || imageSrc || audioSrc) {
      setIsMediaLoading(true);
    } else {
      setIsMediaLoading(false);
    }
  }, [videoSrc, imageSrc, audioSrc]);

  const image = (
    <img
      src={imageSrc}
      alt={metadata.nftName || ''}
      style={{ maxWidth: '100%' }}
      onLoad={onLoad}
      onError={onLoad}
    />
  );
  const media = (
    <>
      {hasVideo ? (
        <video
          autoPlay
          controls
          loop
          style={{ maxWidth: '100%' }}
          onLoadedData={onLoad}
          onError={onLoad}
        >
          <source src={videoSrc || ''} />
          {image}
        </video>
      ) : hasImage ? (
        image
      ) : null}
      {hasAudio ? (
        <audio
          controls
          src={audioSrc || ''}
          onLoadedData={onLoad}
          onError={onLoad}
        />
      ) : null}
    </>
  );

  return (
    <>
      <div className={!isLoading ? styles.hidden : ''}>
        <ViewerLoader />
      </div>
      <div
        className={cx(styles.card, {
          [styles.silverBorder]:
            chainId === CHAIN_ID_SOLANA ||
            chainId === CHAIN_ID_POLYGON ||
            chainId === CHAIN_ID_AVAX,
          [styles.hidden]: isLoading,
        })}
      >
        <div className={styles.textContent}>
          {metadata.nftName ? (
            <div className={styles.title}>
              {metadata.nftName}
            </div>
          ) : (
            <div className={styles.title} />
          )}
          <div className={styles.address}>value - Chain {chainId}</div>
          <LogoIcon chainId={chainId} />
        </div>
        <div
          className={cx(styles.mediaContent, {
            [styles.silverMediaBorder]:
              chainId === CHAIN_ID_SOLANA ||
              chainId === CHAIN_ID_POLYGON ||
              chainId === CHAIN_ID_OASIS ||
              chainId === CHAIN_ID_AVAX,
          })}
        >
          {media}
        </div>
        <div className={styles.detailsContent}>
          {metadata.description ? (
            <div className={styles.description}>
              {metadata.description}
            </div>
          ) : null}
          {value.tokenId ? (
            <div className={styles.tokenId}>
              <Tooltip title='Copy'>
                <span onClick={copyTokenId}>
                  {value.tokenId.length > 18
                    ? `#${value.tokenId.substr(0, 16)}...`
                    : `#${value.tokenId}`}
                </span>
              </Tooltip>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
