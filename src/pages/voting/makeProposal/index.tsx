import BigNumber from "bignumber.js";
import cx from "classnames";
import { clone, filter, map, mapKeys } from "lodash";
import moment from "moment-timezone";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { Field, Form } from "react-final-form";
import BodyContainer from "src/common/components/bodyContainer";
import BreadCrumb, { BreadCrumbItem } from "src/common/components/breadCrumb";
import ButtonConnectWallet from "src/common/components/buttonConnectWallet";
import FieldDateTimePicker from "src/common/components/form/fieldDateTimePicker";
import FieldText from "src/common/components/form/fieldText";
import InputWrapper from "src/common/components/form/inputWrapper";
import Loading from "src/common/components/loading";
import { APP_URL } from "src/common/constants/url";
import { formatCurrencyByLocale } from "src/common/utils/format";
import { composeValidators, required } from "src/common/utils/formValidate";
import { nearSignText } from "src/modules/near/utils";
import { useCurrentWallet } from "src/modules/nftLend/hooks/useCurrentWallet";
import { useToken } from "src/modules/nftLend/hooks/useToken";
import styles from "../styles.module.scss";
import VotingServices from "../Voting.Services";
import {
  CurrencyPWPTokenData,
  ProposalData,
  ProposalMessageData,
} from "../Voting.Services.Data";
import { toastError, toastSuccess } from "src/common/services/toaster";
import icClose from "../images/ic_close.svg";

const minDateCurrent = (value: any) => {
  if (moment(value).isSameOrBefore(moment.now())) {
    return `This is time invalid. Time should be AFTER ${moment().format(
      "yyyy/MM/DD HH:mm A"
    )}`;
  }
  return undefined;
};

const validateStartDate = (value, values) => {
  const end = values?.end;
  if (end && moment(value).isSameOrAfter(end)) {
    return `This is time invalid. Time should be BEFORE ${moment(end).format(
      "yyyy/MM/DD HH:mm A"
    )}`;
  }
  return undefined;
};

const validateEndDate = (value, values) => {
  const start = values?.start;
  if (start && moment(value).isSameOrBefore(start)) {
    return `This is time invalid. Time should be BEFORE ${moment(start).format(
      "yyyy/MM/DD HH:mm A"
    )}`;
  }
  return undefined;
};

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

  const defaultChoices = [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ];

  const { currentWallet, isConnected, connectWallet } = useCurrentWallet();
  const [initValues, setInitValues] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [choices, setChoices] = useState<any[]>(defaultChoices);
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
      setLoading(true);
      const choices = filter(Object.keys(values), (v) =>
        v?.includes("choice_")
      ).map((v) => values?.[v]);

      const dataMessage: ProposalMessageData = {
        timestamp: moment().unix(),
        type: "proposal",
        payload: {
          name: values.name,
          body: values.body,
          snapshot: moment().unix(),
          start: moment(values?.start).unix(),
          end: moment(values?.end).unix(),
          choices,
          metadata: {
            network: currency?.network?.toString(),
            token: {
              symbol: currency?.symbol,
              address: currency?.contract_address?.toString(),
              decimals: currency?.decimals,
            },
          },
          type: "single-choice",
        },
      };
      const dataMessageString = JSON.stringify(dataMessage);
      const signature: string = await nearSignText(
        currentWallet?.address,
        dataMessageString
      );
      const body: ProposalData = {
        message: dataMessageString,
        signature,
        network: currency?.network?.toString(),
        address: currentWallet.address?.toString(),
      };
      await VotingServices.createProposal(body);
      toastSuccess("Proposal created successfully");
      // setTimeout(() => {
      //   window.location.reload();
      // }, 800);
    } catch (error) {
      toastError(error?.message || err);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const onAddChoice = () => {
    setChoices((value) => [
      ...value,
      {
        id: value.length + 1,
      },
    ]);
  };

  const onRemoveChoose = (i: any) => {
    setChoices((value: any[]) => value.filter((v) => v.id !== i.id));
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
                    name="name"
                    placeholder=""
                    children={FieldText}
                    validate={required}
                  />
                </InputWrapper>
                <InputWrapper label="Content" theme="dark">
                  <Field
                    name="body"
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
                    {choices.map((v, i) => (
                      <InputWrapper
                        key={i}
                        label={`Choice ${v.id}`}
                        theme="dark"
                      >
                        <Field
                          name={`choice_${v.id}`}
                          placeholder="Input choice text"
                          children={FieldText}
                          validate={required}
                        />
                        {i > 1 && (
                          <Button
                            onClick={() => onRemoveChoose(v)}
                            className={styles.btnRemoveChoose}
                          >
                            <img src={icClose} />
                          </Button>
                        )}
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
                        name="start"
                        placeholder="YYYY/MM/DD HH:mm"
                        children={FieldDateTimePicker}
                        validate={composeValidators(
                          required,
                          minDateCurrent,
                          validateStartDate
                        )}
                        showTimeInput={true}
                        minDate={moment.now()}
                      />
                    </InputWrapper>
                    <InputWrapper label="End Date" theme="dark">
                      <Field
                        name="end"
                        placeholder="YYYY/MM/DD HH:mm"
                        children={FieldDateTimePicker}
                        validate={composeValidators(
                          required,
                          minDateCurrent,
                          validateEndDate
                        )}
                        showTimeInput={true}
                        minDate={moment.now()}
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
