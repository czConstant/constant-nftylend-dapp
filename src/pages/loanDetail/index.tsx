import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BodyContainer from "src/common/components/bodyContainer";
import BreadCrumb, { BreadCrumbItem } from "src/common/components/breadCrumb";
import { APP_URL } from "src/common/constants/url";
import last from "lodash/last";
import cx from "classnames";
import { isMobile } from "react-device-detect";
import NftPawn, { AssetData, ResponseResult } from '@nftpawn-js/core';

import styles from "./styles.module.scss";
import Loading from "src/common/components/loading";
import EmptyDetailLoan from "src/views/apps/emptyDetailLoan";
import LoanDetailPawnInfo from "./pawnInfo";
import LoanDetailActivity from "./LoanDetail.Activity";
import LoanDetailSuggest from "./LoanDetail.Suggest";
import { useAppSelector } from "src/store/hooks";
import { selectNftyLend } from "src/store/nftyLend";
import { LoanNft } from 'src/modules/nftLend/models/loan';
import CardNftMedia from 'src/views/apps/CardNftMedia';
import AssetInfo from './assetInfo';
import LoanDetailSaleHistory from './LoanDetail.SaleHistory';

const LoanDetail = () => {
  const location = useLocation();
  const pathLoan: string = last(location.pathname.split("/"))?.toString() || '';
  const navigate = useNavigate();

  const needReload = useAppSelector(selectNftyLend).needReload;

  const defaultBreadCrumbs = useRef<BreadCrumbItem[]>([
    {
      label: "Discover",
      link: APP_URL.DISCOVER,
    },
    {
      label: "Collections",
      link: APP_URL.LIST_LOAN,
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
      const response: ResponseResult = await NftPawn.loan({ seo: pathLoan });
      const result: AssetData = response.result;

      if (result?.collection?.name) {
        defaultBreadCrumbs.current[1].label = result?.collection.name;
        defaultBreadCrumbs.current[1].link = `${APP_URL.LIST_LOAN}/?collection=${result.collection.seo_url}`;
        defaultBreadCrumbs.current[2].label = result?.name;
      }

      setBreadCrumbs(defaultBreadCrumbs.current);
      setLoan(LoanNft.parseFromApiDetail(result));
    } catch(err) {
      navigate(APP_URL.LIST_LOAN);
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
        <div className={styles.headerContainer}>
          <div>
            <CardNftMedia
              detail={loan.asset.detail}
              name={loan.asset.name}
              width={300}
              height={300}
              config={{
                video: {
                  controls: true,
                  controlsList: "nodownload",
                  autoPlay: true,
                  onMouseEnter: () => {},
                  onMouseLeave: () => {},
                },
              }}
              className={styles.itemMedia}
              showOriginal
            />
            <AssetInfo asset={loan.asset} owner={loan.owner} />
          </div>
          <LoanDetailPawnInfo loan={loan} />
        </div>
        <LoanDetailActivity asset={loan?.asset} />
        <LoanDetailSaleHistory asset={loan?.asset} />
        <LoanDetailSuggest loan={loan} />
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
