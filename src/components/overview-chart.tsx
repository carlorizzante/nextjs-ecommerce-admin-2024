"use client";

import {
  Bar,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

type OverviewChartProps = {
  data: any[];
}

export const OverviewChart = ({ data }: OverviewChartProps) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data}>
      <XAxis
        dataKey="name"
        stroke="#888888"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <XAxis
        stroke="#888888"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `$${value}`}
      />
      <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
      {/* <Tooltip /> */}
      {/* <Line type="monotone" dataKey="uv" stroke="#8884d8" /> */}
      {/* <Line type="monotone" dataKey="pv" stroke="#82ca9d" /> */}
    </LineChart>
  </ResponsiveContainer>
);
