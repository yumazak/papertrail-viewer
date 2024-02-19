import {
  LineChart,
  Line,
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
import { LogEntry, PaperTrailLogData } from "@/lib/types/papertrail";

interface Props {
  data: LogEntry[];
}

type LineChartData = {
  name: string;
  date: Date;
  service: number;
};

export function MultiLineChart(props: Props) {
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
      <LineChart
        width={500}
        height={300}
        data={props.data}
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
        <Line
          type="monotone"
          dataKey="service"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
