import React, { useState, useEffect } from 'react';
import "./LineGraph.css";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = { 
    legend:{
        display:false,
    },
    element:{
        point:{
            radius: 0,
        },
    },
    maintainAspectRation: false,
    tooltip:{
        mode:"index",
        intersect:false,
        callbacks:{
            label: function(tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type:"time",
                time:{
                    formate:"MM/DD/YY",
                    tooltipFormat:"ll",
                },
            },
        ],
        yAxes:[
            {
                gridLines:{
                    display:false,
                },
                ticks:{
                    callback:function(value, index, values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    }
}

const buildChartData = (data, casesTypes="cases") => {
    const chartData = [];
    let lastDataPoint;
    let cases = data[casesTypes]
    Object.keys(cases).forEach( date => {
        if(lastDataPoint){
            const newDataPoint = {
                x: date,
                y: cases[date] - lastDataPoint
            }
            chartData.push(newDataPoint)
        }
        lastDataPoint = cases[date];
    })
    return chartData;
}

export default function LineGraph({ casesType }) {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then(response => {
                return response.json()
            })
            .then((data) => {
                let chartData = buildChartData(data, casesType);
                setData(chartData);
            })
        }
        fetchData();
        
    }, [casesType]);  

    return (
        <div>
            <Line
                data = {{
                    datasets:[
                        {
                            backgroundColor:"rgba(204, 16, 52, 0.5)",
                            borderColor:"#CC1034",
                            data:data,

                        }
                    ]
                }}
                options={options}
            >
            </Line>
        </div>
    )
}
