import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const conditions = [
  { 
    id: 'totalSpent', 
    label: 'Total Spent', 
    type: 'number', 
    unit: '₹',
    description: 'Total amount spent by the customer'
  },
  { 
    id: 'visits', 
    label: 'Number of Visits', 
    type: 'number',
    description: 'Total number of times customer visited'
  },
  { 
    id: 'lastVisit', 
    label: 'Days Since Last Visit', 
    type: 'number',
    description: 'Number of days since customer last visited'
  }
];

const operators = [
  { id: 'gt', label: 'Greater than', applicableTypes: ['number'] },
  { id: 'lt', label: 'Less than', applicableTypes: ['number'] },
  { id: 'eq', label: 'Equal to', applicableTypes: ['number'] },
  { id: 'between', label: 'Between', applicableTypes: ['number'] }
];

const RuleItem = ({ rule, index, moveRule, updateRule, removeRule, isLast, rules }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'RULE',
    item: { index, rule },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'RULE',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRule(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  });

  const handleConditionChange = (e) => {
    const newCondition = e.target.value;
    const selectedCondition = conditions.find(c => c.id === newCondition);
    const validOperators = operators.filter(op => 
      op.applicableTypes.includes(selectedCondition.type)
    );
    
    updateRule(rule.id, {
      condition: newCondition,
      operator: validOperators[0].id,
      value: '',
      value2: '' // For "between" operator
    });
  };

  const handleOperatorChange = (e) => {
    updateRule(rule.id, {
      operator: e.target.value,
      value2: e.target.value === 'between' ? '' : undefined
    });
  };

  const handleValueChange = (e, field = 'value') => {
    updateRule(rule.id, {
      [field]: e.target.value
    });
  };

  const handleConjunctionChange = (e) => {
    // Update all subsequent rules' conjunctions to maintain consistency
    const newConjunction = e.target.value;
    const updatedRules = [...rules];
    for (let i = index; i < updatedRules.length; i++) {
      updatedRules[i] = {
        ...updatedRules[i],
        conjunction: newConjunction
      };
    }
    updateRule(rule.id, { conjunction: newConjunction }, updatedRules);
  };

  const condition = conditions.find(c => c.id === rule.condition);
  const validOperators = operators.filter(op => 
    op.applicableTypes.includes(condition.type)
  );

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex-none cursor-move">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {index > 0 && (
        <select
          value={rule.conjunction}
          onChange={handleConjunctionChange}
          className="p-2 border rounded bg-white"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
      )}

      <select
        value={rule.condition}
        onChange={handleConditionChange}
        className="p-2 border rounded flex-grow md:flex-grow-0"
      >
        {conditions.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        value={rule.operator}
        onChange={handleOperatorChange}
        className="p-2 border rounded flex-grow md:flex-grow-0"
      >
        {validOperators.map((op) => (
          <option key={op.id} value={op.id}>
            {op.label}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2 flex-grow">
        <input
          type="number"
          value={rule.value}
          onChange={(e) => handleValueChange(e)}
          className="p-2 border rounded flex-grow"
          placeholder="Value"
          min="0"
        />
        {rule.operator === 'between' && (
          <>
            <span className="text-gray-500">and</span>
            <input
              type="number"
              value={rule.value2 || ''}
              onChange={(e) => handleValueChange(e, 'value2')}
              className="p-2 border rounded flex-grow"
              placeholder="Second Value"
              min="0"
            />
          </>
        )}
        {condition.unit && <span className="text-gray-500">{condition.unit}</span>}
      </div>

      <button
        onClick={() => removeRule(rule.id)}
        className="p-2 text-red-600 hover:text-red-800 flex-none"
        title="Remove rule"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

const RuleBuilder = ({ rules, onChange }) => {
  const moveRule = (dragIndex, hoverIndex) => {
    const dragRule = rules[dragIndex];
    const newRules = [...rules];
    newRules.splice(dragIndex, 1);
    newRules.splice(hoverIndex, 0, dragRule);
    
    // Preserve conjunctions after move
    if (dragIndex < hoverIndex) {
      // Moving down
      for (let i = dragIndex; i < hoverIndex; i++) {
        newRules[i].conjunction = rules[i + 1].conjunction;
      }
    } else {
      // Moving up
      for (let i = hoverIndex + 1; i <= dragIndex; i++) {
        newRules[i].conjunction = rules[i - 1].conjunction;
      }
    }
    
    onChange(newRules);
  };

  const addRule = () => {
    const newRule = {
      id: Date.now(),
      condition: conditions[0].id,
      operator: operators[0].id,
      value: '',
      value2: '',
      conjunction: rules.length > 0 ? rules[rules.length - 1].conjunction : 'AND'
    };
    onChange([...rules, newRule]);
  };

  const removeRule = (ruleId) => {
    onChange(rules.filter(rule => rule.id !== ruleId));
  };

  const updateRule = (ruleId, updates, updatedRules = null) => {
    if (updatedRules) {
      onChange(updatedRules);
    } else {
      onChange(rules.map(rule =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ));
    }
  };

  const getNaturalLanguageRule = (rule, index) => {
    const condition = conditions.find(c => c.id === rule.condition);
    const operator = operators.find(op => op.id === rule.operator);
    
    let ruleText = '';
    if (index > 0) {
      ruleText += ` ${rule.conjunction} `;
    }
    
    if (operator.id === 'between') {
      if (rule.value && rule.value2) {
        ruleText += `${condition.label} is between ${rule.value} and ${rule.value2}`;
      } else {
        ruleText += `${condition.label} is between (incomplete range)`;
      }
    } else {
      ruleText += `${condition.label} is ${operator.label.toLowerCase()} ${rule.value || '(no value)'}`;
    }
    
    if (condition.unit) {
      if (operator.id === 'between') {
        ruleText += ` ${condition.unit} each`;
      } else {
        ruleText += ` ${condition.unit}`;
      }
    }
    
    return ruleText;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <RuleItem
            key={rule.id}
            rule={rule}
            index={index}
            moveRule={moveRule}
            updateRule={updateRule}
            removeRule={removeRule}
            isLast={index === rules.length - 1}
            rules={rules}
          />
        ))}

        <button
          onClick={addRule}
          className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          + Add Rule
        </button>

        {rules.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Rule Summary</h4>
            <p className="text-blue-700">
              {rules.map((rule, index) => getNaturalLanguageRule(rule, index))}
            </p>
            <div className="mt-2 text-sm text-blue-600">
              Target Audience: Customers who match these conditions will be targeted for specific campaigns or actions.
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default RuleBuilder; 