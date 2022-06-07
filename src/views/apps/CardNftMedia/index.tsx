import React, { useRef } from 'react';
import last from 'lodash/last';
import cx from 'classnames';

import Loading from 'src/common/components/loading';
import { getImageThumb } from "src/modules/nftLend/utils";

import styles from './styles.module.scss';

export const mediaTypes = {
  video: ['mov', 'mp4', 'video'],
  image: ['jpg', 'png', 'gif', 'jpeg', 'image'],
};

interface CardNftMediaProps {
  config?: any;
  className?: string;
  name?: string;
  width?: number;
  height?: number;
  showOriginal?: boolean;
  detail?: any;
  loading?: boolean;
}

const CardNftMedia = (props: CardNftMediaProps) => {
  const {
    config,
    className,
    name,
    width = 300,
    height = 300,
    showOriginal = false,
    detail,
    loading,
  } = props;

  const refVideo = useRef();

  const isVideo = () => {
    if (detail?.mime_type?.includes('video')) return true;
    if (detail?.image) {
      const mediaType = last(String(detail?.image as string)?.split('.')) || '';
      if (mediaTypes.video.includes(mediaType)) return true;
    }
    return false;
  }

  const getFileExtension = (): string => {
    let mediaType = '';
    if (detail?.image) {
      mediaType = last(String(detail?.image as string)?.split('.')) || '';
      if (mediaTypes.image.includes(mediaType)) return mediaType;
      if (mediaTypes.video.includes(mediaType)) return mediaType;
    }
  
    mediaType = detail?.properties?.files?.length > 0
      ? detail?.properties?.files[0]?.type
      : '';
    return last(mediaType.split('/')) || '';
  };
  
  const renderMedia = () => {
    // if (!mediaType) return null;
    let media = null;
    const extension = getFileExtension()
    if (isVideo()) {
      media = (
        <video
          muted
          ref={refVideo}
          loop
          disablePictureInPicture
          playsInline
          controls
          // autoPlay
          // onMouseEnter={() => refVideo.current?.play()}
          // onMouseLeave={() => refVideo.current?.pause()}
          {...config?.video}
        >
          <source src={detail?.image} type={detail?.mime_type || `video/${extension}`} />
        </video>
      );
    } else {
      media = <img src={getImageThumb({ width, height, url: detail?.image, showOriginal })} alt={name} />
    }

    return (
      <div className={cx(styles.cardNftMedia, className)}>{media}</div>
    );
  };

  if (loading) {
    return (
      <div className={cx(styles.cardNftMedia, className)}>
        <Loading />
      </div>
    );
  }
  return renderMedia();
};

export default CardNftMedia;