console.log(workoutData)

const oneMinute = 1000 * 60
let sumPower = 0
let counter = 0
let beginTime = 0

let oneMinAvgs = []


workoutData.samples.forEach(second => {
    if(counter !== oneMinute/1000){
        sumPower += second.values.power
        counter += 1
    } else {
        let powerObj = {
            begin: beginTime/1000/60,
            end: (second.millisecondOffset - 1000)/1000/60,
            avgPower: sumPower/counter
        }

        oneMinAvgs.push(powerObj)
        counter = 1
        sumPower = second.values.power
        beginTime = second.millisecondOffset
    }
})

console.log('twentyMinAvgs', oneMinAvgs)
