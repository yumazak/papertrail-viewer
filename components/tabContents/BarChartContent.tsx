import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { TooltipProps } from "recharts";
// for recharts v2.1 and above
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { PaperTrailLogData } from "@/lib/types/papertrail";

interface Props {
  data: PaperTrailLogData[];
}

type LineChartData = {
  name: string;
  date: Date;
  service: number;
};

export function BarChartContent(props: Props) {
  const lineChartDatas: LineChartData[] = props.data.map((data) => {
    return {
      name: data.message.path,
      date: data.generatedAt,
      service: data.message.service,
    };
  });
  console.log(lineChartDatas);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      console.log(payload);
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].payload.name}`}</p>
          <p className="intro">{payload[0].payload.service}</p>
          <p className="desc">Anything you want can be displayed here.</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        width={500}
        height={300}
        data={lineChartDatas}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" hide={true} />
        <YAxis />
        <Tooltip
          formatter={(value, name) => {
            return value + " ms";
          }}
        />
        <Legend />
        <Bar dataKey="service" />
      </BarChart>
    </ResponsiveContainer>
  );
}
