
import random
import time
from django.http import JsonResponse
    
def generate_random_boolean():
    return random.choice([True, False])

def generate_response(success, message):
    return JsonResponse({
        "success": success,
        "message": message
    })

def openEmptySlot(request):
    random_boolean = generate_random_boolean()
    print(random_boolean) 
    time.sleep(5)
    if random_boolean:
        return generate_response(True, "Slot opened Successfully")
    else:
        return generate_response(False, "Some error occurred")

def getchargedbattery(request):
    random_boolean = generate_random_boolean()
    print(random_boolean) 
    time.sleep(5)
    if random_boolean:
        return generate_response(True, "Take your charged battery")
    else:
        return generate_response(False, "Some error occurred")
