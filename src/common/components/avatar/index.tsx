import cx from "classnames";
import React from "react";

import { getAvatarName } from "src/common/utils/helper";
import styles from "./styles.module.scss";

interface AvatarProps {
  id?: string;
  img?: string;
  name?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  id,
  img,
  name,
  size,
  className,
  onClick,
}) => {
  const renderContent = () => {
    if (Boolean(img)) {
      return <img alt={name || "avatar"} src={img} />;
    } else if (name) {
      return <span>{getAvatarName(name)}</span>;
    } else {
      return null;
    }
  };

  return (
    <div
      id={id}
      className={cx(styles.container, className)}
      style={{ width: size, height: size }}
    >
      {renderContent()}
    </div>
  );
};

Avatar.defaultProps = {
  size: 120,
};

export default Avatar;
