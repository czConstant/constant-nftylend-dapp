import React from 'react';
import { Field } from "react-final-form";
import { Button } from "react-bootstrap";

import { toastError } from 'src/common/services/toaster';
import { required, isEmail, composeValidators } from "src/common/utils/formValidate";
import InputWrapper from "src/common/components/form/inputWrapper";
import FieldText from 'src/common/components/form/fieldText';
import Loading from 'src/common/components/loading';
import styles from './addEmail.module.scss';

interface AddEmailFormProps {
  submitting: boolean;
  onSubmit: React.FormEventHandler;
}

const AddEmailForm = (props: AddEmailFormProps) => {
  const { submitting, onSubmit } = props;

  return (
    <form onSubmit={onSubmit}>
      <InputWrapper label="Email" theme="dark">
        <Field
          name=" email"
          children={FieldText}
          placeholder="0.0"
          validate={composeValidators(required, isEmail())}
        />
      </InputWrapper>
      <div>
        <Button
          type="submit"
          disabled={submitting}
          className={styles.submitButton}
        >
          {submitting ? <Loading dark /> : "Save"}
        </Button>
      </div>
    </form>
  )
}

export default AddEmailForm;
