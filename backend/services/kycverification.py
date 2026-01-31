import requests
from django.conf import settings


def aadhaar_otp_generate(aadhaar_number):

    url = "https://sandbox.cashfree.com/verification/offline-aadhaar/otp"

    payload = { "aadhaar_number": aadhaar_number }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "x-client-id": settings.CASHFREE_CLIENT_ID,
        "x-client-secret": settings.CASHFREE_CLIENT_SECRET, 
    }
    response = requests.post(url, json=payload, headers=headers)

    print(response.text)
    print(response.json,'--------------------------jjjjj')
    print('>>>>>>>>>>>>>>>>>>>> def aadhaar res',response)
    return response

# status 200
# {
#   "status": "SUCCESS",
#   "message": "OTP sent successfully",
#   "ref_id": 21637861
# }

# {
#   "status": "SUCCESS",
#   "message": "Aadhaar not linked to mobile number",
#   "ref_id": 21637861
# }

# {
#   "ref_id": 208,
#   "status": "INVALID",
#   "message": "Invalid Aadhaar Card"
# }

def verify_aadhaar(otp,ref_id):
    url = "https://sandbox.cashfree.com/verification/offline-aadhaar/verify"
    payload = {
        "otp": otp,
        "ref_id": ref_id
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)

    print(response.text)
    print('>>>>>>>>>>>>>>>>>>>> def aadhaar verify',response)
    return response
# status 200 
# { 
#   "ref_id": 70471,
#   "status": "VALID",
#   "message": "Aadhaar Card Exists",
#   "care_of": "S/O: Fakkirappa Dollin",
#   "address": "Shri Kanaka Nilaya,,Umashankar Nagar 1st Main 5th Cross,Ranebennur,Haveri-Karnataka,India",
#   "dob": "02-02-1995",
#   "email": null,
#   "gender": "M",
#   "name": "Mallesh Fakkirappa Dollin",
#   "split_address": {
#     "country": "India",
#     "dist": "Haveri",
#     "house": "Shri Kanaka Nilaya",
#     "landmark": null,
#     "pincode": 581115,
#     "po": "Ranebennur",
#     "state": "Karnataka",
#     "street": "Umashankar Nagar 1st Main 5th Cross",
#     "subdist": "Ranibennur",
#     "vtc": "Ranibennur"
#   },
#   "year_of_birth": 1995,
#   "mobile_hash": "ed189eb73247cb90b769e7e8d7dfd2efa4cd6a5ec27602f5d2721c035266568c",
#   "photo_link": "<base64 encoded image>"
# }