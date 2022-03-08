import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import BodyContainer from "src/common/components/bodyContainer";
import BreadCrumb, { BreadCrumbItem } from "src/common/components/breadCrumb";
import { APP_URL } from "src/common/constants/url";
import LoansHeader from "../loans/Loans.Header";
import last from "lodash/last";
import cx from "classnames";

import styles from "./styles.module.scss";
import Loading from "src/common/components/loading";
import { getLoanById } from "src/modules/nftLend/api";
import { LoanData, LoanDataDetail } from "src/modules/nftLend/models/loan";
import { ResponseResult } from "src/modules/nftLend/models/api";
import EmptyDetailLoan from "src/modules/nftLend/components/emptyDetailLoan";
import LoanDetailHeader from "./LoanDetail.Header";
import LoanDetailActivity from "./LoanDetail.Activity";
import LoanDetailSuggest from "./LoanDetail.Suggest";

const LoanDetail = () => {
  const location = useLocation();
  const pathLoan: string = last(location.pathname.split("/"))?.toString();

  const defaultBreadCrumbs = useRef<BreadCrumbItem[]>([
    {
      label: "Discover",
      link: APP_URL.NFT_LENDING,
    },
    {
      label: "Collections",
      link: APP_URL.NFT_LENDING_LIST_LOAN,
    },
    {
      label: "Loan",
    },
  ]);

  const [breadCrumbs, setBreadCrumbs] = useState<BreadCrumbItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<LoanDataDetail>();

  useEffect(() => {
    getLoan();
  }, [pathLoan]);

  const getLoan = async () => {
    setLoading(true);
    try {
      const response: ResponseResult = await getLoanById(pathLoan);
      const result: LoanDataDetail = response.result;

      defaultBreadCrumbs.current[1].label = result.collection.name;
      defaultBreadCrumbs.current[1].link = result.collection.seo_url;
      defaultBreadCrumbs.current[2].label = result.name;

      setBreadCrumbs(defaultBreadCrumbs.current);
      setDetail(result);
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    if (loading) return <Loading />;
    if (!Boolean(detail)) return <EmptyDetailLoan />;
    return (
      <>
        <BreadCrumb items={breadCrumbs} />
        <LoanDetailHeader loan={detail} />
        <LoanDetailActivity loan={detail} />
        <LoanDetailSuggest loan={detail} />
      </>
    );
  };

  return (
    <BodyContainer
      className={cx(styles.wrapper, loading && styles.loadingWrap)}
    >
      {renderView()}
    </BodyContainer>
  );
};

export default LoanDetail;