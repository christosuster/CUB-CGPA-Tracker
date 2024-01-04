import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { course } from "@/utils/types";
import { Card } from "./ui/card";

const GradesTable = ({ data }: { data: course[] }) => {
  return (
    <Card className=" w-full mx-auto">
      <Table>
        <TableHeader>
          <TableRow className="">
            <TableHead className="text-left">Semester</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Crd Hr.</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.Course}>
              <TableCell className="font-medium">{item.Semester}</TableCell>
              <TableCell>{item.Course}</TableCell>
              <TableCell>{item.Credit}</TableCell>
              <TableCell>{item.Total}</TableCell>
              <TableCell>{item.Grade}</TableCell>
              <TableCell className="text-right">{item.Score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default GradesTable;
