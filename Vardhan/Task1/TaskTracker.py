import argparse
import time

print("Task Tracker CLI")
print("Start, Pause, Resume, Quit Tasks in CLI.")
print("Please Create tasks.log, Ftasks.log if they are not there.")


def choicesDescriptions():
    return """
Choices supports the following: 
   start         - Start a Task
   pause         - Pause the Task
   resume        - Tesume the Task
   quit          - Quit the Task
"""


parser = argparse.ArgumentParser(
    formatter_class=argparse.RawTextHelpFormatter, epilog=choicesDescriptions()
)


def start():
    TaskName = input("Enter Your Task Name: ")
    logFile = open("tasks.log", "w")
    print("Cleaning Up Existing Tasks")
    logFile.writelines(f"{TaskName}:{time.time()}:-:-:-")
    logFile.close()
    print(f"{TaskName} task Started")
    return 0


def pause():
    PauseTime = time.time()
    logFile = open("tasks.log", "r")
    content = logFile.readline().split(":")
    if content[0] == "":
        print("No Task Listed")
        return 0
    TaskName, StartTime, EndTime, BreakTime, LPauseTime = content
    logFile.close()
    logFile = open("tasks.log", "w")
    logFile.writelines(f"{TaskName}:{StartTime}:{EndTime}:{BreakTime}:{PauseTime}")
    logFile.close()
    print(f"{TaskName} task Paused")
    return 0


def resume():
    ResumeTime = time.time()
    logFile = open("tasks.log", "r")
    content = logFile.readline().split(":")
    if content[0] == "":
        print("No Task Listed")
        return 0
    TaskName, StartTime, EndTime, BreakTime, LPauseTime = content
    logFile.close()
    logFile = open("tasks.log", "w")
    BreakTime = (
        ResumeTime - float(LPauseTime)
        if BreakTime == "-"
        else float(BreakTime) + ResumeTime - float(LPauseTime)
    )
    logFile.writelines(f"{TaskName}:{StartTime}:{EndTime}:{BreakTime}:-")
    logFile.close()
    print(f"{TaskName} task Resume")
    return 0


def quit():
    QEndTime = time.time()
    logFile = open("tasks.log", "r")
    content = logFile.readline().split(":")
    if content[0] == "":
        print("No Task Listed")
        return 0
    TaskName, StartTime, EndTime, BreakTime, LPauseTime = content
    logFile.close()
    logFile = open("tasks.log", "w")
    logFile.writelines(f"{TaskName}:{StartTime}:{QEndTime}:{BreakTime}:-")
    logFile.close()
    calcTaskTime()
    print(f"{TaskName} task Stopped")
    return 0


def calcTaskTime():
    logFile = open("tasks.log", "r")
    content = logFile.readline().split(":")
    TaskName, StartTime, EndTime, BreakTime, LPauseTime = content
    logFile.close()
    TimeTakenPerTask = (
        float(EndTime) - float(StartTime) - float(BreakTime)
        if BreakTime != "-"
        else float(EndTime) - float(StartTime)
    )
    FTaskFile = open("Ftasks.log", "+a")
    FTaskFile.write("\n")
    FTaskFile.write(
        f"Task :{TaskName}, Time Spent On Task:{time.strftime("%H:%M:%S", time.gmtime(TimeTakenPerTask))}"
    )
    FTaskFile.close()
    logFile = open("tasks.log", "w")
    logFile.write("")
    logFile.close()
    return 0


FUNCTION_MAP = {"start": start, "resume": resume, "pause": pause, "quit": quit}


parser.add_argument("command", choices=FUNCTION_MAP.keys())
args = parser.parse_args()
main = FUNCTION_MAP[args.command]
main()
