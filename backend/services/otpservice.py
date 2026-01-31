import json
import requests
from django.conf import settings

def send_otp(mobile_number, params={}):
    url = f"https://control.msg91.com/api/v5/otp"
    payload = json.dumps(params)

    headers = {'Content-Type': "application/json"}

    query_params = {
        "template_id": settings.OTP_TEMPLATE_ID,
        "otp_length": 6,
        "mobile": f"{settings.COUNTRY_CODE_MOBILE}{mobile_number}",
        "authkey": settings.MSG91_AUTH_KEY,
        "realTimeResponse": "true"
    }

    response = requests.post(url, headers=headers, params=query_params, data=payload)
    response_data = response.json()

    return response_data


def otp_verify(mobile_number, otp):
    url = f"https://control.msg91.com/api/v5/otp/verify"
    headers = {'authkey': settings.MSG91_AUTH_KEY}

    query_params = {
        "otp": otp,
        "mobile": f"{settings.COUNTRY_CODE_MOBILE}{mobile_number}"
    }

    response = requests.get(url, headers=headers, params=query_params)
    response_data = response.json()
    return response_data

def resend_otp(mobile_number):
    url = f"https://control.msg91.com/api/v5/otp/retry"
    query_params = {
        'authkey': settings.MSG91_AUTH_KEY,
        'retrytype': 'text',
        'mobile': f"{settings.COUNTRY_CODE_MOBILE}{mobile_number}"
    }
    response = requests.get(url, params=query_params)
    print('resend otp >>>>>>>>>>>>>>>>>>>>>>>> in resend functions', response.text)
    return response.json()