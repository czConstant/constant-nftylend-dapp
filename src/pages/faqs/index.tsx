import React from "react";
import { isMobile } from "react-device-detect";
import cx from "classnames";

import styles from "./styles.module.scss";
import BodyContainer from "src/common/components/bodyContainer";
import SectionCollapse from "src/common/components/sectionCollapse";
import { DISCORD_URL } from 'src/common/constants/url';

const FAQs = () => {
  return (
    <BodyContainer
      className={cx(
        isMobile && styles.mbWrapper,
        styles.wrapper,
        styles.wrapper
      )}
    >
      <div>
        <h3>FAQ</h3>
        <SectionCollapse
          label="What is NFT Pawn?"
          content={
            <span>
              <b>NFT Pawn</b> is an autonomous P2P lending marketplace powered
              by smart contracts. Whether you want to invest or borrow, you
              choose to fulfill an existing order on the marketplace or
              negotiate your rate and term. Our smart contracts handle the rest,
              power the entire transaction from beginning to end, minimize
              errors, faster transactional speed, and reduce the need for
              institutional trust.
            </span>
          }
        />
        <SectionCollapse
          label="Do I need an account to use the application?"
          content={
            <span>
              No, you don’t need an account to use the application. NFT Pawn is
              a decentralized application (Dapp) and what you need is a Solana
              wallet to start to use.
            </span>
          }
        />
        <SectionCollapse
          label="What are the supported projects/ blockchain?"
          content={
            <span>
              NFT Pawn was built on the Solana blockchain and we support the
              top NFT collections in the market. Detail:
              <a
                target={"_blank"}
                href="https://docs.nftpawn.financial/overview/assetment-list-nft-collections-supported"
              >
                https://docs.nftpawn.financial/overview/assetment-list-nft-collections-supported
              </a>
            </span>
          }
        />
        <SectionCollapse
          label="What are the supported wallets?"
          content={
            <span>
              Initially, we’re supporting 4 Solana wallets: Solflare, Sollet,
              Phantom, Coin98. The list of supported wallets will increase in
              the future.
            </span>
          }
        />
        <SectionCollapse
          label="What are the fees for using NFT Pawn?"
          content={
            <div>
              There are three fees you’ll need to look out for:
              <ul>
                <li>
                  Transaction fee: This fee is charged by the Solana blockchain
                  to verify transactions. More details:
                  <a
                    target={"_blank"}
                    href="https://docs.solana.com/transaction_fees"
                  >
                    https://docs.solana.com/transaction_fees
                  </a>
                </li>
                <li>
                  Data fee: This fee is charged by the Solana blockchain to
                  store smart contracts. More details:
                  <a
                    target={"_blank"}
                    href="https://docs.solana.com/storage_rent_economics"
                  >
                    https://docs.solana.com/storage_rent_economics
                  </a>
                </li>
                <li>
                  Platform fee: This fee is charged by the Pawn Protocol, it’s
                  applied to the borrower when repaying the loans. More details:
                  ​​
                  <a
                    target={"_blank"}
                    href="https://docs.nftpawn.financial/overview/how-nfty-lend-work"
                  >
                    https://docs.nftpawn.financial/overview/how-nfty-lend-work
                  </a>
                </li>
              </ul>
            </div>
          }
        />
        <h4>For Borrowers</h4>
        <SectionCollapse
          label="How can I use my NFTs as collateral for a loan?"
          content={
            <div>
              <p>
                To start a new loan order, the borrower needs to have the NFT
                which is included in the NFT collection supported by our Dapp:
                <a
                  target={"_blank"}
                  href="https://docs.nftpawn.financial/overview/assetment-list-nft-collections-supported"
                >
                  https://docs.nftpawn.financial/overview/assetment-list-nft-collections-supported
                </a>
              </p>
              <p>
                Then the borrower can create the new loan order on these NFTs.
                More instructions for the borrower would be updated here:
                <a
                  target={"_blank"}
                  href="https://docs.nftpawn.financial/feature-instructions/borrowing"
                >
                  https://docs.nftpawn.financial/feature-instructions/borrowing
                </a>
              </p>
            </div>
          }
        />
        <SectionCollapse
          label="Can I use NFT Pawn to sell my NFTs?"
          content={
            "Yes. MyConstant team has plans to create the Sale Contract which have allow users to sell their NFTs easily."
          }
        />
        <SectionCollapse
          label="How can I repay the loan and get back my NFTs?"
          content={
            <span>
              You can follow the instructions for the borrower here:
              <a
                target={"_blank"}
                href="https://docs.nftpawn.financial/feature-instructions/borrowing"
              >
                https://docs.nftpawn.financial/feature-instructions/borrowing
              </a>
            </span>
          }
        />
        <SectionCollapse
          label="What happens if I cannot repay the loan?"
          content={
            "When the borrower cannot repay the loan then the loan order is defaulted and cannot be repaid later. At this time, the NFT asset would be pending to the lender to call for liquidation."
          }
        />
        <SectionCollapse
          label="What are the fees for Borrowers?"
          content={
            <div>
              There are three fees you’ll need to look out for:
              <ul>
                <li>
                  Transaction fee: This fee is charged by the Solana blockchain
                  to verify transactions. More details:
                  <a
                    target={"_blank"}
                    href="https://docs.solana.com/transaction_fees"
                  >
                    https://docs.solana.com/transaction_fees
                  </a>
                </li>
                <li>
                  Data fee: This fee is charged by the Solana blockchain to
                  store smart contracts. More details:
                  <a
                    target={"_blank"}
                    href="https://docs.solana.com/storage_rent_economics"
                  >
                    https://docs.solana.com/storage_rent_economics
                  </a>
                </li>
                <li>
                  Platform fee: This fee is charged by the Pawn Protocol, it’s
                  applied to the borrower when repaying the loans. More details:
                  ​​
                  <a
                    target={"_blank"}
                    href="https://docs.nftpawn.financial/overview/how-nfty-lend-work"
                  >
                    https://docs.nftpawn.financial/overview/how-nfty-lend-work
                  </a>
                </li>
              </ul>
            </div>
          }
        />
        <h4>For Lenders</h4>
        <SectionCollapse
          label="What happens if I accept the loan offer from borrowers?"
          content={
            <div>
              <p>
                Once the lender hits `Order now` or the borrower accept the
                offer from the lender, Pawn Protocol would run a smart contract
                to process as the next step. This time:
              </p>
              <ul>
                <li>
                  The borrower would receive principal and their NFT would be
                  locked on the smart contract.
                </li>
                <li>
                  The lender would pending for the smart contract to run and
                  earn passive income (interest)
                </li>
              </ul>
            </div>
          }
        />
        <SectionCollapse
          label="What are the fees for Lenders?"
          content={
            <div>
              <p>There are two fees you’ll need to look out for:</p>
              <ul>
                <li>
                  Transaction fee: This fee is charged by the Solana blockchain
                  to verify transactions. More details:{" "}
                  <a
                    href="https://docs.solana.com/transaction_fees"
                    target={"_blank"}
                  >
                    https://docs.solana.com/transaction_fees
                  </a>
                </li>
                <li>
                  Data fee: This fee is charged by the Solana blockchain to
                  store smart contracts. More details:
                  <a
                    href="https://docs.solana.com/storage_rent_economics"
                    target={"_blank"}
                  >
                    https://docs.solana.com/storage_rent_economics
                  </a>
                </li>
              </ul>
            </div>
          }
        />
        <SectionCollapse
          label="Is it safe to lend my crypto on the NFT Pawn platform?"
          content={
            <div>
              <p>
                Using NFTy involves certain risks. To mitigate those risks, we
                have plans to involve the top auditor to audit our code, either
                in partnership with the Bug Bounty community. Please find out
                more info here: (
                <a
                  href="https://docs.nftpawn.financial/resource/audit"
                  target={"_blank"}
                >
                  https://docs.nftpawn.financial/resource/audit
                </a>
                ).
              </p>
              <p>
                As a user of our protocol, you are in agreement that you are
                aware of these risks, and that all liability resides with you.
                So please don’t invest your life savings or risk assets you
                can’t afford to lose. Try to be as careful with your funds as we
                are with our code.
              </p>
            </div>
          }
        />
        <SectionCollapse
          label="How can I contact support?"
          content={
            <div>
              <p>There are the social channels for contact</p>
              <ul>
                <li>
                  Facebook:{" "}
                  <a
                    href="https://www.facebook.com/myconstantp2p"
                    target={"_blank"}
                  >
                    https://www.facebook.com/myconstantp2p
                  </a>
                </li>
                <li>
                  Discord:{" "}
                  <a
                    href={DISCORD_URL}
                    target={"_blank"}
                  >
                    {DISCORD_URL}
                  </a>
                </li>
                <li>
                  Livechat:{" "}
                  <a
                    href="https://www.myconstant.com/live-chat"
                    target={"_blank"}
                  >
                    https://www.myconstant.com/live-chat
                  </a>
                </li>
                <li>
                  Twitter:{" "}
                  <a href="https://twitter.com/myconstantp2p" target={"_blank"}>
                    https://twitter.com/myconstantp2p
                  </a>
                </li>
                <li>
                  Mail:{" "}
                  <a href="mailto:hello@nftpawn.financial" target={"_blank"}>
                    hello@nftpawn.financial
                  </a>
                </li>
              </ul>
            </div>
          }
        />
      </div>
    </BodyContainer>
  );
};

export default FAQs;
