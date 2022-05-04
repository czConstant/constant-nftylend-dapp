import { useEffect, useState } from 'react';
import cx from 'classnames';
import { Form } from "react-final-form";

import { toastError } from 'src/common/services/toaster';

import styles from './addEmail.module.scss';
import AddEmailForm from './form';

interface DialogAddEmailProps {
  onClose: Function;
}

const DialogAddEmail = (props: DialogAddEmailProps) => {
  const { onClose } = props;

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (values) => {
    console.log("🚀 ~ file: index.tsx ~ line 20 ~ onSubmit ~ values", values)
  }

  return (
    <div className={styles.addEmail}>
      <h2>Enable Notification</h2>
      <p>We need your email to notify immediately updated information</p>
      <Form onSubmit={onSubmit}>
        {({ values, handleSubmit }) => (
          <AddEmailForm
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        )}
      </Form>
    </div>
  );
};

export default DialogAddEmail;