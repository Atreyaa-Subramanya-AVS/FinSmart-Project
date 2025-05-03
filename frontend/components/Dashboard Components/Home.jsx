"use client";

import { useEffect, useState } from "react";
import Loading_Dashboard from "./Loading_Dashboard";
import {
  ArrowUpDown,
  Banknote,
  BanknoteIcon,
  ChartPie,
  Coins,
  CoinsIcon,
  HandCoins,
  PiggyBank,
  Pizza,
  ReceiptIndianRupee,
  ShoppingBag,
  Triangle,
} from "lucide-react";

import {
  Pie,
  PieChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  Label,
  Cell,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import CircleProgressBar from "./CircleProgressBar";
import DashboardAI from "./DashboardAI";
import Data from "./dummy2.json";
import clsx from "clsx";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
};

const chartConfig3 = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(Data._id);
    }
  }, []);

  return (
    <div className="min-h-[89vh] bg-[#333] rounded-lg overflow-x-hidden">
      {/* {isLoading ? (
        <div className="flex w-full justify-center items-center h-[89svh]">
          <Loading_Dashboard />
        </div>
      ) : ( */}
      <div className="grid grid-cols-3 gap-2 max-lg:grid-cols-2 pb-4">
        <div className="w-full max-lg:col-span-3 max-lg:px-6 max-w-screen-md mx-auto">
          <BalanceTracker />
          <MoneyInMoneyOut />
          <p className="inline-flex gap-2 justify-center w-full text-sm items-center mt-2">
            <ArrowUpDown />
            Spending and Saving Rates
          </p>
          <SpendingSaving />
        </div>
        {/* -------- Money Distribution ------ */}
        <div className="max-lg:w-full col-span-2 max-lg:col-span-3 max-lg:p-4">
          <MoneyDistribution />
        </div>
        {/* -------- End of Money Distribution ------ */}
        <div className="grid grid-cols-3 col-span-3 max-xl:grid-cols-2 max-md:grid-cols-1">
          <ExpectedIncome className="p-2" />
          <ExpectedBudget />
          <BillsBudget />
          <DebtsPaymentGoal />
          <SavingsGoal />
          <MiscellaneousExpenses />
        </div>
        <div className="col-span-3 grid grid-cols-2 gap-4 px-2 max-md:grid-cols-1">
          <IncomeSources className="bg-[#444] h-fit" />
          <InvestmentDistribution className="bg-[#444] h-fit" />
        </div>
        <div className="grid grid-cols-3 col-span-3 max-lg:grid-cols-2 max-md:grid-cols-1">
          <div className="p-2">
            <ExpenseCategories className="" />
          </div>
          <div className="p-2">
            <BillsCategories />
          </div>
          <div className="p-2">
            <DebtsCategories />
          </div>
          <div className="col-span-3 max-md:col-span-1 max-lg:col-span-2 max-lg:p-4 mx-auto bg-black md:px-12 py-3 rounded-md my-5 max-lg:w-[80%]">
            <Notes />
          </div>
        </div>
      </div>
      {/* <DashboardAI /> */}
      {/* )} */}
    </div>
  );
}

const formatRupees = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const BalanceTracker = () => (
  <div className="bg-[#1E2646] p-4 m-2 rounded-md relative w-full">
    <div className="flex">
      <h1 className="text-base font-bold pb-1">Available Balance:</h1>
    </div>
    <div>
      <p className="text-2xl">
        <span className="font-semibold">
          {formatRupees(Data.balanceTracker.currentBalance)}
        </span>{" "}
        <span className="text-sm text-neutral-400">
          / {formatRupees(Data.balanceTracker.totalBalance)}
        </span>
      </p>
    </div>
    <div className="absolute right-5 bottom-5">
      <Coins className="scale-150 text-neutral-400" />
    </div>
  </div>
);

