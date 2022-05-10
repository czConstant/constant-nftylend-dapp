import { useEffect, useState } from 'react';
import cx from 'classnames';
import { Form } from "react-final-form";
import Switch from 'rc-switch';
import { Button } from "react-bootstrap";

import { toastError } from 'src/common/services/toaster';
import Loading from 'src/common/components/loading';

import styles from './settingNotification.module.scss';
import AddEmailForm from './form';
import api from 'src/common/services/apiClient';
import { API_URL } from 'src/common/constants/url';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';

interface DialogSettingNotificationProps {
  onClose: Function;
}

const DialogSettingNotification = (props: DialogSettingNotificationProps) => {
  const { onClose } = props;
  const { currentWallet } = useCurrentWallet();

  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newsletterActive, setNewsletterActive] = useState(false)
  const [loanActivity, setLoanActivity] = useState(false)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetchSetting();
  }, [])

  const fetchSetting = async () => {
    try {
      const res = await api.get(API_URL.NFT_LEND.USER_SETTINGS, { params: {
        network: currentWallet.chain.toString(),
        address: currentWallet.address
      }});
      setSettings(res.result);
    } catch { }
  }
  
  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true)
      await api.post(API_URL.NFT_LEND.USER_EMAIL_SETTINGS, {
        address: currentWallet.address,
        network: currentWallet.chain.toString(),
        email: values.email,
      })
      fetchSetting();
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      setSubmitting(false);
    }
  }

  const onSave = (values) => {
  
  }

  return (
    <div className={styles.wrapper}>
      <h2>Setting</h2>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <AddEmailForm
            email={settings?.email}
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