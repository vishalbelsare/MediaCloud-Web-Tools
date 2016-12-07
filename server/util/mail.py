import logging
from flask_mail import Message

from server import mail

logger = logging.getLogger(__name__)

def send_email(sender, recipients, subject, message):
    logger.debug('Sending mail '+sender+':'+subject)
    msg = Message(subject,
                  sender=sender,
                  recipients=recipients)
    msg.body = message
    mail.send(msg)
