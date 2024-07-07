from tabula import read_pdf
from tabula import convert_into
from PyPDF2 import PdfReader

def conditions(string):
    string = string.upper()#Results Information
    sems = ['I B.TECH I','I B.TECH II',\
            'II B.TECH I','II B.TECH II',\
            'III B.TECH I','III B.TECH II',\
            'IV B.TECH I','IV B.TECH II']
    months = ['JAN', 'FEB', 'MAR', \
              'APR', 'MAY', 'JUNE', 'JULY', \
              'AUG', 'SEP', 'OCT',\
              'NOV', 'DEC',\
              'January', 'February', 'March', \
              'April', 'May', 'June', 'July',\
              'August', 'September', 'October',\
              'November', 'December']
    ans = [False,'','','']
    if ('REVALUATION' in string or 'RECOUNTING' in string):
        print("\n\nyes",string)
        ans[0] = True
    if('REGULAR' in string):
        ans[1] = False
    else:
        ans[1] = True

    #Month of the exam
    month = ''
    for m in range(len(months)):
        if months[m].upper() in string:
            if(m<12):
                month = months[m].upper()
                mn = months[m+12].upper()
                idxmon = m+1
            else:
                month = months[m].upper()
    p = string.find(month)
    py = string[p:p+20].find('20')
    if(idxmon > 12):
        idxmon = idxmon-12
    if(idxmon < 10):
        ans[3] = string[p+py:p+py+4]+'-0'+ str(idxmon) + '-01'
    else:
        ans[3] = string[p+py:p+py+4]+'-'+ str(idxmon) + '-01'
    

    sem = ''
    semidx = 0
    for s in sems:
        pos = string.find(s)
        #print(pos)
        semidx+=1
        if(pos!=-1 and string[pos-1]==" " and string[pos+len(s)]==' '):
            sem = s + ' Sem'
            print(sem)
            break
        
    ans[2] = semidx
    return ans


def getDetails(file):
    array = []
    filename = file
    reader = PdfReader(filename)
    num_pages = len(reader.pages)
    page = reader.pages[0]
    text = page.extract_text()[0:200]
    print(text)
    ExamDetails = conditions(text)
    return ExamDetails

'''
#PYTHON ARRAY
for i in range(num_pages):
    dfs = read_pdf(filename, pages=i+1)
    df = dfs[0]
    array.append(df.to_numpy())

#Each row through array
print(ExamDetails)
print('num pages: ',num_pages)
print('first and last student details of each page')
for i in range(num_pages):
    print(array[i][0])
    print(array[i][len(array[i])-1])
'''
