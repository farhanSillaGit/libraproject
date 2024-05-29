from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings
import os
from dotenv import load_dotenv
import base64
# Create your views here.
load_dotenv()
def security_patrol(request):
    return render(request, 'patrol.html')
def home(request):
    return render(request, 'index.html')
def track_attendance(request):
    return render(request, 'attendance.html')

# Import necessary modules
from django.http import JsonResponse
from google.oauth2 import service_account
from googleapiclient.discovery import build
import json


def patrolling(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data
            form_data = json.loads(request.body.decode('utf-8'))
            print("Received form data:")
            print(form_data)
            #json_file_path = os.path.join(settings.BASE_DIR, 'home', 'credentials', 'qrprojecct-46ebc6050104.json')
            json_file_path = os.getenv('GOOGLE_CLOUD_CREDENTIALS_PATH')
            # Initialize Google Sheets API


            creds = service_account.Credentials.from_service_account_file(
                json_file_path,
                scopes=['https://www.googleapis.com/auth/spreadsheets']
            )
            service = build('sheets', 'v4', credentials=creds)

            # Write data to Google Sheet
           # spreadsheet_id = '1biXAwyxTbIN3IBG4QNUtqOvlk22jS_8LNV0aZ3may6M'
            spreadsheet_id = os.getenv('MYFORM_SPREADSHEET_ID')
            range_ = 'Sheet1!A2:H'  # Specify the sheet name or range where you want to write data
            values = []
            for submission in form_data:
                site_id = submission.get('siteId')
                time_str = submission.get('time')
                status = submission.get('status')
                date = submission.get('date')
                shift = submission.get('shift')
                employee_id = submission.get('employeeId')
                remark = submission.get('remark')
                qr_code = submission.get('qrCode')
                # Append each form submission to the values list
                values.append([site_id, time_str, status, date, shift, employee_id, remark, qr_code])
                # For demonstration purposes, print the form data
                print(f'Site Code: {site_id}')
                print(f'Time: {time_str}')
                print(f'Status: {status}')
                print(f'Date: {date}')
                print(f'Shift: {shift}')
                print(f'Employee ID: {employee_id}')
                print(f'Remark: {remark}')
                print(f'Scanned QR Code: {qr_code}')

            # Append all form submissions to the Google Sheet
            body = {'values': values}
            result = service.spreadsheets().values().append(
                spreadsheetId=spreadsheet_id,
                range=range_,
                valueInputOption='RAW',
                body=body
            ).execute()

            return JsonResponse({'message': 'Form submitted successfully!'})
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)


def form_submission(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data
            form_data = json.loads(request.body.decode('utf-8'))
            #print("Received form data:")
            #print(form_data)
            #json_file_path = os.path.join(settings.BASE_DIR, 'home', 'credentials', 'qrprojecct-46ebc6050104.json')
            json_file_path = os.getenv('GOOGLE_CLOUD_CREDENTIALS_PATH')
            # Initialize Google Sheets API
            creds = service_account.Credentials.from_service_account_file(
                json_file_path,
                scopes=['https://www.googleapis.com/auth/spreadsheets']
            )
            service = build('sheets', 'v4', credentials=creds)

            for submission in form_data:
                form_id = submission.get('formid')
                if form_id == 'myForm':
                    # For 'myForm'
                    spreadsheet_id =  os.getenv('MYFORM_SPREADSHEET_ID')
                    range_ = 'Sheet1!A2:H'  # Specify the sheet name or range where you want to write data
                    site_id = submission.get('siteId')
                    time_str = submission.get('time')
                    status = submission.get('status')
                    date = submission.get('date')
                    shift = submission.get('shift')
                    employee_id = submission.get('employeeId')
                    remark = submission.get('remark')
                    qr_code = submission.get('qrCode')

                    # Append form data to the specified Google Sheet
                    values = [[site_id, time_str, status, date, shift, employee_id, remark, qr_code]]
                    body = {'values': values}
                    result = service.spreadsheets().values().append(
                        spreadsheetId=spreadsheet_id,
                        range=range_,
                        valueInputOption='RAW',
                        body=body
                    ).execute()
                    print(f'Form data submitted to sheet for myForm')

                elif form_id == 'myForm2':
                    # For 'myForm2'
                    spreadsheet_id =  os.getenv('MYFORM2_SPREADSHEET_ID')
                    range_ = 'Sheet2!A2:L'  # Specify the sheet name or range where you want to write data
                    site_id = submission.get('siteId')
                    time_str = submission.get('time')
                    status = submission.get('status')
                    date = submission.get('date')
                    shift = submission.get('shift')
                    employee_id = submission.get('employeeId')

                    # Append form data to the specified Google Sheet
                    values = [[site_id, time_str, status, date, shift, employee_id]]
                    body = {'values': values}
                    result = service.spreadsheets().values().append(
                        spreadsheetId=spreadsheet_id,
                        range=range_,
                        valueInputOption='RAW',
                        body=body
                    ).execute()
                    print(f'Form data submitted to sheet for myForm2')

                else:
                    print(f'No matching spreadsheet found for form ID: {form_id}')

            return JsonResponse({'message': 'Form submissions processed successfully!'})
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)

