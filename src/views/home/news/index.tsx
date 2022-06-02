import SectionContainer from 'src/common/components/sectionContainer';

import styles from './news.module.scss';

const News = () => {
  const data = [
    {
      category: 'community',
      title: 'Avalanche Coin (AVAX): Crypto\' New Speed King',
      image: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeice5iu2tk6b4xfwjglbvzz5pl6x4eh7o6zjelwj7u24afcdduscyi.ipfs.dweb.link/887.png?ext=png',
      date: 'May 20, 2022',
      author: 'George Schooling'
    },
    {
      category: 'community',
      title: 'Avalanche Coin (AVAX): Crypto\' New Speed King',
      image: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeiguvhsni5fcxjnkb6ax34twzgpesgmr2n2ve77r5v4njws5ojk4cm.ipfs.dweb.link/1289.png?ext=png',
      date: 'May 20, 2022',
      author: 'George Schooling'
    },
    {
      category: 'community',
      title: 'Avalanche Coin (AVAX): Crypto\' New Speed King',
      image: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/Zv36HBXp7lbcdc70IyAKBOt-fqHISBOb3xUYdgZB1nI?ext=png',
      date: 'May 20, 2022',
      author: 'George Schooling'
    },
  ]

  return (
    <SectionContainer className={styles.wrapper}>
      <h2>News</h2>
      <div className={styles.list}>
        {data.map(e => {
          return (
            <div className={styles.item}>
              <img alt="" src={e.image} />
              <div className={styles.category}>{e.category}</div>
              <div className={styles.title}>{e.title}</div>
              <div className={styles.author}>
                <img src="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/cgmeNshUCObmdkE56XTAt8YesQvd_SJ4teZ10QHQgVs" />
                <span>{e.date} - {e.author}</span>
              </div>
            </div>
          )
        })}
      </div>
    </SectionContainer>
  )
};

export default News;