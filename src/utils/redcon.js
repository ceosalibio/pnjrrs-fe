 function redCon(data){
    let val
    if(data == 'R1'){
        val = 'R1 - Fully Mission Capable'
    }
    else if(data == 'R2'){
        val = 'R2 - Mission Capable'
    }
    else if(data == 'R3'){
        val = 'R3 - Partially Mission Capable'
    }
    else{
        val = 'R4 - Not Mission Capable'
    }
    return val;
}

function redStyle(val){
    let style
    if(val.includes('R1')){
        style = 'redCon1'
    }
    else if(val.includes('R2')){
        style = 'redCon2'
    }
    else if(val.includes('R3')){

        style = 'redCon3'
    }
    else{
        style = 'redCon4'
    }
    return style
}
export const red = {
    redCon,
    redStyle
}