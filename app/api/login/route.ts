import {setCookie} from 'cookies-next';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { ID,Pass } = body;

  const content =
    `POST%20%2Fums%2Fems%2Floginems.php%20HTTP%2F1.1=&Host%3A%20ums.cub.edu.bd=&Content-Length%3A%2091=&Cache-Control%3A%20max-age=0&Sec-Ch-Ua-Mobile%3A%20%3F0=&Sec-Ch-Ua-Platform%3A%20%22Windows%22=&Upgrade-Insecure-Requests%3A%201=&Origin%3A%20https%3A%2F%2Fums.cub.edu.bd=&Content-Type%3A%20application%2Fx-www-form-urlencoded=&User-Agent%3A%20Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F119.0.6045.159%20Safari%2F537.36=&Sec-Fetch-Site%3A%20same-origin=&Sec-Fetch-Mode%3A%20navigate=&Sec-Fetch-User%3A%20%3F1=&Sec-Fetch-Dest%3A%20document=&Referer%3A%20https%3A%2F%2Fums.cub.edu.bd%2Fums%2Fems%2Findex.php=&Accept-Encoding%3A%20gzip%2C%20deflate%2C%20br=&Accept-Language%3A%20en-US%2Cen%3Bq=0.9&Priority%3A%20u=0%2C%20i&Connection%3A%20close=&source=%2524actpage&globalkey=%2524globalkey&DataType=Login&gemsname=${ID}&gemspass=${Pass}`;

  const login = await fetch("http://ums.cub.edu.bd/ums/ems/loginems.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: content,
  });

  const loginData = login.headers.getSetCookie()[0];

  const data=await login.text();

  const found=data.search("<h1>Login to your account</h1>");

  if(found!=-1){
    return NextResponse.json({
      status:"failed",
      message:"Login Failed"
    });
  }
  else{
    const res=NextResponse.json({
      status:"success",
      message:"Login Successful"
    });
    const phpsessid= loginData.split(";")[0].split("=")[1];
    setCookie("PHPSESSID", phpsessid, { req,
      res,
      maxAge: 60*60, 
      path: '/', });
    return res
    
  }
   
}