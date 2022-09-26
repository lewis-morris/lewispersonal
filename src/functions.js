function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function shufflearr(array) {
    return [...array].sort(function(){return 0.5 - Math.random()})
}
export {randomIntFromInterval, shufflearr}