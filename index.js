const oneMinute = 60 * 1000
let powerArray = []
let beginTime = 1000

let oneMinAvgs = []

workoutData.samples.forEach(second => {
    if((second.millisecondOffset - beginTime + 1000) <= oneMinute){
        powerArray.push(second.values.power)
    } else {
        let powerObj = {
            begin: beginTime/1000,
            end: (second.millisecondOffset - 1000)/1000,
            avgPower: powerArray.reduce((acc, curr) => acc + curr) / powerArray.length
        }

        oneMinAvgs.push(powerObj)
        powerArray = [second.values.power]
        beginTime = second.millisecondOffset
    }
})

// oneMinAvgs.forEach((minute, i) => console.log(i, minute))

let twentyMinuteAverages = []

for(let i = 0; i <= oneMinAvgs.length - 20; i++){
    let tempAvgArr = []
    
    for(let j = 0; j < 20; j++){
        if(j === 0){
            tempAvgArr.push(oneMinAvgs[i + j])
        } else if ((tempAvgArr[0].begin - oneMinAvgs[i + j].begin) <= (20 * 60)){
            tempAvgArr.push(oneMinAvgs[i + j])
        }
    }
    let powerCounter = 0
    let counter = 0 

    tempAvgArr.forEach(minute => {
        powerCounter += minute.avgPower
        counter += 1
    })

    let tempObj = {
        start: oneMinAvgs[i].begin,
        end: oneMinAvgs[i+19].end,
        avgPower: powerCounter / counter
    }

    twentyMinuteAverages.push(tempObj)
}


let highestTwentyMinuteEstimate = twentyMinuteAverages[0]

twentyMinuteAverages.forEach((timeSpan,i) => {
    if(timeSpan.avgPower > highestTwentyMinuteEstimate.avgPower){
        highestTwentyMinuteEstimate = timeSpan 
    }
})

let oneSecondIntervals = []
let powerCounter
let start
let end
let max = {avgPower: 0}

workoutData.samples.forEach((sec,i) => {
    if(sec.millisecondOffset >= highestTwentyMinuteEstimate.start - (oneMinute * 20) && sec.millisecondOffset <= highestTwentyMinuteEstimate.end + (oneMinute * 20)){
        start = sec.millisecondOffset
        end = start + (oneMinute * 20)
        powerCounter = []
        let shortenedArray = workoutData.samples.slice(i)

            shortenedArray.forEach(shortSecond => {
                if(shortSecond.millisecondOffset <= end){
                    powerCounter.push(shortSecond.values.power)
                } else {
                    let powerObj = {
                        begin: start,
                        end: end,
                        avgPower: powerCounter.reduce((acc,curr) => acc + curr) / powerCounter.length
                    }

                    oneSecondIntervals.push(powerObj)
                    if(max.avgPower < powerObj.avgPower){
                        max = powerObj
                    }
                }
                // console.log('oneSecondIntervals', oneSecondIntervals)
            })
    }
})

// console.log('oneSecondIntervals', oneSecondIntervals)

