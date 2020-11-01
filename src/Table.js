import React from 'react';
import "./Table.css";
import numeral from "numeral"
import { capitalize } from "./util.js";

function Table({countries, casesType}) {
    return (
        <div className="table">
            <table className="table__table">
                <tbody className="table__tbody">                  
                    <tr className="table__header" key={"header"} >
                        <td>{"Country"}</td>
                        <td>{"Today"}</td>
                        <td>{"Total"}</td>
                    </tr>
                    { 
                        (countries.map(country => (
                            <tr key={country.country}>
                                <td>{country.country}</td>
                                <td>{numeral(country["today"+capitalize(casesType)]).format("0,0")}</td>
                                <td>{numeral(country[casesType]).format("0,0")}</td>
                            </tr>
                        )))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table;
