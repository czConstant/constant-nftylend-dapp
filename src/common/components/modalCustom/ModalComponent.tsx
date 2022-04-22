import cx from "classnames";
import { isMobile } from "react-device-detect";

import { useAppDispatch } from "src/store/hooks";
import { closeModal } from "src/store/modal";

import styles from "./styles.module.scss";

export interface ModalComponentProps {
  id: string;
  render: Function;
  title?: string | object;
  className?: string;
  actions?: object;
  onClose?: Function;
  theme?: "light" | "dark";
}

const ModalComponent = (props: ModalComponentProps) => {
  const {
    id,
    render,
    className,
    title,
    actions,
    onClose,
    theme = "dark",
  } = props;
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal({ id }));
    if (onClose) onClose(props);
  };

  return (
    <div
      className={cx(
        styles.modalDialog,
        styles[theme],
        className
      )}
    >
      {title && (
        <div className={styles.header}>
          <div>{title}</div>
          {/* <i className="fal fa-times" onClick={handleClose} /> */}
        </div>
      )}
      {render(actions)}
    </div>
  );
};

export default ModalComponent;
