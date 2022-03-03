import React, { memo, useEffect, useRef, useState, useMemo } from 'react';
import axios from 'axios';
import last from 'lodash/last';
import cx from 'classnames';

import Loading from 'src/common/components/loading';

import styles from './styles.module.scss';
import { getImageThumb } from '../../api';

export const mediaTypes = {
  video: ['mov', 'mp4', 'video'],
  img: ['jpg', 'png', 'gif', 'jpeg', 'image'],
};

interface ItemNftMediaProps {
  tokenUrl?: string;
  config?: any;
  className?: string;
  name?: string;
  isFetchUrl?: boolean;
  width?: number;
  height?: number;
  showOriginal?: boolean;
}

const ItemNftMedia = (props: ItemNftMediaProps) => {
  const {
    tokenUrl = '',
    config,
    className,
    name,
    isFetchUrl,
    width = 300,
    height = 300,
    showOriginal = false
  } = props;

  const refVideo = useRef();
  
  const [detail, setDetail] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(tokenUrl);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isFetchUrl) fetchDetail();
  }, [isFetchUrl]);

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(tokenUrl);
      if (res.status === 200) {
        setMediaUrl(res.data?.image);
        setDetail(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderMedia = (mediaType?: string) => {
    if (!mediaType) return null;
    let media = null;
    if (mediaTypes.video.includes(mediaType)) {
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
          <source src={mediaUrl} type={`video/${mediaType}`} />
        </video>
      );
    } else {
      media = <img src={getImageThumb({ width, height, url: mediaUrl, showOriginal })} alt={name} />
    }

    return (
      <div className={cx(styles.itemMedia, className)}>{media}</div>
    );
  };

  if (!isFetchUrl) {
    const mediaType = last(last(mediaUrl)?.split('.'));
    return renderMedia(mediaType);
  }
  if (isLoading) {
    return (
      <div className={cx(styles.itemMedia, className)}>
        <Loading />
      </div>
    );
  }

  const mediaType = detail?.properties?.files?.length > 0
    ? detail?.properties?.files[0]?.type
    : '';

  return renderMedia(last(mediaType.split('/')));
};

export default ItemNftMedia;