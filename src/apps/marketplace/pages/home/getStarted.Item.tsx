import { Button } from "@chakra-ui/react";
import React, { memo } from "react";
import { Card } from "react-bootstrap";
import CountdownTimmer from "../../components/countdown";

import { ItemNFTModel } from "../../models/itemNFT";
import styles from "./styles.module.scss";

interface GetStartedItemProps {
  item: ItemNFTModel;
}

const GetStartedItem: React.FC<GetStartedItemProps> = (props) => {
  const { item } = props;

  return (
    <Card className={styles.cardContainer}>
      <Card.Header>
        <Card.Img src={item.img} />
      </Card.Header>
      <Card.Body>
        <div className={styles.titleWrap}>
          <Card.Title>{item.title}</Card.Title>
          <div className={styles.badgeNetwork}>{item.network.network}</div>
        </div>
        <div className={styles.contentWrap}>
          <CountdownTimmer date={item.duration} />
          <div className={styles.bidWrap}>
            <div>Current Bid</div>
            <div>
              {item.bid_price} {item.network.symbol}
            </div>
          </div>
        </div>
      </Card.Body>
      <Button>Bid</Button>
    </Card>
  );
};

export default memo(GetStartedItem);
