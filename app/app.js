let score = 0;

function increaseScore(){

score += 10;

if(score > 100){
score = 100;
}

document.getElementById("score").innerText = score + " / 100";

}
