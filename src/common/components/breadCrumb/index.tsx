import React from "react";
import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

export interface BreadCrumbItem {
  link?: string;
  label: string;
}

interface BreadCrumbProps {
  items: BreadCrumbItem[];
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ items }) => {
  return (
    <div className={styles.breadcrumb}>
      {items.map((item, index) => {
        if (index < items.length - 1) {
          return (
            <Link to={item.link}>
              <i className="fas fa-angle-right" /> {item.label}
            </Link>
          );
        }
        return (
          <div>
            <i className="fas fa-angle-right" /> {item.label}
          </div>
        );
      })}
    </div>
  );
};

BreadCrumb.defaultProps = {
  items: [],
};

export default BreadCrumb;
