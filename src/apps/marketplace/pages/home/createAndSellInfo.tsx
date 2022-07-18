import React, { memo } from "react";
import { Card } from "react-bootstrap";

import styles from "./styles.module.scss";
import icShop from "../../assets/images/ic_shop.svg";
import icSetupWallet from "../../assets/images/ic_setup_wallet.svg";
import icAddNft from "../../assets/images/add_nft.svg";
import { Box, Stack } from "@chakra-ui/react";

interface CardInfoProps {
  item: any;
}

const CardInfo: React.FC<CardInfoProps> = ({ item }) => {
  return (
    <Card className={item?.link && styles.hasLink}>
      <Card.Body>
        <div className={"card-img-wrap"}>
          <Card.Img src={item.icon} />
        </div>
        <Card.Title>{item.title}</Card.Title>
        <Card.Text>{item.desc}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const rows = [
  {
    icon: icSetupWallet,
    title: "Set up your wallet",
    desc: "Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right corner.",
  },
  {
    icon: icAddNft,
    title: "Add your NFTs",
    desc: "Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right corner.",
    link: "/",
  },
  {
    icon: icShop,
    title: "List them for sale",
    desc: "Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right corner.",
  },
];

const CreateAndSellInfo = () => {
  return (
    <div className={styles.createASellContainer}>
      <h3>Create and sell your NFTs</h3>
      <div className={styles.createASellContent}>
        <Stack spacing={10} direction="row">
          {rows.map((row) => (
            <Box key={row.title}>
              <CardInfo item={row} />
            </Box>
          ))}
        </Stack>
      </div>
    </div>
  );
};

export default memo(CreateAndSellInfo);
