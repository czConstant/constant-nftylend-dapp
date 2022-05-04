import { useEffect, useState } from 'react';
import cx from 'classnames';
import { Form } from "react-final-form";
import Switch from 'rc-switch';
import { Button } from "react-bootstrap";

import { toastError } from 'src/common/services/toaster';
import Loading from 'src/common/components/loading';

import styles from './settingNotification.module.scss';
import AddEmailForm from './form';

interface DialogSettingNotificationProps {
  onClose: Function;
}

const DialogSettingNotification = (props: DialogSettingNotificationProps) => {
  const { onClose } = props;

  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newsletterActive, setNewsletterActive] = useState(false)
  const [loanActivity, setLoanActivity] = useState(false)
  
  const onSubmit = (values) => {
    console.log("🚀 ~ file: index.tsx ~ line 20 ~ onSubmit ~ values", values)
  }

  const onSave = (values) => {
  
  }

  return (
    <div className={styles.wrapper}>
      <h2>Setting</h2>
      <Form onSubmit={onSubmit}>
        {({ values, handleSubmit }) => (
          <AddEmailForm
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        )}
      </Form>
      <h3>Notification Preference</h3>
      <div className={styles.switchRow}>
        <div>
          <label>Newsletter</label>
          <p>Get first notified for any NFTPawn info</p>
        </div>
        <Switch checked={newsletterActive} onChange={e => setNewsletterActive(e)} />
      </div>
      <div className={styles.switchRow}>
        <div>
          <label>Loans activity</label>
          <p>Get notified for your loans and offers on NFTPawn</p>
        </div>
        <Switch checked={loanActivity} onChange={e => setLoanActivity(e)} />
      </div>
      <Button
        disabled={saving}
        className={styles.saveButton}
        onClick={onSave}
      >
        {saving ? <Loading dark /> : "Save"}
      </Button>
    </div>
  );
};

export default DialogSettingNotification;