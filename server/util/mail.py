from flask_mail import Message

from server import mail

def send_email(sender, recipients, subject, message):
    msg = Message(subject,
                  sender=sender,
                  recipients=recipients)
    msg.body = message
    mail.send(msg)
