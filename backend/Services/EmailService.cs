using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace backend.Services
{
    public class EmailService
    {
        public IConfiguration Configuration { get; }
        public EmailService(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public async Task SendEmail(string toEmail, string subject, string body)
        {
            var fromEmail = "seu email";
            var fromEmailPassword = "sctecyafrckrwahg";
            var fromDisplayName = "nome da conta";


            var message = new MailMessage()
            {
                From = new MailAddress(fromEmail, fromDisplayName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(toEmail);

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromEmail, fromEmailPassword),
                EnableSsl = true,
                UseDefaultCredentials = false
            };

            smtpClient.Send(message);
        }
    }
}