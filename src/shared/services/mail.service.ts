import CONFIG from "../../config/config";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(CONFIG.SENDGRID_API_KEY);
console.log("CONFIG.SENDGRID_API_KEY", CONFIG.SENDGRID_API_KEY);

export class MailService {
  sendMail = async (params: any): Promise<any> => {
    const { to, subject, html } = params;

    const msg = {
      to,
      from: "dev1@mindrobo.co",
      subject,
      html,
    };

    const response = await sgMail.send(msg);
    return response;
  };
}
