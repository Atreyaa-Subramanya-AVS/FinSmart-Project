"use client";

import { useEffect, useState } from "react";
import Loading_Dashboard from "./Loading_Dashboard";
import {
  ArrowUpDown,
  Banknote,
  ChartPie,
  Coins,
  IndianRupee,
  ShoppingBag,
  WalletMinimal,
} from "lucide-react";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className=" min-h-[89vh] bg-[#333] rounded-lg">
      {/* {isLoading ? (
        <div className="flex w-full justify-center items-center h-[89svh]">
          <Loading_Dashboard />
        </div>
      ) : ( */}
      <div className="grid grid-cols-3 gap-2 max-lg:grid-cols-2">
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
        <div className="grid col-span-2 m-2 relative">
          <div className="flex justify-between flex-1 bg-black rounded-md ">
            <div className="m-4 text-lg text-[#ccc] relative">
              <p className="font-bold">Money Distribution</p>
              <div className="flex text-white my-4  gap-4 whitespace-nowrap">
                <div className="text-stone-500 text-md font-semibold">
                  <p>Money In:</p>
                  <p>Previous Balance:</p>
                </div>
                <div>
                  <p>₹ 60,100</p>
                  <p className="border-b-2 border-[#ccc]">₹ 50,300</p>
                  <p>₹ 10,500</p>
                  {/* <div className="right-[15%] top-1/4 absolute">
                    <IndianRupee className="scale-[8] text-neutral-600" />
                  </div> */}
                </div>
              </div>
              <div className="my-4 mx-auto w-full">
                <p className="text-md font-bold my-2">Categories</p>
                <div className="flex flex-col">
                  <div className="flex gap-3 justify-between">
                    <p>43%</p>
                    <p className="inline-flex justify-start items-center -mt-[0.4rem] gap-1">
                      <span className="bg-red-500 p-1 rounded-full my-4 inline-block"></span>
                      Expenses
                    </p>
                    <p>₹ 26,000</p>
                  </div>
                  <div className="flex gap-3 justify-between">
                    <p>43%</p>
                    <p className="flex items-center gap-1 mx-2">
                      <span className="bg-red-500 p-1 rounded-full my-4 inline-block"></span>
                      Bills
                    </p>
                    <p>₹ 26,000</p>
                  </div>
                  <div className="flex gap-3 justify-between">
                    <p>43%</p>
                    <p className="inline-flex justify-center items-center -mt-[0.4rem] gap-1">
                      <span className="bg-red-500 p-1 rounded-full my-4 inline-block"></span>
                      Savings
                    </p>
                    <p>₹ 26,000</p>
                  </div>
                  <div className="flex gap-3 justify-between">
                    <p>43%</p>
                    <p className="inline-flex justify-center items-center -mt-[0.4rem] gap-1">
                      <span className="bg-red-500 p-1 rounded-full my-4 inline-block"></span>
                      Debts
                    </p>
                    <p>₹ 26,000</p>
                  </div>
                  <div className="flex gap-3 justify-between border-b-2 border-[#ccc]">
                    <p>43%</p>
                    <p className="inline-flex justify-center items-center -mt-[0.4rem] gap-1">
                      <span className="bg-red-500 p-1 rounded-full my-4 inline-block"></span>
                      Others
                    </p>
                    <p>₹ 26,000</p>
                  </div>
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
            <div className="flex flex-col gap-12">
              <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Pie Chart - Donut</CardTitle>
                  <CardDescription>Money Distribution</CardDescription>
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
        {/* -------- End of Money Distribution ------ */}
        <div className="m-2 bg-[#444] p-3 rounded-md">
          <h1>Expected Income:</h1>
          <div className="flex justify-between w-full items-center p-4 rounded-md">
            <div className="flex justify-between w-full">
              {/* Money In */}
              <div>
                <p className="text-sm">Money In:</p>
                <p className="text-lg font-semibold">₹ 60,100.00</p>
              </div>

              {/* Expected */}
              <div>
                <p className="text-sm">Expected:</p>
                <p className="text-lg font-semibold">₹ 20,100.00</p>
              </div>
            </div>
          </div>
          {/* Radial Chart */}
          <div className="grid grid-cols-3 items-center w-fit h-fit bg-white">
            <div className="col-span-1">
              <CircleProgressBar
                percentage={55}
                className=""
                strokeColor="black"
              />
            </div>
            <div className="col-span-2 h-fit w-fit">
              <p>Progress this year</p>
              <p>Incomes under expected ₹10,100.00</p>
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}

const BalanceTracker = () => (
  <div className="bg-[#1E2646] p-4 m-2 rounded-md relative w-full">
    <div className="flex">
      <h1 className="text-md">Available Balance:</h1>
    </div>
    <div>
      <p className="text-2xl">
        ₹24,051 <span className="text-sm text-neutral-400">/ ₹50,000</span>
      </p>
    </div>
    <div className="absolute right-5 bottom-5">
      <Coins className="scale-150 text-neutral-400" />
    </div>
  </div>
);

const MoneyInMoneyOut = () => (
  <div className="grid grid-cols-2 m-2 gap-4 w-full justify-between rounded-md">
    <div className="bg-[#444] relative px-2 flex flex-col gap-4 py-4 rounded-md">
      <div>
        <h1 className="text-green-500 text-md">Money In:</h1>
        <p className="font-bold text-2xl">₹ 60,100</p>
      </div>
      <div className="absolute top-1 right-2">
        <Banknote className="text-neutral-300" />
      </div>
      <div>
        <p className="text-sm">Previous Balance:</p>
        <p>₹ 0.00</p>
      </div>
    </div>
    <div className="bg-[#444] relative px-2 rounded-md flex flex-col gap-4 py-4">
      <div>
        <h1 className="text-red-500 text-md">Money Out:</h1>
        <p className="font-bold text-2xl">₹ 51,843</p>
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

const SpendingSaving = () => (
  <div className="flex bg-[#444] justify-between px-4 py-3 m-2 rounded-md w-full">
    <div className="flex flex-col">
      <p className="text-red-500">You are spending</p>
      <p className="font-bold text-xl">66%</p>
      <p className="text-sm text-neutral-400">of your income</p>
    </div>
    <div className="flex flex-col">
      <p className="text-purple-500">You are saving</p>
      <p className="font-bold text-xl">36%</p>
      <p className="text-sm text-neutral-400">of your income</p>
    </div>
  </div>
);
