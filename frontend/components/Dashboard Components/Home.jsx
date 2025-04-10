"use client";

import { use, useEffect, useState } from "react";
import Loading_Dashboard from "./Loading_Dashboard";
import {
  ArrowUpDown,
  Banknote,
  ChartPie,
  Coins,
  HandCoins,
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
import Data from "./dummy.json";


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

const chartData2 = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig2 = {
  desktop: {
    label: "Desktop",
    color: "hsl(0,0%,100%)",
  },
};

const chartData3 = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 200, fill: "var(--color-other)" },
];

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
    <div className=" min-h-[89vh] bg-[#333] rounded-lg">
      {/* {isLoading ? (
        <div className="flex w-full justify-center items-center h-[89svh]">
          <Loading_Dashboard />
        </div>
      ) : ( */}
      <div className="grid grid-cols-3 gap-2 max-lg:grid-cols-2 pb-4">
        <div className="w-full max-lg:col-span-2 max-lg:px-6">
          <BalanceTracker />
          <MoneyInMoneyOut />
          <p className="inline-flex gap-2 justify-center w-full text-sm items-center mt-2">
            <ArrowUpDown />
            Spending and Saving Rates
          </p>
          <SpendingSaving />
        </div>
        {/* -------- Money Distribution ------ */}
        <MoneyDistribution />
        {/* -------- End of Money Distribution ------ */}
        <ExpectedIncome className="p-2" />
        <ExpectedBudget />
        <BillsBudget />
        <DebtsPaymentGoal />
        <SavingsGoal />
        <MiscellaneousExpenses />
        <div className="col-span-3 grid grid-cols-2 gap-4 px-2">
          <IncomeSources className="bg-[#444] h-fit" />
          <InvestmentDistribution className="bg-[#444] h-fit" />
        </div>
        <div className="p-2">
          <ExpenseCategories className="" />
        </div>
        <div className="p-2">
          <BillsCategories />
        </div>
        <div className="p-2">
          <DebtsCategories />
        </div>
      </div>
      <DashboardAI />
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
const SpendingSaving = () => (
  <div className="flex bg-[#444] justify-between px-4 py-3 m-2 rounded-md w-full">
    <div className="flex flex-col">
      <p className="text-red-500">You are spending</p>
      <p className="font-bold text-xl">
        {(
          (Data.spendingSaving.spending / Data.balanceTracker.totalBalance) *
          100
        ).toFixed(1)}
        %
      </p>
      <p className="text-sm text-neutral-400">of your income</p>
    </div>
    <div className="flex flex-col">
      <p className="text-green-500">You are saving</p>
      <p className="font-bold text-xl">
        {(
          (Data.spendingSaving.saving / Data.balanceTracker.totalBalance) *
          100
        ).toFixed(1)}
        %
      </p>
      <p className="text-sm text-neutral-400">of your income</p>
    </div>
  </div>
);

//Done
const ExpectedIncome = () => (
  <div className="m-2 bg-[#444] p-4 max-md:pb-12 rounded-md h-[fit-content] relative">
    <div className="flex flex-col justify-between w-full p-2 rounded-md">
      <div className="flex gap-1">
        <Triangle className="scale-75 rotate-180 pb-1 border-none stroke-none fill-red-500" />
        <h1 className="pb-2 inline-flex text-lg font-bold">Expected Income</h1>
      </div>
      <div className="flex justify-between w-full">
        {/* Money In */}
        <div>
          <p className="text-md">Money In:</p>
          <p className="text-lg font-semibold max-md:text-base">
            {formatRupees(Data.expectedIncome.moneyIn)}
          </p>
        </div>

        {/* Expected */}
        <div>
          <p className="text-md">Expected:</p>
          <p className="text-lg font-semibold max-md:text-base">
            {formatRupees(Data.expectedIncome.expected)}
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-3 items-center md:gap-12 lg:p-4 max-md:grid-cols-2">
      <div className="md:col-span-1 w-fit">
        <CircleProgressBar
          percentage={(
            (Data.expectedIncome.moneyIn / Data.expectedIncome.expected) *
            100
          ).toFixed(1)}
          strokeColor="#019D45"
          circleWidth={100}
        />
      </div>
      <div className="md:col-span-2 col-span-1">
        <p className="text-sm font-medium py-2">Progress this year</p>
        <p className="text-lg font-bold leading-none text-balance">
          Income under expected{" "}
          <span>
            {formatRupees(
              Data.expectedIncome.expected - Data.expectedIncome.moneyIn
            )}
          </span>
        </p>
      </div>
    </div>
    <div className="absolute right-0 bottom-0 bg-neutral-600 p-2 rounded-md rounded-tr-none rounded-bl-none">
      <HandCoins />
    </div>
  </div>
);

