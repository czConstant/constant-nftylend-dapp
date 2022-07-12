import React, { useRef, useState } from 'react';
import last from 'lodash/last';
import cx from 'classnames';
import { Box, Center, Icon } from '@chakra-ui/react';
import { FiAlertTriangle } from 'react-icons/fi';

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

  const [srcLoading, setSrcLoading] = useState(true)
  const [srcRetry, setSrcRetry] = useState(3)
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
          <source
            src={detail?.image}
            type={detail?.mime_type || `video/${extension}`}
            onLoad={() => setSrcLoading(false)}
            onError={() => srcRetry > 0 && setSrcRetry(srcRetry-1)}
          />
        </video>
      );
    } else {
      media = (
        srcRetry && <img
          src={`${getImageThumb({ width, height, url: detail?.image, showOriginal })}?retry=${srcRetry}`}
          alt={name}
          onLoad={() => setSrcLoading(false)}
          onError={() => srcRetry > 0 && setSrcRetry(srcRetry-1)}
        />
      )
    }

    return media
  };

  return (
    <Box position='relative' minW={width} minH={height} className={cx(styles.cardNftMedia, className)}>
      {loading
        ? <Loading />
        : (<>
            {srcLoading && (
              <Center position='absolute' w='100%' h='100%'>
              {srcRetry === 0 ? <Icon color='text.secondary' fontSize='4xl' as={FiAlertTriangle} /> : <Loading />}
              </Center>
            )}
          {renderMedia()}
        </>)
      }
    </Box>
  )
};

export default CardNftMedia;