import React, {useState, useEffect } from 'react';
import './App.css';
import { FormControl, MenuItem, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from "./InfoBox.js";
import Map from "./Map.js";
import Table from "./Table.js";
import { sortData, capitalize, prettifyStat } from "./util.js";
import LineGraph from "./LIneGraph.js";
import "leaflet/dist/leaflet.css";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tabledata, setTabledata] = useState([]);
  const [mapCenter, setMapCenter] = useState([0,0])
  const [zoomLevel, setZoomLevel] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, [])

  useEffect(() => {
    const getCountriesData = async() =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            "name":country.country,
            "value":country.countryInfo.iso2          
        }));
        setCountries(countries);
        setTabledata(sortData(data));
        setMapCountries(data);
        
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value; 
    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : 
      `https://disease.sh/v3/covid-19/countries/${countryCode}`
    
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      setCountry (countryCode);
      setCountryInfo(data);
      
      if(countryCode === "worldwide"){
        setMapCenter([0, 0]);
        setZoomLevel(2);
      }
      else{
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoomLevel(3);
      }
    });
  }

  return (
    <div className="app">
      <div className="app__left">
      

        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem key="worldwide" value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country, index) => (<MenuItem key={index} value={country.value}>{country.name}</MenuItem>))
              }
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox 
            onClick={e => setCasesType("cases")}
            active={casesType === "cases"}
            title="Coronavirus Cases" 
            total={countryInfo.cases} 
            cases={prettifyStat(countryInfo.todayCases)}
            activeColor={"blue"}
          > 
          </InfoBox>
          <InfoBox 
            onClick={e => setCasesType("recovered")}
            title="Recovered" 
            active={casesType === "recovered"}
            total={countryInfo.recovered} 
            cases={prettifyStat(countryInfo.todayRecovered)}
            activeColor={"green"}  
          > 
          </InfoBox>
          <InfoBox 
            onClick={e => setCasesType("deaths")}
            active={casesType === "deaths"}
            title="Deaths" 
            total={countryInfo.deaths} 
            cases={prettifyStat(countryInfo.todayDeaths)}
            type={"deaths"}
            activeColor={"red"}  
          > 
          </InfoBox>
        </div>    
        <Map countries={mapCountries} center={mapCenter} zoomLevel = {zoomLevel} casesType={casesType}></Map>
      </div>
      
        <Card className="app__right">
          <CardContent>
            <h3>{capitalize(casesType)} by Country</h3>
            <Table countries={tabledata} casesType = {casesType} />
            <h3 className={"app__graph_header"}> Historical {capitalize(casesType)} -- {country}</h3>
            <LineGraph casesType={casesType} country={country} className={"app__graph"}/>
          </CardContent>
        </Card> 
      
    </div>
  );
}

export default App;
