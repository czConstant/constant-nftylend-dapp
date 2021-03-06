import moment from "moment-timezone";
import { useEffect, useState } from "react";
import SectionContainer from "src/common/components/sectionContainer";
import { getNews } from "src/modules/nftLend/api";

import styles from "./news.module.scss";

const News = () => {
  const data = [
    {
      category: "community",
      title: "Avalanche Coin (AVAX): Crypto' New Speed King",
      image:
        "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeice5iu2tk6b4xfwjglbvzz5pl6x4eh7o6zjelwj7u24afcdduscyi.ipfs.dweb.link/887.png?ext=png",
      date: "May 20, 2022",
      author: "George Schooling",
    },
    {
      category: "community",
      title: "Avalanche Coin (AVAX): Crypto' New Speed King",
      image:
        "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeiguvhsni5fcxjnkb6ax34twzgpesgmr2n2ve77r5v4njws5ojk4cm.ipfs.dweb.link/1289.png?ext=png",
      date: "May 20, 2022",
      author: "George Schooling",
    },
    {
      category: "community",
      title: "Avalanche Coin (AVAX): Crypto' New Speed King",
      image:
        "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/Zv36HBXp7lbcdc70IyAKBOt-fqHISBOb3xUYdgZB1nI?ext=png",
      date: "May 20, 2022",
      author: "George Schooling",
    },
  ];

  const [news, setNews] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response: any = await getNews();
      console.log("response", response);

      setNews(response);
    } catch (error) {}
  };

  return (
    <SectionContainer className={styles.wrapper}>
      <h2>News</h2>
      <div className={styles.list}>
        {news.map((e) => {
          const authInfo = e.yoast_head_json?.schema?.["@graph"]?.find(
            (v) => v?.["@type"] === "Person"
          );
          return (
            <div key={e.id} className={styles.item}>
              <a href={e.link} target="_blank">
                <img alt="" src={e.yoast_head_json?.og_image?.[0]?.url} />
                {/* <div className={styles.category}>{e.category}</div> */}
                <div className={styles.title}>{e.title.rendered}</div>
                <div className={styles.author}>
                  <img src={authInfo?.image?.url} />
                  <span>
                    {moment(e.yoast_head_json?.article_published_time).format(
                      "DD-MMM, yyyy"
                    )}{" "}
                    | {authInfo?.name}
                  </span>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
};

export default News;
