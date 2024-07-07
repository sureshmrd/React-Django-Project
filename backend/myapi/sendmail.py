from django.core.mail import send_mail,EmailMessage
from django.conf import settings 

import smtplib

def send_forget_password_mail(email , token ):
    YOUR_GOOGLE_EMAIL = 'balajikukkapalli2002@gmail.com'  # The email you setup to send the email using app password
    YOUR_GOOGLE_EMAIL_APP_PASSWORD = 'gmeacfikgvnuwbgs'  # The app password you generated

    smtpserver = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    smtpserver.ehlo()
    smtpserver.login(YOUR_GOOGLE_EMAIL, YOUR_GOOGLE_EMAIL_APP_PASSWORD)

    # Test send mail
    sent_from = YOUR_GOOGLE_EMAIL
    print('seknd: ',email)
    sent_to = email  #  Send it to self (as test)
    email_text = 'This is a test'
    email_text = 'Hi click on the link to reset your password\nhttp://localhost:3000/counsellor/resetpassword/'+token+'/'
    smtpserver.sendmail(sent_from, sent_to,email_text)

    # Close the connection
    smtpserver.close()
    return True