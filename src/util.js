import numeral from "numeral"

export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a,b)=> {
        if(a.cases > b.cases){
            return -1;
        }
        else{
            return 1;
        }
    });

    return sortedData;
}

export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
}

export const prettifyStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";



