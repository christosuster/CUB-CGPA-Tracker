import { Record, SemesterGPA } from "@/utils/types";
import parse from "html-react-parser";

function formatName(inputString: string) {
  let trimmedString = inputString.trim().toLowerCase();


  let formattedString = trimmedString.replace(/\b\w/g, c => c.toUpperCase());

  return formattedString;
}

export async function POST(request: Request) {
    const body = await request.json();
    const { cookie } = body;

  const phpsessid = "PHPSESSID=" + cookie;
  

  const scoreData = await fetch("http://ums.cub.edu.bd/ums/ems/courselistmy.php", {
    method: "GET",
    headers: {
      Cookie: phpsessid,
    },
  });

  const res = await scoreData.text();

  const found = res.search("My Information");

  if (found === -1) {
    return new Response(JSON.stringify({ 
      status: "error",
      message: "Something went wrong. Please login again."
     }));
  }

  const id = res.split("<h3>")[1].split("</h3>")[0];
  
  
  let image = res.split('<img src="../')[1].split('"')[0];
  

  let name = res.split(image)[1].split('>')[1].split('<')[0];
  name = formatName(name);
  

image = "http://ums.cub.edu.bd/ums/" + image;
  
   let table = res.split("<table")[1].split("</table>")[0];
  table = "<table" + table + "</table>";
  
    


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

    const cleanedTableElements = tableElements.filter(e=>{
      return !isNaN(e.Credit) && !isNaN(e.Score) && !isNaN(e.CreditScore)
    });


    cleanedTableElements.map((e) => {
    
      e.CreditScore = e.Credit * e.Score;
    });

    const semesterGPA: SemesterGPA[] = [];
    const semesters: string[] = [];

    cleanedTableElements.reverse().map((e) => {
      if (!semesters.includes(e.Semester)) {
        semesters.push(e.Semester);
      }
    });
    let currentCGPA = 0;
    let cumulativeCredit = 0;
    let creditGPA = 0;
    semesters.map((semester) => {
      const semesterData = cleanedTableElements.filter(
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

    

    return new Response(JSON.stringify({
      status: "success",
      data: {
        semesterGPA,
      name,
      image,
      id,
      courses: cleanedTableElements,
      }
    }));
}