from django.core.management.base import BaseCommand

class Message(BaseCommand):
    help = 'Prints'

    def handle(self, *args, **kwargs):
        print('Hello, this is a cron job!')