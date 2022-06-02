import React, { memo, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import BodyContainer from "src/common/components/bodyContainer";
import styles from "../styles.module.scss";
import cx from "classnames";
import { Button, Col, Row } from "react-bootstrap";
import BreadCrumb, { BreadCrumbItem } from "src/common/components/breadCrumb";
import { APP_URL } from "src/common/constants/url";
import InputWrapper from "src/common/components/form/inputWrapper";
import { Field, Form } from "react-final-form";
import { required } from "src/common/utils/formValidate";
import FieldText from "src/common/components/form/fieldText";
import MakeProposalChoices from "./MakeProposal.Choices";
import { useCurrentWallet } from "src/modules/nftLend/hooks/useCurrentWallet";
import ButtonConnectWallet from "src/common/components/buttonConnectWallet";

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
  const [choices, setChoices] = useState<number>(2);

  const onSubmit = async (values: any) => {};

  const onAddChoice = () => {
    setChoices((value) => value + 1);
  };

  return (
    <BodyContainer className={cx(isMobile && styles.mbWrapper, styles.wrapper)}>
      <BreadCrumb items={defaultBreadCrumbs.current} />
      <Form onSubmit={onSubmit} initialValues={initValues}>
        {({ values, handleSubmit }) => (
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
                      onClick={onAddChoice}
                      className={cx(
                        styles.btnMakeProposal,
                        styles.btnSubmitAProposal
                      )}
                    >
                      Submit a Proposal
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
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Form>
    </BodyContainer>
  );
};

export default VotingMakeProposal;
