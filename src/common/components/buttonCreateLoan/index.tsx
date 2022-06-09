import React from "react";
import { Button } from "react-bootstrap";
import { Player } from "@lottiefiles/react-lottie-player";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import cx from 'classnames';

import { closeModal, openModal } from "src/store/modal";
import { APP_URL } from "src/common/constants/url";
import DialogGuideStart from 'src/views/apps/DialogGuideStart';

import lfCards from "./assets/lt_cards.json";
import styles from "./styles.module.scss";

interface ButtonCreateLoanProps {
  className?: string;
  hiddenIcon?: boolean;
  title?: string;
  onCallBack?: () => void;
}

const ButtonCreateLoan: React.FC<ButtonCreateLoanProps> = ({
  className,
  hiddenIcon,
  title,
  onCallBack
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onOpenModal = () => {
    const close = () => dispatch(closeModal({ id: "createLoanModal" }));
    dispatch(
      openModal({
        id: "createLoanModal",
        className: styles.dialog,
        render: () => <DialogGuideStart onClose={close} navigate={navigate} onGoToAsset={onCallBack} />,
        theme: "dark",
      })
    );
  };

  if (location.pathname.includes(APP_URL.MY_NFT)) return null;

  return (
    <Button onClick={onOpenModal} className={cx(styles.container, className)}>
      {!hiddenIcon && (
        <Player
          autoplay
          loop
          src={lfCards}
          style={{ height: "30px", width: "30px" }}
        />
      )}
      <span>{title || "Create Loan"}</span>
    </Button>
  );
};

export default ButtonCreateLoan;
