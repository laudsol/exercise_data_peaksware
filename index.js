const oneMinute = 60 * 1000
let powerArray = []
let beginTime = 1000

let oneMinAvgs = []


workoutData.samples.forEach(second => {
    if((second.millisecondOffset - beginTime + 1000) <= oneMinute){
        powerArray.push(second.values.power)
    } else {
        let powerObj = {
            counter,
            begin: beginTime/1000,
            end: (second.millisecondOffset - 1000)/1000,
            avgPower: powerArray.reduce((acc, curr) => acc + curr) / powerArray.length
        }

        oneMinAvgs.push(powerObj)
        powerArray = [second.values.power]
        beginTime = second.millisecondOffset
    }
})

oneMinAvgs.forEach(minute => console.log(minute))
