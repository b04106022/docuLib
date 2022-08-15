$(document).ready(function(){
//     // tableHtml = '';

//     // let j = 0;
//     // for(let i=0; i<temp_data.length; i++){
//     //     if(!pushed.includes(i)){
//     //         msg = '<td colspan=2>書目「' + temp_data[i].title + '」已存在。<br>下為已存在於 MetaLib 的書目詳情，請確認是否仍要匯入？<br><br></td></tr>';
//     //         msg  = `<tr><td class='td-title'>　文獻題名：</td><td>${dupArray[j].title}</td></tr>`;
//     //         msg += `<tr><td class='td-title'>　　　作者：</td><td>${dupArray[j].xml_metadata.Udef_author}</td></tr>`;
//     //         msg += `<tr><td class='td-title'>　出版日期：</td><td>${dupArray[j].xml_metadata.Udef_publish_date}</td></tr>`;
//     //         msg += `<tr><td class='td-title'>　出處題名：</td><td>${dupArray[j].xml_metadata.Udef_publisher.text}</td></tr>`;
//     //         msg += `<tr><td class='td-title'>　　關鍵字：</td><td>${dupArray[j].xml_metadata.Udef_keywords}</td></tr>`;
//     //         msg += `<tr><td class='td-title'>　　　摘要：</td><td>${dupArray[j].doc_content.Paragraph}</td></tr>`;
//     //         msg += `<tr><td class='td-title'>　　　筆記：</td><td>${dupArray[j].doculib.note}</td></tr>`;
//     //         msg += `<tr class='tr-border-bottom'><td class='td-title'>　　資料夾：</td><td>${arrToStr(dupArray[j].doculib.folder)}</td></tr>`;
//     //         j++;
        
//     //         tableHtml += `<tr><td rowspan=8 width=4% class='td-border-right center'><input value=${dupArray[j].filename} type="checkbox" name='c'></td>`;
//     //         tableHtml += msg;
//     //     }
    // }

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