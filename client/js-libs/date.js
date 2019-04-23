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
}


function showDate(date = new Date()){
    var d = new Date();
    var min = d.getMinutes().toString();
    var hr  = d.getHours().toString();
    var day = d.getDate();
    var month = d.getMonth();
    var week = d.getDay();
    var year = d.getYear();
    
    
    
}
export {getWeek,getMonth,showDate}