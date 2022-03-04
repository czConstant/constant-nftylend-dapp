import React, { useRef } from "react";
import last from 'lodash/last';
import random from 'lodash/random';

import Avatar from "src/common/components/avatar";
import { getImageThumb } from "src/modules/nftLend/api";
import { mediaTypes } from "src/modules/nftLend/components/itemNft";

interface RandomAvatarProps {
  images: {
    asset: {
      token_url: string;
    };
  }[];
}

const RandomAvatar: React.FC<RandomAvatarProps> = ({ images }) => {
  const imgs = useRef(
    images
      ?.map((img) => img?.asset?.token_url)
      ?.filter((img: string) => !mediaTypes.video.includes(last(img)))
      ?.slice(0, 10)
      ?.map((img) => getImageThumb({ height: 120, width: 120, url: img }))
  );

  return (
    <Avatar img={imgs.current[random(0, imgs.current.length - 1, false)]} />
  );
};

RandomAvatar.defaultProps = {
  images: [],
};

export default RandomAvatar;
