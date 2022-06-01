import React, { memo, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import BodyContainer from "src/common/components/bodyContainer";
import styles from "../styles.module.scss";
import cx from "classnames";
import { Col, Row } from "react-bootstrap";
import BreadCrumb, { BreadCrumbItem } from "src/common/components/breadCrumb";
import { APP_URL } from "src/common/constants/url";
import InputWrapper from "src/common/components/form/inputWrapper";
import { Field, Form } from "react-final-form";
import { required } from "src/common/utils/formValidate";
import FieldText from "src/common/components/form/fieldText";
import MakeProposalChoices from "./MakeProposal.Choices";

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

  const [initValues, setInitValues] = useState([]);

  const onSubmit = async (values: any) => {};

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
                  inputType='textarea'
                />
              </InputWrapper>
              <MakeProposalChoices />
            </Col>
            <Col></Col>
          </Row>
        )}
      </Form>
    </BodyContainer>
  );
};

export default VotingMakeProposal;
