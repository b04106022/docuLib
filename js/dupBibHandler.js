$(document).ready(function(){
    $('#dupTable').html(dupTableHtml);
});

// $('#dupTable').html(tableHtml);

$('button').click(function(){
    console.log(getCheckedboxArray());
});
function getCheckedboxArray(){
    let checkedboxArray = [];
    let checkboxs = document.getElementsByName('c');
    for(let i=0; i<checkboxs.length; i++){
        if(checkboxs[i].checked){
            checkedboxArray.push(checkboxs[i].value);
        }
    }
    return checkedboxArray;
}
function arrToStr(arr){
    let str = "";
    if(arr==undefined || arr.length<1){
        return str
    }
    arr.forEach(function(item){
        str += item + "; ";
    })
    return str
}