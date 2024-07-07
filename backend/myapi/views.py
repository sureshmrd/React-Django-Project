from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.views import View
from rest_framework.response import Response
from .models import Result,Student,Counsellor,Profile
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import ResultSerializer,CounsellorSerializer
from rest_framework import status
from .readcsv import uploadToDb
from .uploadcounsellor import readcounsellor, readstudent
from django.contrib.auth import authenticate,login
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .sendmail import send_forget_password_mail
import uuid
from rest_framework.decorators import api_view
import json

@api_view(['GET'])
def counsellor_list(request):
    if request.method == 'GET':
        counsellors = Counsellor.objects.all().values()
        serializer = CounsellorSerializer(counsellors, many=True)
        data = []
        i=0
        for row in counsellors:
            students = Student.objects.filter(counId=row['counId'])
            student_data = []
            for student in students:
                s = Student.objects.get(regNo=student.regNo)
                student_data.append({
                    'regNo': student.regNo,
                    'cgpa': s.cgpa,
                    'backlogs': s.activebacklogs,
                    'year': s.year,
                    'branch': s.branch,
                    'section':s.section,
                })
            data.append({'counsellor':serializer.data[i],'students': student_data})
            i+=1

        return Response(data)
    else:
        # Method not allowed
        return Response({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def handle_upload(request):
    if request.method == 'POST':
        # Access form data
        name = request.POST.get('name')  # Access the 'name' field
        # Access the 'pdfName' field
        
        # Access uploaded file
        pdf_file = request.FILES.get('pdf')  # Access the uploaded PDF file
        
        # Do something with the form data and file
        if name and pdf_file:
            # Process the uploaded file
            # For example, save it to the server
            if(name=='Counsellor'):
                with open('media/counsellor.xlsx', 'wb') as f:
                    for chunk in pdf_file.chunks():
                        f.write(chunk)
                readcounsellor()
            elif(name=='Result'):
                with open('media/result.pdf', 'wb') as f:
                    for chunk in pdf_file.chunks():
                        f.write(chunk)
                m = uploadToDb()
                print(m)
                if((m['uploaded']==False and m['reval']==True) or m['colError']==True):
                    return JsonResponse({'error': m['message']}, status=200)
            elif(name=="Student"):
                with open('media/student.xlsx', 'wb') as f:
                    for chunk in pdf_file.chunks():
                        f.write(chunk)
                readstudent()
            # Return a JSON response indicating success
            return JsonResponse({'message': 'Upload successful'}, status=200)
        else:
            # If required form data is missing, return a JSON response with an error message
            return JsonResponse({'error': 'Missing form data'}, status=400)
    else:
        # Handle other HTTP methods (e.g., GET)
        return JsonResponse({'error': 'Method not allowed'}, status=405)

class Counselling(View):
    def get(self, request):
        try:
            counsellor_id = request.GET.get('counId')
            counsellor_name = Counsellor.objects.get(counId=counsellor_id)
            students = Student.objects.filter(counId=counsellor_id)
            student_data = []
            for student in students:
                results = Result.objects.filter(regNo=student.regNo)
                serializer = ResultSerializer(results, many=True)
                student_data.append({
                    'regNo': student.regNo,
                    'results': serializer.data,
                })
            return JsonResponse({'students': student_data,'name':counsellor_name.name})
        except Counsellor.DoesNotExist:
            return JsonResponse({'error': 'Counsellor not found'}, status=404)

@csrf_exempt
def forgot_password(request):
    if request.method == 'POST':
        counId = request.POST.get('counId')

        try:
            user = User.objects.get(username=counId)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        user_obj = User.objects.get(username = counId)
        token = str(uuid.uuid4())
        profile_obj= Profile.objects.get(user = user_obj)
        profile_obj.forget_password_token = token
        profile_obj.save()
        send_forget_password_mail(user_obj.email , token)
        return JsonResponse({'message': 'Password reset email sent successfully','token':token}, status=200)

    # If the request method is not POST, return an error
    return JsonResponse({'error': 'Method not allowed'}, status=405)

class StudentView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        regNo = request.GET.get('regNo')
        rows = Result.objects.filter(regNo=regNo)
        serializer = ResultSerializer(rows, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        posts_serializer = ResultSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def counsellor_login(request):
    if request.method == 'POST':
        # Get the request body as a byte string
        body = request.body

        # Decode the byte string to UTF-8 format and parse the JSON data
        data = json.loads(body.decode('utf-8'))

        # Extract username and password from the JSON data
        username = data.get('username')
        password = data.get('password')

        # Check if the username and password are provided
        if not username or not password:
            return JsonResponse({'error': 'Both username and password are required'}, status=400)

        # Authenticate the user
        user = authenticate(username=username, password=password)

        # If authentication is successful, log in the user
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful'},status=200)

        # If authentication fails, return an error message
        return JsonResponse({'error': 'Invalid username or password'}, status=401)

    # If the request method is not POST, return an error
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def Home(request):
    return HttpResponse("Home Page<h1>welcome<h1>")

@csrf_exempt
def ChangePassword(request , token):
    try:
        profile_obj = Profile.objects.filter(forget_password_token = token).first()
        user_id = profile_obj.user.id
        if request.method == 'POST':
            body = request.body

        # Decode the byte string to UTF-8 format and parse the JSON data
            data = json.loads(body.decode('utf-8'))
            new_password = data.get('new_password')
            if user_id is  None:
                return JsonResponse({'error': 'Invalid username or password'}, status=401)
            
            user_obj = User.objects.get(id = user_id)
            user_obj.set_password(new_password)
            user_obj.save()
            
            return JsonResponse({'message': 'Login successful'},status=200)
                    
    except Exception as e:
        return JsonResponse({'error': 'Invalid username or password'}, status=401)
    
def details(request) :

    regNo = request.GET.get('regNo')
    student = Result.objects.get(regNo = regNo)
    return HttpResponse("Hello %s" %student.subName)