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
import { LoanDataAsset, ResponseResult } from "src/modules/nftLend/models/api";
import EmptyDetailLoan from "src/modules/nftLend/components/emptyDetailLoan";
import LoanDetailHeader from "./LoanDetail.Header";
import LoanDetailActivity from "./LoanDetail.Activity";
import LoanDetailSuggest from "./LoanDetail.Suggest";
import LoanDetailOffers from "./LoanDetail.Offers";
import { useSelector } from "react-redux";
import { useAppSelector } from "src/store/hooks";
import { selectNftyLend } from "src/store/nftyLend";
import { isMobile } from "react-device-detect";
import { LoanNft } from 'src/modules/nftLend/models/loan';

const LoanDetail = () => {
  const location = useLocation();
  const pathLoan: string = last(location.pathname.split("/"))?.toString() || '';

  const needReload = useAppSelector(selectNftyLend).needReload;

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
  const [detail, setDetail] = useState<LoanNft>();

  useEffect(() => {
    getLoan();
  }, [pathLoan, needReload]);

  const getLoan = async () => {
    setLoading(true);
    try {
      const response: ResponseResult = await getLoanById(pathLoan);
      const result: LoanDataAsset = response.result;

      defaultBreadCrumbs.current[1].label = result.collection.name;
      defaultBreadCrumbs.current[1].link = `${APP_URL.NFT_LENDING_LIST_LOAN}/?collection=${result.collection.seo_url}`;
      defaultBreadCrumbs.current[2].label = result.name;

      setBreadCrumbs(defaultBreadCrumbs.current);
      setDetail(LoanNft.parseFromApiDetail(result));
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    if (loading) return <Loading />;
    if (!detail || !detail.asset) return <EmptyDetailLoan />;
    return (
      <>
        <BreadCrumb items={breadCrumbs} />
        <LoanDetailHeader asset={detail?.asset} loan={detail} />
        <LoanDetailOffers asset={detail?.asset} loan={detail} />
        <LoanDetailActivity asset={detail?.asset} loan={detail} />
        {/* <LoanDetailSuggest asset={detail?.asset} loan={detail} /> */}
      </>
    );
  };

  return (
    <BodyContainer
      className={cx(
        loading && styles.loadingWrap,
        isMobile && styles.mbWrapper,
        styles.wrapper
      )}
    >
      {renderView()}
    </BodyContainer>
  );
};

export default LoanDetail;
