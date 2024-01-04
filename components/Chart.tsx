"use client";
import { SemesterGPA } from "@/utils/types";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Chart = ({ data }: { data: SemesterGPA[] }) => {
  console.log("rendering");

  return (
    <div className="h-[500px] w-[95%] mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          className="mx-auto"
          data={data}
          margin={{
            top: 20,
            right: 30,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Semester" textAnchor="end" angle={-45} />
          <YAxis yAxisId="left" type="number" domain={["dataMin", "dataMax"]} />
          <Tooltip contentStyle={{ backgroundColor: "#222" }} />
          <Legend verticalAlign="top" align="center" height={36} />

          <Line
            yAxisId="left"
            name="GPA"
            type="monotone"
            dataKey="GPA"
            stroke="#82ca9d"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="CurrentCGPA"
            name="CGPA"
            stroke="#8884d8"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