//Done
const ExpectedBudget = () => (
  <div className="m-2 bg-[#444] p-4 max-md:pb-12 rounded-md h-[fit-content] relative">
    <div className="flex flex-col justify-between w-full p-2 rounded-md">
      <div className="flex gap-1">
        <Triangle className="scale-75 rotate-180 pb-1 border-none stroke-none fill-red-500" />
        <h1 className="pb-2 inline-flex text-lg font-bold">Expected Budget</h1>
      </div>
      <div className="flex justify-between w-full">
        {/* Money In */}
        <div>
          <p className="text-md">Expenses:</p>
          <p className="text-lg font-semibold max-md:text-base">
            {formatRupees(Data.expectedBudget.expenses)}
          </p>
        </div>

        {/* Expected */}
        <div>
          <p className="text-md">Budget:</p>
          <p className="text-lg font-semibold max-md:text-base">
            {formatRupees(Data.expectedBudget.budget)}
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-3 items-center md:gap-12 lg:p-4 max-md:grid-cols-2">
      <div className="md:col-span-1 w-fit">
        <CircleProgressBar
          percentage={(
            (Data.expectedBudget.expenses / Data.expectedBudget.budget) *
            100
          ).toFixed(1)}
          strokeColor="#019D45"
          circleWidth={100}
        />
      </div>
      <div className="md:col-span-2 col-span-1">
        <p className="text-sm font-medium py-2">Progress this year</p>
        <p className="text-lg font-bold leading-none">
          Expenses in Budget{" "}
          {formatRupees(Data.expectedBudget.budget - Data.expectedBudget.bills)}
        </p>
      </div>
    </div>
    <div className="absolute right-0 bottom-0 bg-neutral-600 p-2 rounded-md rounded-tr-none rounded-bl-none">
      <HandCoins />
    </div>
  </div>
);

const MoneyDistribution = () => {
  const moneyDistribution = Data.moneyDistribution;

  return (
    <div className="grid col-span-2 m-2 relative">
      <div className="flex justify-between flex-1 bg-black rounded-md">
        <div className="m-4 text-lg text-[#ccc] relative">
          <p className="font-bold">Money Distribution</p>
          <div className="flex text-white my-4 gap-4 whitespace-nowrap">
            <div className="text-stone-500 text-md font-semibold">
              <p>Money In:</p>
              <p>Previous Balance:</p>
            </div>
            <div>
              <p className="">
                {formatRupees(Data.moneyDistributionMoneyIn.moneyIn)}
              </p>
              <p className="border-b-2 border-[#ccc]">
                {formatRupees(Data.moneyDistributionMoneyIn.previousBalance)}
              </p>
              <p>
                {formatRupees(
                  Data.moneyDistributionMoneyIn.moneyIn -
                    Data.moneyDistributionMoneyIn.previousBalance
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
                  className={`flex gap-3 justify-between ${
                    index === moneyDistribution.length - 1
                      ? "border-b-2 border-[#ccc]"
                      : ""
                  }`}
                >
                  <p>{item.percentage}%</p>
                  <p className="inline-flex justify-center items-center -mt-[0.4rem] gap-1">
                    <span
                      className="p-1 rounded-full my-4 inline-block"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    {item.category}
                  </p>
                  <p>₹ {item.amount.toLocaleString()}</p>
                </div>
              ))}
              <div className="flex justify-between w-full">
                <p>100%</p>
                <p>₹ 60,100</p>
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
                    data={chartData}
                    dataKey="visitors"
                    nameKey="browser"
                    innerRadius={40}
                  />
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
        <Triangle className="scale-75 rotate-180 pb-1 border-none stroke-none fill-red-500" />
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
      <div className="md:col-span-1 w-fit">
        <CircleProgressBar
          percentage={(
            (Data.billsBudget.bills / Data.billsBudget.budget) *
            100
          ).toFixed(1)}
          strokeColor="#019D45"
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
      <HandCoins />
    </div>
  </div>
);

//Done
const DebtsPaymentGoal = () => (
  <div className="m-2 bg-[#444] p-4 max-md:pb-12 rounded-md h-[fit-content] relative">
    <div className="flex flex-col justify-between w-full p-2 rounded-md">
      <div className="flex gap-1">
        <Triangle className="scale-75 rotate-180 pb-1 border-none stroke-none fill-red-500" />
        <h1 className="pb-2 inline-flex text-lg font-bold">
          Debts Payment Goal
        </h1>
      </div>
      <div className="flex justify-between w-full">
        {/* Money In */}
        <div>
          <p className="text-md">Debts Paid:</p>
          <p className="text-lg font-semibold max-md:text-base">
            {formatRupees(Data.debtsPaymentGoal.debtsPaid)}
          </p>
        </div>

        {/* Expected */}
        <div>
          <p className="text-md">Goal:</p>
          <p className="text-lg font-semibold max-md:text-base">
            {formatRupees(Data.debtsPaymentGoal.goal)}
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-3 items-center md:gap-12 lg:p-4 max-md:grid-cols-2">
      <div className="md:col-span-1 w-fit">
        <CircleProgressBar
          percentage={(
            (Data.debtsPaymentGoal.debtsPaid / Data.debtsPaymentGoal.goal) *
            100
          ).toFixed(1)}
          strokeColor="#019D45"
          circleWidth={100}
        />
      </div>
      <div className="md:col-span-2 col-span-1">
        <p className="text-sm font-medium py-2">Progress this year</p>
        <p className="text-lg font-bold leading-none">
          Debts Unpaid{" "}
          {formatRupees(
            Data.debtsPaymentGoal.goal - Data.debtsPaymentGoal.debtsPaid
          )}
        </p>
      </div>
    </div>
    <div className="absolute right-0 bottom-0 bg-neutral-600 p-2 rounded-md rounded-tr-none rounded-bl-none">
      <HandCoins />
    </div>
  </div>
);

const SavingsGoal = () => (
  <div className="m-2 bg-[#444] p-4 max-md:pb-12 rounded-md h-[fit-content] relative">
    <div className="flex flex-col justify-between w-full p-2 rounded-md">
      <div className="flex gap-1">
        <Triangle className="scale-75 rotate-180 pb-1 border-none stroke-none fill-red-500" />
        <h1 className="pb-2 inline-flex text-lg font-bold">Savings Goal</h1>
      </div>
      <div className="flex justify-between w-full">
        {/* Money In */}
        <div>
          <p className="text-md">Money Saved:</p>
          <p className="text-lg font-semibold max-md:text-base">
            {formatRupees(Data.savingsGoal.moneySaved)}
          </p>
        </div>

        {/* Expected */}
        <div>
          <p className="text-md">Goal:</p>
          <p className="text-lg font-semibold max-md:text-base">
            {formatRupees(Data.savingsGoal.goal)}
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-3 items-center md:gap-12 lg:p-4 max-md:grid-cols-2">
      <div className="md:col-span-1 w-fit">
        <CircleProgressBar
          percentage={(
            (Data.savingsGoal.moneySaved / Data.savingsGoal.goal) *
            100
          ).toFixed(1)}
          strokeColor="#019D45"
          circleWidth={100}
        />
      </div>
      <div className="md:col-span-2 col-span-1">
        <p className="text-sm font-medium py-2">Progress this year</p>
        <p className="text-lg font-bold leading-none">
          Savings under Goal{" "}
          {formatRupees(Data.savingsGoal.goal - Data.savingsGoal.moneySaved)}
        </p>
      </div>
    </div>
    <div className="absolute right-0 bottom-0 bg-neutral-600 p-2 rounded-md rounded-tr-none rounded-bl-none">
      <HandCoins />
    </div>
  </div>
);

