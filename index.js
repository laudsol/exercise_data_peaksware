const powerData = workoutData.samples
const oneMinute = 60
const timeInput = 20 * oneMinute

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

const bestTime = getBestTime(powerData, timeInput)

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
            name: 'power',
            data: graphPowerData
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

let locations = [
    [-33.890542, 151.274856],
    [-33.923036, 151.259052],
    [-34.028249, 151.157507]
]


let gpsData = powerData
.map((second) => {
    return [second.values.positionLat, second.values.positionLong] 
})
.filter(position => position[0] !== undefined && position[1] !== undefined)

let center = {
    lat: gpsData[0][0], 
    lng:gpsData[0][1]
}

buildGraph()
