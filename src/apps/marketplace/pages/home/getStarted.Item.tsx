import React, { memo } from "react";
import { Card } from "react-bootstrap";

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
        <div className={styles.titleWrap} >
          <Card.Title>{item.title}</Card.Title>
          <div className={styles.badgeNetwork}>{item.network.network}</div>
        </div>
        <div className={styles.contentWrap} >

        </div>
      </Card.Body>
    </Card>
  );
};

export default memo(GetStartedItem);
