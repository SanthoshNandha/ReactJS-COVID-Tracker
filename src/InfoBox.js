import React from 'react'
import "./InfoBox.css"
import { Card, CardContent, Typography} from '@material-ui/core'

export default function InfoBox({title, cases, total, active, onClick, activeColor}) {
    return (
        <Card 
            onClick = {onClick}
            className={`infoBox ${active &&  " infoBox--selected infoBox--selected--"}${activeColor}`}>
                <CardContent>   
                    <Typography className="infoBox__title" color="textSecondary">
                        {title}
                    </Typography>
                    <h2 className={`infoBox__cases infoBox__cases--${activeColor}`}>{cases}</h2>
                    <Typography className="infoBox__total" color="textSecondary">
                        {total} Total
                    </Typography>
                    

                </CardContent>
        </Card>
    )
}
