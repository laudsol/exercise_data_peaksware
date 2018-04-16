const powerData = workoutData.samples
const oneMinute = 60
const bestTimeSegments = [1,5,10,15,20]

const time = (data, index) => {
    return data[index].millisecondOffset/1000
}

const average = (data) => {
    return data.reduce((acc, curr) => {return acc + curr}) / data.length
}

const getBestTime = (powerData, timeInput) => {
    let maxAvgPower = {avgPower: 0}

    for(let i = 0; i < powerData.length; i++){
        let avgPowerObj = {
            start: time(powerData, i),
            end: '',
            avgPower: '',
        }

        let powerBySecondArr = []

        for(let j = i; j < powerData.length - i; j++){
            if(avgPowerObj.start + timeInput > time(powerData, j)){
                powerBySecondArr.push(powerData[j].values.power)
                avgPowerObj.end = time(powerData, j)
            }
        }

        if(avgPowerObj.start + timeInput -1 === avgPowerObj.end){
            avgPowerObj.avgPower = average(powerBySecondArr)
            
            if(avgPowerObj.avgPower > maxAvgPower.avgPower){
                maxAvgPower = avgPowerObj
            }
        }
    }

    return  maxAvgPower
}

const graphPowerData = powerData
    .map(second => second.values.power)
    .filter(power => power !== undefined)

const buildGraph = () => {
    $('#powerChart').highcharts({
        title: {
            text: 'Power over workout time'
        },
        yAxis: {
            title: {
                text: 'Power'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 0
            }
        },
    
        series: [{
            name: ' Power Output',
            data: graphPowerData
        },{
            name: bestTimeGraphData[0].type,
            data: bestTimeGraphData[0].data
        },{
            name: bestTimeGraphData[1].type,
            data: bestTimeGraphData[1].data
        },{
            name: bestTimeGraphData[2].type,
            data: bestTimeGraphData[2].data
        },{
            name: bestTimeGraphData[3].type,
            data: bestTimeGraphData[3].data
        },{
            name: bestTimeGraphData[4].type,
            data: bestTimeGraphData[4].data
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    })
}


const bestTimeGraphData = bestTimeSegments.map(timeSegment => {
    let bestTime = getBestTime(powerData, timeSegment * oneMinute)

    let bestTimeData = powerData.map(second => {
        if(second.millisecondOffset/1000 >= bestTime.start && second.millisecondOffset/1000 <= bestTime.end){
            return bestTime.avgPower
        } else {
            return 0
        }
    })
    
    return {
        type: `Best ${timeSegment} minute avg power`,
        data: bestTimeData,
    }
})

const gpsData = powerData
    .map((second) => {
        return {lat: second.values.positionLat, lng: second.values.positionLong} 
    })
    .filter(position => position.lat !== undefined && position.lng !== undefined)

const startPoint = gpsData[0]

buildGraph()
