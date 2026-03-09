const checkboxes=document.querySelectorAll(".score")

checkboxes.forEach(box=>{
box.addEventListener("change",updateScore)
})

function updateScore(){

let total=0

checkboxes.forEach(box=>{
if(box.checked){total++}
})

document.getElementById("total").innerText=total+" / 15"

let agency=Math.round((total/15)*100)

document.getElementById("agencyScore").innerText=agency+" / 100"

}

function saveDay(){

let total=0

checkboxes.forEach(box=>{
if(box.checked){total++}
})

let data=JSON.parse(localStorage.getItem("pasData")||"[]")

data.push({
date:new Date().toISOString(),
score:total
})

localStorage.setItem("pasData",JSON.stringify(data))

calculateStreak()

alert("Day saved")

}

function calculateStreak(){

let data=JSON.parse(localStorage.getItem("pasData")||"[]")

if(data.length<2){
document.getElementById("streak").innerText="0 weeks"
return
}

let streak=0

for(let i=1;i<data.length;i++){

if(data[i].score>=data[i-1].score){
streak++
}

}

document.getElementById("streak").innerText=streak+" weeks"

}

calculateStreak()
