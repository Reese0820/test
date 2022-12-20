function timing() {
    var time = [];
    for (var i = 18; i <= 44; i++) {
        var n = i%2==0 ? i/2+':00' : (i+1)/2-1+':30';
        if( n<10 ) 
        n = '0' + n;
        time.push(n);
    }
    return time
}

function jsonParser() {
    rawData  = document.getElementById('data').innerHTML;
    jsonData = JSON.parse( rawData )
    return jsonData
}

function editCheck() {
    let text;
    let password = prompt( "神秘數字 : ", "" );
    if ( password != '0429' ) { createTable() }
    else if ( password == '0429' ) { createTable( pass = 1 ) }
}

function Submit1() {
    let data = document.getElementById('data').innerHTML;
    var json = JSON.parse(data);

    for (let title in json) {
        if ( document.getElementById(title)!=null && document.getElementById(title).children[0] != undefined ) {
            json[title]=document.getElementById(title).children[0].className;
        }
    }
    document.getElementById( 'save' ).value=JSON.stringify( json );
}

function createTable( pass = 0 ) {
    // Remove old table.
    if ( document.getElementById('scheduleDiv') != null ) {
        document.getElementById('scheduleDiv').remove();
    }

    // Declare Variable.
    const week = [' ','週一','週二','週三','週四','週五','週六','週日'];
    const time = timing()
    let jsonData = jsonParser();

    // Setting tables.
    let scheduleDiv    = document.createElement('div');
        scheduleDiv.id = 'scheduleDiv';

    // Buttom of table.

    let inputDiv = document.createElement('div');
        inputDiv.className = 'inputDiv';
    
    scheduleDiv.appendChild(inputDiv)

    let weekForm = document.createElement('form');
        weekForm.method='post';
        weekForm.id = 'weekForm';
    inputDiv.appendChild(weekForm)

    let weekSelector = document.createElement('input');
        weekSelector.value     = jsonData['time'];
        weekSelector.type      = 'week';
        weekSelector.name      = 'weekValue';
        weekSelector.id        = 'week';
        weekSelector.className = 'inputDiv';
        weekSelector.onchange  = function(){document.getElementById('weekForm').submit()};
    weekForm.appendChild(weekSelector);

    if ( pass == 1 ) {
        
        let jsonForm = document.createElement('form');
            jsonForm.method = 'post';
        inputDiv.appendChild(jsonForm)
            
        let input1        = document.createElement('input');
            input1.id     = 'save';
            input1.type   = 'text';
            input1.name   = 'saving';
            input1.value  = '';
            input1.hidden = '1';
        jsonForm.appendChild(input1)

        let input2           = document.createElement('input');
            input2.onclick   = function() {Submit1()};
            input2.type      = 'submit';
            input2.name      = 'send';
            input2.value     = '儲存';
            input2.className = 'submitButton';
        jsonForm.appendChild(input2)

        let reset           = document.createElement('button');
            reset.className = 'resetButton';
            reset.onclick   = function() {createTable(1)};
            reset.appendChild(document.createTextNode('重置'));
        inputDiv.appendChild(reset);
    }

    // Create sticky table.
    let stick           = document.createElement('table');
        stick.className = 'tableContainer sticky';
    let tr              = stick.insertRow();
        tr.className    = 'tableHead';
    for ( let weekNum = 0; weekNum < 8; weekNum++ ) {
        let td = tr.insertCell();
            td.appendChild( document.createTextNode( week[weekNum] ));
            if ( weekNum == 0 ) { 
                td.className = 'firstRow';
                td.innerHTML = '第' + jsonData['time'] + '週';
            }
    }

    // Create data table.
    let scheduleTable           = document.createElement('table');
        scheduleTable.className = 'tableContainer';

    for( let scheduleRow = 0; scheduleRow < 27; scheduleRow++ ) {
        let tr = scheduleTable.insertRow();

        for( let scheduleColumn = 0; scheduleColumn < 8; scheduleColumn++ ){
            let td = tr.insertCell();
            let slec = document.createElement('select');
                slec.id        = 'options';
                slec.onchange  = function(){
                    this.className = this.options[this.selectedIndex].className
                };
            let tdId = 'p' + ( scheduleRow + 1 ).toString() + '_' + scheduleColumn.toString();

            if ( scheduleColumn == 0 ) {
                td.className = 'firstRow ';
                td.appendChild( document.createTextNode( time[scheduleRow] ));
            }
            if ( scheduleColumn > 0 ){

                if ( pass == 1 ) {
                    td.appendChild( slec );
                        
                    let space = document.createElement('option');
                        space.value     = '';
                        space.innerHTML = '';
                        space.hidden    = '1';
                        space.selected  = '1';
                        slec.appendChild( space );

                    for( let studentNum = 0; studentNum < 7; studentNum++ ) {
                        let student       = document.createElement('option');
                        student.className = 'student' + ( studentNum + 1 ).toString();
                        student.value     = 'student' + ( studentNum + 1 ).toString();
                        student.innerHTML = '學生' + ( studentNum + 1 ).toString();
                        slec.appendChild( student );
                    }

                    let rest           = document.createElement('option');
                        rest.className = 'rest';
                        rest.value     = 'rest';
                        rest.innerHTML = '不接';
                    slec.appendChild(rest);

                    let spare           = document.createElement('option');
                        spare.className = 'spare';
                        spare.value     = 'spare';
                        spare.innerHTML = '空白';
                    slec.appendChild(spare);
                }
                td.className = 'restRow ';
            }

            if ( jsonData[tdId] != undefined ) {
                td.id           = tdId;
                td.className   += jsonData[ tdId ];
                slec.className += jsonData[ tdId ];
            }
        }
    }
    document.getElementById( 'schedule' ).appendChild( scheduleDiv );
    scheduleDiv.appendChild( stick );
    scheduleDiv.appendChild( scheduleTable );
}