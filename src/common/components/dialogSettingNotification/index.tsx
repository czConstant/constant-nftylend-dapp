import { useEffect, useState } from 'react';
import { Box, Button, Flex, Icon, IconButton, Input, InputGroup, Switch, Text } from '@chakra-ui/react';
import { MdCheck, MdClose } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import moment from 'moment-timezone';

import { toastError, toastSuccess } from 'src/common/services/toaster';
import Loading from 'src/common/components/loading';

import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { getUserSettings, changeUserSettings, verifyUserEmail } from 'src/modules/nftLend/api';
import { nearSignText } from 'src/modules/near/utils';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { selectUserSettings, updateUserSettings } from 'src/store/nftyLend';

interface DialogSettingNotificationProps {
  onClose: Function;
}

const DialogSettingNotification = (props: DialogSettingNotificationProps) => {
  const { onClose } = props
  const { currentWallet } = useCurrentWallet()
  const settings = useAppSelector(selectUserSettings)
  const dispatch = useAppDispatch()

  const [submitting, setSubmitting] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)

  const [email, setEmail] = useState('')
  const [newsNotiEnabled, setNewsNotiEnabled] = useState(false)
  const [loanNotiEnabled, setLoanNotiEnabled] = useState(false)

  useEffect(() => {
    if (!settings) return;
    setEmail(settings.email);
    setNewsNotiEnabled(settings.news_noti_enabled);
    setLoanNotiEnabled(settings.loan_noti_enabled);
  }, [settings])

  const fetchSetting = async () => {
    try {
      const res = await getUserSettings(currentWallet.address, currentWallet.chain);
      dispatch(updateUserSettings(res.result))
    } catch { }
  }

  const changeNotiSetting = async (key: string, value: any) => {
    try {
      const timestamp = moment().unix()
      // const signature = await nearSignText(currentWallet.address, String(timestamp))
      await changeUserSettings({
        address: currentWallet.address,
        network: currentWallet.chain,
        // signature,
        timestamp,
        [key]: value,
      })
      fetchSetting();
      toastSuccess('Save settings succesfully!')
    } catch (err: any) {
      toastError(err?.message || err);
    }
  }

  const onSave = async () => {
    try {
      setSubmitting(true)
      const timestamp = moment().unix()
      // const signature = await nearSignText(currentWallet.address, String(timestamp))
      await changeUserSettings({
        email: email,
        address: currentWallet.address,
        network: currentWallet.chain,
        // signature,
        timestamp,
      })
      fetchSetting();
      toastSuccess('Save email succesfully!')
    } catch (err: any) {
      toastError(err?.message || err);
    } finally {
      setSubmitting(false)
    }
  }

  const renderEmailSection = () => {
    if (settings.email && !editingEmail) return (
      <Flex alignItems='center' justifyContent='space-between'>
        <Text py={2}>{settings.email}</Text>
        <IconButton variant='link' color='text.primary' aria-label='edit-email' icon={<Icon as={BsPencilSquare} />} onClick={() => setEditingEmail(true)} />
      </Flex>
    )

    const canSave = email && email !== settings.email

    return (
      <Flex alignItems='center' gap={2}>
        <Input value={email} onChange={e => setEmail(e.target.value)} />
        {settings.email
          ? (<>
            <IconButton aria-label='save' icon={submitting ? <Loading /> : <MdCheck />} disabled={!canSave || submitting} onClick={onSave} />
            <IconButton aria-label='cancel' variant='solid' colorScheme='whiteAlpha' icon={<MdClose />} onClick={() => setEditingEmail(false)} />
          </>) : (
            <Button mt={1} ml={4} w='80px' fontSize='sm' disabled={submitting} onClick={onSave}>
              {submitting ? <Loading dark /> : "Save"}
            </Button>
          )}
      </Flex>
    )
  }
  
  return (
    <Flex direction='column' gap={4}>
      <Flex direction='column'>
      <Text fontWeight='medium'>Email</Text>
        {renderEmailSection()}
      </Flex>
      <Text fontSize='xl' fontWeight='semibold' mb={4}>Notification Preference</Text>
      <Flex direction='column' gap={4}>
        <Flex alignItems='center' justifyContent='space-between' gap={4}>
          <Box>
            <Text fontWeight='medium'>Newsletter</Text>
            <Text fontSize='sm' color='text.secondary'>Get first notified for any NFTPawn info</Text>
          </Box>
          <Switch colorScheme='brand.primary' isChecked={newsNotiEnabled} onChange={e => changeNotiSetting('news_noti_enabled', newsNotiEnabled)} />
        </Flex>
        <Flex alignItems='center' justifyContent='space-between' gap={4}>
          <Box>
            <Text fontWeight='medium'>Loans activity</Text>
            <Text fontSize='sm' color='text.secondary'>Get notified for your loans and offers on NFTPawn</Text>
          </Box>
          <Switch colorScheme='brand.primary' isChecked={loanNotiEnabled} onChange={e => changeNotiSetting('loan_noti_enabled', loanNotiEnabled)} />
        </Flex>
      </Flex>
    </Flex>

  );
};

export default DialogSettingNotification;