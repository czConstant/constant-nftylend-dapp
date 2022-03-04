import React, { useMemo } from "react";
import RandomAvatar from "./randomAvatar";

interface LoansHeaderProps {
    
}

const LoansHeader = ({ collection, isLoading, dataLoan }) => {
  const attributes = useMemo(
    () => [
      {
        id: "total_volume",
        label: "Total Volume",
        symbol: "$",
      },
      {
        id: "avg24h_amount",
        label: "Avg Sale Price",
        symbol: "$",
      },
      {
        id: "total_listed",
        label: "Total Listed Count",
      },
    ],
    []
  );

  return (
    <div>
      <RandomAvatar images={dataLoan?.result} />
    </div>
  );
};

export default LoansHeader;
