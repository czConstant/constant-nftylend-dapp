import React, { memo, useEffect, useRef, useState, useMemo } from 'react';
import axios from 'axios';
import last from 'lodash/last';
import cx from 'classnames';

import Loading from 'src/common/components/loading';

import styles from './styles.module.scss';
import { getImageThumb } from '../../api';

export const mediaTypes = {
  video: ['mov', 'mp4', 'video'],
  image: ['jpg', 'png', 'gif', 'jpeg', 'image'],
};

interface ItemNftMediaProps {
  config?: any;
  className?: string;
  name?: string;
  width?: number;
  height?: number;
  showOriginal?: boolean;
  detail?: any;
  loading: boolean;
}

const ItemNftMedia = (props: ItemNftMediaProps) => {
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

  const getMediaType = () => {
    let mediaType = '';
    if (detail?.image) {
      mediaType = last(last(detail?.image as string)?.split('.')) || '';
      if (mediaTypes.image.includes(mediaType)) return mediaType;
    }
  
    mediaType = detail?.properties?.files?.length > 0
      ? detail?.properties?.files[0]?.type
      : '';
    return last(mediaType.split('/'));
  };
  
  const renderMedia = (mediaType?: string) => {
    // if (!mediaType) return null;
    let media = null;
    if (mediaTypes.video.includes(mediaType || '')) {
      media = (
        <video
          muted
          ref={refVideo}
          loop
          disablePictureInPicture
          playsInline
          onMouseEnter={() => refVideo.current?.play()}
          onMouseLeave={() => refVideo.current?.pause()}
          {...config?.video}
        >
          <source src={detail?.image} type={`video/${mediaType}`} />
        </video>
      );
    } else {
      media = <img src={getImageThumb({ width, height, url: detail?.image, showOriginal })} alt={name} />
    }

    return (
      <div className={cx(styles.itemMedia, className)}>{media}</div>
    );
  };

  if (loading) {
    return (
      <div className={cx(styles.itemMedia, className)}>
        <Loading />
      </div>
    );
  }
  return renderMedia(getMediaType());
};

export default ItemNftMedia;