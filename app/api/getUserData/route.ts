import { Record, SemesterGPA } from "@/utils/types";
import parse from "html-react-parser";
export async function POST(request: Request) {
    const body = await request.json();
    const { cookie } = body;

  const phpsessid = "PHPSESSID=" + cookie;
  console.log(phpsessid);

  const scoreData = await fetch("http://ums.cub.edu.bd/ums/ems/courselistmy.php", {
    method: "GET",
    headers: {
      Cookie: phpsessid,
    },
  });

  const res = await scoreData.text();

  let table= "";
  if(res){
    table = res.split("<table")[1].split("</table>")[0];
  table = "<table" + table + "</table>";
  }
    


    const tableData = parse(table) as JSX.Element;

    const tableHeader = [
      "Semester",
      "Course",
      "Credit",
      "Total",
      "Grade",
      "Score",
    ];
    const tableElements: Record[] = [];
    tableData.props.children.map((row: any) => {
      if(row.type == "tr"){
        const rowData = {
        Course: "",
        Credit: 0,
        Grade: "",
        Score: 0,
        Semester: "",
        Total: "",
        CreditScore: 0,
      };
      
      
      row.props.children.map((e: any, i: number) => {
        if (i === 2 || i === 5) {
          Object.assign(rowData, { [tableHeader[i]]: e.props.children * 1 });
        } else {
          Object.assign(rowData, { [tableHeader[i]]: e.props.children });
        }
      });
      tableElements.push(rowData);
      }
      
    });

    tableElements.map((e) => {
      e.CreditScore = e.Credit * e.Score;
    });

    const semesterGPA: SemesterGPA[] = [];
    const semesters: string[] = [];

    tableElements.reverse().map((e) => {
      if (!semesters.includes(e.Semester)) {
        semesters.push(e.Semester);
      }
    });
    let currentCGPA = 0;
    let cumulativeCredit = 0;
    let creditGPA = 0;
    semesters.map((semester) => {
      const semesterData = tableElements.filter(
        (e) => e.Semester === semester
      ) as Record[];
      const semesterCredit = semesterData.reduce(
        (acc, cur) => acc + cur.Credit,
        0
      );
      const semesterCreditScore = semesterData.reduce(
        (acc, cur) => acc + cur.CreditScore,
        0
      );
      const GPA = semesterCreditScore / semesterCredit;

      cumulativeCredit = cumulativeCredit + semesterCredit;
      creditGPA = creditGPA + GPA * semesterCredit;
      currentCGPA = creditGPA / cumulativeCredit;

      const data = {
        Semester: semester,
        GPA: +GPA.toFixed(2),
        Credit: semesterCredit,
        CurrentCGPA: +currentCGPA.toFixed(2),
        CumulativeCredit: cumulativeCredit,
      };
      semesterGPA.push(data);
    });

    return new Response(JSON.stringify(semesterGPA));
}