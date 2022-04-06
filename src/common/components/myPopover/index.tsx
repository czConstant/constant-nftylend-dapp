import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import { isMobile } from "react-device-detect";
import cx from 'classnames';

import styles from './styles.module.scss';
import { closeModal, openModal } from 'src/store/modal';
import { useAppDispatch } from 'src/store/hooks';

const ICON_TYPE = {
  solid: 'fas',
  regular: 'far',
  light: 'fal',
  duotone: 'fad',
};

interface MyPopoverProps {
  icon?: string;
  className?: string;
  title?: string;
  content?: string | React.ReactNode;
  desc?: string | React.ReactNode;
  placement?: 'top' | 'bottom';
  target?: React.ReactNode;
  children?: React.ReactNode;
  iconSize?: number;
  isStickOnHover?: boolean;
  onShow?: Function;
}

const MyPopover = (props: MyPopoverProps, forwardedRef: React.Ref<any>) => {
  const {
    className,
    children,
    title,
    desc,
    content,
    icon = 'fa-question-circle',
    iconSize,
    placement = 'top',
    target,
    onShow,
    isStickOnHover = false
  } = props;
  const dispatch = useAppDispatch();

  const targetRef = useRef(null);
  const timeoutHover: React.Ref<any> = useRef();

  const [show, setShow] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', listenScroll);
    return () => {
      window.removeEventListener('scroll', listenScroll);
    };
  }, []);

  useImperativeHandle(forwardedRef, () => {
    return {
      hide: handleHide,
      show: handleShow
    };
  });

  const listenScroll = () => {
    setShow(false);
  };

  const onHideMobile = () => {
    dispatch(closeModal({ id: 'popupHover' }));
  }

  const showDialog = () => {
    return dispatch(openModal({
      id: 'popupHover',
      modalProps: { centered: true, size: 'sm' },
      render: () => {
        return (
          <div className={styles.popupHover}>
            <div className={styles.content}>{content || desc}</div>
            <div className="actions">
              <Button variant="primary" onClick={onHideMobile}>
                Done
              </Button>
            </div>
          </div>
        );
      },
    }));
  };

  const getLayout = (onClick?: Function) => {
    return (
      <div className={cx(styles.icon)} property={`--icon-size ${iconSize};`} role="presentation" onClick={() => onClick && onClick()}>
        <i className={`${ICON_TYPE.solid} ${icon}`} />
      </div>
    );
  };

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (onShow) onShow();
    if (isMobile) {
      showDialog();
    } else {
      setShow(!show);
    }
  };

  const handleHide = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };
  
  const handleMouseEnter = () => {
    timeoutHover.current = setTimeout(() => {
      setShow(true);
    }, 200);
  }

  const handleMouseLeave = () => {
    clearTimeout(timeoutHover.current);
    setShow(false);
  }

  return (
    <>
      <span ref={targetRef} onClick={handleClick} onMouseEnter={isStickOnHover ? handleMouseEnter : undefined} onMouseLeave={isStickOnHover ? handleMouseLeave : undefined}>
        {children || getLayout()}
      </span>
      <Overlay
        show={show}
        target={targetRef.current || target}
        placement={placement}
        containerPadding={20}
        onHide={handleHide}
        rootClose
        rootCloseEvent="click"
      >
        <Popover
          id="popover-basic"
          className={cx(styles.popover, className)}
          onMouseEnter={isStickOnHover ? handleMouseEnter : undefined}
          onMouseLeave={isStickOnHover ? handleMouseLeave : undefined}
        >
          <div className={styles.content}>{content || desc}</div>
        </Popover>
      </Overlay>
    </>
  );
};

export default forwardRef(MyPopover);
