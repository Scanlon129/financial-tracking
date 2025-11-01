import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import TransactionsTable from './TransactionsTable.jsx';
import BudgetList from './BudgetList.jsx';
import UploadTransactions from './UploadTransactions.jsx';
import PlaidImport from './PlaidImport.jsx';
import InsightsPanel from './InsightsPanel.jsx';

const api = axios.create({
  baseURL: '/api',
});

const DashboardPage = () => {
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => (await api.get('/transactions')).data,
  });

  const { data: budgets = [] } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => (await api.get('/budgets')).data,
  });

  const { data: insights = [] } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => (await api.get('/insights')).data,
  });

  const autoCategorizeMutation = useMutation({
    mutationFn: async () => (await api.post('/transactions/auto-categorize')).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const autoBudgetMutation = useMutation({
    mutationFn: async () => (await api.post('/budgets/auto')).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  const totals = useMemo(() => {
    const income = transactions
      .filter((txn) => txn.amount > 0)
      .reduce((acc, txn) => acc + txn.amount, 0);
    const expenses = transactions
      .filter((txn) => txn.amount < 0)
      .reduce((acc, txn) => acc + txn.amount, 0);
    return {
      income,
      expenses,
      net: income + expenses,
    };
  }, [transactions]);

  return (
    <div className="dashboard">
      <section className="grid stats">
        <div className="card">
          <h2>Income</h2>
          <p>${totals.income.toFixed(2)}</p>
        </div>
        <div className="card">
          <h2>Expenses</h2>
          <p>${Math.abs(totals.expenses).toFixed(2)}</p>
        </div>
        <div className={`card ${totals.net >= 0 ? 'positive' : 'negative'}`}>
          <h2>Net</h2>
          <p>${totals.net.toFixed(2)}</p>
        </div>
        <div className="card">
          <h2>Categories</h2>
          <p>{categories.length}</p>
        </div>
      </section>

      <section className="actions">
        <UploadTransactions
          onComplete={() => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
          }}
        />
        <PlaidImport
          onComplete={() => queryClient.invalidateQueries({ queryKey: ['transactions'] })}
        />
        <div className="action-card">
          <h3>AI Tools</h3>
          <button onClick={() => autoCategorizeMutation.mutate()} disabled={autoCategorizeMutation.isLoading}>
            {autoCategorizeMutation.isLoading ? 'Categorizing…' : 'Auto-categorize'}
          </button>
          <button onClick={() => autoBudgetMutation.mutate()} disabled={autoBudgetMutation.isLoading}>
            {autoBudgetMutation.isLoading ? 'Generating…' : 'Auto budget'}
          </button>
          {autoCategorizeMutation.data && (
            <p>
              Updated {autoCategorizeMutation.data.updated} transactions.
              {autoCategorizeMutation.data.uncategorized > 0 && (
                <span> {autoCategorizeMutation.data.uncategorized} remaining uncategorized.</span>
              )}
            </p>
          )}
        </div>
      </section>

      <section className="grid main">
        <div className="card wide">
          <h2>Recent Transactions</h2>
          <TransactionsTable transactions={transactions} />
        </div>
        <div className="card">
          <h2>Budgets</h2>
          <BudgetList budgets={budgets} />
        </div>
        <div className="card">
          <h2>Insights</h2>
          <InsightsPanel insights={insights} />
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
