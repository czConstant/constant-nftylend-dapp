import React from 'react';
import { Field } from "react-final-form";
import { Button } from "react-bootstrap";

import { required, isEmail, composeValidators } from "src/common/utils/formValidate";
import InputWrapper from "src/common/components/form/inputWrapper";
import FieldText from 'src/common/components/form/fieldText';
import Loading from 'src/common/components/loading';
import styles from './settingNotification.module.scss';

interface AddEmailFormProps {
  email: string;
  submitting: boolean;
  onSubmit: React.FormEventHandler;
}

const AddEmailForm = (props: AddEmailFormProps) => {
  const { email, submitting, onSubmit } = props;

  return (
    <form className={styles.formEmail} onSubmit={onSubmit}>
      <InputWrapper label="Email" theme="dark">
        <Field
          disabled={email}
          defaultValue={email}
          name="email"
          children={FieldText}
          placeholder="example@nftpawn.financial"
          validate={composeValidators(required, isEmail())}
        />
      </InputWrapper>
      {!email && (
        <Button
          type="submit"
          disabled={submitting}
          className={styles.submitButton}
        >
          {submitting ? <Loading dark /> : "Add email"}
        </Button>
      )}
    </form>
  );
}

export default AddEmailForm;
