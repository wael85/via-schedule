$(document).ready(()=>{readXML()});

$("#week").css({"color": "red"});
let schedule;
let schedulesArray =[];

function readXML(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200)
        {
            addToArray(this);
        }
    };
    xhttp.open("GET", "../schedules.xml", true);
    xhttp.send();
}

function addToArray(xml)
{
    var xmlDoc = xml.responseXML;
    let schedules = xmlDoc.getElementsByTagName("schedules");
    for(let i=0; i<schedules.length; i++)
    {
        let lessonsXML = schedules[i].getElementsByTagName("lessons");
        let lessons = [];
        for(let j=0; j<lessonsXML.length; j++)
        {
            let courseNameVar =  lessonsXML[j].getElementsByTagName("course")[0].getElementsByTagName("name")[0].childNodes[0].nodeValue;
            let roomIdVar = lessonsXML[j].getElementsByTagName("roomId")[0].childNodes[0].nodeValue;
            let timeStartVar = lessonsXML[j].getElementsByTagName("start")[0].childNodes[0].nodeValue;
            let timeEndVar = lessonsXML[j].getElementsByTagName("end")[0].childNodes[0].nodeValue;
            


            let lesson = {
                courseName: courseNameVar,
                roomId: roomIdVar,
                timeStart: timeStartVar,
                timeEnd: timeEndVar
            };

            lessons.push(lesson);
        }

        schedule = {
            id: schedules[i].getElementsByTagName("id")[0].childNodes[0].nodeValue,
            semester: schedules[i].getElementsByTagName("semester")[0].childNodes[0].nodeValue,
            className: schedules[i].getElementsByTagName("className")[0].childNodes[0].nodeValue,
            lessons: lessons
        };
        schedulesArray.push(schedule);
    }
    console.log(schedulesArray);
}




let divTop = $("table").offset().top;
//console.log(divTop);

// render the week on schedule
function renderLessons(semesterVar, classVar,date){
    let scheduleId = semesterVar + classVar;
    // if there is no date set date to today
    if(date == null){
        date = new Date();
    }
    // getting first and last day in week
    let countUp = 0;
    let countDown = 0
    let weekDay = date.getDay();
    weekDay++;
    while(weekDay <= 5 ){
        countUp++;
        weekDay++;
    }
    weekDay = date.getDay();
    weekDay--;
    while(weekDay >= 1){
       countDown++;
       weekDay--;
    
    }
    let lastDayInWeek = new Date(date.getTime()+(countUp * 86400000));
    let firstDayInWeek = new Date(date.getTime()-(countDown * 86400000));
    // render week number 
    document.getElementById('week').innerText = date.getWeek();
    // clean the schedule before render new week
    let divArray = document.getElementsByClassName('div-holder');
    if(divArray.length > 0){
        for(const div of divArray){
            div.innerText = "";
        }
    }
    for(let j=0; j<schedulesArray.length; j++)
    {
        console.log(scheduleId);
        if(schedulesArray[j].id === scheduleId)
        {
            console.log("inside if");
            let lessonsRender = schedulesArray[j].lessons.filter(lesson => {
                console.log(new Date(lesson.timeStart).toISOString() )
                if(new Date(lesson.timeStart).getTime() >= firstDayInWeek.getTime() && new Date(lesson.timeStart ).getTime() <= lastDayInWeek.getTime()  ){
                    return lesson;
                }
            })
            console.log(lessonsRender);
            for(let i=0; i<lessonsRender.length; i++){
                let lessonRender = lessonsRender[i];
                let start = new Date(lessonRender.timeStart);
                let end = new Date(lessonRender.timeEnd);
                let endHour = (end.getHours() ) + ((end.getUTCMinutes() / 60));
                let startHouer = start.getHours()  + ((start.getUTCMinutes() / 60));
                let day = start.getUTCDay();
                let lessonLength = endHour - startHouer;
                
                let divTop = $("#mydiv").offset().top;
                $("<div class='div-holder'></div>").css({
                    "display":"block",
                    "width": "15%",
                    "margin" : "auto",
                    "height": `${lessonLength * 100}px`,
                    "position": "absolute",
                    "left": `${((day-1) * 15)+20}%`,
                    "top": `${((startHouer - 7) * 100) +130}px`
                }).append(
                    `<div class='${lessonRender.courseName}1'>
                       <h3>${lessonRender.courseName}</h3>
                       <h6>${lessonRender.roomId}</h6>
                    </div>`).appendTo("#mydiv");
            }
        }
       
    
    }
    
};

// get Schedule Id And render it
let semester=1;
let className="X";

document.getElementById("schedule").innerText = semester+className;
document.getElementById("semester").addEventListener("change", function(e){
   semester = e.target.value;
   clicked = 0;
   renderLessons(semester, className);
   document.getElementById("schedule").innerText = semester+className;
});
document.getElementById("class").addEventListener("change", function(e){
    className = e.target.value;
    clicked = 0;
    renderLessons(semester, className);
    document.getElementById("schedule").innerText = semester+className;
    
 });
   let clicked = 0;
  $("#next_week").click(function (e) { 
    //  e.preventDefault();
    clicked++;
    let nextDate = new Date((new Date().getTime())+ clicked * 604800000);
    renderLessons(semester, className, nextDate);
  });
  $("#previous_week").click(function (e) { 
    //  e.preventDefault();
    clicked--;
    let previousDate = new Date((new Date().getTime())+ clicked * 604800000);
    renderLessons(semester, className, previousDate);
  });

 // add get week to Date opject
 Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }
