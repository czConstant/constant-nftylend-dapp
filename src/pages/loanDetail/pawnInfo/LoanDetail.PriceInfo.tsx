import BigNumber from "bignumber.js";
import React from "react";

import icPriceTag from "../images/ic_price_tag.svg";
import LoanDetailButtons from "./LoanDetail.Buttons";
import { OfferData } from 'src/modules/nftLend/models/api';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { isSameAddress } from 'src/common/utils/helper';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { LOAN_DURATION } from 'src/modules/nftLend/constant';
import { formatCurrencyByLocale } from "src/common/utils/format";

import pawnStyles from './pawnInfo.module.scss';
import styles from "../styles.module.scss";
import CountdownText from 'src/common/components/countdownText';

export interface LoanDetailProps {
  loan: LoanNft;
}

interface LoanDetailPriceInfoProps extends LoanDetailProps {}

const LoanDetailPriceInfo: React.FC<LoanDetailPriceInfoProps> = ({ loan }) => {
  const { currentWallet } = useCurrentWallet();
  const userOffer: OfferData = loan.offers?.find(
    (v) =>
      isSameAddress(v.lender?.toString(), currentWallet.address) &&
      v.status === "new"
  );

  const loanDuration = LOAN_DURATION.find(e => e.id === loan.duration / 86400);
  const offerDuration = LOAN_DURATION.find(e => e.id === userOffer?.duration / 86400);

  return (
    <div className={styles.infoPrice}>
      <div className={pawnStyles.head}> 
        <div>
          <div className={styles.infoPriceTags}>
            <label>Principal</label>
            <img src={icPriceTag} alt="item price" />
          </div>
          <div className={styles.infoPriceValue}>
            <div>{`${formatCurrencyByLocale(
              loan.principal_amount,
              2
            )} ${loan.currency?.symbol}`}</div>
          </div>
        </div>
        <div className={pawnStyles.configs}>
          <label>Negotiation</label>
          <ul> 
            <li className={loan.isAllowChange('principal_amount') ? pawnStyles.allow : pawnStyles.notallow }>Principal</li>
            <li className={loan.isAllowChange('duration') ? pawnStyles.allow : pawnStyles.notallow }>Duration</li>
            <li className={loan.isAllowChange('interest_rate') ? pawnStyles.allow : pawnStyles.notallow }>Interest rate</li>
          </ul>
        </div>
      </div>
      <LoanDetailButtons loan={loan} userOffer={userOffer} />
      <div className={styles.feeInfoWrap}>
        <div>
          <div className={styles.feeInfoTitle}>Interest rate</div>
          <div className={styles.feeInfoValue}>
            {new BigNumber(loan.interest_rate)
              .multipliedBy(100)
              .toNumber()}
            %
          </div>
        </div>
        <div>
          <div className={styles.feeInfoTitle}>Terms</div>
          <div className={styles.feeInfoValue}>
            {loanDuration ? loanDuration.label : `${Math.ceil(new BigNumber(loan.duration).dividedBy(86400).toNumber())} days`}
          </div>
        </div>
        {userOffer && (
          <>
            <div>
              <div
                className={styles.feeInfoTitle}
                style={{ color: "green", opacity: 0.8 }}
              >
                My Principal
              </div>
              <div
                className={styles.feeInfoValue}
                style={{ color: "green", fontWeight: "bold" }}
              >
                {userOffer?.principal_amount} {loan.currency?.symbol}
              </div>
            </div>
            <div>
              <div
                className={styles.feeInfoTitle}
                style={{ color: "green", opacity: 0.8 }}
              >
                My Interest rate
              </div>
              <div
                className={styles.feeInfoValue}
                style={{ color: "green", fontWeight: "bold" }}
              >
                {new BigNumber(userOffer?.interest_rate)
                  .multipliedBy(100)
                  .toNumber()}
                %
              </div>
            </div>
            <div>
              <div
                className={styles.feeInfoTitle}
                style={{ color: "green", opacity: 0.8 }}
              >
                My Terms
              </div>
              <div
                className={styles.feeInfoValue}
                style={{ color: "green", fontWeight: "bold" }}
              >
                {offerDuration ? offerDuration.label : `${Math.ceil(new BigNumber(userOffer.duration).dividedBy(86400).toNumber())} days`}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoanDetailPriceInfo;
