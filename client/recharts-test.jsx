import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Week 1', value: 10 },
  { name: 'Week 2', value: 20 },
  { name: 'Week 3', value: 15 },
  { name: 'Week 4', value: 25 }
];

const RechartsTest = () => {
  console.log('RechartsTest component rendering');
  console.log('Test data:', data);
  
  return (
    <div style={{ width: '500px', height: '300px', background: 'white', padding: '20px' }}>
      <h2>Recharts Test</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsTest;