export let data = [ '23, ', '123, ', '234, ' ]
// let data = [ '23, ', '123, ', '234, ' ]

$(document).ready(function(){
    renderData();
    generateMsg();
})

function generateMsg(){
    data.push('113, ')
    window.open('index2.html')
    console.log(data)
}

export function renderData(){
    $('#p1').html(data)
}