const MiscellaneousExpenses = () => (
  <div className="m-2 bg-[#444] p-4 max-md:pb-12 rounded-md h-[fit-content] relative">
    <div className="flex flex-col justify-between w-full p-2 rounded-md">
      <div className="flex gap-1">
        <Triangle className="scale-75 rotate-180 pb-1 border-none stroke-none fill-red-500" />
        <h1 className="pb-2 inline-flex text-lg font-bold">Misc. Expenses</h1>
      </div>
      <div className="flex justify-between w-full">
        {/* Money In */}
        <div>
          <p className="text-md">Expenses:</p>
          <p className="text-lg font-semibold max-md:text-base">
            {formatRupees(Data.miscellaneousExpenses.expenses)}
          </p>
        </div>

        {/* Expected */}
        <div>
          <p className="text-md">Budget:</p>
          <p className="text-lg font-semibold max-md:text-base">
            {formatRupees(Data.miscellaneousExpenses.budget)}
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-3 items-center md:gap-12 lg:p-4 max-md:grid-cols-2">
      <div className="md:col-span-1 w-fit">
        <CircleProgressBar
          percentage={(
            (Data.miscellaneousExpenses.expenses /
              Data.miscellaneousExpenses.budget) *
            100
          ).toFixed(1)}
          strokeColor="#019D45"
          circleWidth={100}
        />
      </div>
      <div className="md:col-span-2 col-span-1">
        <p className="text-sm font-medium py-2">Progress this year</p>
        <p className="text-lg font-bold leading-none">
          Misc. Costs{" "}
          {formatRupees(
            Data.miscellaneousExpenses.budget -
              Data.miscellaneousExpenses.expenses
          )}
        </p>
      </div>
    </div>
    <div className="absolute right-0 bottom-0 bg-neutral-600 p-2 rounded-md rounded-tr-none rounded-bl-none">
      <HandCoins />
    </div>
  </div>
);

const IncomeSources = ({ className }) => {
  const chartData = Data?.incomeSourcesGraph || [];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Income Sources</CardTitle>
        <CardDescription>Graph of all Income Sources</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          width={600}
          height={300}
          data={chartData}
          className="w-32"
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="source"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
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
            />
          </Bar>
        </BarChart>
      </CardContent>
    </Card>
  );
};

const InvestmentDistribution = ({ className }) => {
  const chartData = Data?.investmentDistributionGraph || [];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Investment Distribution</CardTitle>
        <CardDescription>Graph of all Investment Distributions</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          width={600}
          height={300}
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="type"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
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
            />
          </Bar>
        </BarChart>
      </CardContent>
    </Card>
  );
};

const ExpenseCategories = ({ className }) => {
  const total = Data.expectedBudget.expenses;
  const expenseCategoriesData = Data.expenseCategories.map((item) => ({
    ...item,
    percentage: (item.amount / total) * 100,
  }));

  const expenseCategoriesPie = expenseCategoriesData.map((item) => ({
    browser: item.category,
    visitors: item.amount,
    fill: item.color,
  }));

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
              data={expenseCategoriesPie}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
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
                          y={(viewBox.cy || 0) + 10}
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
            {expenseCategoriesData.map((item, index) => (
              <p key={index} className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span>{item.percentage.toFixed(1)}%</span> {item.category}
              </p>
            ))}
          </div>

          <div className="space-y-2">
            {expenseCategoriesData.map((item, index) => (
              <p key={index}>₹ {item.amount.toLocaleString("en-IN")}</p>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const BillsCategories = ({ className }) => {
  const billsCategoriesData = Data.billsCategories;
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
                          y={(viewBox.cy || 0) + 10}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ₹{Data.billsBudget.bills.toLocaleString("en-IN")}
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
                <span>{item.percentage.toFixed(1)}%</span> {item.category}
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

const DebtsCategories = ({ className }) => {
  const debtsCategoriesData = Data.debtsCategories;
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
                          y={(viewBox.cy || 0) + 10}
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
                <span>{item.percentage.toFixed(1)}%</span> {item.category}
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
