import { useEffect, useState } from 'react';
import { Field, Form } from "react-final-form";
import { Button } from "react-bootstrap";
import { Switch } from '@chakra-ui/react';

import { toastError, toastSuccess } from 'src/common/services/toaster';
import Loading from 'src/common/components/loading';
import { required, isEmail, composeValidators } from "src/common/utils/formValidate";
import InputWrapper from "src/common/components/form/inputWrapper";
import FieldText from 'src/common/components/form/fieldText';

import styles from './settingNotification.module.scss';
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
  const [settings, setSettings] = useState<any>(null)

  const [email, setEmail] = useState('')
  const [newsNotiEnabled, setNewsNotiEnabled] = useState(false)
  const [loanNotiEnabled, setLoanNotiEnabled] = useState(false)

  useEffect(() => {
    fetchSetting();
  }, [])

  useEffect(() => {
    if (!settings) return;
    setEmail(settings.email);
    setNewsNotiEnabled(settings.news_noti_enabled);
    setLoanNotiEnabled(settings.loan_noti_enabled);
  }, [settings])

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
      await api.post(API_URL.NFT_LEND.USER_SETTINGS, {
        address: currentWallet.address,
        network: currentWallet.chain.toString(),
        email: values.email,
        news_noti_enabled: newsNotiEnabled,
        loan_noti_enabled: loanNotiEnabled,
      })
      fetchSetting();
      toastSuccess('Save settings succesfully!')
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <Form onSubmit={onSubmit} initialValues={{ email }}>
        {({ handleSubmit }) => (
          <form className={styles.formEmail} onSubmit={handleSubmit}>
            <h2>Setting</h2>
            <InputWrapper label="Email" theme="dark">
              <Field
                name="email"
                children={FieldText}
                placeholder="example@nftpawn.financial"
                validate={composeValidators(required, isEmail())}
              />
            </InputWrapper>
            <h3>Notification Preference</h3>
            <div className={styles.switchRow}>
              <div>
                <label>Newsletter</label>
                <p>Get first notified for any NFTPawn info</p>
              </div>
              <Switch colorScheme='brand.primary' isChecked={newsNotiEnabled} onChange={e => setNewsNotiEnabled(e.target.checked)} />
            </div>
            <div className={styles.switchRow}>
              <div>
                <label>Loans activity</label>
                <p>Get notified for your loans and offers on NFTPawn</p>
              </div>
              <Switch colorScheme='brand.primary' isChecked={loanNotiEnabled} onChange={e => setLoanNotiEnabled(e.target.checked)} />
            </div>
            <Button
              disabled={submitting}
              className={styles.saveButton}
              type="submit"
            >
              {submitting ? <Loading dark /> : "Save"}
            </Button>
          </form>
        )}
      </Form>
    </div>
  );
};

export default DialogSettingNotification;