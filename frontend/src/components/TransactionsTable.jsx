import React from 'react';
import dayjs from 'dayjs';

const TransactionsTable = ({ transactions }) => {
  if (!transactions.length) {
    return <p>No transactions yet. Import a CSV or connect via Plaid.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Account</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{dayjs(txn.date).format('MMM D, YYYY')}</td>
              <td>{txn.description}</td>
              <td>{txn.category ? txn.category.name : '—'}</td>
              <td>{txn.account_name || txn.source || '—'}</td>
              <td className={txn.amount >= 0 ? 'positive' : 'negative'}>
                ${txn.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
