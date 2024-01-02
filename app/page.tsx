"use client";
import { Record } from "@/types";
import parse from "html-react-parser";

export default function Home() {
  const getData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}api/getUserData`, {
      method: "POST",
      body: JSON.stringify({
        ID: process.env.NEXT_PUBLIC_ID,
        Pass: process.env.NEXT_PUBLIC_PASS,
      }),
    });

    const data = await res.text();

    const tableData = parse(data) as JSX.Element;

    const tableHeader = [
      "Semester",
      "Course",
      "Credit",
      "Total",
      "Grade",
      "Score",
    ];
    const tableElements: Record[] = [];
    tableData.props.children[1].props.children.map((row: any) => {
      const rowData = {
        Course: "",
        Credit: 0,
        Grade: "",
        Score: 0,
        Semester: "",
        Total: "",
      };
      row.props.children.map((e: any, i: number) => {
        if (i === 2 || i === 5) {
          Object.assign(rowData, { [tableHeader[i]]: e.props.children * 1 });
        } else {
          Object.assign(rowData, { [tableHeader[i]]: e.props.children });
        }
      });
      tableElements.push(rowData);
    });

    console.log(tableElements);
  };

  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <button
        className="bg-blue-600 p-3 hover:bg-blue-800 rounded-2xl"
        onClick={getData}
      >
        Get Data
      </button>
    </main>
  );
}
