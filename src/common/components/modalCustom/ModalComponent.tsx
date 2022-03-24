import cx from "classnames";
import { Modal } from "react-bootstrap";

import { useAppDispatch } from "src/store/hooks";
import { closeModal } from "src/store/modal";

import styles from "./styles.module.scss";

interface ModalProps {
  dialogClassName?: string;
  contentClassName?: string;
  padding?: number;
}

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
  const { id, render, title, className, actions, modalProps, onClose, theme = 'dark' } =
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
    <div className={cx(styles.dialog, styles[theme], className)}>
      {render(actions)}
    </div>
  );
};

export default ModalComponent;
