import React, { memo } from "react";
import Wrapper from "../../components/wrapper";
import CreateAndSellInfo from "./CreateAndSellInfo";
import GetStarted from "./getStarted";

const MarketplaceHome = () => {
  return (
    <Wrapper>
      <GetStarted />
      <CreateAndSellInfo />
    </Wrapper>
  );
};

export default MarketplaceHome;
