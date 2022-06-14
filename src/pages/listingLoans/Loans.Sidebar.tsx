import React, { useEffect, useMemo, useRef } from "react";
import queryString from "query-string";
import { Field, Form } from "react-final-form";
import { useLocation, useNavigate } from "react-router-dom";
import FieldAmount from "src/common/components/form/fieldAmount";
import InputWrapper from "src/common/components/form/inputWrapper";
import styles from "./styles.module.scss";
import FieldDropdown from "src/common/components/form/fieldDropdown";
import { LOAN_DURATION } from "src/modules/nftLend/constant";
import { APP_URL } from "src/common/constants/url";
import { Button } from '@chakra-ui/react';

const FilterAmount = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <label className={styles.filterLabel}>Principal (USDC)</label>
      <div className={styles.filterGroup}>
        <InputWrapper className={styles.filterInputLabel} label="Min Amount">
          <Field
            className={styles.filterInput}
            name="min_price"
            children={FieldAmount}
            placeholder="0.0"
          />
        </InputWrapper>
        <InputWrapper className={styles.filterInputLabel} label="Max Amount">
          <Field
            className={styles.filterInput}
            name="max_price"
            children={FieldAmount}
            placeholder="0.0"
          />
        </InputWrapper>
      </div>
      <label className={styles.filterLabel}>Duration (Day)</label>
      <div className={styles.filterGroup}>
        <InputWrapper className={styles.filterInputLabel} label="Min Duration">
          <Field
            className={styles.filterInput}
            name="min_duration"
            children={FieldDropdown}
            list={LOAN_DURATION}
            valueField="id"
          />
        </InputWrapper>
        <InputWrapper className={styles.filterInputLabel} label="Max Duration">
          <Field
            className={styles.filterInput}
            name="max_duration"
            children={FieldDropdown}
            list={LOAN_DURATION}
            valueField="id"
          />
        </InputWrapper>
      </div>
      <label className={styles.filterLabel}>Term Rate (% APY)</label>
      <div className={styles.filterGroup}>
        <InputWrapper
          className={styles.filterInputLabel}
          label="Min Interest Rate"
        >
          <Field
            className={styles.filterInput}
            name="min_interest_rate"
            children={FieldAmount}
            placeholder="0.0"
          />
        </InputWrapper>
        <InputWrapper
          className={styles.filterInputLabel}
          label="Max Interest Rate"
        >
          <Field
            className={styles.filterInput}
            name="max_interest_rate"
            children={FieldAmount}
            placeholder="0.0"
          />
        </InputWrapper>
      </div>
      <Button w='100%' type="submit">
        Apply Now
      </Button>
    </form>
  );
};

interface LoansSidebarProps {
  isLoading?: boolean;
}

const LoansSidebar: React.FC<LoansSidebarProps> = ({ isLoading }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (values: any) => {
    const params = queryString.parse(location.search);
    const url = queryString.stringifyUrl({
      url: APP_URL.LIST_LOAN,
      query: {
        ...params,
        ...values,
      },
    });
    return navigate(url);
  };

  return (
    <div className={styles.sideBarContainer}>
      <div className={styles.filterHeader}>
        <h4>Filters</h4>
      </div>
      <div className={styles.filterWrapper}>
        <Form onSubmit={onSubmit}>
          {({ handleSubmit }) => <FilterAmount onSubmit={handleSubmit} />}
        </Form>
      </div>
    </div>
  );
};

export default LoansSidebar;
