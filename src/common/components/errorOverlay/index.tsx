import React, { useEffect, useState } from "react";
import { Overlay, Popover } from "react-bootstrap";

import styles from "./styles.module.scss";

const UpdatingPopover = React.forwardRef(
  ({ popper, children, show: _, innerError, zIndex, type, ...props }, ref) => {
    useEffect(() => {
      popper.scheduleUpdate();
    }, [children, popper, innerError]);

    const isHide = String(props.style.transform).match(
      /translate3d\(0px, .+, 0\)/g
    );

    return (
      <Popover
        className={styles.container}
        body
        ref={ref}
        {...props}
        isError={type === "error"}
        style={{
          opacity: isHide ? 0 : 1,
          fontSize: "11px",
          zIndex: zIndex,
          maxWidth: "300px",
          fontWeight: 300,
          ...props.style,
        }}
      >
        <span>{innerError}</span>
      </Popover>
    );
  }
);

const ErrorOverlay = ({
  placement = "bottom",
  target,
  shouldShowError,
  error,
  type = "error",
  zIndex = 1,
}) => {
  const [innerError, setInnerError] = useState(null);

  useEffect(() => {
    setInnerError(null);
    if (
      error &&
      ((typeof error === "string" && error?.trim().length > 0) ||
        typeof error === "object")
    ) {
      setInnerError(error);
    }
  }, [error]);

  return (
    <Overlay
      target={target.current}
      show={innerError && shouldShowError}
      placement={placement}
    >
      <UpdatingPopover innerError={innerError} zIndex={zIndex} type={type} />
    </Overlay>
  );
};

export default ErrorOverlay;
