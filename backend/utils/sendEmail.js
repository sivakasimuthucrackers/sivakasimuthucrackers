import { Resend } from "resend";

export async function sendEmail({to,subject,html,attachments=[]}) {
  const resend=new Resend(process.env.RESEND_API_KEY);
  const from=process.env.RESEND_FROM_EMAIL;

  if(!from||!process.env.RESEND_API_KEY){
    console.error("Missing Resend environment variables");
    return {success:false};
  }

  try{
    const {data,error}=await resend.emails.send({
      from:`Sivakasi Muthu Crackers <${from}>`,
      to:Array.isArray(to)?to:[to],
      subject,
      html,
      attachments:attachments.map(a=>({
        filename:a.filename,
        content:Buffer.isBuffer(a.content)?a.content.toString("base64"):a.content
      }))
    });

    if(error){
      console.error(error);
      return {success:false,error};
    }

    return {success:true,messageId:data?.id};
  }catch(e){
    console.error(e);
    return {success:false,error:e.message};
  }
}
