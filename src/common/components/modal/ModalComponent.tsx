import cx from "classnames";
import { Modal, ModalProps } from "react-bootstrap";

import { useAppDispatch } from "src/store/hooks";
import { closeModal } from "src/store/modal";

import styles from "./styles.module.scss";

export interface ModalComponentProps {
  id: string;
  render: Function;
  title?: string | object;
  className?: string;
  actions?: object;
  modalProps?: ModalProps;
  onClose?: Function;
  theme?: "light" | "dark";
}

const ModalComponent = (props: ModalComponentProps) => {
  const { id, render, title, className, actions, modalProps, onClose, theme } = props;
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

  const { dialogClassName, contentClassName, ...rest } = modalProps || {};

  return (
    <Modal
      show
      keyboard={false}
      onHide={handleClose}
      bsclass={className}
      dialogClassName={dialogClassName}
      contentClassName={cx(contentClassName, styles.modalContent, theme === 'dark' && styles.modalDark)}
      {...rest}
    >
      {renderHeader()}
      <Modal.Body className={cx(styles.modalBody)}>
        {render(actions)}
      </Modal.Body>
    </Modal>
  );
};

export default ModalComponent;
