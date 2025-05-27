import { useState } from 'react';

const conditions = [
  { id: 'totalSpent', label: 'Total Spent', type: 'number' },
  { id: 'visits', label: 'Number of Visits', type: 'number' },
  { id: 'lastVisit', label: 'Days Since Last Visit', type: 'number' },
];

const operators = {
  number: [
    { id: 'gt', label: 'Greater than' },
    { id: 'lt', label: 'Less than' },
    { id: 'eq', label: 'Equal to' },
  ]
};

const RuleBuilder = ({ rules, onChange }) => {
  const addRule = () => {
    onChange([
      ...rules,
      { id: Date.now(), condition: 'totalSpent', operator: 'gt', value: '' }
    ]);
  };

  const removeRule = (ruleId) => {
    onChange(rules.filter(rule => rule.id !== ruleId));
  };

  const updateRule = (ruleId, field, value) => {
    onChange(rules.map(rule => 
      rule.id === ruleId ? { ...rule, [field]: value } : rule
    ));
  };

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <div key={rule.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <select
            value={rule.condition}
            onChange={(e) => updateRule(rule.id, 'condition', e.target.value)}
            className="p-2 border rounded"
          >
            {conditions.map((condition) => (
              <option key={condition.id} value={condition.id}>
                {condition.label}
              </option>
            ))}
          </select>

          <select
            value={rule.operator}
            onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
            className="p-2 border rounded"
          >
            {operators.number.map((op) => (
              <option key={op.id} value={op.id}>
                {op.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={rule.value}
            onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
            className="p-2 border rounded"
            placeholder="Value"
          />

          <button
            onClick={() => removeRule(rule.id)}
            className="p-2 text-red-600 hover:text-red-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}

      <button
        onClick={addRule}
        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
      >
        + Add Rule
      </button>
    </div>
  );
};

export default RuleBuilder; 