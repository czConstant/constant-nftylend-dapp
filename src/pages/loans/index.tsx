import { useEffect, useState } from "react";
import BodyContainer from "src/common/components/bodyContainer";
import { getLoanByCollection } from "src/modules/nftLend/api";
import { ListResponse } from "src/modules/nftLend/models/api";
import { LoanData } from "src/modules/nftLend/models/loan";
import LoansHeader from "./Loans.Header";
import styles from "./styles.module.scss";



const Loans = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [resLoans, resSetLoans] = useState<LoanData[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response: ListResponse = await getLoanByCollection();
      const result: LoanData[] = response.result;
      resSetLoans(result);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <BodyContainer className={styles.wrapper}>
      <LoansHeader />
      {/* <OnBoardingHeader />
      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          {collections.map((collection, index) => (
            <Item
              key={collection?.id || index}
              item={collection}
              loading={loading}
              onPressItem={() =>
                navigate(
                  `${APP_URL.NFT_LENDING_LIST_LOAN}?collection=${collection?.seo_url}`
                )
              }
            />
          ))}
        </div>
      </div> */}
    </BodyContainer>
  );
};

export default Loans;