// Done
const MoneyInMoneyOut = () => (
  <div className="grid grid-cols-2 m-2 gap-4 w-full justify-between rounded-md">
    <div className="bg-[#444] relative px-2 flex flex-col gap-4 py-4 rounded-md">
      <div>
        <h1 className="text-green-500 text-md">Money In:</h1>
        <p className="font-bold text-2xl">
          {formatRupees(Data.moneyInMoneyOut.moneyIn)}
        </p>
      </div>
      <div className="absolute top-1 right-2">
        <Banknote className="text-neutral-300" />
      </div>
      <div>
        <p className="text-sm">Previous Balance:</p>
        <p>{formatRupees(Data.moneyInMoneyOut.previousBalance)}</p>
      </div>
    </div>
    <div className="bg-[#444] relative px-2 rounded-md flex flex-col gap-4 py-4">
      <div>
        <h1 className="text-red-500 text-md">Money Out:</h1>
        <p className="font-bold text-2xl">
          {formatRupees(Data.moneyInMoneyOut.moneyOut)}
        </p>
      </div>
      <div className="absolute top-1 right-2">
        <ShoppingBag className="scale-90 text-neutral-300" />
      </div>
      <div className="text-xs text-pretty">
        <p>(Expenses + Bills + Savings + Debts)</p>
      </div>
    </div>
  </div>
);

//Done
const SpendingSaving = () => {
  const spending = Data.moneyInMoneyOut.moneyOut;
  const saving = Data.moneyInMoneyOut.moneyIn - spending;
  const total = Data.balanceTracker.totalBalance || 1; // Avoid division by 0

  return (
    <div className="flex bg-[#444] justify-between px-4 py-3 m-2 rounded-md w-full">
      <div className="flex flex-col">
        <p className="text-red-500">You are spending</p>
        <p className="font-bold text-xl">
          {((spending / total) * 100).toFixed(1)}%
        </p>
        <p className="text-sm text-neutral-400">of your income</p>
      </div>
      <div className="flex flex-col">
        <p className="text-green-500">You are saving</p>
        <p className="font-bold text-xl">
          {((saving / total) * 100).toFixed(1)}%
        </p>
        <p className="text-sm text-neutral-400">of your income</p>
      </div>
    </div>
  );
};

//Done
const ExpectedIncome = () => {
  const income = Data.expectedIncome.moneyIn;
  const expected = Data.expectedIncome.expected;
  const isIncomeUnderExpected = income < expected;

  return (
    <div className="m-2 bg-[#444] p-4 max-md:pb-12 rounded-md h-[fit-content] relative">
      <div className="flex flex-col justify-between w-full p-2 rounded-md">
        <div
          className={`flex gap-1 ${
            isIncomeUnderExpected ? "" : "items-center"
          }`}
        >
          <Triangle
            className={clsx(
              `scale-75 rotate-180 pb-1 border-none stroke-none ${
                isIncomeUnderExpected
                  ? "fill-red-500"
                  : "rotate-0 fill-green-500"
              }`
            )}
          />
          <h1 className="pb-2 inline-flex text-lg font-bold">
            Expected Income
          </h1>
        </div>
        <div className="flex justify-between w-full">
          {/* Money In */}
          <div>
            <p className="text-md">Money In:</p>
            <p className="text-lg font-semibold max-md:text-base">
              {formatRupees(income)}
            </p>
          </div>

          {/* Expected */}
          <div>
            <p className="text-md">Expected:</p>
            <p className="text-lg font-semibold max-md:text-base">
              {formatRupees(expected)}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 items-center md:gap-12 lg:p-4 max-md:grid-cols-2">
        <div className="md:col-span-1 w-fit max-md:mt-5">
          <CircleProgressBar
            percentage={Math.min((income / expected) * 100, 100).toFixed(1)}
            strokeColor="hsl(var(--chart-1))"
            className="contrast-200"
            circleWidth={100}
          />
        </div>
        <div className="md:col-span-2 col-span-1">
          <p className="text-sm font-medium py-2">Progress this year</p>
          <p className="text-lg font-bold leading-none text-balance">
            Income {isIncomeUnderExpected ? "under" : "over"} expected{" "}
            <span>{formatRupees(Math.abs(expected - income))}</span>
          </p>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 bg-neutral-600 p-2 rounded-md rounded-tr-none rounded-bl-none">
        <BanknoteIcon />
      </div>
    </div>
  );
};

