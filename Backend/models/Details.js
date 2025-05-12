const mongoose = require("mongoose");

const CategorySchema = {
  category: String,
  amount: Number,
  color: String,
};

const DetailsSchema = new mongoose.Schema({
  _id: { type: String },
  goals: [
    {
      Goal: String,
      Value: Number,
    },
  ],
  balanceTracker: {
    currentBalance: Number,
    totalAmount: Number,
  },
  moneyInMoneyOut: {
    moneyIn: Number,
    moneyOut: Number,
    previousBalance: Number,
  },
  moneyDistribution: [CategorySchema],
  expectedIncome: {
    moneyIn: Number,
    expected: Number,
  },
  expectedBudget: {
    expenses: Number,
    budget: Number,
  },
  billsBudget: {
    bills: Number,
    budget: Number,
  },
  debtsPaymentGoal: {
    debtsPaid: Number,
    goal: Number,
  },
  savingsGoal: {
    moneySaved: Number,
    goal: Number,
  },
  miscellaneousExpenses: {
    expenses: Number,
    budget: Number,
  },
  expenseCategories: [CategorySchema],
  billsCategories: [CategorySchema],
  debtsCategories: [CategorySchema],
  incomeSourcesGraph: [
    {
      source: String,
      amount: Number,
    },
  ],
  investmentDistributionGraph: [
    {
      type: { type: String },
      amount: { type: Number },
    },
  ],
  notes: { type: String },
  financialAnalysis: {
    prompt: {type : String},
    aiFeedBack: { type: String },
  },
  stockAnalysis: {
    query: { type: String },
    aiStockInsights: { type: String },
    plots: [{ type: String }],
  },
});

module.exports = mongoose.model("Details", DetailsSchema);
