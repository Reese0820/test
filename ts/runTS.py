from flask import Flask, render_template, request
from datetime import datetime
import shutil
import json
import os

#
# route.
#

app = Flask(__name__)


@app.route( '/Home', methods=['POST', 'GET'] )
def Home():
    return render_template( 'Home.html' )


@app.route( '/Schedule', methods=['POST', 'GET'] )
def Schedule():

    # Preparing json.
    if request.method == 'POST':
        if 'weekValue' in request.form:
            selectTime = request.values['weekValue']
            currentTime, dataJson = checkingJson( selectTime )
        elif 'send' in request.form:
            savingData = json.loads( request.values['saving'] )

            selectTime = savingData['time']
            selectYear = selectTime.split('-')[0]
            jsonFile   = f"./Json/{selectYear}/{selectTime}_Json.json"
            with open(jsonFile, 'w') as writeJson:
                json.dump( savingData, writeJson, indent=4 )
            
            currentTime, dataJson = checkingJson( selectTime )
    else:
        currentTime, dataJson = checkingJson()

    return render_template( 'Schedule.html', dataJson=dataJson, currentTime=currentTime )


#
# Functions.
#

def checkingJson( selectTime='' ):

    # Parameters initial setting.
    if not selectTime:
        currentTime = datetime.now().strftime( '%Y-W%W' )
        currentYear = datetime.now().strftime( '%Y' )
        currentWeek = datetime.now().strftime( '%W' )
    else:
        currentTime = selectTime
        currentYear = selectTime.split('-W')[0]
        currentWeek = selectTime.split('-W')[-1]

    jsonFile    = f"./Json/{currentYear}/{currentTime}_Json.json"
    blankFile   = './Json/blankWeeklyJson.json'

    # Checking time for file.
    checkingTime( jsonFile, blankFile, currentTime )

    # Parsing data to send.
    dataJson = open( jsonFile, 'r' )
    dataJson = str( json.load( dataJson )).replace( "'", '"' )

    return currentTime, dataJson

def checkingTime( jsonFile, blankFile, currentTime ):
    
    # Check year.
    if not os.path.isdir( os.path.dirname( jsonFile )):
        os.makedirs( os.path.dirname( jsonFile ))

    # Check current week of json file.
    if not os.path.isfile( jsonFile ):
        shutil.copy2( blankFile, jsonFile )
        retimeJson = json.load( open( jsonFile, 'r' ))

        with open( jsonFile, 'w' ) as jFile:
            retimeJson['time'] = currentTime
            json.dump( retimeJson, jFile, indent=4 )

#
# Execution.
#

if __name__ == '__main__':
    app.run( host='0.0.0.0', port='5000', debug=True )