let powerData = workoutData.samples
let oneMinute = 60
let timeInput = 20 * oneMinute

const itteratePowerData = (powerData, timeInput) => {
    let timeSegmentedPowerAverage = []
    let maxAvgPowerOverTimeSegment = {avgPower: 0}
    
    for(let i = 0; i < powerData.length; i++){
        let avgPowerObj = {
            start: powerData[i].millisecondOffset/1000,
            end: '',
            avgPower: '',
        }

        let avgPowerCalc = []

        for(let j = i; j < powerData.length - i; j++){
            if(avgPowerObj.start + timeInput > powerData[j].millisecondOffset/1000){

                avgPowerCalc.push(powerData[j].values.power)
                avgPowerObj.end = powerData[j].millisecondOffset/1000
            }
        }

        if(avgPowerCalc.length > 0 && avgPowerObj.start + timeInput -1 === avgPowerObj.end){
            avgPowerObj.avgPower = avgPowerCalc.reduce((acc, curr) => {return acc + curr}) / avgPowerCalc.length
            timeSegmentedPowerAverage.push(avgPowerObj)
        }

        if(avgPowerObj.avgPower > maxAvgPowerOverTimeSegment.avgPower){
            maxAvgPowerOverTimeSegment = avgPowerObj
        }
    }
    return [timeSegmentedPowerAverage, maxAvgPowerOverTimeSegment]
}

let timeSegmentedPowerdata = itteratePowerData(powerData, timeInput)

console.log(timeSegmentedPowerdata)