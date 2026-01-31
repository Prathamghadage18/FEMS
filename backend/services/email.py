import threading
from django.conf import settings
from django.core.mail import EmailMessage as Email


class EmailService(threading.Thread):
    def __init__(self, subject, body, recievers, to_cc=[], *args, **kwargs):
        self.email = Email(
            subject,  # subject
            body,  # body
            settings.EMAIL_HOST_NAME + " " + settings.EMAIL_HOST_USER,  # from mail
            list(set(recievers)),  # recievers
            cc=list(set(to_cc)),  # in cc
            bcc=[]
        )
        super(EmailService, self).__init__(*args, **kwargs)
    

    def run(self):
        self.email.send(fail_silently=False)

    def send(self,):
        self.start()    

