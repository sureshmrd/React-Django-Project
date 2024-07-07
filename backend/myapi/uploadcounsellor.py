
import pandas as pd
from .models import Counsellor,Student,Result
from django.contrib.auth.models import User
from .models import *
from .helpers import cgpa_and_backlogs
from .serializers import ResultSerializer

def readcounsellor():
    df = pd.read_excel('./media/counsellor.xlsx')
    paswFlag = True  
    #print(df.head())
    for index, row in df.iterrows():
        try:#checking if counsellor already exists
            r = Counsellor.objects.get(counId=row.iloc[0])
            if ( r.name == row.iloc[1] and int(r.phoneNo)==row.iloc[2] and r.mail == row.iloc[3] ):
                paswFlag = False  #If Nodetails change dont reset password
        except:
            pass
        newCoun = Counsellor(
        counId = row.iloc[0],
        name=row.iloc[1],
        phoneNo = row.iloc[2],
        mail = row.iloc[3]
        )
        newCoun.save()

        counsId = row.iloc[0]
        email = row.iloc[3]
        password = "sircrr123"

        try:
            user_obj = User(username = counsId , email = email)
            user_obj.set_password(password)
            user_obj.save()
            profile_obj = Profile.objects.create(user = user_obj )
            profile_obj.save()
        except:
            user_obj = User.objects.get(username = counsId , email = email)
            if(paswFlag):
                user_obj.set_password(password)
            user_obj.save()

        

def readstudent():
    df = pd.read_excel('./media/student.xlsx')
    #print(df.head())
    for index, row in df.iterrows():
        counsellor = Counsellor.objects.get(counId=row.iloc[1])
        rows = Result.objects.filter(regNo=row.iloc[0])
        serializer = ResultSerializer(rows, many=True)
        cb = cgpa_and_backlogs(serializer.data)
        row = Student(row.iloc[0], counsellor, row.iloc[2], row.iloc[3], row.iloc[4],cb['cgpa'],cb['backlogs'])
        row.save()
