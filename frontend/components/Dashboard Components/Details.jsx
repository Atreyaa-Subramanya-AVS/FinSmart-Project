import React, { useEffect, useState } from "react";
import DashboardInput from "../DashboardInput";
import { Button } from "../ui/button";
import { CirclePlus, PlusCircle } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import DashboardDropDown from "../DashboardDropDown";
import Data from "./dummy.json";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Loading_Dashboard from "./Loading_Dashboard";

const Details = () => {
  const [sampleData, setSampleData] = useState("");
  const [initialData, setInitialData] = useState(null);
  const [ID, setID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const defaultFormData = {
    goals: [],
    balanceTracker: { currentBalance: "", totalAmount: "" },
    moneyInMoneyOut: { moneyIn: "", moneyOut: "", previousBalance: "" },
    moneyDistribution: [],
    expectedIncome: { moneyIn: "", expected: "" },
    expectedBudget: { expenses: "", budget: "" },
    billsBudget: { bills: "", budget: "" },
    debtsPaymentGoal: { debtsPaid: "", goal: "" },
    savingsGoal: { moneySaved: "", goal: "" },
    miscellaneousExpenses: { expenses: "", budget: "" },
    expenseCategories: [],
    billsCategories: [],
    debtsCategories: [],
    incomeSourcesGraph: [],
    investmentDistributionGraph: [],
    notes: "",
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    let isMounted = true;

    const fetchUserAndData = async () => {
      try {
        const userResponse = await axios.get(
          "https://finsmart-backend-380l.onrender.com/auth/user",
          { withCredentials: true }
        );

        console.log(userResponse);

        const userID = userResponse.data.ID;
        if (!userID) throw new Error("User ID not found");

        if (isMounted) setID(userID);

        try {
          const detailsResponse = await axios.get(
            `https://finsmart-backend-380l.onrender.com/api/details/${userID}`
          );

          if (detailsResponse.data.data && isMounted) {
            setFormData(detailsResponse.data.data);
            setInitialData(detailsResponse.data.data);
          }
        } catch (error) {
          if (error.response?.status === 404) {
            // No data exists yet — use default form
            console.warn(
              "No details found for this user. Using default form data."
            );
            if (isMounted) {
              setFormData(defaultFormData);
              setInitialData(defaultFormData);
            }
          } else {
            console.error("Error fetching details:", error);
            toast.error("Failed to load user details.");
          }
        }
      } catch (error) {
        console.error("Error fetching user or details:", error);
        toast.error("Failed to load user data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUserAndData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (sampleData === "Erase Data") {
      setFormData(defaultFormData);
    } else if (Data && Data[sampleData]) {
      setFormData(Data[sampleData]);
    }
  }, [sampleData]);

    const validateFormData = () => {
      if (!formData.goals.length) {
        toast.error("Please add at least one goal.");
        return false;
      }
      if (!formData.balanceTracker.currentBalance) {
        toast.error("Please enter your current balance.");
        return false;
      }
      return true;
    };

    const handleSave = async () => {
      if (!validateFormData()) return;

    const savePromise = axios.post(
      "https://finsmart-backend-380l.onrender.com/api/details/store",
      { ID, ...formData }
    );

      toast.promise(savePromise, {
        loading: "Saving details...",
        success: "Details saved successfully!",
        error: "Failed to save details.",
      });

    try {
      const response = await savePromise;
      console.log("Save response:", response.data);
      setInitialData(formData);
    } catch (error) {
      console.error("Error saving details:", error);
    }
  };

  const isDataChanged = () => {
    if (!initialData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  };

  if (isLoading) {
    return (
      <div className="flex w-full justify-center items-center h-[89svh]">
        <Loading_Dashboard />
      </div>
    );
  }

  return (
    <div className="relative z-50 max-w-screen-lg xl:max-w-screen-xl bg-[#222] mx-auto min-h-screen rounded-md shadow-2xl p-2 px-4">
      <Toaster />
      <div className="flex justify-between items-start text-4xl tracking-tight font-semibold border-b-2 overflow-x-hidden md:mx-2">
        <h1 className="pt-2 pb-5">Details</h1>
        <div className="flex items-center mb-3">
          <DashboardDropDown setSampleData={setSampleData} />
        </div>
        <div className="flex flex-col items-center py-2">
          <Button
            onClick={handleSave}
            disabled={!isDataChanged()}
            className={`${
              isDataChanged()
                ? "bg-red-600 hover:bg-red-700 text-white w-fit"
                : "opacity-50 cursor-not-allowed w-fit"
            }`}
          >
            Save
          </Button>
          <p
            className={`text-red-600 text-sm mb-2 transition-opacity duration-300 pointer-events-none ${
              isDataChanged() ? "opacity-100" : "opacity-0"
            }`}
          >
            Save your changes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-lg:grid-cols-2 max-md:grid-cols-1">
        <div className="col-span-2 max-md:col-span-1">
          <Goals goals={formData.goals} setFormData={setFormData} />
        </div>

        <div className="">
          <BalanceTracker
            balanceTracker={formData.balanceTracker}
            setFormData={setFormData}
          />
          <Spendings
            moneyInMoneyOut={formData.moneyInMoneyOut}
            setFormData={setFormData}
          />
        </div>
        <div className="lg:col-span-3 col-span-2 max-md:col-span-1 md:mx-12 max-md:w-full md:max-w-screen-xl border-t-2 border-b-2">
          <MoneyDistribution
            moneyDistribution={formData.moneyDistribution}
            setFormData={setFormData}
          />
        </div>
        <ExpectedIncome
          expectedIncome={formData.expectedIncome}
          setFormData={setFormData}
        />
        <ExpectedBudget
          expectedBudget={formData.expectedBudget}
          setFormData={setFormData}
        />

        <BillsBudget
          billsBudget={formData.billsBudget}
          setFormData={setFormData}
        />

        <DebtsPaymentGoal
          debtsPaymentGoal={formData.debtsPaymentGoal}
          setFormData={setFormData}
        />

        <SavingsGoal
          savingsGoal={formData.savingsGoal}
          setFormData={setFormData}
        />

        <MiscellaneousExpenses
          miscellaneousExpenses={formData.miscellaneousExpenses}
          setFormData={setFormData}
        />

        <div className="grid grid-cols-2 col-span-3 max-lg:grid-cols-1 max-lg:col-span-2 max-md:col-span-1">
          <IncomeSources
            incomeSourcesGraph={formData.incomeSourcesGraph}
            setFormData={setFormData}
          />

          <InvestmentDistribution
            investmentDistributionGraph={formData.investmentDistributionGraph}
            setFormData={setFormData}
          />
        </div>
        <div className="lg:col-span-3 col-span-2 max-md:col-span-1 max-md:mx-0 md:mx-28 max-md:w-full md:max-w-screen-xl border-t-2 border-b-2">
          <ExpenseCategories
            expenseCategories={formData.expenseCategories}
            setFormData={setFormData}
          />
        </div>
        <div className="grid grid-cols-2 col-span-3 max-lg:grid-cols-1 max-lg:col-span-2 max-md:col-span-1">
          <BillsCategories
            billsCategories={formData.billsCategories}
            setFormData={setFormData}
          />

          <DebtsCategories
            debtsCategories={formData.debtsCategories}
            setFormData={setFormData}
          />
        </div>
      </div>
      <div className="mx-12 my-6">
        <Notes notes={formData.notes} setFormData={setFormData} />
      </div>
      <div className="text-sm text-neutral-400 text-center py-4">
        "Do not save what is left after spending, but spend what is left after
        saving." — <span className="text-neutral-300">Warren Buffett</span>
      </div>
    </div>
  );
};

const Goals = ({ goals = [], setFormData }) => {
  const [inputGoal, setInputGoal] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [goalError, setGoalError] = useState(false);
  const [valueError, setValueError] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    const isGoalEmpty = inputGoal.trim() === "";
    const isValueEmpty = inputValue.trim() === "";

    setGoalError(isGoalEmpty);
    setValueError(isValueEmpty);

    if (!isGoalEmpty && !isValueEmpty) {
      const newGoals = [...goals, { Goal: inputGoal, Value: inputValue }];
      setFormData((prev) => ({ ...prev, goals: newGoals }));
      setGoalError(false);
      setValueError(false);

      setInputGoal("");
      setInputValue("");
    }
  };

  const handleRemove = (indexToRemove) => {
    const updatedGoals = goals.filter((_, index) => index !== indexToRemove);
    setFormData((prev) => ({ ...prev, goals: updatedGoals }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white my-1">Goals</h2>
      <div className="flex gap-2 py-2">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Goal"
              value={inputGoal}
              setinput={setInputGoal}
              onKeyDown={handleKeyDown}
            />
            {goalError && (
              <p className="text-sm text-red-500 px-1">Goal is required</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Value (Approx.)"
              value={inputValue}
              setinput={setInputValue}
              onKeyDown={handleKeyDown}
            />
            {valueError && (
              <p className="text-sm text-red-500 px-1">Value is required</p>
            )}
          </div>
        </div>
        <div className="inline-flex my-auto">
          <Button onClick={handleClick}>
            <CirclePlus />
          </Button>
        </div>
      </div>

      <div className="max-h-32 overflow-y-auto scrollbar rounded-md">
        {goals.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between overflow-x-hidden px-12 text-white bg-black p-2 gap-2"
          >
            <span className="w-5">{`${index + 1}.`}</span>
            <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
              {item.Goal}
            </span>
            <span className="mx-1">-</span>
            <span className="w-28 text-right">
              ₹ {Number(item.Value).toLocaleString("en-IN")}
            </span>
            <span
              className="rotate-45 hover:text-red-500 cursor-pointer w-5 text-right"
              onClick={() => handleRemove(index)}
            >
              <PlusCircle />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BalanceTracker = ({ balanceTracker = {}, setFormData }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleChange = (field, value) => {
    const numericFields = ["currentBalance", "totalAmount"];
    const newValue = numericFields.includes(field) ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      balanceTracker: {
        ...prev.balanceTracker,
        [field]: newValue,
      },
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white mb-4">Balance Info</h2>
      <div className="flex flex-col gap-2">
        <DashboardInput
          placeholder="Current Balance"
          value={balanceTracker.currentBalance || ""}
          setinput={(val) => handleChange("currentBalance", val)}
          onKeyDown={handleKeyDown}
        />
        <DashboardInput
          placeholder="Total Amount"
          value={balanceTracker.totalAmount || ""}
          setinput={(val) => handleChange("totalAmount", val)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

const Spendings = ({ moneyInMoneyOut, setFormData }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleChange();
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      moneyInMoneyOut: {
        ...prev.moneyInMoneyOut,
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white mb-4">Spendings</h2>
      <div className="flex flex-col gap-2">
        <DashboardInput
          placeholder="Money In"
          value={moneyInMoneyOut.moneyIn}
          setinput={(val) => handleChange("moneyIn", val)}
          onKeyDown={handleKeyDown}
        />

        <DashboardInput
          placeholder="Money Out"
          value={moneyInMoneyOut.moneyOut}
          setinput={(val) => handleChange("moneyOut", val)}
          onKeyDown={handleKeyDown}
        />

        <DashboardInput
          placeholder="Previous Balance"
          value={moneyInMoneyOut.previousBalance}
          setinput={(val) => handleChange("previousBalance", val)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

const MoneyDistribution = ({ moneyDistribution = [], setFormData }) => {
  const [inputCategory, setInputCategory] = useState("");
  const [inputMoneySpent, setInputMoneySpent] = useState("");

  const [categoryError, setCategoryError] = useState(false);
  const [moneySpentError, setMoneySpentError] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    const isCategoryEmpty = inputCategory.trim() === "";
    const isValueEmpty = inputMoneySpent.trim() === "";

    setCategoryError(isCategoryEmpty);
    setMoneySpentError(isValueEmpty);

    if (!isCategoryEmpty && !isValueEmpty) {
      const newIndex = moneyDistribution.length; // current length before adding

      const newEntry = {
        category: inputCategory,
        amount: Number(inputMoneySpent),
        color: `hsl(var(--chart-${newIndex + 1}))`,
      };

      setFormData((prev) => ({
        ...prev,
        moneyDistribution: [...prev.moneyDistribution, newEntry],
      }));

      setInputCategory("");
      setInputMoneySpent("");
    }
  };

  const handleRemove = (indexToRemove) => {
    const updated = moneyDistribution.filter((_, idx) => idx !== indexToRemove);
    setFormData((prev) => ({
      ...prev,
      moneyDistribution: updated,
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white my-2">
        Money Distribution
      </h2>
      <div className="flex gap-2 py-2">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Category"
              value={inputCategory}
              setinput={setInputCategory}
              onKeyDown={handleKeyDown}
            />
            {categoryError && (
              <p className="text-sm text-red-500 px-1">Category is required</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Money Spent"
              value={inputMoneySpent}
              setinput={setInputMoneySpent}
              onKeyDown={handleKeyDown}
            />
            {moneySpentError && (
              <p className="text-sm text-red-500 px-1">Value is required</p>
            )}
          </div>
        </div>
        <div className="inline-flex my-auto">
          <Button onClick={handleClick}>
            <CirclePlus />
          </Button>
        </div>
      </div>

      <div className="max-h-32 overflow-y-auto scrollbar rounded-md">
        {moneyDistribution.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between overflow-x-hidden px-12 text-white bg-black p-2 gap-2"
          >
            <span className="w-3">{`${index + 1}.`}</span>
            <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
              {item.category}
            </span>
            <span className="mx-1">-</span>
            <span className="w-28 text-right">
              ₹ {Number(item.amount).toLocaleString("en-IN")}
            </span>
            <span
              className="rotate-45 hover:text-red-500 cursor-pointer"
              onClick={() => handleRemove(index)}
            >
              <PlusCircle />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExpectedIncome = ({ expectedIncome = [], setFormData }) => {
  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleChange();
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      expectedIncome: {
        ...prev.expectedIncome,
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white mb-6">Expected Income</h2>
      <div className="flex flex-col gap-3">
        <DashboardInput
          placeholder={"Money In"}
          value={expectedIncome.moneyIn}
          setinput={(val) => handleChange("moneyIn", val)}
          onKeyDown={handleKeyDown}
        />
        <DashboardInput
          placeholder={"Expected Income"}
          value={expectedIncome.expected}
          setinput={(val) => handleChange("expected", val)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

const ExpectedBudget = ({ expectedBudget = [], setFormData }) => {
  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleChange();
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      expectedBudget: {
        ...prev.expectedBudget,
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white mb-6">Expected Budget</h2>
      <div className="flex flex-col gap-3">
        <DashboardInput
          placeholder={"Expenses"}
          value={expectedBudget.expenses}
          setinput={(val) => handleChange("expenses", val)}
          onKeyDown={handleKeyDown}
        />
        <DashboardInput
          placeholder={"Budget"}
          value={expectedBudget.budget}
          setinput={(val) => handleChange("budget", val)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

const BillsBudget = ({ billsBudget = [], setFormData }) => {
  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleChange();
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      billsBudget: {
        ...prev.billsBudget,
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white mb-6">Bills Budget</h2>
      <div className="flex flex-col gap-3">
        <DashboardInput
          placeholder={"Bills"}
          value={billsBudget.bills}
          setinput={(val) => handleChange("bills", val)}
          onKeyDown={handleKeyDown}
        />
        <DashboardInput
          placeholder={"Budget"}
          value={billsBudget.budget}
          setinput={(val) => handleChange("budget", val)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

const DebtsPaymentGoal = ({ debtsPaymentGoal = [], setFormData }) => {
  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleChange();
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      debtsPaymentGoal: {
        ...prev.debtsPaymentGoal,
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white mb-6">
        Debts Payment Goal
      </h2>
      <div className="flex flex-col gap-3">
        <DashboardInput
          placeholder={"Debts Paid"}
          value={debtsPaymentGoal.debtsPaid}
          setinput={(val) => handleChange("debtsPaid", val)}
          onKeyDown={handleKeyDown}
        />
        <DashboardInput
          placeholder={"Goal"}
          value={debtsPaymentGoal.goal}
          setinput={(val) => handleChange("goal", val)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

const SavingsGoal = ({ savingsGoal = [], setFormData }) => {
  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleChange();
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      savingsGoal: {
        ...prev.savingsGoal,
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white mb-6">Savings Goal</h2>
      <div className="flex flex-col gap-3">
        <DashboardInput
          placeholder={"Money Saved"}
          value={savingsGoal.moneySaved}
          setinput={(val) => handleChange("debtsPaid", val)}
          onKeyDown={handleKeyDown}
        />
        <DashboardInput
          placeholder={"Goal"}
          value={savingsGoal.goal}
          setinput={(val) => handleChange("goal", val)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

const MiscellaneousExpenses = ({ miscellaneousExpenses = [], setFormData }) => {
  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleChange();
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      miscellaneousExpenses: {
        ...prev.miscellaneousExpenses,
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white mb-6">
        Miscellaneous Expenses
      </h2>
      <div className="flex flex-col gap-3">
        <DashboardInput
          placeholder={"Expenses"}
          value={miscellaneousExpenses.expenses}
          setinput={(val) => handleChange("expenses", val)}
          onKeyDown={handleKeyDown}
        />
        <DashboardInput
          placeholder={"Budget"}
          value={miscellaneousExpenses.budget}
          setinput={(val) => handleChange("budget", val)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

const IncomeSources = ({ incomeSourcesGraph = [], setFormData }) => {
  const [inputSource, setInputSource] = useState("");
  const [inputMoneyEarned, setInputMoneyEarned] = useState("");

  const [sourceError, setSourceError] = useState(false);
  const [moneyEarnedError, setMoneyEarnedError] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    const isSourceEmpty = inputSource.trim() === "";
    const isValueEmpty = inputMoneyEarned.trim() === "";

    setSourceError(isSourceEmpty);
    setMoneyEarnedError(isValueEmpty);

    if (!isSourceEmpty && !isValueEmpty) {
      const newEntry = {
        source: inputSource,
        amount: Number(inputMoneyEarned),
      };

      setFormData((prev) => ({
        ...prev,
        incomeSourcesGraph: [...(prev.incomeSourcesGraph || []), newEntry],
      }));

      setInputSource("");
      setInputMoneyEarned("");
    }
  };

  const handleRemove = (indexToRemove) => {
    const updated = incomeSourcesGraph.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({
      ...prev,
      incomeSourcesGraph: updated,
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white my-2">Income Sources</h2>
      <div className="flex gap-2 py-2">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Source"
              value={inputSource}
              setinput={setInputSource}
              onKeyDown={handleKeyDown}
            />
            {sourceError && (
              <p className="text-sm text-red-500 px-1">Source is required</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Money Earned"
              value={inputMoneyEarned}
              setinput={setInputMoneyEarned}
              onKeyDown={handleKeyDown}
            />
            {moneyEarnedError && (
              <p className="text-sm text-red-500 px-1">Value is required</p>
            )}
          </div>
        </div>
        <div className="inline-flex my-auto">
          <Button onClick={handleClick}>
            <CirclePlus />
          </Button>
        </div>
      </div>

      <div className="max-h-32 overflow-y-auto scrollbar rounded-md">
        {incomeSourcesGraph.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between overflow-x-hidden px-12 text-white bg-black p-2 gap-2"
          >
            <span className="w-3">{`${index + 1}.`}</span>
            <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
              {item.source}
            </span>
            <span className="mx-1">-</span>
            <span className="w-28 text-right">
              ₹ {Number(item.amount).toLocaleString("en-IN")}
            </span>
            <span
              className="rotate-45 hover:text-red-500 cursor-pointer w-5 text-right mx-2"
              onClick={() => handleRemove(index)}
            >
              <PlusCircle />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const InvestmentDistribution = ({
  investmentDistributionGraph = [],
  setFormData,
}) => {
  const [inputCategory, setInputCategory] = useState("");
  const [inputMoneyInvested, setInputMoneyInvested] = useState("");

  const [categoryError, setCategoryError] = useState(false);
  const [inputMoneyInvestedError, setInputMoneyInvestedError] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    const isCategoryEmpty = inputCategory.trim() === "";
    const isValueEmpty = inputMoneyInvested.trim() === "";

    setCategoryError(isCategoryEmpty);
    setInputMoneyInvestedError(isValueEmpty);

    if (!isCategoryEmpty && !isValueEmpty) {
      const newEntry = {
        type: inputCategory,
        amount: Number(inputMoneyInvested),
      };

      setFormData((prev) => ({
        ...prev,
        investmentDistributionGraph: [
          ...(prev.investmentDistributionGraph || []),
          newEntry,
        ],
      }));

      setInputCategory("");
      setInputMoneyInvested("");
    }
  };

  const handleRemove = (indexToRemove) => {
    const updated = investmentDistributionGraph.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({
      ...prev,
      investmentDistributionGraph: updated,
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white my-2">
        Investment Distribution
      </h2>
      <div className="flex gap-2 py-2">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Investment Category"
              value={inputCategory}
              setinput={setInputCategory}
              onKeyDown={handleKeyDown}
            />
            {categoryError && (
              <p className="text-sm text-red-500 px-1">Category is required</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Amount Invested"
              value={inputMoneyInvested}
              setinput={setInputMoneyInvested}
              onKeyDown={handleKeyDown}
            />
            {inputMoneyInvestedError && (
              <p className="text-sm text-red-500 px-1">Value is required</p>
            )}
          </div>
        </div>
        <div className="inline-flex my-auto">
          <Button onClick={handleClick}>
            <CirclePlus />
          </Button>
        </div>
      </div>

      <div className="max-h-32 overflow-y-auto scrollbar rounded-md">
        {investmentDistributionGraph.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between overflow-x-hidden px-12 text-white bg-black p-2 gap-2"
          >
            <span className="w-3">{`${index + 1}.`}</span>
            <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
              {item.type}
            </span>
            <span className="mx-1">-</span>
            <span className="w-28 text-right">
              ₹ {Number(item.amount).toLocaleString("en-IN")}
            </span>
            <span
              className="rotate-45 hover:text-red-500 cursor-pointer w-5 text-right mx-2"
              onClick={() => handleRemove(index)}
            >
              <PlusCircle />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExpenseCategories = ({ expenseCategories = [], setFormData }) => {
  const [inputCategory, setInputCategory] = useState("");
  const [inputMoneySpent, setInputMoneySpent] = useState("");

  const [categoryError, setCategoryError] = useState(false);
  const [moneySpentError, setMoneySpentError] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    const isCategoryEmpty = inputCategory.trim() === "";
    const isValueEmpty = inputMoneySpent.trim() === "";

    setCategoryError(isCategoryEmpty);
    setMoneySpentError(isValueEmpty);

    if (!isCategoryEmpty && !isValueEmpty) {
      const colorIndex = (expenseCategories.length % 12) + 1;
      const newEntry = {
        category: inputCategory,
        amount: Number(inputMoneySpent),
        color: `hsl(var(--chart-${colorIndex}))`,
      };

      setFormData((prev) => ({
        ...prev,
        expenseCategories: [...(prev.expenseCategories || []), newEntry],
      }));

      setInputCategory("");
      setInputMoneySpent("");
    }
  };

  const handleRemove = (indexToRemove) => {
    const updated = expenseCategories.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({
      ...prev,
      expenseCategories: updated,
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white my-2">
        Expense Categories
      </h2>
      <div className="flex gap-2 py-2">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Category"
              value={inputCategory}
              setinput={setInputCategory}
              onKeyDown={handleKeyDown}
            />
            {categoryError && (
              <p className="text-sm text-red-500 px-1">Category is required</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Money Spent"
              value={inputMoneySpent}
              setinput={setInputMoneySpent}
              onKeyDown={handleKeyDown}
            />
            {moneySpentError && (
              <p className="text-sm text-red-500 px-1">Value is required</p>
            )}
          </div>
        </div>
        <div className="inline-flex my-auto">
          <Button onClick={handleClick}>
            <CirclePlus />
          </Button>
        </div>
      </div>

      <div className="max-h-32 overflow-y-auto scrollbar rounded-md">
        {expenseCategories.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between overflow-x-hidden px-12 text-white bg-black p-2 gap-2"
          >
            <span className="w-5">{`${index + 1}.`}</span>
            <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
              {item.category}
            </span>
            <span className="mx-1">-</span>
            <span className="w-28 text-right">
              ₹ {Number(item.amount).toLocaleString("en-IN")}
            </span>
            <span
              className="rotate-45 hover:text-red-500 cursor-pointer w-5 text-right mx-2"
              onClick={() => handleRemove(index)}
            >
              <PlusCircle />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BillsCategories = ({ billsCategories = [], setFormData }) => {
  const [inputCategory, setInputCategory] = useState("");
  const [inputMoneySpent, setInputMoneySpent] = useState("");

  const [categoryError, setCategoryError] = useState(false);
  const [moneySpentError, setMoneySpentError] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    const isCategoryEmpty = inputCategory.trim() === "";
    const isValueEmpty = inputMoneySpent.trim() === "";

    setCategoryError(isCategoryEmpty);
    setMoneySpentError(isValueEmpty);

    if (!isCategoryEmpty && !isValueEmpty) {
      const colorIndex = (billsCategories.length % 12) + 1;
      const newEntry = {
        category: inputCategory,
        amount: Number(inputMoneySpent),
        color: `hsl(var(--chart-${colorIndex}))`,
      };

      setFormData((prev) => ({
        ...prev,
        billsCategories: [...(prev.billsCategories || []), newEntry],
      }));

      setInputCategory("");
      setInputMoneySpent("");
    }
  };

  const handleRemove = (indexToRemove) => {
    const updated = billsCategories.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({
      ...prev,
      billsCategories: updated,
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white my-2">Bills Categories</h2>
      <div className="flex gap-2 py-2">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Category"
              value={inputCategory}
              setinput={setInputCategory}
              onKeyDown={handleKeyDown}
            />
            {categoryError && (
              <p className="text-sm text-red-500 px-1">Category is required</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Money Spent"
              value={inputMoneySpent}
              setinput={setInputMoneySpent}
              onKeyDown={handleKeyDown}
            />
            {moneySpentError && (
              <p className="text-sm text-red-500 px-1">Amount is required</p>
            )}
          </div>
        </div>
        <div className="inline-flex my-auto">
          <Button onClick={handleClick}>
            <CirclePlus />
          </Button>
        </div>
      </div>

      <div className="max-h-32 overflow-y-auto scrollbar rounded-md">
        {billsCategories.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between overflow-x-hidden px-12 text-white bg-black p-2 gap-2"
          >
            <span className="w-5">{`${index + 1}.`}</span>
            <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
              {item.category}
            </span>
            <span className="mx-1">-</span>
            <span className="w-28 text-right">
              ₹ {Number(item.amount).toLocaleString("en-IN")}
            </span>
            <span
              className="rotate-45 hover:text-red-500 cursor-pointer w-5 text-right mx-2"
              onClick={() => handleRemove(index)}
            >
              <PlusCircle />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DebtsCategories = ({ debtsCategories = [], setFormData }) => {
  const [inputCategory, setInputCategory] = useState("");
  const [inputMoneySpent, setInputMoneySpent] = useState("");

  const [categoryError, setCategoryError] = useState(false);
  const [moneySpentError, setMoneySpentError] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    const isCategoryEmpty = inputCategory.trim() === "";
    const isValueEmpty = inputMoneySpent.trim() === "";

    setCategoryError(isCategoryEmpty);
    setMoneySpentError(isValueEmpty);

    if (!isCategoryEmpty && !isValueEmpty) {
      const colorIndex = (debtsCategories.length % 12) + 1;
      const newEntry = {
        category: inputCategory,
        amount: Number(inputMoneySpent),
        color: `hsl(var(--chart-${colorIndex}))`,
      };

      setFormData((prev) => ({
        ...prev,
        debtsCategories: [...(prev.debtsCategories || []), newEntry],
      }));

      setInputCategory("");
      setInputMoneySpent("");
    }
  };

  const handleRemove = (indexToRemove) => {
    const updated = debtsCategories.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({
      ...prev,
      debtsCategories: updated,
    }));
  };

  return (
    <div className="p-2">
      <h2 className="font-medium text-xl text-white my-2">Debts Categories</h2>
      <div className="flex gap-2 py-2">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Category"
              value={inputCategory}
              setinput={setInputCategory}
              onKeyDown={handleKeyDown}
            />
            {categoryError && (
              <p className="text-sm text-red-500 px-1">Category is required</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <DashboardInput
              placeholder="Money Spent"
              value={inputMoneySpent}
              setinput={setInputMoneySpent}
              onKeyDown={handleKeyDown}
            />
            {moneySpentError && (
              <p className="text-sm text-red-500 px-1">Amount is required</p>
            )}
          </div>
        </div>
        <div className="inline-flex my-auto">
          <Button onClick={handleClick}>
            <CirclePlus />
          </Button>
        </div>
      </div>

      <div className="max-h-32 overflow-y-auto scrollbar rounded-md">
        {debtsCategories.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between overflow-x-hidden px-12 text-white bg-black p-2 gap-2"
          >
            <span className="w-5">{`${index + 1}.`}</span>
            <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
              {item.category}
            </span>
            <span className="mx-1">-</span>
            <span className="w-28 text-right">
              ₹ {Number(item.amount).toLocaleString("en-IN")}
            </span>
            <span
              className="rotate-45 hover:text-red-500 cursor-pointer w-5 text-right mx-2"
              onClick={() => handleRemove(index)}
            >
              <PlusCircle />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Notes = ({ notes = "", setFormData }) => {
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      notes: e.target.value,
    }));
  };

  return (
    <div className="*:not-first:mt-2">
      <Label className="text-xl tracking-tight">Notes</Label>
      <Textarea
        className="border border-[#ccc] my-3"
        placeholder="Leave a note"
        value={notes}
        onChange={handleChange}
      />
    </div>
  );
};

export default Details;
