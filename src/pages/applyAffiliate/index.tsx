import { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';

import FieldText from 'src/common/components/form/fieldText';
import InputWrapper from 'src/common/components/form/inputWrapper';
import Loading from 'src/common/components/loading';
import { toastError, toastSuccess } from 'src/common/services/toaster';
import { applyAffiliate } from 'src/modules/nftLend/api';
import { required } from 'src/common/utils/formValidate';
import BodyContainer from 'src/common/components/bodyContainer';
import { Chain } from 'src/common/constants/network';

import BgImage from './img_left.png'
import styles from './styles.module.scss';

const ApplyAffiliate = () => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: any) => {
    if (submitting) return;
    try {
      setSubmitting(true);
      await applyAffiliate({
        address: values.address,
        network: Chain.Near,
        full_name: values.name,
        description: values.description,
        contact: values.contact,
        website: values.website,
      });
      toastSuccess('Apply affiliate successfully! We would contact you as soon as possible!');
    } catch (err: any) {
      toastError(err.message || err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BodyContainer>
      <Flex mt={[20, 40]} h='100%' direction={['column', 'row']} justifyContent='center' p={4} gap={8}>
        <Flex direction='column' className={styles.left} gap={8}>
          <Heading as='h1' maxW={600} fontSize={['3xl', '4xl']} lineHeight={1.5} className={styles.title}>Use <strong>your reach</strong> to give your followers <strong>financial freedom</strong></Heading>
          <Text>Write, talk, or stream about us then get paid when people sign up.</Text>
          <Image display={['none', 'block']} src={BgImage} />
        </Flex>
        <Box minW={[300, 500]} h='fit-content' className={styles.right} bgColor='background.default' p={8} borderRadius={20}>
          <Text fontSize='3xl' mb={8}>Apply Affiliate</Text>
          <Form onSubmit={onSubmit}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <InputWrapper label="Contact" desc="Your Email/Telegram/Discord">
                  <Field
                    name="contact"
                    label="Contact"
                    desc="Your Email/Telegram/Discord"
                    children={FieldText}
                    validate={required}
                  />
                </InputWrapper>
                <InputWrapper label="Full name" desc="Your full name">
                  <Field
                    name="name"
                    children={FieldText}
                    validate={required}
                  />
                </InputWrapper>
                <InputWrapper label="Social/Website" desc="Social Media or Website link (links are separated by semicolons)">
                  <Field
                    name="website"
                    children={FieldText}
                    validate={required}
                  />
                </InputWrapper>
                <InputWrapper label="Content" desc='How will you want to advertise us?'>
                  <Field
                    name="description"
                    children={FieldText}
                    validate={required}
                  />
                </InputWrapper>
                <InputWrapper label="Wallet ID">
                  <Field
                    name="address"
                    children={FieldText}
                    validate={required}
                  />
                </InputWrapper>
                <Button w='100%' h={50} type="submit" disabled={submitting}>
                  {submitting ? <Loading /> : "Apply"}
                </Button>
              </form>
            )}
          </Form>
        </Box>
      </Flex>
    </BodyContainer>
  );
}

export default ApplyAffiliate;