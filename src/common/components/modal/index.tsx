import { closeModal, openModal, selectModals } from 'src/store/modal';
import { useAppSelector } from 'src/store/hooks';
import ModalComponent from './ModalComponent';

const ModalManager = () => {
  const modals = useAppSelector(selectModals).modals;

  if (!modals.length) return null;

  return <>
    {modals.map(modal => (
      <ModalComponent
        key={modal.id}
        actions={{ openModal, closeModal }}
        id={modal.id}
        title={modal.title}
        render={modal.render}
        className={modal.className}
        modalProps={modal.modalProps}
        onClose={modal.onClose}
      />
    ))}
  </>;
}

export default ModalManager;
