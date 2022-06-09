import { useState } from 'react';
import { Field, Form } from 'react-final-form';
import queryString from "query-string";
import { Button, Switch } from '@chakra-ui/react';

import FieldText from 'src/common/components/form/fieldText';
import InputWrapper from 'src/common/components/form/inputWrapper';
import Loading from 'src/common/components/loading';
import { toastError, toastSuccess } from 'src/common/services/toaster';
import { submitWhitelistCollection } from 'src/modules/nftLend/api';
import { required } from 'src/common/utils/formValidate';

import styles from './submitWhitelist.module.scss';
import FieldDropdown from 'src/common/components/form/fieldDropdown';
import CryptoDropdownItem from 'src/common/components/cryptoDropdownItem';
import tokenIcons from 'src/common/utils/tokenIcons';

const SubmitWhitelist = () => {
  const [submitting, setSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState({} as any);

  const onChangeNetwork = (network: any) => {
    setSelectedNetwork(network.symbol);
  }

  const onSubmit = async (values: any) => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const res = await submitWhitelistCollection({
        network: values.network,
        name: values.name,
        description: values.description,
        creator: values.creator,
        contract_address: values.contract_address,
        contact_info: values.contact_info,
      });
      toastSuccess('Submit collection successfully! Stay tuned for our approval');
    } catch (err: any) {
      toastError(err.message || err);
    } finally {
      setSubmitting(false);
    }
  };

  const listNetwork = [
    { symbol: 'ETH', label: <CryptoDropdownItem symbol="ETH" name="Ethereum" icon={tokenIcons.eth} /> },
    { symbol: 'MATIC', label: <CryptoDropdownItem symbol="MATIC" name="Polygon" icon={tokenIcons.matic} /> },
    { symbol: 'AVAX', label: <CryptoDropdownItem symbol="AVAX" name="Avalanche" icon={tokenIcons.avax} /> },
    { symbol: 'SOL', label: <CryptoDropdownItem symbol="SOL" name="Solana" icon={tokenIcons.sol} /> },
  ];

  const initialValues = {
    name: queryString.parse(location.search)?.collection || '',
    creator: queryString.parse(location.search)?.creator || '',
  }
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div>
          <h1>Submit<br />your collection</h1>
          <div className={styles.subtitle}>*We required white-listed collection to create a loan</div>
        </div>
      </div>
      <div className={styles.right}>
        <Form onSubmit={onSubmit} initialValues={initialValues}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <InputWrapper label="Network">
                <Field
                  name="network"
                  children={FieldDropdown}
                  defaultValue={selectedNetwork?.symbol}
                  list={listNetwork}
                  valueField="symbol"
                  placeholder="Select network"
                  searchable
                  alignMenu="right"
                  searchFields={["name", "symbol"]}
                  handleItemOnChange={onChangeNetwork}
                  className={styles.dropdown}
                />
              </InputWrapper>
              <InputWrapper label="Collection name">
                <Field
                  name="name"
                  children={FieldText}
                  placeholder="CryptoKitties"
                  validate={required}
                />
              </InputWrapper>
              <InputWrapper label="Collection description">
                <Field
                  name="description"
                  children={FieldText}
                  validate={required}
                />
              </InputWrapper>
              {['SOL'].includes(selectedNetwork) && (
                <InputWrapper label="Creator">
                  <Field
                    name="creator"
                    children={FieldText}
                    placeholder="0x0000000000000000000000000000000000000000"
                    validate={required}
                  />
                </InputWrapper>
              )}
              {['ETH'].includes(selectedNetwork) && (
                <InputWrapper label="Contract address">
                  <Field
                    name="contract_address"
                    children={FieldText}
                    placeholder="0x0000000000000000000000000000000000000000"
                  />
                </InputWrapper>
              )}
              <InputWrapper label="Contact info">
                <Field
                  name="contact_info"
                  children={FieldText}
                  placeholder="Email | Telegram | Discord"
                  validate={required}
                />
              </InputWrapper>
              <div className={styles.switchGroup}>
                <span>Is verified?</span>
                <Switch colorScheme='brand.primary' isChecked={isVerified} onChange={e => setIsVerified(e.target.checked)} />
              </div>
              {isVerified && (
                <InputWrapper label="Verifier">
                  <Field
                    name="verifier"
                    children={FieldText}
                    placeholder="OpenSea"
                  />
                </InputWrapper>
              )}
              <div className={styles.actions}>
                <Button w='100%' type="submit" disabled={submitting}>
                  {submitting ? <Loading /> : "Submit"}
                </Button>
              </div>
            </form>
          )}
        </Form>
      </div>
    </div>
  );
}

export default SubmitWhitelist;