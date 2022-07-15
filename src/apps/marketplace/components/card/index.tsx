import React, { memo } from "react";
import Card from "react-bootstrap/Card";

import styles from "./styles.module.scss";

interface MyCardItemProps {
  id: string;
  img: string;
  title: string;
  description: string;
}

interface MyCardProps {
  item: MyCardItemProps;
}

const MyCard: React.FC<MyCardProps> = (props) => {
  const { item } = props;

  return (
    <Card className={styles.container}>
      {item.img && <Card.Img src={item.img} />}
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
        <Card.Text>{item.description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default memo(MyCard);
