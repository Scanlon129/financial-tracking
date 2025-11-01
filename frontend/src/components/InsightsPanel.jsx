import React from 'react';

const InsightsPanel = ({ insights }) => {
  if (!insights.length) {
    return <p>No insights yet. Import transactions to get AI-driven suggestions.</p>;
  }

  return (
    <ul className="insights">
      {insights.map((insight, index) => (
        <li key={index}>
          <h4>{insight.title}</h4>
          <p>{insight.detail}</p>
          {insight.action && <span>{insight.action}</span>}
        </li>
      ))}
    </ul>
  );
};

export default InsightsPanel;
