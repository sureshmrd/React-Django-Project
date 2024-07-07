
def mapping(grade):
    grade_points = {
        'F': -1,
        'ABSENT': -1,
        'MP': -1,
        'A+': 10,
        'A': 9,
        'B': 8,
        'C': 7,
        'D': 6,
        'E': 5,
        'COMPLE': 0,
    }
    return grade_points.get(grade, 0)

def keep_latest_results(data):
    latest_results = {}
    for record in data:
        sub_code = record['subCode']
        if sub_code not in latest_results or record['month_year'] > latest_results[sub_code]['month_year']:
            latest_results[sub_code] = record
    return list(latest_results.values())

def cgpa_and_backlogs(data):
    data = keep_latest_results(data)
    total_credits = 0
    total_grade_points = 0
    backlogs = 0
    for record in data:
        grade = mapping(record['grade'])
        credits = float(record['credits'])
        if grade >= 0:
            total_credits += credits
            total_grade_points += grade * credits
        else:
            backlogs += 1
    if total_credits == 0:
        return {'cgpa': 0, 'backlogs': backlogs}
    cgpa = total_grade_points / total_credits
    return {'cgpa': cgpa, 'backlogs': backlogs}