//Done
const ExpectedBudget = () => {
  const expenses = Data.expectedBudget.expenses;
  const budget = Data.expectedBudget.budget;
  const isExpensesUnderBudget = expenses <= budget;

  return (
    <div className="m-2 bg-[#444] p-4 max-md:pb-12 rounded-md h-[fit-content] relative">
      <div className="flex flex-col justify-between w-full p-2 rounded-md">
        <div className={`flex gap-1 ${isExpensesUnderBudget ? "" : ""}`}>
          <Triangle
            className={clsx(
              `scale-75 rotate-180 pb-1 border-none stroke-none ${
                isExpensesUnderBudget
                  ? "fill-green-500 rotate-0"
                  : "fill-red-500"
              }`
            )}
          />
          <h1 className="pb-2 inline-flex text-lg font-bold">
            Expected Budget
          </h1>
        </div>
        <div className="flex justify-between w-full">
          {/* Expenses */}
          <div>
            <p className="text-md">Expenses:</p>
            <p className="text-lg font-semibold max-md:text-base">
              {formatRupees(expenses)}
            </p>
          </div>

          {/* Budget */}
          <div>
            <p className="text-md">Budget:</p>
            <p className="text-lg font-semibold max-md:text-base">
              {formatRupees(budget)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 items-center md:gap-12 lg:p-4 max-md:grid-cols-2">
        <div className="md:col-span-1 w-fit max-md:mt-5">
          <CircleProgressBar
            percentage={Math.min((expenses / budget) * 100, 100).toFixed(1)}
            strokeColor="hsl(var(--chart-4))"
            className="contrast-200"
            circleWidth={100}
          />
        </div>
        <div className="md:col-span-2 col-span-1">
          <p className="text-sm font-medium py-2">Progress this year</p>
          <p className="text-lg font-bold leading-none">
            Expenses {isExpensesUnderBudget ? "under" : "over"} budget{" "}
            <span>{formatRupees(Math.abs(budget - expenses))}</span>
          </p>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 bg-neutral-600 p-2 rounded-md rounded-tr-none rounded-bl-none">
        <Pizza />
      </div>
    </div>
  );
};

//Done
const MoneyDistribution = () => {
  const moneyDistribution = Data.moneyDistribution;
  const totalAmount = moneyDistribution.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="grid lg:col-span-2 m-2 relative">
      <div className="flex justify-between flex-1 bg-black rounded-md max-md:flex-col">
        <div className="m-4 text-lg text-[#ccc] relative">
          <p className="font-bold">Money Distribution</p>
          <div className="flex text-white my-4 gap-4 whitespace-nowrap">
            <div className="text-stone-500 text-md font-semibold">
              <p>Money In:</p>
              <p>Previous Balance:</p>
            </div>
            <div>
              <p className="">{formatRupees(Data.moneyInMoneyOut.moneyIn)}</p>
              <p className="border-b-2 border-[#ccc]">
                {formatRupees(Data.moneyInMoneyOut.previousBalance)}
              </p>
              <p>
                {formatRupees(
                  Data.moneyInMoneyOut.moneyIn -
                    Data.moneyInMoneyOut.previousBalance
                )}
              </p>
            </div>
          </div>
          <div className="my-4 mx-auto w-full">
            <p className="text-md font-bold my-2">Categories</p>
            <div className="flex flex-col">
              {moneyDistribution.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-3 justify-between ${
                    index === moneyDistribution.length - 1
                      ? "border-b-2 border-[#ccc]"
                      : ""
                  }`}
                >
                  <p className="">{((item.amount / totalAmount) * 100).toFixed(2)}%</p>

                  <p className="inline-flex justify-start items-center -mt-[0.4rem] gap-1 -ml-2">
                    <span
                      className="p-1 rounded-lg mt-5 my-4 inline-block"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    {item.category}
                  </p>

                  <p>₹ {item.amount.toLocaleString()}</p>
                </div>
              ))}

              <div className="flex justify-between w-full">
                <p>100%</p>
                <p>
                  ₹{" "}
                  {moneyDistribution
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-4 bottom-4">
          <ChartPie className="text-neutral-400" />
        </div>

        <div className="flex flex-col gap-12 flex-1 bg-black my-auto">
          <Card className="flex flex-col bg-black border-none">
            <CardHeader className="items-center pb-0">
              <CardTitle>Distribution</CardTitle>
              <CardDescription>Pie-Chart</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={Data.moneyDistribution}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={40}
                  >
                    {Data.moneyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none text-muted-foreground text-pretty text-center">
                Total Distribution of your money.
              </div>
              <div className="leading-none text-muted-foreground text-xs">
                Donut-Pie Chart
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

//Done
const BillsBudget = () => (
  <div className="m-2 bg-[#444] p-4 max-md:pb-12 rounded-md h-[fit-content] relative">
    <div className="flex flex-col justify-between w-full p-2 rounded-md">
      <div className="flex gap-1">
        <Triangle
          className={clsx(
            `scale-75 rotate-180 pb-1 border-none stroke-none ${
              Data.billsBudget.bills > Data.billsBudget.budget
                ? "fill-red-500"
                : "rotate-0 fill-green-500"
            }`
          )}
        />
        <h1 className="pb-2 inline-flex text-lg font-bold">Bills Budget</h1>
      </div>
      <div className="flex justify-between w-full">
        {/* Money In */}
        <div>
          <p className="text-md">Bills:</p>
          <p className="text-lg font-semibold max-md:text-base">
            {formatRupees(Data.billsBudget.bills)}
          </p>
        </div>

        {/* Expected */}
        <div>
          <p className="text-md">Budget:</p>
          <p className="text-lg font-semibold max-md:text-base">
            {formatRupees(Data.billsBudget.budget)}
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-3 items-center md:gap-12 lg:p-4 max-md:grid-cols-2">
      <div className="md:col-span-1 w-fit max-md:mt-5">
        <CircleProgressBar
          percentage={(
            (Data.billsBudget.bills / Data.billsBudget.budget) *
            100
          ).toFixed(1)}
          strokeColor="hsl(var(--chart-11))"
          className="contrast-200"
          circleWidth={100}
        />
      </div>
      <div className="md:col-span-2 col-span-1">
        <p className="text-sm font-medium py-2">Progress this year</p>
        <p className="text-lg font-bold leading-none">
          Bills in Budget{" "}
          {formatRupees(Data.billsBudget.budget - Data.billsBudget.bills)}
        </p>
      </div>
    </div>
    <div className="absolute right-0 bottom-0 bg-neutral-600 p-2 rounded-md rounded-tr-none rounded-bl-none">
      <ReceiptIndianRupee />
    </div>
  </div>
);

//Done
const DebtsPaymentGoal = () => {
  const debtsPaid = Data.debtsPaymentGoal.debtsPaid;
  const goal = Data.debtsPaymentGoal.goal;
  const isDebtsPaidUnderGoal = debtsPaid < goal;

  return (
    <div className="m-2 bg-[#444] p-4 max-md:pb-12 rounded-md h-[fit-content] relative">
      <div className="flex flex-col justify-between w-full p-2 rounded-md">
        <div
          className={`flex gap-1 ${!isDebtsPaidUnderGoal && "items-center"}`}
        >
          <Triangle
            className={clsx(
              `scale-75 rotate-180 pb-1 border-none stroke-none ${
                isDebtsPaidUnderGoal
                  ? "fill-red-500"
                  : "rotate-0 fill-green-500"
              }`
            )}
          />
          <h1 className="pb-2 inline-flex text-lg font-bold">
            Debts Payment Goal
          </h1>
        </div>
        <div className="flex justify-between w-full">
          {/* Debts Paid */}
          <div>
            <p className="text-md">Debts Paid:</p>
            <p className="text-lg font-semibold max-md:text-base">
              {formatRupees(debtsPaid)}
            </p>
          </div>

          {/* Goal */}
          <div>
            <p className="text-md">Goal:</p>
            <p className="text-lg font-semibold max-md:text-base">
              {formatRupees(goal)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 items-center md:gap-12 lg:p-4 max-md:grid-cols-2">
        <div className="md:col-span-1 w-fit max-md:mt-5">
          <CircleProgressBar
            percentage={Math.min((debtsPaid / goal) * 100, 100).toFixed(1)}
            strokeColor="hsl(var(--chart-12))"
            className="contrast-200"
            circleWidth={100}
          />
        </div>
        <div className="md:col-span-2 col-span-1">
          <p className="text-sm font-medium py-2">Progress this year</p>
          <p className="text-lg font-bold leading-none">
            Debts {isDebtsPaidUnderGoal ? "unpaid" : "over"} goal{" "}
            <span>{formatRupees(Math.abs(goal - debtsPaid))}</span>
          </p>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 bg-neutral-600 p-2 rounded-md rounded-tr-none rounded-bl-none">
        <HandCoins />
      </div>
    </div>
  );
};

//Done
const SavingsGoal = () => {
  const moneySaved = Data.savingsGoal.moneySaved;
  const goal = Data.savingsGoal.goal;
  const isSavingsUnderGoal = moneySaved < goal;

  return (
    <div className="m-2 bg-[#444] p-4 max-md:pb-12 rounded-md h-[fit-content] relative">
      <div className="flex flex-col justify-between w-full p-2 rounded-md">
        <div className={`flex gap-1 ${!isSavingsUnderGoal && "items-center"}`}>
          <Triangle
            className={clsx(
              `scale-75 rotate-180 pb-1 border-none stroke-none ${
                isSavingsUnderGoal ? "fill-red-500" : "rotate-0 fill-green-500"
              }`
            )}
          />
          <h1 className="pb-2 inline-flex text-lg font-bold">Savings Goal</h1>
        </div>
        <div className="flex justify-between w-full">
          {/* Money Saved */}
          <div>
            <p className="text-md">Money Saved:</p>
            <p className="text-lg font-semibold max-md:text-base">
              {formatRupees(moneySaved)}
            </p>
          </div>

          {/* Goal */}
          <div>
            <p className="text-md">Goal:</p>
            <p className="text-lg font-semibold max-md:text-base">
              {formatRupees(goal)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 items-center md:gap-12 lg:p-4 max-md:grid-cols-2">
        <div className="md:col-span-1 w-fit max-md:mt-5">
          <CircleProgressBar
            percentage={Math.min((moneySaved / goal) * 100, 100).toFixed(1)}
            strokeColor="hsl(var(--chart-14))"
            className="contrast-200"
            circleWidth={100}
          />
        </div>
        <div className="md:col-span-2 col-span-1">
          <p className="text-sm font-medium py-2">Progress this year</p>
          <p className="text-lg font-bold leading-none">
            Savings {isSavingsUnderGoal ? "under" : "over"} goal{" "}
            {formatRupees(Math.abs(goal - moneySaved))}
          </p>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 bg-neutral-600 p-2 rounded-md rounded-tr-none rounded-bl-none">
        <PiggyBank />
      </div>
    </div>
  );
};

//Done
const MiscellaneousExpenses = () => {
  const expenses = Data.miscellaneousExpenses.expenses;
  const budget = Data.miscellaneousExpenses.budget;
  const isOverBudget = expenses > budget;

  return (
    <div className="m-2 bg-[#444] p-4 max-md:pb-12 rounded-md h-[fit-content] relative">
      <div className="flex flex-col justify-between w-full p-2 rounded-md">
        <div className={`flex gap-1 ${!isOverBudget && ""}`}>
          <Triangle
            className={clsx(
              `scale-75 rotate-180 pb-1 border-none stroke-none ${
                isOverBudget ? "fill-red-500" : "rotate-0 fill-green-500"
              }`
            )}
          />
          <h1 className="pb-2 inline-flex text-lg font-bold">Misc. Expenses</h1>
        </div>
        <div className="flex justify-between w-full">
          <div>
            <p className="text-md">Expenses:</p>
            <p className="text-lg font-semibold max-md:text-base">
              {formatRupees(expenses)}
            </p>
          </div>
          <div>
            <p className="text-md">Budget:</p>
            <p className="text-lg font-semibold max-md:text-base">
              {formatRupees(budget)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 items-center md:gap-12 lg:p-4 max-md:grid-cols-2">
        <div className="md:col-span-1 w-fit max-md:mt-5">
          <CircleProgressBar
            percentage={Math.min((expenses / budget) * 100, 100).toFixed(1)}
            strokeColor="hsl(var(--chart-20))"
            className="contrast-200"
            circleWidth={100}
          />
        </div>
        <div className="md:col-span-2 col-span-1">
          <p className="text-sm font-medium py-2">Progress this year</p>
          <p className="text-lg font-bold leading-none">
            Misc. Costs {isOverBudget ? "over" : "under"} budget{" "}
            {formatRupees(Math.abs(budget - expenses))}
          </p>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 bg-neutral-600 p-2 rounded-md rounded-tr-none rounded-bl-none">
        <CoinsIcon />
      </div>
    </div>
  );
};

//Done
const IncomeSources = ({ className }) => {
  const chartData = Data?.incomeSourcesGraph || [];

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">Income Sources</CardTitle>
        <CardDescription>Graph of all Income Sources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="5 5" />
              <XAxis
                dataKey="source"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{
                  fill: "#eee",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />
              <Bar
                dataKey="amount"
                fill="hsl(var(--chart-3))"
                radius={[8, 8, 0, 0]}
              >
                <LabelList
                  dataKey="amount"
                  position="top"
                  offset={10}
                  className="fill-foreground"
                  fontSize={12}
                  fontWeight={"500"}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

//Done
const InvestmentDistribution = ({ className }) => {
  const chartData = Data?.investmentDistributionGraph || [];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Investment Distribution</CardTitle>
        <CardDescription>Graph of all Investment Distributions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="5 5" />

              <XAxis
                dataKey="type"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={0}
                angle={-45}
                height={60}
                textAnchor="end"
                tick={{
                  fill: "#eee",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />

              <Bar
                dataKey="amount"
                fill="hsl(var(--chart-4))"
                radius={[8, 8, 0, 0]}
              >
                <LabelList
                  dataKey="amount"
                  position="top"
                  offset={10}
                  className="fill-foreground"
                  fontSize={12}
                  fontWeight={"500"}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const ExpenseCategories = ({ className }) => {
  const expenseCategories = Data.expenseCategories;
  const total = expenseCategories.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className={`${className} flex flex-col h-full bg-[#222]`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Expense Categories</CardTitle>
        <CardDescription>Distribution:</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig3}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={expenseCategories}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              {expenseCategories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy - 20}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 10}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ₹{total.toLocaleString("en-IN")}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center justify-between gap-2 font-medium leading-none w-full">
          <div className="space-y-2">
            {expenseCategories.map((item, index) => (
              <p key={index} className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span>{((item.amount / total) * 100).toFixed(1)}%</span>
                {item.category}
              </p>
            ))}
          </div>

          <div className="space-y-2">
            {expenseCategories.map((item, index) => (
              <p key={index}>₹ {item.amount.toLocaleString("en-IN")}</p>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

//Done
const BillsCategories = ({ className }) => {
  const billsCategoriesData = Data.billsCategories;
  const total = billsCategoriesData.reduce((sum, item) => sum + item.amount, 0);

  const billsCategoriesPie = billsCategoriesData.map((item) => ({
    browser: item.category,
    visitors: item.amount,
    fill: item.color,
  }));

  return (
    <Card className={`${className} flex flex-col h-full bg-[#222]`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Bills Categories</CardTitle>
        <CardDescription>Distribution:</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig3}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={billsCategoriesPie}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox?.cx && viewBox?.cy) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy - 20}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 10}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ₹{total.toLocaleString("en-IN")}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center justify-between gap-2 font-medium leading-none w-full">
          <div className="space-y-2">
            {billsCategoriesData.map((item, index) => (
              <p key={index} className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span>{((item.amount / total) * 100).toFixed(1)}%</span>
                {item.category}
              </p>
            ))}
          </div>
          <div className="space-y-2">
            {billsCategoriesData.map((item, index) => (
              <p key={index}>₹ {item.amount.toLocaleString("en-IN")}</p>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

//Done
const DebtsCategories = ({ className }) => {
  const debtsCategoriesData = Data.debtsCategories;
  const total = debtsCategoriesData.reduce((sum, item) => sum + item.amount, 0);

  const debtsCategoriesPie = debtsCategoriesData.map((item) => ({
    browser: item.category,
    visitors: item.amount,
    fill: item.color,
  }));

  return (
    <Card className={`${className} flex flex-col h-full bg-[#222]`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Debts Categories</CardTitle>
        <CardDescription>Distribution:</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig3}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={debtsCategoriesPie}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox?.cx && viewBox?.cy) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy - 20}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 10}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ₹
                          {Data.debtsPaymentGoal.debtsPaid.toLocaleString(
                            "en-IN"
                          )}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center justify-between gap-2 font-medium leading-none w-full">
          <div className="space-y-2">
            {debtsCategoriesData.map((item, index) => (
              <p key={index} className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span>{((item.amount / total) * 100).toFixed(1)}%</span>
                {item.category}
              </p>
            ))}
          </div>
          <div className="space-y-2">
            {debtsCategoriesData.map((item, index) => (
              <p key={index}>₹ {item.amount.toLocaleString("en-IN")}</p>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const Notes = ({ className }) => {
  return (
    <div className="cols-span-1 md:col-span-2 lg:col-span-3 ">
      <h1>{Data.notes}</h1>
    </div>
  );
};
