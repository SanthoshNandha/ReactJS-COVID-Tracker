import React from 'react'
import "./Map.css"
import { Map as LeafletMap, Popup, TileLayer, Circle } from 'react-leaflet'
import numeral from "numeral";
import{ extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';



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

const showDataOnMap = (data, casesType="cases") => {
    const counts = data.map(country => 
      country[casesType]
    );

    const linerScale = scaleLinear()
                        .domain(extent(counts))
                        .range([100000, 1500000]);

    return data.map(country => (
        <Circle
            key={country.country}
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].color}
            fillColor={casesTypeColors[casesType].color}
            radius={              
              linerScale(country[casesType])     
            }
        >
            <Popup>
              <div className="info-container">
                <div
                  className="info-flag"
                  style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                ></div>
                <div className="info-name">{country.country}</div>
                <div className="info-confirmed">
                  Cases: {numeral(country.cases).format("0,0")}
                </div>
                <div className="info-recovered">
                  Recovered: {numeral(country.recovered).format("0,0")}
                </div>
                <div className="info-deaths">
                  Deaths: {numeral(country.deaths).format("0,0")}
                </div>
              </div>
            </Popup>
        </Circle>
    ))
  };

function Map({countries, center, zoomLevel, casesType}) {
      
    return (
        
        <div className="map">
            <LeafletMap center={center} zoom={zoomLevel}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />

            {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
