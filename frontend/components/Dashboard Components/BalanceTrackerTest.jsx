import { Coins } from 'lucide-react';
import React from 'react'

const BalanceTrackerTest = ({ Data }) => {
  const currentBalance = Data?.balanceTracker?.currentBalance ?? 0;
  const totalAmount = Data?.balanceTracker?.totalAmount ?? 0;

  return (
    <div className="bg-[#1E2646] p-4 m-2 rounded-md relative w-full">
      <div className="flex">
        <h1 className="text-base font-bold pb-1">Available Balance:</h1>
      </div>
      <div>
        <p className="text-2xl">
          <span className="font-semibold">{formatRupees(currentBalance)}</span>{" "}
          <span className="text-sm text-neutral-400">
            / {formatRupees(totalAmount)}
          </span>
        </p>
      </div>
      <div className="absolute right-5 bottom-5">
        <Coins className="scale-150 text-neutral-400" />
      </div>
    </div>
  );
};

export default BalanceTrackerTest