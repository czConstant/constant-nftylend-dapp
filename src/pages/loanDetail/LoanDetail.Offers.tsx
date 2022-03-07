import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { useDispatch } from "react-redux";
import { LoanDetailProps } from "./LoanDetail.Header";

const LoanDetailOffers: React.FC<LoanDetailProps> = ({ loan }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const dispatch = useDispatch();
  
  const offers = loan?.new_loan.offers || [];

  return <div>LoanDetailOffers</div>;
};

export default LoanDetailOffers;
