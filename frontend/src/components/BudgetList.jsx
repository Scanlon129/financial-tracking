import React from 'react';

const BudgetList = ({ budgets }) => {
  if (!budgets.length) {
    return <p>No budgets configured yet. Try generating them with AI.</p>;
  }

  return (
    <ul className="budget-list">
      {budgets.map((budget) => (
        <li key={budget.id}>
          <div>
            <strong>{budget.category?.name ?? 'Uncategorized'}</strong>
            <span>{budget.period}</span>
          </div>
          <div>
            <span>${budget.amount.toFixed(2)}</span>
            {budget.ai_generated && <small>AI</small>}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BudgetList;
