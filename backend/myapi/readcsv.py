import pandas as pd
import tabula
from django.contrib.auth.models import User
from .models import Result,Student
from .pdfExtr import getDetails
import datetime
from .helpers import cgpa_and_backlogs
# Read CSV file into a DataFrame

def updateGpa(regNo,gpa,backlogs):
    try:
        student = Student.objects.get(regNo=regNo)
        student.cgpa = gpa
        student.activebacklogs = backlogs
        student.save()
    except:
        print(regNo,"student not registered in Student Table")

def toCsv():
    df = pd.DataFrame([])
    '''dfs = tabula.read_pdf('./media/result.pdf', pages='all',stream=True)
    df = [dfs[i] for i in range(len(dfs))]
    df = pd.concat(df)
    df.to_csv('./media/'+'ok.csv',index=False)'''
    examDetails = getDetails('./media/result.pdf')
    return examDetails

def uploadToDb():
    
    csv_file_path = './media/ok.csv'
    revalution,regular,sem,datee = toCsv()
    df = pd.read_csv(csv_file_path)
    year = (sem-1)//2+1
    semes = 1 if sem%2==1 else 2
    seme = str(year)+'-'+str(semes)
    print(revalution,regular,sem,datee)
    d = datee.split('-')#dateFormat: 2002-08-24
    d = datetime.date(int(d[0]), int(d[1]), int(d[2]))
    
    studentReg = df.iloc[0][0]
    #print(studentReg)
    if(df.shape[1]==6):
        if(revalution==False):
            #print("in sec 1", seme)
            for index, row in df.iterrows():
                #print(index,'/',df.shape[0])
                try:
                    r = Result.objects.get(regNo=row.iloc[0],subCode=row.iloc[1],month_year = d)
                    r.delete()
                except:
                    pass
                    #r=False
                #if(r):
                #    continue
                result = Result(
                    regNo = row.iloc[0],
                    subCode=row.iloc[1],
                    subName = row.iloc[2],
                    internals = row.iloc[3],
                    grade = row.iloc[4],
                    credits = row.iloc[5],
                    sem = seme,
                    month_year = d
                )
                result.save()
                if(studentReg!=row.iloc[0]):
                    print(studentReg,index,'/',df.shape[0])
                    stdRows = Result.objects.filter(regNo=studentReg).values()
                    gb = cgpa_and_backlogs(stdRows)
                    updateGpa(studentReg,gb['cgpa'],gb['backlogs'])
                    studentReg = row.iloc[0]

            return {'colError':False,'uploaded':True,'reval':False,'message':'Upload Successful'}
        else:
            print('InRevalutaion')
            try:
                for index, row in df.iterrows():
                    r = Result.objects.get(regNo=row.iloc[0],subCode=row.iloc[1],month_year = d)
                    print("reval",index,'/',df.shape[0])
                    if('NO' in str(row.iloc[4]).upper()):
                        continue
                    r.internals = row.iloc[3]
                    r.grade = row.iloc[4]
                    r.credits = row.iloc[5]
                    r.save()

                    if(studentReg!=row.iloc[0]):
                        stdRows = Result.objects.filter(regNo=studentReg).values()
                        gb = cgpa_and_backlogs(stdRows)
                        updateGpa(studentReg,gb['cgpa'],gb['backlogs'])
                        studentReg = row.iloc[0]
                return {'colError':False,'uploaded':True,'reval':True,'message':'Upload Successful'}
            except:
                return {'colError':False,'uploaded':False,'reval':True,'message':'Upload Regular Before Revaluation.'}
    elif(df.shape[1]==5):
        if(revalution==False):
            for index, row in df.iterrows():
                r = Result.objects.get(regNo=row.iloc[0],subCode=row.iloc[1],month_year = d)
                if(r):
                    continue
                result = Result(
                    regNo = row.iloc[0],
                    subCode=row.iloc[1],
                    subName = row.iloc[2],
                    internals = 0,
                    grade = row.iloc[3],
                    credits = row.iloc[4],
                    sem = seme,
                    month_year = d
                )
                result.save()

                if(studentReg!=row.iloc[0]):
                    stdRows = Result.objects.filter(regNo=studentReg).values()
                    gb = cgpa_and_backlogs(stdRows)
                    updateGpa(studentReg,gb['cgpa'],gb['backlogs'])
                    studentReg = row.iloc[0]

            return {'colError':False,'uploaded':True,'reval':False,'message':'Upload Successful'}
        else:
            try:
                for index, row in df.iterrows():
                    r = Result.objects.get(regNo=row.iloc[0],subCode=row.iloc[1],month_year = d)
                    if('NO' in str(row.iloc[4]).upper()):
                        continue
                    r.internals = 0,
                    r.grade = row.iloc[3]
                    r.credits = row.iloc[4]
                    r.save()

                    if(studentReg!=row.iloc[0]):
                        stdRows = Result.objects.filter(regNo=studentReg).values()
                        gb = cgpa_and_backlogs(stdRows)
                        updateGpa(studentReg,gb['cgpa'],gb['backlogs'])
                        studentReg = row.iloc[0]

                return {'colError':False,'uploaded':True,'reval':True,'message':'Upload Successful'}
            except:
                return {'colError':False,'uploaded':False,'reval':True,'message':'Upload Regular Before Revaluation.'}
    else:
        return {'colError':True,'uploaded':False,'reval':True,'message':'Data Not in right format'}
    