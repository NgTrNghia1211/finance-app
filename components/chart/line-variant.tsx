import React from "react";

import { format } from "date-fns";

import {
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { CustomTooltip } from "./custom-tooltip";

type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export const LineVariant = ({ data }: Props) => {
  const mappingData = data.map((item) => ({
    ...item,
    expenses: item.expenses * -1,
  }));

  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <LineChart data={mappingData}>
        <CartesianGrid strokeDasharray={"3 3"} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => format(value, "dd MMM")}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          dataKey="income"
          stroke="#8884d8"
          strokeWidth={2}
          fill="#8884d8"
          className="drop-shadow-sm"
          dot={false}
        />
        <Line
          dataKey="expenses"
          strokeWidth={2}
          stroke="#82ca9d"
          fill="#82ca9d"
          className="drop-shadow-sm"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
