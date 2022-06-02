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

  const onAddChoice = () => {
    setChoices((value) => value + 1);
  };

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
                        name={`choice_${i+1}`}
                        placeholder="Input choice text"
                        children={FieldText}
                        validate={required}
                      />
                    </InputWrapper>
                  ))}
                <Button onClick={onAddChoice} className={styles.btnChoice}>
                  Add Choice
                </Button>
              </div>
            );
          }}
        </Form>
      </div>
    </div>
  );
};

export default MakeProposalChoices;
