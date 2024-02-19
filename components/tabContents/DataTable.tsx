import { LogEntry, PaperTrailLogData } from "@/lib/types/papertrail";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface Props {
  data: LogEntry[];
}
interface GroupedData {
  path: string;
  count: number;
  maxService: number;
  avgService: number;
}

export function DataTable(props: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<GroupedData>[] = [
    {
      accessorKey: "path",
      header: "Path",
    },
    {
      accessorKey: "count",
      header: ({ column }) => {
        return (
          //   <Button
          //     variant="ghost"
          //     onClick={() => {
          //       console.log(table.getRowModel);
          //     }}
          //   >
          //     Count
          //     <ArrowUpDown className="ml-2 h-4 w-4" />
          //   </Button>
          <div>Count</div>
        );
      },
    },
    {
      accessorKey: "maxService",
      header: "Max",
    },
    {
      accessorKey: "avgService",
      header: "Average",
    },
  ];
  const groupedByPath = props.data.reduce((acc, item) => {
    // 'key'をキーとしてデータをグループ化
    if (!acc[item.key]) {
      acc[item.key] = {
        path: item.key,
        count: 0,
        maxService: 0,
        avgService: 0,
      };
    }

    acc[item.key].count += 1;
    acc[item.key].maxService = Math.max(acc[item.key].maxService, item.service);

    // 平均値の更新
    const totalService =
      acc[item.key].avgService * (acc[item.key].count - 1) + item.service;
    acc[item.key].avgService = totalService / acc[item.key].count;

    return acc;
  }, {} as Record<string, GroupedData>);
  const table = useReactTable({
    data: Object.entries(groupedByPath).map(([path, logs]) => logs),
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
