import React, { useEffect, useMemo, useRef } from "react";
import { Button } from "react-bootstrap";
import queryString from "query-string";
import { Field, useForm, Form } from "react-final-form";
import { useLocation, useNavigate } from "react-router-dom";
import FieldAmount from "src/common/components/form/fieldAmount";
import InputWrapper from "src/common/components/form/inputWrapper";
import styles from "./styles.module.scss";

const FilterAmount = ({ onSubmit }) => {
  const form = useForm();
  return (
    <form onSubmit={onSubmit}>
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
      <Button type="submit" className={styles.btnApplyNow}>
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

  const collection_id = queryString.parse(location.search)?.collection_id;

  const refDefaultUrl = useMemo(
    () =>
      `?collection_id=${
        collection_id || ""
      }&min_price={min_price}&max_price={max_price}`,
    []
  );

  const onSubmit = (values: { min_price: string; max_price: string }) => {
    const url = `${refDefaultUrl
      .replace("{min_price}", values.min_price)
      .replace("{max_price}", values.max_price)}`;

    return navigate(url);
  };

  return (
    <div className={styles.sideBarContainer}>
      <div className={styles.filterHeader}>
        <h4>Filters</h4>
      </div>
      <label className={styles.filterLabel}>Principal (USDC)</label>
      <div className={styles.filterWrapper}>
        <Form onSubmit={onSubmit}>
          {({ handleSubmit }) => <FilterAmount onSubmit={handleSubmit} />}
        </Form>
      </div>
    </div>
  );
};

export default LoansSidebar;
