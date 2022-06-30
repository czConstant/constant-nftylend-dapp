import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalProps } from '@chakra-ui/react';
import cx from "classnames";

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

  return (
    <Modal isOpen onClose={handleClose} isCentered {...modalProps}>
      <ModalOverlay />
      <ModalContent className={className}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody className={cx(styles.modalBody)}>
          {render(actions)}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
