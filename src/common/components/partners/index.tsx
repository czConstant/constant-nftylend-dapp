import React, { memo } from "react";
import { isMobile } from "react-device-detect";
import cx from "classnames";

import styles from "./styles.module.scss";
import imgPartner1 from "./assets/partner_1.png";
import imgPartner2 from "./assets/partner_2.png";
import imgPartner3 from "./assets/partner_3.png";
import imgPartner4 from "./assets/partner_4.png";
import imgPartner5 from "./assets/partner_5.png";
import imgPartner6 from "./assets/partner_6.png";
import imgPartner7 from "./assets/partner_7.png";
import imgPartner8 from "./assets/partner_8.png";
import imgPartner9 from "./assets/partner_9.png";

const logoPartners = [
  imgPartner1,
  imgPartner2,
  imgPartner9,
  imgPartner3,
  imgPartner4,
  imgPartner5,
  imgPartner6,
  imgPartner7,
  imgPartner8,
];

const HomePartner = ({ className }) => {
  return (
    <section className={cx(isMobile && styles.mbSection, styles.section)}>
      <div className={styles.sectionBgOurPartner}>
        <div className={cx(className.coloredText, "top-title")}>
          PAWN PROTOCOL
        </div>
        <h2>Partners</h2>
        <div className={styles.wrapPartner}>
          {logoPartners.map((v) => (
            <div key={v}>
              <img src={v} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(HomePartner);
