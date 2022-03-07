import { Collapse } from 'react-bootstrap';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';


import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { selectNftBridge } from 'src/store/nftBridge';

import useCheckIfWormholeWrapped from '../../hooks/useCheckIfWormholeWrapped';
import useFetchTargetAsset from '../../hooks/useFetchTargetAsset';
import { setSourceChain, setStep, setTargetChain } from '../../store/nftSlice';
import {
  selectNFTActiveStep,
  selectNFTIsRedeemComplete,
  selectNFTIsRedeeming,
  selectNFTIsSendComplete,
  selectNFTIsSending,
} from '../../store/selectors';
import { CHAINS_WITH_NFT_SUPPORT } from '../../utils/consts';
import Redeem from './Redeem';
import RedeemPreview from './RedeemPreview';
import Send from './Send';
import SendPreview from './SendPreview';
import Source from './Source';
import SourcePreview from './SourcePreview';
import Target from './Target';
import TargetPreview from './TargetPreview';

import styles from './transfer.module.scss';
import StepSource from '../stepSource';

const STEPS = {
  source: 0,
  target: 1,
  send: 2,
  redeem: 3,
}

const Transfer = () => {

  const nftBridgeState = useAppSelector(selectNftBridge);
  const { sourceChain, targetChain } = nftBridgeState;

  const [currentStep,  setCurrentStep] = useState(STEPS.source);

  useCheckIfWormholeWrapped(true);
  useFetchTargetAsset(true);
  const dispatch = useAppDispatch();
  const activeStep = useAppSelector(selectNFTActiveStep);
  const isSending = useAppSelector(selectNFTIsSending);
  const isSendComplete = useAppSelector(selectNFTIsSendComplete);
  const isRedeeming = useAppSelector(selectNFTIsRedeeming);
  const isRedeemComplete = useAppSelector(selectNFTIsRedeemComplete);
  const preventNavigation =
    (isSending || isSendComplete || isRedeeming) && !isRedeemComplete;

  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const pathSourceChain = query.get('sourceChain');
  const pathTargetChain = query.get('targetChain');

  //This effect initializes the state based on the path params
  useEffect(() => {
    if (!pathSourceChain && !pathTargetChain) {
      return;
    }
    try {
      const sourceChain: ChainId | undefined = CHAINS_WITH_NFT_SUPPORT.find(
        (x) => parseFloat(pathSourceChain || '') === x.id
      )?.id;
      const targetChain: ChainId | undefined = CHAINS_WITH_NFT_SUPPORT.find(
        (x) => parseFloat(pathTargetChain || '') === x.id
      )?.id;

      if (sourceChain === targetChain) {
        return;
      }
      if (sourceChain) {
        dispatch(setSourceChain(sourceChain));
      }
      if (targetChain) {
        dispatch(setTargetChain(targetChain));
      }
    } catch (e) {
      console.error('Invalid path params specified.');
    }
  }, [pathSourceChain, pathTargetChain, dispatch]);

  useEffect(() => {
    if (preventNavigation) {
      window.onbeforeunload = () => true;
      return () => {
        window.onbeforeunload = null;
      };
    }
  }, [preventNavigation]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.stepWrapper}>
        <div className={styles.title}>1. Source</div>
        <Collapse in={currentStep === STEPS.source}>
          <div>
            <StepSource />
          </div>
        </Collapse>
      </div>
      <div className={styles.stepWrapper}>
        <div className={styles.title}>2. Target</div>
        <Collapse in={false}>
          <div>
            <StepSource />
          </div>
        </Collapse>
      </div>
      <div className={styles.stepWrapper}>
        <div className={styles.title}>3. Send</div>
        <Collapse in={currentStep === STEPS.send}>
          <div>
            <StepSource />
          </div>
        </Collapse>
      </div>
      <div className={styles.stepWrapper}>
        <div className={styles.title}>4. Redeem</div>
        <Collapse in={currentStep === STEPS.redeem}>
          <div>
            <StepSource />
          </div>
        </Collapse>
      </div>
    </div>
  );
}

export default Transfer;
