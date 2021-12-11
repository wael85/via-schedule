
let lessons = [
    {
        courseName: " SDJ1",
        roomId: "C-7",
        timeStart: "2022-1-3 8:15",
        timeEnd: "2022-1-3 10:00"

    },
    {
        courseName: " SDJ1",
        roomId: "C-7",
        timeStart: "2022-1-21 8:15",
        timeEnd: "2022-1-21 10:00"

    },
    {
        courseName: " DMA1",
        roomId: "C-7",
        timeStart: "2022-1-4 10:15",
        timeEnd: "2022-1-4 12:00"

    },
    {
        courseName: " SEP1",
        roomId: "C-7",
        timeStart: "2022-1-20 11:00",
        timeEnd: "2022-1-20 12:15"

    }
];
function getLessonsInWeek(){

}
let divTop = $("table").offset().top;
console.log(divTop);
function renderLessons(lessons){
lessons.forEach((lesson) => {
    let start = new Date(lesson.timeStart);
    let end = new Date(lesson.timeEnd);
    let endHour = (end.getUTCHours() + 1) + ((end.getUTCMinutes() / 60));
    let startHouer = start.getUTCHours() + 1 + ((start.getUTCMinutes() / 60));
    let day = start.getUTCDay();
    let lessonLength = endHour - startHouer;
    
    let divTop = $("#mydiv").offset().top;
    $("<div></div>").css({
        "width": "15%",
        "margin" : "auto",
        "height": `${lessonLength * 100}px`,
        "position": "absolute",
        "left": `${((day-1) * 15)+20}%`,
        "top": `${((startHouer - 7) * 100) +130}px`
    }).append(
        `<div class='${lesson.courseName}'>
           <h3>${lesson.courseName}</h3>
           <h6>${lesson.roomId}</h6>
        </div>`).appendTo("#mydiv");
})

};
renderLessons(lessons);
// get Schedule Id And render it
let semester = "1";
let className = "X";
document.getElementById("schedule").innerText = semester+className;
document.getElementById("semester").addEventListener("change", function(e){
   semester = e.target.value;
   console.log( e.target.value);
   document.getElementById("schedule").innerText = semester+className;
  
});
document.getElementById("class").addEventListener("change", function(e){
    className = e.target.value;
    console.log( e.target.value);
    document.getElementById("schedule").innerText = semester+className;
    
 });