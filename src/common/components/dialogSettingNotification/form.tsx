import React from 'react';
import { Field } from "react-final-form";
import { Button } from "react-bootstrap";

import { required, isEmail, composeValidators } from "src/common/utils/formValidate";
import InputWrapper from "src/common/components/form/inputWrapper";
import FieldText from 'src/common/components/form/fieldText';
import Loading from 'src/common/components/loading';
import styles from './settingNotification.module.scss';

interface AddEmailFormProps {
  submitting: boolean;
  onSubmit: React.FormEventHandler;
}

const AddEmailForm = (props: AddEmailFormProps) => {
  const { submitting, onSubmit } = props;

  return (
    <form className={styles.formEmail} onSubmit={onSubmit}>
      <InputWrapper label="Email" theme="dark">
        <Field
          name=" email"
          children={FieldText}
          placeholder="0.0"
          validate={composeValidators(required, isEmail())}
        />
      </InputWrapper>
      <Button
        type="submit"
        disabled={submitting}
        className={styles.submitButton}
      >
        {submitting ? <Loading dark /> : "Add email"}
      </Button>
    </form>
  );
}

export default AddEmailForm;
