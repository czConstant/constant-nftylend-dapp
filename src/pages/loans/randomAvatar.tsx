import random from "lodash/random";
import React from "react";
import Avatar from "src/common/components/avatar";
import { getImageThumb } from "src/modules/nftLend/api";
import { mediaTypes } from "src/modules/nftLend/components/itemNft";
import { LoanData } from "src/modules/nftLend/models/loan";

interface RandomAvatarProps {
  loans: LoanData[];
}

const RandomAvatar: React.FC<RandomAvatarProps> = ({ loans }) => {
  const randomIndex = random(0, loans.length - 1, false);

  const loanByIndex = loans[randomIndex];

  const media = loans
    ?.map((loan) => loan.asset.token_url)
    ?.filter((img: string) => !mediaTypes.video?.includes(img))
    ?.slice(0, 10)
    ?.map((img) => getImageThumb({ height: 120, width: 120, url: img }));

  return (
    <Avatar img={media[randomIndex]} name={loanByIndex?.asset?.collection?.name} />
  );
};

RandomAvatar.defaultProps = {
  loans: [],
};

export default RandomAvatar;
