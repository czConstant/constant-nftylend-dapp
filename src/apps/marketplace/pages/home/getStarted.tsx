import { memo, useState } from "react";

import { Box, Button, Stack } from "@chakra-ui/react";
import moment from "moment-timezone";
import Oranament from "../../components/oranament";
import { ItemNFTModel } from "../../models/itemNFT";
import GetStartedItem from "./getStarted.Item";
import styles from "./styles.module.scss";

const mockItems: ItemNFTModel[] = [
  {
    id: "1",
    title: "Panda NFT is the primier marketplace #324",
    img: "https://lh3.googleusercontent.com/5c_cM539smY1RHLmVXoLSYwXN1WYGO3ng6f4aiHxsnBMzd_9RLpb4uabYclRV9BCUyBVzIDo6foehMxXEc2Jy1deDwdQONsCWLFkRw=w600",
    network: {
      symbol: "ETH",
      network: "ETH",
    },
    bid_price: "4.89",
    duration: "2022-09-13T02:41:43Z",
    description:
      "Panda NFT is the primier marketplace for NFT, which are digital items you can truly own. Digital items have existed for a long time, but never like this.",
  },
  {
    id: "2",
    title: "Panda NFT is the primier marketplace #324",
    img: "https://lh3.googleusercontent.com/zPYIYQJhVrk63xjXbpUvk_6cfcPpWdxsMTCXpNuolKKzhbn1Cp7invLU9NKOjc7rUX-BlhrcsYkOcVn_V2I4N4z7sDbnAaGpjfrR_Wg=w600",
    network: {
      symbol: "ETH",
      network: "ETH",
    },
    bid_price: "4.89",
    duration: "2022-09-13T02:41:43Z",
    description:
      "Panda NFT is the primier marketplace for NFT, which are digital items you can truly own. Digital items have existed for a long time, but never like this.",
  },
];

const GetStarted = () => {
  const [items, setItems] = useState<ItemNFTModel[]>(mockItems);

  return (
    <div className={styles.getStartedConatainer}>
      <Oranament />
      <Stack className={styles.getStartedContent} spacing={8} direction="row">
        <Box>
          <div>
            <h2>Discover a New Era of Crypto Currency</h2>
            <p>
              Panda NFT is the primier marketplace for NFT, which are digital
              items you can truly own. Digital items have existed for a long
              time, but never like this.
            </p>
          </div>
          <Button>Get Started</Button>
        </Box>
        <Box className={styles.getStartedItems}>
          {items.map((item) => (
            <GetStartedItem key={item.id} item={item} />
          ))}
        </Box>
      </Stack>
    </div>
  );
};

export default memo(GetStarted);
