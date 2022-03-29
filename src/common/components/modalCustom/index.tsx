import last from 'lodash/last';
import cx from 'classnames';
import { closeModal, openModal, selectModals } from 'src/store/modal';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import ModalComponent from './ModalComponent';
import styles from './styles.module.scss';

const ModalManager = () => {
  const modals = useAppSelector(selectModals).modals;
  const dispatch = useAppDispatch();

  const onBackdropClick = () => {
    const id = last(modals)?.id || '';
    dispatch(closeModal({ id }));
  };

  return (
    <div className={cx(styles.modalCustom, modals.length > 0 && styles.show)}>
      <div className={styles.backdrop} onClick={onBackdropClick} />
      <div className={cx(styles.dialog)}>
        {modals.map(modal => (
          <ModalComponent
            key={modal.id}
            actions={{ openModal, closeModal }}
            id={modal.id}
            title={modal.title}
            render={modal.render}
            className={modal.className}
            onClose={modal.onClose}
            theme={modal.theme}
          />
        ))}
      </div>
    </div>
  )
}

export default ModalManager;
