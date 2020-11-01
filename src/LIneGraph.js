import React, { useState, useEffect } from 'react';
import "./LineGraph.css";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const casesTypeColors = {
    cases: {
      color:"blue",
      
    },
    recovered: {
      color:"green",
      
    },
    deaths: {
      color:"red",
     
    },
  };

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
    responsive: true,
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
    let cases = data["timeline"] ? data["timeline"][casesTypes]: data[casesTypes];

    
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

export default function LineGraph({ casesType, country, className }) {

    const [data, setData] = useState([]);

    useEffect(() => {       

        const url = country === "worldwide" ? "https://disease.sh/v3/covid-19/historical/all?lastdays=120" : 
        `https://disease.sh/v3/covid-19/historical/${country}?lastdays=120`

       
        const fetchData = async () => {
            await fetch(url)
            .then(response => {
                
                return response.json()
            })
            .then((data) => {
                let chartData = buildChartData(data, casesType);
                setData(chartData);
            })
        }
        fetchData();
        
    }, [casesType, country]);  

    return (
        <div className={className}>
            <Line
                data = {{
                    datasets:[
                        {
                            backgroundColor:"gray",
                            borderColor:casesTypeColors[casesType].color,
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
