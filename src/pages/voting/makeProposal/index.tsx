import BigNumber from "bignumber.js";
import cx from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { Field, Form } from "react-final-form";
import BodyContainer from "src/common/components/bodyContainer";
import BreadCrumb, { BreadCrumbItem } from "src/common/components/breadCrumb";
import ButtonConnectWallet from "src/common/components/buttonConnectWallet";
import FieldText from "src/common/components/form/fieldText";
import InputWrapper from "src/common/components/form/inputWrapper";
import Loading from "src/common/components/loading";
import { APP_URL } from "src/common/constants/url";
import { formatCurrencyByLocale } from "src/common/utils/format";
import { required } from "src/common/utils/formValidate";
import { getNftListCurrency } from "src/modules/nftLend/api";
import { useCurrentWallet } from "src/modules/nftLend/hooks/useCurrentWallet";
import { useToken } from "src/modules/nftLend/hooks/useToken";
import styles from "../styles.module.scss";
import VotingServices from "../Voting.Services";
import { CurrencyPWPTokenData, ProposalData } from "../Voting.Services.Data";

const VotingMakeProposal = () => {
  const defaultBreadCrumbs = useRef<BreadCrumbItem[]>([
    {
      label: "Discover",
      link: APP_URL.NFT_LENDING,
    },
    {
      label: "Voting",
      link: APP_URL.NFT_LENDING_VOTING,
    },
    {
      label: "Make a Proposal",
    },
  ]);

  const { currentWallet, isConnected, connectWallet } = useCurrentWallet();
  const [initValues, setInitValues] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [choices, setChoices] = useState<number>(2);
  const { getBalance } = useToken();
  const [balance, setBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<CurrencyPWPTokenData | null>(null);

  useEffect(() => {
    getData();
  }, [currentWallet]);

  const getData = async () => {
    try {
      Promise.all([fetchBalance()]);
    } catch (error) {}
  };

  const fetchBalance = async () => {
    const currencies = await VotingServices.getCurrenciesPWP();
    const balance = await getBalance(currencies.contract_address);
    setBalance(
      new BigNumber(balance).dividedBy(10 ** currencies.decimals).toNumber()
    );
    setCurrency(currencies);
  };

  const onSubmit = async (values: any) => {
    try {
      console.log("onSubmit");

      setLoading(true);
      const body: ProposalData = {};
      const response: any = await VotingServices.createProposal(body);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const onAddChoice = () => {
    setChoices((value) => value + 1);
  };

  return (
    <BodyContainer className={cx(isMobile && styles.mbWrapper, styles.wrapper)}>
      <BreadCrumb items={defaultBreadCrumbs.current} />
      <Form onSubmit={onSubmit} initialValues={initValues}>
        {({ values, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Row className={styles.formWrapper}>
              <Col>
                <InputWrapper label="Title" theme="dark">
                  <Field
                    name="title"
                    placeholder=""
                    children={FieldText}
                    validate={required}
                  />
                </InputWrapper>
                <InputWrapper label="Content" theme="dark">
                  <Field
                    name="content"
                    placeholder=""
                    children={FieldText}
                    validate={required}
                    rows={10}
                    inputType="textarea"
                  />
                </InputWrapper>
                <div className={styles.choiceWrapper}>
                  <div className={styles.choiceTitle}>
                    <h5>Choices</h5>
                  </div>
                  <div className={styles.choiceFormWrap}>
                    {Array(choices)
                      .fill(0)
                      .map((v, i) => (
                        <InputWrapper
                          key={i}
                          label={`Choice ${i + 1}`}
                          theme="dark"
                        >
                          <Field
                            name={`choice_${i + 1}`}
                            placeholder="Input choice text"
                            children={FieldText}
                            validate={required}
                          />
                        </InputWrapper>
                      ))}
                    <Button onClick={onAddChoice} className={styles.btnChoice}>
                      Add Choice
                    </Button>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className={styles.choiceWrapper}>
                  <div className={styles.choiceTitle}>
                    <h5>Actions</h5>
                  </div>
                  <div className={styles.choiceFormWrap}>
                    <InputWrapper label="Start Date" theme="dark">
                      <Field
                        name="start_date"
                        placeholder="YYYY/MM/DD"
                        children={FieldText}
                        validate={required}
                      />
                    </InputWrapper>
                    <InputWrapper label="End Date" theme="dark">
                      <Field
                        name="end_date"
                        placeholder="YYYY/MM/DD"
                        children={FieldText}
                        validate={required}
                      />
                    </InputWrapper>

                    {isConnected ? (
                      <Button
                        className={cx(
                          styles.btnMakeProposal,
                          styles.btnSubmitAProposal
                        )}
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? <Loading dark /> : "Publish"}
                      </Button>
                    ) : (
                      <ButtonConnectWallet
                        className={cx(
                          styles.btnMakeProposal,
                          styles.btnSubmitAProposal,
                          styles.btnConnect
                        )}
                      />
                    )}
                    <div className={styles.wrapBalance}>
                      {isConnected && (
                        <div>
                          My Balance:{" "}
                          <span>
                            {formatCurrencyByLocale(balance)} {currency?.symbol}
                          </span>
                        </div>
                      )}
                      <div>
                        You need at least{" "}
                        {formatCurrencyByLocale(currency?.proposal_threshold)}{" "}
                        {currency?.symbol} to publish a proposal.
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </form>
        )}
      </Form>
    </BodyContainer>
  );
};

export default VotingMakeProposal;
