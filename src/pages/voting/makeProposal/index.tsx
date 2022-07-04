import BigNumber from "bignumber.js";
import cx from "classnames";
import filter from "lodash/filter";
import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
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
import { formatCurrency } from "src/common/utils/format";
import { composeValidators, required } from "src/common/utils/formValidate";
import { nearSignText } from "src/modules/near/utils";
import { useCurrentWallet } from "src/modules/nftLend/hooks/useCurrentWallet";
import { useToken } from "src/modules/nftLend/hooks/useToken";
import styles from "../styles.module.scss";
import VotingServices from "../Voting.Services";
import {
  CurrencyPWPTokenData,
  ProposalData,
  ProposalListItemData,
  ProposalMessageData,
  ProposalTypeData,
  ProposalTypes,
} from "../Voting.Services.Data";
import { toastError, toastSuccess } from "src/common/services/toaster";
import icClose from "../images/ic_close.svg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserPwpBalance } from "src/modules/nftLend/api";

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
      link: APP_URL.DISCOVER,
    },
    {
      label: "Voting",
      link: APP_URL.VOTING,
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

  const navigate = useNavigate();

  const configs = useSelector((state) => state?.nftyLend?.configs);
  const proposalTypes: ProposalTypeData[] = configs?.proposals || [];
  const defaultType: ProposalTypeData = proposalTypes.find((v) => v.active);

  const { currentWallet, isConnected, connectWallet } = useCurrentWallet();
  const [initValues, setInitValues] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [choices, setChoices] = useState<any[]>(defaultChoices);
  const { getBalance } = useToken();
  const [balance, setBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<CurrencyPWPTokenData | null>(null);
  const [type, setType] = useState<string>(defaultType.key);

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
    const pwpBalance = await getUserPwpBalance(
      currentWallet.address,
      currencies.network
    );
    const amount = new BigNumber(pwpBalance.result.balance);
    setBalance(amount.toNumber());
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
        type: type,
        payload: {
          name: values.name,
          body: values.body,
          contact: values.contact,
          project_name: values.project_name,
          snapshot: moment().unix(),
          start: values?.start ? moment(values?.start).unix() : undefined,
          end: values?.end ? moment(values?.end).unix() : undefined,
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
      const response: ProposalListItemData =
        await VotingServices.createProposal(body);
      toastSuccess("Proposal created successfully");

      return navigate(
        `${APP_URL.VOTING_DETAIL}/?id=${response?.id.toString()}`
      );
    } catch (error) {
      toastError(error?.message || err);
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
                {type === ProposalTypes.Proposal && (
                  <InputWrapper label="Project Name" theme="dark">
                    <Field
                      name="project_name"
                      placeholder=""
                      children={FieldText}
                      validate={required}
                    />
                  </InputWrapper>
                )}

                <InputWrapper label="Content" theme="dark">
                  <Field
                    name="body"
                    placeholder=""
                    children={FieldText}
                    rows={10}
                    inputType="textarea"
                  />
                </InputWrapper>
                {type === ProposalTypes.Proposal && (
                  <InputWrapper label="Contact" theme="dark">
                    <Field name="contact" placeholder="" children={FieldText} />
                  </InputWrapper>
                )}

                {type !== ProposalTypes.Proposal && (
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
                      <Button
                        onClick={onAddChoice}
                        className={styles.btnChoice}
                      >
                        Add Choice
                      </Button>
                    </div>
                  </div>
                )}
              </Col>
              <Col md={4}>
                <div className={styles.choiceWrapper}>
                  <div className={styles.choiceTitle}>
                    {/* <h5>Actions</h5> */}
                  </div>
                  <div className={styles.choiceFormWrap}>
                    {type !== ProposalTypes.Proposal && (
                      <React.Fragment>
                        <InputWrapper label="Start Date" theme="dark">
                          <Field
                            name="start"
                            placeholder="YYYY/MM/DD HH:mm"
                            children={FieldDateTimePicker}
                            validate={
                              type !== ProposalTypes.Proposal
                                ? composeValidators(
                                    required,
                                    minDateCurrent,
                                    validateStartDate
                                  )
                                : undefined
                            }
                            showTimeInput={true}
                            minDate={moment.now()}
                          />
                        </InputWrapper>
                        <InputWrapper label="End Date" theme="dark">
                          <Field
                            name="end"
                            placeholder="YYYY/MM/DD HH:mm"
                            children={FieldDateTimePicker}
                            validate={
                              type !== ProposalTypes.Proposal
                                ? composeValidators(
                                    required,
                                    minDateCurrent,
                                    validateEndDate
                                  )
                                : undefined
                            }
                            showTimeInput={true}
                            minDate={moment.now()}
                          />
                        </InputWrapper>
                      </React.Fragment>
                    )}

                    {proposalTypes.length > 1 && (
                      <div className={styles.proposalTypesWrap}>
                        {proposalTypes.map((v) => (
                          <Button
                            onClick={() => setType(v.key)}
                            disabled={!v.active}
                            key={v.key}
                          >
                            <span
                              className={type === v.key ? styles.active : ""}
                            />
                            {v.name}
                          </Button>
                        ))}
                      </div>
                    )}

                    {isConnected ? (
                      <Button
                        className={cx(
                          styles.btnMakeProposal,
                          styles.btnSubmitAProposal
                        )}
                        type="submit"
                        disabled={
                          loading ||
                          parseFloat(balance) <
                            parseFloat(currency?.proposal_pwp_required)
                        }
                      >
                        {loading ? <Loading dark /> : "Submit"}
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
                    {parseFloat(balance) <
                      parseFloat(currency?.proposal_pwp_required) && (
                      <div className={styles.wrapBalance}>
                        {isConnected && (
                          <div>
                            My Balance:{" "}
                            <span>
                              {formatCurrency(balance)}{" "}
                              {currency?.symbol}
                            </span>
                          </div>
                        )}
                        <div className={styles.requiredInfo}>
                          You must have at least{" "}
                          {formatCurrency(
                            currency?.proposal_pwp_required
                          )}{" "}
                          {currency?.symbol} in your reward history to submit a
                          proposal. There are just a few methods to get your PWP
                          reward:
                          <ol>
                            <li>
                              Participate in our AMA and Airdrop activities.
                            </li>
                            <li>
                              Using NFT to place a loan order is one of these
                              whitelisted NFT collections.{" "}
                              <a
                                href="http://docs.nftpawn.financial/overview/assetment-list-nft-collections-supported"
                                target="_blank"
                              >
                                Read more
                              </a>
                            </li>
                          </ol>
                        </div>
                      </div>
                    )}
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
