import cx from 'classnames';
import { Modal } from 'react-bootstrap';

import { useAppDispatch } from 'src/store/hooks';
import { closeModal } from 'src/store/modal';

import styles from './styles.module.scss';

interface ModalProps {
  dialogClassName?: string;
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
}

const ModalComponent = (props: ModalComponentProps) => {
  const { id, render, title, className, actions, modalProps, onClose } = props;
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
      {...modalProps}
    >
      {renderHeader()}
      <Modal.Body className={cx(modalProps?.padding === 0 && styles.noPadding)}>
        {render(actions)}
      </Modal.Body>
    </Modal>
  );
}

export default ModalComponent;
