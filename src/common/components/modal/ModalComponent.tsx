import cx from "classnames";
import { Modal } from "react-bootstrap";

import { useAppDispatch } from "src/store/hooks";
import { closeModal } from "src/store/modal";

import { ModalComponentProps } from './ModalComponentInterface';
import styles from "./styles.module.scss";

const ModalComponent = (props: ModalComponentProps) => {
  const { id, render, title, className, actions, modalProps, onClose, theme } =
    props;
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal({ id }));
    if (onClose) onClose(props);
  };

  const renderHeader = () => {
    return title ? (
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
    ) : null;
  };

  return (
    <Modal
      show
      keyboard={false}
      onHide={handleClose}
      bsclass={className}
      dialogClassName={modalProps?.dialogClassName}
      contentClassName={cx([modalProps?.contentClassName, cx(theme === "dark" && styles.modalDark)])}
      {...modalProps}
    >
      {renderHeader()}
      <Modal.Body className={cx(modalProps?.padding === 0 && styles.noPadding)}>
        {render(actions)}
      </Modal.Body>
    </Modal>
  );
};

export default ModalComponent;
