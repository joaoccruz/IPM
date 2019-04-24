function getWeek(date){
    var week = date.getDay();
    switch(week){
        case 1: 
            var dayW = ("Monday");
            break;
        case 2: 
            var dayW = ("Tuesday");
            break;
        case 3: 
            var dayW = ("Wednesday");
            break;
        case 4: 
            var dayW = ("Thursday");
            break;
        case 5: 
            var dayW = ("Friday");
            break;
        case 6: 
            var dayW = ("Saturday");
            break;
        case 0: 
            var dayW = ("Sunday");
            break;
    }
    return dayW;
}

function getTime(date = new Date()){
    var min = date.getMinutes().toString();
    var hr  = date.getHours().toString();
    if(min < 10)
        min = "0" + min
    
    if(hr < 10)
        hr = "0" + hr

    return hr + ":" + min;
}

function getMonth(date){
    var month = date.getMonth();
    switch(month){
        case 0: 
            month = "January";
            break;
        case 1: 
            month = "February";
            break;
        case 2: 
            month = "March";
            break;
        case 3:
             month = "April";
            break;
        case 4: 
            month = "May";
            break;
        case 5: 
            month = "June"; 
            break;
        case 6: 
            month = "July";
            break;
        case 7: 
            month = "August";
            break;
        case 8: 
            month = "September";
            break;
        case 9: 
            month = "October";
            break;
        case 10: 
            month = "November";
            break;
        case 11: 
            month = "December";
            break;
       }
    return month;
}




function getDate(date = new Date()){
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    
    if(day < 10)
        day = "0" + day; 

    month += 1;
    
    if(month < 10)
        month = "0" + month; 

    return "{0}/{1}/{2}".format(day,month,year);

}
export {getWeek, getMonth, getTime, getDate}