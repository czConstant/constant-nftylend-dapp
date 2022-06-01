import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import FieldText from "src/common/components/form/fieldText";
import InputWrapper from "src/common/components/form/inputWrapper";
import { required } from "src/common/utils/formValidate";
import styles from "../styles.module.scss";

const MakeProposalChoices = () => {
  const [choices, setChoices] = useState<number>(2);

  const onSubmit = (values) => {};

  return (
    <div className={styles.choiceWrapper}>
      <div className={styles.choiceTitle}>
        <h5>Choices</h5>
      </div>
      <div className={styles.choiceFormWrap}>
        <Form className={styles.choiceFormWrap} onSubmit={onSubmit}>
          {({ values, handleSubmit }) => {
            return (
              <div>
                {Array(choices)
                  .fill(0)
                  .map((v, i) => (
                    <InputWrapper
                      key={i}
                      label={`Choice ${i + 1}`}
                      theme="dark"
                    >
                      <Field
                        name="title"
                        placeholder="Input choice text"
                        children={FieldText}
                        validate={required}
                      />
                    </InputWrapper>
                  ))}
                <Button className={styles.btnChoice}>Add Choice</Button>
              </div>
            );
          }}
        </Form>
      </div>
    </div>
  );
};

export default MakeProposalChoices;
