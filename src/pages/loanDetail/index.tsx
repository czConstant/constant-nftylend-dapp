import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BodyContainer from "src/common/components/bodyContainer";
import BreadCrumb, { BreadCrumbItem } from "src/common/components/breadCrumb";
import { APP_URL } from "src/common/constants/url";
import last from "lodash/last";
import cx from "classnames";
import { isMobile } from "react-device-detect";

import styles from "./styles.module.scss";
import Loading from "src/common/components/loading";
import { getLoanById } from "src/modules/nftLend/api";
import { LoanDataAsset, ResponseResult } from "src/modules/nftLend/models/api";
import EmptyDetailLoan from "src/modules/nftLend/components/emptyDetailLoan";
import LoanDetailHeader from "./LoanDetail.Header";
import LoanDetailActivity from "./LoanDetail.Activity";
import LoanDetailSuggest from "./LoanDetail.Suggest";
import LoanDetailOffers from "./LoanDetail.Offers";
import { useAppSelector } from "src/store/hooks";
import { selectNftyLend } from "src/store/nftyLend";
import { LoanNft } from 'src/modules/nftLend/models/loan';

const LoanDetail = () => {
  const location = useLocation();
  const pathLoan: string = last(location.pathname.split("/"))?.toString() || '';
  const navigate = useNavigate();

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
  const [loan, setLoan] = useState<LoanNft>();

  useEffect(() => {
    getLoan();
  }, [pathLoan, needReload]);

  const getLoan = async () => {
    setLoading(true);
    try {
      const response: ResponseResult = await getLoanById(pathLoan);
      const result: LoanDataAsset = response.result;

      if (result?.collection?.name) {
        defaultBreadCrumbs.current[1].label = result?.collection.name;
        defaultBreadCrumbs.current[1].link = `${APP_URL.NFT_LENDING_LIST_LOAN}/?collection=${result.collection.seo_url}`;
        defaultBreadCrumbs.current[2].label = result?.name;
      }

      setBreadCrumbs(defaultBreadCrumbs.current);
      setLoan(LoanNft.parseFromApiDetail(result));
    } catch(err) {
      navigate(APP_URL.NFT_LENDING_LIST_LOAN);
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    if (loading) return <Loading />;
    if (!loan || !loan.asset) return <EmptyDetailLoan />;
    return (
      <>
        <BreadCrumb items={breadCrumbs} />
        <LoanDetailHeader asset={loan?.asset} loan={loan} />
        <LoanDetailOffers asset={loan?.asset} loan={loan} />
        <LoanDetailActivity asset={loan?.asset} loan={loan} />
        <LoanDetailSuggest asset={loan?.asset} loan={loan} />
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
