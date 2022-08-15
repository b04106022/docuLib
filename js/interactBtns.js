let currentFolder = "";
let oldFolderName = "";
let _xml = ""

function checkFolderName(folderName){
    let result = false;
    if(folderName == ''){
        alert("請輸入資料夾名稱")
    }else if(folder.includes(folderName)){
        alert("資料夾 " + folderName + " 已存在")
    }else{
        result = true;
    }
    return result
}
function createFolder(){
    const folderName = document.querySelector('#folderName');
    if(checkFolderName(folderName.value)){
        folder.push(folderName.value);
        alert(folderName.value + " 新建成功");
        folderName.value = '';
        renderFolder();
        renderData(currentFolder);
        $('#createFolderModal').modal('hide');
    }
}
function editFolderName(){
    const newName = document.getElementById('newFolderName');
    if(checkFolderName(newName.value)){
        folder[folder.indexOf(oldFolderName)] = newName.value;
        trArray = getTrArray(oldFolderName);
        trArray.forEach(function(item){
            data[item].doculib.folder[data[item].doculib.folder.indexOf(oldFolderName)] = newName.value;
        });
        alert("資料夾 " + newName.value + " 修改成功");
        $('#editFolderModal').modal('hide');
        renderFolder();
        renderData(newName.value);
        newName.value = '';
    }
}

function addDataToFolder(){
    saveToJson();
    let checkedboxArray = getCheckedboxArray();
    const folderSelector = document.querySelector('#folderSelector');
    if(checkedboxArray.length == 0 &&　folderSelector.value == ""){
        alert("請選取欲操作的書目與資料夾");
    }else if(checkedboxArray.length == 0){
        alert("請選取欲操作的書目");
    }else if(folderSelector.value == ""){
        alert("請選擇欲加入的資料夾");
    }else{
        if(currentFolder == "全部書目"){
            checkedboxArray.forEach(function(item){
                if(!data[item].doculib.folder.includes(folderSelector.value)){
                    data[item].doculib.folder.push(folderSelector.value);
                    if (!(folderSelector.value in data[item].doculib.topic)){
                        data[item].doculib.topic[folderSelector.value] = [];
                        data[item].doculib.tag[folderSelector.value] = [];
                        data[item].doculib.important[folderSelector.value] = "";
                    }
                }
            })
        }else{
            // if bib in "垃圾桶"
            checkedboxArray.forEach(function(item){
                data[item].doculib.folder = ["全部書目", folderSelector.value];
                if (!(folderSelector.value in data[item].doculib.topic)){
                    data[item].doculib.topic[folderSelector.value] = [];
                    data[item].doculib.tag[folderSelector.value] = [];
                    data[item].doculib.important[folderSelector.value] = "";
                }
            })
        }
        saveToJson(); 
        renderFolder();
        renderData(currentFolder);
    }
}
function deleteData(){
    saveToJson();
    let checkedboxArray = getCheckedboxArray();
    if(checkedboxArray.length > 0){
        if(currentFolder == "全部書目"){
            let alertBib = "";
            checkedboxArray.forEach(function(item){
                if(data[item].doculib.folder.length>1){
                    alertBib += data[item].title + "\n";
                }
            })
            if(alertBib != ""){
                if(confirm(`以下書目仍存在其他研究資料夾中，請確認是否移至垃圾桶\n${alertBib}`)){
                    checkedboxArray.forEach(function(item){
                        data[item].doculib.folder = ["垃圾桶"];
                    })
                }
            }else{
                checkedboxArray.forEach(function(item){
                    data[item].doculib.folder = ["垃圾桶"];
                })
            }
        }else if(currentFolder == "垃圾桶"){
            if(confirm("刪除後將無法復原，請確定是否刪除")){
                checkedboxArray.reverse().forEach(function(item){
                    data.splice(item, 1);
                })
            }
        }else{
            // Move Out from user folder
            checkedboxArray.forEach(function(item){
                let index = data[item].doculib.folder.indexOf(currentFolder);
                data[item].doculib.folder.splice(index, 1);
            })
        }
    }else{
        alert("請選取欲操作的書目");
    }
    saveToJson(); 
    renderFolder();
    renderData(currentFolder);
}

function check_all(obj, cName){
    let checkboxs = document.getElementsByName(cName);
    for(let i=0; i<checkboxs.length; i++){
        checkboxs[i].checked = obj.checked;
    }
}
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
function strToArr(str){
    let arr = str.trim().split(';');
    for(let i=0; i<arr.length; i++){
        arr[i] = arr[i].trim();
    }
    if(arr[arr.length-1] == ""){
        arr.splice(arr.length-1, 1);
    }
    return arr
}
function encodeUrl(url){
    return url.replaceAll('&','&amp;')
}
function getGeoLevel(pub_loc){
    let locArr = ['', '', ''];
    if(pub_loc.includes('[')){
        pub_loc = pub_loc.split('[')[0]
    }
    temp = pub_loc.replaceAll(' ','').split(',');
    if(temp.length == 2){
        locArr[2] = temp[0];
        locArr[0] = temp[1];
    }else if(temp.length == 3){
        locArr[2] = temp[0];
        locArr[1] = temp[1];
        locArr[0] = temp[2];
    }
    return locArr
}
function getMetatagContent(tagName, str){
    let arr;
    if(tagName=='Udef_doctype' || tagName=='Udef_docclass'){
        arr = str.split(';');
    }else{
        arr = str.split(/=|;/);
    }
    arr = arr.map(s => s.trim());

    let content = "";
    if(tagName!='Udef_author'){
        for(let i=0; i<arr.length; i++){
            content += `<${tagName}>${arr[i].toLowerCase()}</${tagName}>`;
        }
    }else{
        for(let i=0; i<arr.length; i++){
            content += `<${tagName}>${arr[i]}</${tagName}>`;
        }
    }
    return content
}

// Import DocuLib Json
function readJsonFile(){
    let file = document.querySelector('#file');
    if (!file.value.length){
        alert('請先選擇檔案');
    }else{
        let reader = new FileReader();
        reader.onload = jsonFile;
		reader.readAsText(file.files[0]);
    }
}
function jsonFile(event) {
    let str = event.target.result;
    let json = JSON.parse(str);
    if(data.length == 0){
        data = json[0];
        folder = json[1];
    }else{
        let temp_data = json[0];
        let temp_folder = json[1];

        // check bibliography for duplicates
        checkDupData(temp_data)

        // import folder
        for(let j=0; j<temp_folder.length; j++){
            if(!folder.includes(temp_folder[j])){
                folder.push(temp_folder[j]);
            }
        }
    }
    localStorage.setItem('userData', JSON.stringify([data, folder]));
    alert('匯入完成，回到全部書目列表');
    $('#importJsonModal').modal('hide');
    renderFolder();
    renderData('全部書目')
}
function checkDupData(temp_data){
    // record the duplicate bibs & import bibs that are not duplicate
    let dupArray = [];
    let pushed = [];

    for(let i=0; i<temp_data.length; i++){
        if(data.some(el => el.filename === temp_data[i].filename || el.title === temp_data[i].title)){ 
            let result = data.filter(el => el.filename === temp_data[i].filename || el.title === temp_data[i].title);
            dupArray.push(...result);
        }else{
            data.push(temp_data[i]);
            pushed.push(i)
        }
    }
    // check if user is importing duplicate bibs
    if(dupArray.length > 0){
        // generatae dup table
        var newwin = window.open("dupBibs.html");
        newwin.onload = () => {
            newwin.data = data;
            newwin.temp_data = temp_data;
            newwin.dupArray = dupArray;
            newwin.pushed = pushed;
        };

        // let j = 0;
        // for(let i=0; i<temp_data.length; i++){
        //     if(!pushed.includes(i)){
        //         msg = '書目「' + temp_data[i].title + '」已存在。\n下為已存在於 MetaLib 的書目詳情，請確認是否仍要匯入？\n\n';
        //         msg += `文獻題名：${dupArray[j].title}\n`;
        //         msg += `作者：${dupArray[j].xml_metadata.Udef_author}\n`;
        //         msg += `出版日期：${dupArray[j].xml_metadata.Udef_publish_date}\n`;
        //         msg += `出處題名：${dupArray[j].xml_metadata.Udef_publisher.text}\n`;
        //         msg += `關鍵字：${dupArray[j].xml_metadata.Udef_keywords}\n`;
        //         msg += `摘要：${dupArray[j].doc_content.Paragraph}\n`;
        //         msg += `筆記：${dupArray[j].doculib.note}\n`;
        //         msg += `資料夾：${arrToStr(dupArray[j].doculib.folder)}`;
        //         j++;
                
        //         if(confirm(msg)){
        //             let suffix = getFilenameSuffix(temp_data[i].filename);
        //             temp_data[i].filename += suffix;
        //             data.push(temp_data[i]);
        //             // console.log(temp_data[i])
        //         }
        //     }
        // }
    }
}
function getFilenameSuffix(filename){
    let suffix = 'd';
    let n = data.filter(el => el.filename.includes(filename)).length;
    return suffix.repeat(n)
}

// Import From DLBS
function getDLBSJson(){
    if($('#dlbs').val() == ''){
        alert('請輸入匯入序號')
    }else{
        var url = 'https://buddhism.lib.ntu.edu.tw/ExportToDocuLib?dlbs=' + $('#dlbs').val() + '&callback=dlbs';
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
        $('#dlbs').val('');
    }
}
function dlbs(dlbs){
    let temp_data = cleanDLBSData(dlbs.books);

    if(data.length == 0){
        data = temp_data;
    }else{
        checkDupData(temp_data);
    }
    localStorage.setItem('userData', JSON.stringify([data, folder]));
    alert('匯入完成，回到全部書目列表');
    $('#ImportDLBSModal').modal('hide');
    renderFolder();
    renderData('全部書目')
}
function cleanDLBSData(data){
    data.forEach(function(item){
        // rename Udef_publisher_data to Udef_publish_data
        Object.defineProperty(item.xml_metadata, 'Udef_publish_date', Object.getOwnPropertyDescriptor(item.xml_metadata, 'Udef_publisher_date'));
        delete item.xml_metadata['Udef_publisher_date'];

        // check Udef_compilation_name is missing or not
        if(!item.xml_metadata.hasOwnProperty('Udef_compilation_name')){
            item.xml_metadata.Udef_compilation_name = {'a':'', 'text':''};
        }

        // Udef_author1-6
        if(item.xml_metadata.Udef_author1.a == 'https://buddhism.lib.ntu.edu.tw/author/authorinfo.jsp?ID=' && item.xml_metadata.Udef_author1.text == ''){
            item.xml_metadata.Udef_author1 = {};
        }if(item.xml_metadata.Udef_author2.a == 'https://buddhism.lib.ntu.edu.tw/author/authorinfo.jsp?ID=' && item.xml_metadata.Udef_author2.text == ''){
            item.xml_metadata.Udef_author2 = {};
        }if(item.xml_metadata.Udef_author3.a == 'https://buddhism.lib.ntu.edu.tw/author/authorinfo.jsp?ID=' && item.xml_metadata.Udef_author3.text == ''){
            item.xml_metadata.Udef_author3 = {};
        }if(item.xml_metadata.Udef_author4.a == 'https://buddhism.lib.ntu.edu.tw/author/authorinfo.jsp?ID=' && item.xml_metadata.Udef_author4.text == ''){
            item.xml_metadata.Udef_author4 = {};
        }if(item.xml_metadata.Udef_author5.a == 'https://buddhism.lib.ntu.edu.tw/author/authorinfo.jsp?ID=' && item.xml_metadata.Udef_author5.text == ''){
            item.xml_metadata.Udef_author5 = {};
        }if(item.xml_metadata.Udef_author6.a == 'https://buddhism.lib.ntu.edu.tw/author/authorinfo.jsp?ID=' && item.xml_metadata.Udef_author6.text == ''){
            item.xml_metadata.Udef_author6 = {};
        }

        // topic, tag, important
        item.doculib.topic = {};
        item.doculib.tag = {};
        item.doculib.important = {};
    });
    return data
}

// check addBibModal: dup or null
$('#u_title').change(function(){
    checkUserBib($('#u_title').val());
});
function checkUserBib(u_title){
    let dupArray = [];
    let j = 0;
    data.forEach(function(item, index){
        if(item.title == u_title){
            dupArray.push(item);

            msg = '書目「' + u_title + '」已存在。\n下為已存在於 MetaLib 的書目詳情，請確認是否仍要匯入？\n\n';
            msg += `文獻題名：${dupArray[j].title}\n`;
            msg += `作者：${dupArray[j].xml_metadata.Udef_author}\n`;
            msg += `出版日期：${dupArray[j].xml_metadata.Udef_publish_date}\n`;
            msg += `出處題名：${dupArray[j].xml_metadata.Udef_publisher.text}\n`;
            msg += `關鍵字：${dupArray[j].xml_metadata.Udef_keywords}\n`;
            msg += `摘要：${dupArray[j].doc_content.Paragraph}\n`;
            msg += `筆記：${dupArray[j].doculib.note}\n`;
            msg += `資料夾：${arrToStr(dupArray[j].doculib.folder)}`;
            j++;

            alert(msg);
        }
    })
}
function checkAddBibModal(){
    if($('#u_title').val() == ''){
        alert('請填寫文獻題名')
    }else{
        $('#addBibModal').modal('hide');
        $('#addBibModal2').modal('show');
    }
}
// add user bib to Data
function addBibByUser(){
    let userDataNumber = 'user_' + getUserDataNumber();
    let authorArr = $('#u_author').val();
    let importFolder = getImportFolder();
    let topicObj = {};
    let tagObj = {};
    let importantObj = {};
    if(importFolder.length > 1){
        for(let i=1; i<importFolder.length; i++){
            topicObj[importFolder[i]] = [];
            tagObj[importFolder[i]] = [];
            importantObj[importFolder[i]] = "";
        }
    }

    let userDataObj = {
        "filename": userDataNumber,
        "title": $('#u_title').val(),
        "doc_source": "User Imported",
        "xml_metadata": {
            "Udef_refSrc": {
                "a": "", 
                "text": "原書目網址"
            },
            "Udef_author" : authorArr,
            "Udef_author1": {},
            "Udef_author2": {},
            "Udef_author3": {},
            "Udef_author4": {},
            "Udef_author5": {},
            "Udef_author6": {},
            "Udef_compilation_name": {
                "a": "",
                "text": $('#u_compilation_name').val()
            },
            "Udef_seriesname": "",
            "Udef_seriessubsidiary": "",
            "Udef_seriesno": "",
            "Udef_compilation_vol": $('#u_compilation_vol').val(),
            "Udef_compilation_page": $('#u_compilation_page').val(),
            "Udef_publish_date": $('#u_publish_date').val(),
            "Udef_publisher": {
                "a": "",
                "text": $('#u_publisher').val()
            },
            "Udef_publisher_location": $('#u_publisher_location').val(),
            "Udef_doctypes": $('#u_doctypes').val(),
            "Udef_biliography_language": $('#u_biliography_language').val(),
            "Udef_remark": "",
            "Udef_remarkcontent": "",
            "Udef_keywords": $('#u_keywords').val(),
            "Udef_tablecontent": $('#u_tablecontent').val(),
            "Udef_book_code": $('#u_book_code').val(),
            "Udef_edition": "",
            "Udef_fulltextSrc": {
                "a": $('#u_fulltextSrc').val(),
                "text": $('#u_fulltextSrc').val()? "全文網址" : "無全文網址"
            },
            "Udef_category": "",
            "Udef_period": "",
            "Udef_area": "",
            "Udef_place": "",
            "Udef_institution": "",
            "Udef_department": "",
            "Udef_publicationyear": "",
            "Udef_degree": "",
            "Udef_doi": {
            "a": $('#u_doi').val(),
            "text": $('#u_doi').val()? "DOI" : "無DOI"
            }
        },
        "doc_content": {
            "Paragraph": $('#u_paragraph').val()
        },
        "doculib":{
            "folder": importFolder,
            "topic": topicObj,
            "tag": tagObj,
            "important": importantObj,
            "read": $('#u_read').val(),
            "note": $('#u_note').val()
        }
    }
    data.push(userDataObj);

    clearAddBibModal();
    $('#addBibModal2').modal('hide');
    alert("書目已匯入，回到全部書目列表");
    renderFolder();
    renderData('全部書目');
    saveToJson(); 
}
function getUserDataNumber(){
    let number = 0;
    data.forEach(function(item){
        if(item.filename.includes('user')){
            n = parseInt(item.filename.replace('user_', ''));
            if(n > number){
                number = n;
            }
        }
    })
    return number+1
}
function getImportFolder(){
    let importFolder = ["全部書目"];
	$.each($("input[name='importFolder']:checked"), function() {
		importFolder.push($(this).val());
	});
    return importFolder
}
function clearAddBibModal(){
    $('#u_title').val('');
    $('#u_author').val('');
    $('#u_publish_date').val('');
    $('#u_compilation_name').val('');
    $('#u_keywords').val('');
    $('#u_read').val('未閱讀');
    $.each($("input[name='importFolder']:checked"), function() {
        $(this).prop('checked', false);
    });
    $('#u_note').val('');
    $('#u_compilation_vol').val('');
    $('#u_compilation_page').val('');
    $('#u_publisher').val('');
    $('#u_publisher_location').val('');
    $('#u_book_code').val('');
    $('#u_doctypes').val('');
    $('#u_biliography_language').val('');
    $('#u_fulltextSrc').val('');
    $('#u_doi').val('');
    $('#u_paragraph').val('');
    $('#u_tablecontent').val('');
}

function saveNoteData(){
    let index = document.getElementById('noteId').value;
    data[index].doculib.note = document.getElementById('noteContent').value;
}
function saveToJson(){
    trArray = getTrArray(currentFolder);
    trArray.forEach(function(item){
        let tr1 = document.getElementById(item);
        let tr2 = document.getElementById("hiddenRow_"+item);
        // 核心欄位
        // Metatags: author, keyword, topic, tag, doctypes, docclass
        data[item].title = tr1.children[1].textContent;
        data[item].xml_metadata.Udef_author = tr1.children[2].textContent;
        // data[item].year_for_grouping = tr1.children[3].textContent;
        data[item].xml_metadata.Udef_compilation_name.text = tr1.children[4].textContent;
        data[item].xml_metadata.Udef_keywords = tr1.children[5].textContent;
        // 使用者加值欄位
        // 6主題分類, 7tag, 8重要,  9資料夾, 10閱讀狀態, 11筆記
        if(currentFolder != '全部書目'){
            data[item].doculib.topic[currentFolder] = tr1.children[6].textContent;
            data[item].doculib.tag[currentFolder] = tr1.children[7].textContent;
            if(tr1.children[8].firstElementChild.checked){
                data[item].doculib.important[currentFolder] = tr1.children[8].firstElementChild.value;
            }
        }
        data[item].doculib.read = tr1.children[10].firstElementChild.value;
        // data[item].doculib.note = tr1.children[11].textContent;
        // 共同欄位
        let volPage = tr2.children[1].children[0].firstElementChild.value.split(';');
        data[item].xml_metadata.Udef_compilation_vol = volPage[0];
        data[item].xml_metadata.Udef_compilation_page = volPage[1].trim();
        data[item].xml_metadata.Udef_publisher.text = tr2.children[1].children[1].firstElementChild.value;
        data[item].xml_metadata.Udef_publish_date = tr2.children[1].children[2].firstElementChild.value;
        data[item].xml_metadata.Udef_publisher_location = tr2.children[1].children[3].firstElementChild.value;
        data[item].xml_metadata.Udef_Udef_book_code = tr2.children[1].children[4].firstElementChild.value;
        data[item].xml_metadata.Udef_doctypes = tr2.children[1].children[5].firstElementChild.value;
        data[item].xml_metadata.Udef_docclass = tr2.children[1].children[6].firstElementChild.value;
        data[item].doc_content.Paragraph = tr2.children[1].children[7].lastElementChild.value;
        data[item].xml_metadata.Udef_tablecontent = tr2.children[1].children[8].lastElementChild.value;
        // 共同欄位－網址
        if(document.getElementById("author1_a_"+item)!=null){
            data[item].xml_metadata.Udef_author1.a = document.getElementById("author1_a_"+item).value;
        }
        if(document.getElementById("author2_a_"+item)!=null){
            data[item].xml_metadata.Udef_author2.a = document.getElementById("author2_a_"+item).value;
        }
        if(document.getElementById("author3_a_"+item)!=null){
            data[item].xml_metadata.Udef_author3.a = document.getElementById("author3_a_"+item).value;
        }
        if(document.getElementById("author4_a_"+item)!=null){
            data[item].xml_metadata.Udef_author4.a = document.getElementById("author4_a_"+item).value;
        }
        if(document.getElementById("author5_a_"+item)!=null){
            data[item].xml_metadata.Udef_author5.a = document.getElementById("author5_a_"+item).value;
        }
        if(document.getElementById("author6_a_"+item)!=null){
            data[item].xml_metadata.Udef_author6.a = document.getElementById("author6_a_"+item).value;
        }
        if(document.getElementById("compilation_name_a_"+item)!=null){
            data[item].xml_metadata.Udef_compilation_name.a = document.getElementById("compilation_name_a_"+item).value;
        }
        if(document.getElementById("publisher_a_"+item)!=null){
            data[item].xml_metadata.Udef_publisher.a = document.getElementById("publisher_a_"+item).value;
        }
        if(document.getElementById("fulltextSrc_"+item)!=null){
            // 預設填入網址
            if(document.getElementById("fulltextSrc_"+item).value=="無全文"){
                data[item].xml_metadata.Udef_fulltextSrc.a = "";
                data[item].xml_metadata.Udef_fulltextSrc.text = "無全文";
            }else{
                data[item].xml_metadata.Udef_fulltextSrc.a = document.getElementById("fulltextSrc_"+item).value;
                data[item].xml_metadata.Udef_fulltextSrc.text = "全文網址";
            }
        }
        if(document.getElementById("doi_"+item)!=null){
            // 預設填入網址
            if(document.getElementById("doi_"+item).value=="無DOI"){
                data[item].xml_metadata.Udef_doi.a = "";
                data[item].xml_metadata.Udef_doi.text = "無DOI";
            }
            else{
                data[item].xml_metadata.Udef_doi.a = document.getElementById("doi_"+item).value;
                data[item].xml_metadata.Udef_doi.text = "DOI";
            }
        }
        // 輔助欄位
        // 叢書
        if(document.getElementById("seriesname_"+item)!=null){
            data[item].xml_metadata.Udef_seriesname = document.getElementById("seriesname_"+item).value;
        }if(document.getElementById("seriessubsidiary_"+item)!=null){
            data[item].xml_metadata.Udef_seriessubsidiary = document.getElementById("seriessubsidiary_"+item).value;
        }if(document.getElementById("seriesno_"+item)!=null){
            data[item].xml_metadata.Udef_seriesno = document.getElementById("seriesno_"+item).value;
        }
        // 藝術資料庫
        if(document.getElementById("category_"+item)!=null){
            data[item].xml_metadata.Udef_category = document.getElementById("category_"+item).value;
        }if(document.getElementById("period_"+item)!=null){
            data[item].xml_metadata.Udef_period = document.getElementById("period_"+item).value;
        }if(document.getElementById("area_"+item)!=null){
            data[item].xml_metadata.Udef_area = document.getElementById("area_"+item).value;
        }if(document.getElementById("place_"+item)!=null){
            data[item].xml_metadata.Udef_place = document.getElementById("place_"+item).value;
        }
        // 碩博士論文
        if(document.getElementById("institution_"+item)!=null){
            data[item].xml_metadata.Udef_institution = document.getElementById("institution_"+item).value;
        }if(document.getElementById("department_"+item)!=null){
            data[item].xml_metadata.Udef_department = document.getElementById("department_"+item).value;
        }if(document.getElementById("publicationyear_"+item)!=null){
            data[item].xml_metadata.Udef_publicationyear = document.getElementById("publicationyear_"+item).value;
        }if(document.getElementById("degree_"+item)!=null){
            data[item].xml_metadata.Udef_degree = document.getElementById("degree_"+item).value;
        }
        // 內容
        if(document.getElementById("edition_"+item)!=null){
            data[item].xml_metadata.Udef_edition = document.getElementById("edition_"+item).value;
        }if(document.getElementById("remark_"+item)!=null){
            data[item].xml_metadata.Udef_remark = document.getElementById("remark_"+item).value;
        }if(document.getElementById("remarkcontent_"+item)!=null){
            data[item].xml_metadata.Udef_remarkcontent = document.getElementById("remarkcontent_"+item).value;
        }
    })
    localStorage.setItem('userData', JSON.stringify([data, folder]));
}
function downloadJson(){
    saveToJson();
    let link = document.createElement('a');
    let blob = new Blob([JSON.stringify([data, folder])], {type:""});
    let url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', currentFolder + '_' + now() + '.json');
    link.click();
}

function jsonToCsv(){
    saveToJson();
    let checkedboxArray = getCheckedboxArray();
    if(checkedboxArray.length == 0){
        checkedboxArray = getTrArray(currentFolder);
    }
    // header
    let csvContent;
    if(currentFolder=="全部書目" || currentFolder=="垃圾桶"){
        csvContent = `文獻題名,作者,出版年,出處題名,關鍵字,閱讀狀態,筆記,卷期,頁次,出版者,出版日期,出版地,ISSN/ISBN/ISRC,資料類型,語言,摘要,目次,作者1網址,作者2網址,作者3網址,作者4網址,作者5網址,作者6網址,出處題名網址,出版者網址,全文網址,DOI,叢書名,附屬叢書,叢書號,研究類別,研究時代,研究地區,研究地點,校院名稱,系所名稱,畢業年度,學位類別,版本項,附註項,內容項,原書目網址\r\n`;
    }else{
        csvContent = `文獻題名,作者,出版年,出處題名,關鍵字,主題分類,Tag,重要,閱讀狀態,筆記,卷期,頁次,出版者,出版日期,出版地,ISSN/ISBN/ISRC,資料類型,語言,摘要,目次,作者1網址,作者2網址,作者3網址,作者4網址,作者5網址,作者6網址,出處題名網址,出版者網址,全文網址,DOI,叢書名,附屬叢書,叢書號,研究類別,研究時代,研究地區,研究地點,校院名稱,系所名稱,畢業年度,學位類別,版本項,附註項,內容項,原書目網址\r\n`;
    }
    checkedboxArray.forEach(function(item){
        // content
        let row;
        if(currentFolder == "全部書目" || currentFolder == "垃圾桶"){
            row = [data[item].title, data[item].xml_metadata.Udef_author, data[item].xml_metadata.Udef_publish_date.substring(0,4), data[item].xml_metadata.Udef_compilation_name.text, data[item].xml_metadata.Udef_keywords, data[item].doculib.read, data[item].doculib.note, 
            data[item].xml_metadata.Udef_compilation_vol, data[item].xml_metadata.Udef_compilation_page, data[item].xml_metadata.Udef_publisher.text, data[item].xml_metadata.Udef_publish_date, data[item].xml_metadata.Udef_publisher_location, data[item].xml_metadata.Udef_Udef_book_code, data[item].xml_metadata.Udef_doctypes, data[item].xml_metadata.Udef_docclass, data[item].doc_content.Paragraph, data[item].xml_metadata.Udef_tablecontent, 
            data[item].xml_metadata.Udef_author1.a, data[item].xml_metadata.Udef_author2.a, data[item].xml_metadata.Udef_author3.a, data[item].xml_metadata.Udef_author4.a, data[item].xml_metadata.Udef_author5.a, data[item].xml_metadata.Udef_author6.a, data[item].xml_metadata.Udef_compilation_name.a, data[item].xml_metadata.Udef_publisher.a, data[item].xml_metadata.Udef_fulltextSrc.a, data[item].xml_metadata.Udef_doi.a,
            data[item].xml_metadata.Udef_seriesname, data[item].xml_metadata.Udef_seriessubsidiary, data[item].xml_metadata.Udef_seriesno, data[item].xml_metadata.Udef_category, data[item].xml_metadata.Udef_period, data[item].xml_metadata.Udef_area, data[item].xml_metadata.Udef_place, data[item].xml_metadata.Udef_institution, data[item].xml_metadata.Udef_department, data[item].xml_metadata.Udef_publicationyear, data[item].xml_metadata.Udef_degree, data[item].xml_metadata.Udef_edition, data[item].xml_metadata.Udef_remark, data[item].xml_metadata.Udef_remarkcontent, data[item].xml_metadata.Udef_refSrc.a];
        }else{            
            row = [data[item].title, data[item].xml_metadata.Udef_author, data[item].xml_metadata.Udef_publish_date.substring(0,4), data[item].xml_metadata.Udef_compilation_name.text, data[item].xml_metadata.Udef_keywords, 
                    data[item].doculib.topic[currentFolder], data[item].doculib.tag[currentFolder], data[item].doculib.important[currentFolder], data[item].doculib.read, data[item].doculib.note, 
                    data[item].xml_metadata.Udef_compilation_vol, data[item].xml_metadata.Udef_compilation_page, data[item].xml_metadata.Udef_publisher.text, data[item].xml_metadata.Udef_publish_date, data[item].xml_metadata.Udef_publisher_location, data[item].xml_metadata.Udef_Udef_book_code, data[item].xml_metadata.Udef_doctypes, data[item].xml_metadata.Udef_docclass, data[item].doc_content.Paragraph, data[item].xml_metadata.Udef_tablecontent, 
                    data[item].xml_metadata.Udef_author1.a, data[item].xml_metadata.Udef_author2.a, data[item].xml_metadata.Udef_author3.a, data[item].xml_metadata.Udef_author4.a, data[item].xml_metadata.Udef_author5.a, data[item].xml_metadata.Udef_author6.a, data[item].xml_metadata.Udef_compilation_name.a, data[item].xml_metadata.Udef_publisher.a, data[item].xml_metadata.Udef_fulltextSrc.a, data[item].xml_metadata.Udef_doi.a,
                    data[item].xml_metadata.Udef_seriesname, data[item].xml_metadata.Udef_seriessubsidiary, data[item].xml_metadata.Udef_seriesno, data[item].xml_metadata.Udef_category, data[item].xml_metadata.Udef_period, data[item].xml_metadata.Udef_area, data[item].xml_metadata.Udef_place, data[item].xml_metadata.Udef_institution, data[item].xml_metadata.Udef_department, data[item].xml_metadata.Udef_publicationyear, data[item].xml_metadata.Udef_degree, data[item].xml_metadata.Udef_edition, data[item].xml_metadata.Udef_remark, data[item].xml_metadata.Udef_remarkcontent, data[item].xml_metadata.Udef_refSrc.a];
        }
        row.forEach(function(cell){
            if(cell != undefined){
                if(cell=="undefined"){
                    cell = "";
                }
                cell = cell.replaceAll(',', ';');
                cell = cell.replaceAll('\n', ' ');
                cell = cell.replaceAll('\r', ' ');
            }
            else{
                cell = "";
            }
            csvContent += cell + ",";
        })
        csvContent += "\r\n";
    })
    let link = document.createElement('a');
    // "\ufeff" 解決中文亂碼
    let blob = new Blob(["\ufeff"+csvContent], {type:'text/csv;charset=utf-8;'});
    let url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', currentFolder  + '_' + now() + '.csv');
    link.click();
}
function downloadXML(){
    jsonToDocuXML();
    let blob = new Blob([_xml], {type: "text/xml;charset=utf-8"});
    saveAs(blob, currentFolder  + '_' + now() + ".xml");
}
function jsonToDocuXML(){
    saveToJson();
    let checkedboxArray = getCheckedboxArray();
    if(checkedboxArray.length == 0){
        checkedboxArray = getTrArray(currentFolder);
    }
    let xmlContent = 
`<ThdlPrototypeExport>
<corpus name="${currentFolder}">
<metadata_field_settings>
<compilation_name show_spotlight="Y" display_order="999">出處題名</compilation_name>
<year_for_grouping show_spotlight="Y" display_order="999">出版年</year_for_grouping>
<geo_level1 show_spotlight="Y" display_order="999">出版國家</geo_level1>
<geo_level2 show_spotlight="Y" display_order="999">出版省分</geo_level2>
<geo_level3 show_spotlight="Y" display_order="999">出版地點</geo_level3>
<book_code show_spotlight="Y" display_order="999">ISSN/ISBN/ISRC</book_code>
<doc_source show_spotlight="Y" display_order="999">書目來源</doc_source>
</metadata_field_settings>
<feature_analysis>
<spotlight category="Udef_author" sub_category="-" display_order="1" title="作者"/>
<tag type="contentTagging" name="Udef_author" default_category="Udef_author" default_sub_category="-"/>
<spotlight category="Udef_keyword" sub_category="-" display_order="2" title="關鍵字"/>
<tag type="contentTagging" name="Udef_keyword" default_category="Udef_keyword" default_sub_category="-"/>
<spotlight category="Udef_docclass" sub_category="-" display_order="3" title="語言"/>
<tag type="contentTagging" name="Udef_docclass" default_category="Udef_docclass" default_sub_category="-"/>
<spotlight category="Udef_doctype" sub_category="-" display_order="4" title="資料類型"/>
<tag type="contentTagging" name="Udef_doctype" default_category="Udef_doctype" default_sub_category="-"/>
<spotlight category="Udef_topic" sub_category="-" display_order="5" title="主題分類"/>
<tag type="contentTagging" name="Udef_topic" default_category="Udef_topic" default_sub_category="-"/>
<spotlight category="Udef_tag" sub_category="-" display_order="6" title="Tag"/>
<tag type="contentTagging" name="Udef_tag" default_category="Udef_tag" default_sub_category="-"/>
</feature_analysis>
</corpus>
<documents>`;
    checkedboxArray.forEach(function(item){
        xmlContent += `
<document filename="${data[item].filename}">
<corpus>${currentFolder}</corpus>
<title>${data[item].title}</title>
<compilation_name>${data[item].xml_metadata.Udef_compilation_name.text}</compilation_name>
<compilation_vol>${data[item].xml_metadata.Udef_compilation_vol}</compilation_vol>
<time_orig_str>${data[item].xml_metadata.Udef_publish_date}</time_orig_str>
<year_for_grouping>${data[item].xml_metadata.Udef_publish_date.substring(0,4)}</year_for_grouping>
<geo_level1>${getGeoLevel(data[item].xml_metadata.Udef_publisher_location)[0]}</geo_level1>
<geo_level2>${getGeoLevel(data[item].xml_metadata.Udef_publisher_location)[1]}</geo_level2>
<geo_level3>${getGeoLevel(data[item].xml_metadata.Udef_publisher_location)[2]}</geo_level3>
<book_code>${data[item].xml_metadata.Udef_book_code}</book_code>
<doc_source>${data[item].doc_source}</doc_source>
<xml_metadata>
<Udef_author>${data[item].xml_metadata.Udef_author}</Udef_author>
<Udef_doctypes>${data[item].xml_metadata.Udef_doctypes}</Udef_doctypes>
<Udef_biliography_language>${data[item].xml_metadata.Udef_biliography_language}</Udef_biliography_language>
<Udef_keywords>${data[item].xml_metadata.Udef_keywords}</Udef_keywords>
<Udef_read>${data[item].doculib.read}</Udef_read>
<Udef_note>${data[item].doculib.note}</Udef_note>`;
        if(currentFolder!="全部書目" && currentFolder!="垃圾桶"){
            xmlContent +=`
<Udef_topic>${data[item].doculib.topic[currentFolder]}</Udef_topic>
<Udef_tag>${data[item].doculib.tag[currentFolder]}</Udef_tag>
<Udef_important>${data[item].doculib.important[currentFolder]}</Udef_important>`;
}
        // Udef_author1 - Udef_author6
        if(Object.keys(data[item].xml_metadata.Udef_author1).length>0){
            if(data[item].xml_metadata.Udef_author1.a!=""){
                xmlContent += `
<Udef_author1>
<a href="${encodeUrl(data[item].xml_metadata.Udef_author1.a)}" target="_blank">${data[item].xml_metadata.Udef_author1.text}</a>
</Udef_author1>`;}
            else{
                xmlContent += `
<Udef_author1>${data[item].xml_metadata.Udef_author1.text}</Udef_author1>`;}}
        if(Object.keys(data[item].xml_metadata.Udef_author2).length>0){
            if(data[item].xml_metadata.Udef_author2.a!=""){
                xmlContent += `
<Udef_author2>
<a href="${encodeUrl(data[item].xml_metadata.Udef_author2.a)}" target="_blank">${data[item].xml_metadata.Udef_author2.text}</a>
</Udef_author2>`;}
            else{
                xmlContent += `
<Udef_author2>${data[item].xml_metadata.Udef_author2.text}</Udef_author2>`;}}
        if(Object.keys(data[item].xml_metadata.Udef_author3).length>0){
            if(data[item].xml_metadata.Udef_author3.a!=""){
                xmlContent += `
<Udef_author3>
<a href="${encodeUrl(data[item].xml_metadata.Udef_author3.a)}" target="_blank">${data[item].xml_metadata.Udef_author3.text}</a>
</Udef_author3>`;}
            else{
                xmlContent += `
<Udef_author3>${data[item].xml_metadata.Udef_author3.text}</Udef_author3>`;}}
        if(Object.keys(data[item].xml_metadata.Udef_author4).length>0){
            if(data[item].xml_metadata.Udef_author4.a!=""){
                xmlContent += `
<Udef_author4>
<a href="${encodeUrl(data[item].xml_metadata.Udef_author4.a)}" target="_blank">${data[item].xml_metadata.Udef_author4.text}</a>
</Udef_author4>`;}
            else{
                xmlContent += `
<Udef_author4>${data[item].xml_metadata.Udef_author4.text}</Udef_author4>`;}}
        if(Object.keys(data[item].xml_metadata.Udef_author5).length>0){
            if(data[item].xml_metadata.Udef_author5.a!=""){
                xmlContent += `
<Udef_author5>
<a href="${encodeUrl(data[item].xml_metadata.Udef_author5.a)}" target="_blank">${data[item].xml_metadata.Udef_author5.text}</a>
</Udef_author5>`;}
            else{
                xmlContent += `
<Udef_author5>${data[item].xml_metadata.Udef_author5.text}</Udef_author5>`;}}
        if(Object.keys(data[item].xml_metadata.Udef_author6).length>0){
            if(data[item].xml_metadata.Udef_author6.a!=""){
                xmlContent += `
<Udef_author6>
<a href="${encodeUrl(data[item].xml_metadata.Udef_author6.a)}" target="_blank">${data[item].xml_metadata.Udef_author6.text}</a>
</Udef_author6>`;}
            else{
                xmlContent += `
<Udef_author6>${data[item].xml_metadata.Udef_author6.text}</Udef_author6>`;}}
        // compilation
        if(data[item].xml_metadata.Udef_compilation_name.a!=""){
            xmlContent += `
<Udef_compilation_name>
<a href="${encodeUrl(data[item].xml_metadata.Udef_compilation_name.a)}" target="_blank">${data[item].xml_metadata.Udef_compilation_name.text}</a>
</Udef_compilation_name>`;}
        else{
            xmlContent += `
<Udef_compilation_name>${data[item].xml_metadata.Udef_compilation_name.text}</Udef_compilation_name>`;}
        if(data[item].xml_metadata.Udef_compilation_vol!=""){
            xmlContent += `
<Udef_compilation_vol>${data[item].xml_metadata.Udef_compilation_vol}</Udef_compilation_vol>`;}
        if(data[item].xml_metadata.Udef_compilation_page!=""){
            xmlContent += `
<Udef_compilation_page>${data[item].xml_metadata.Udef_compilation_page}</Udef_compilation_page>`;}
        // publisher
        if(data[item].xml_metadata.Udef_publisher.a!=""){
            xmlContent += `
<Udef_publisher>
<a href="${encodeUrl(data[item].xml_metadata.Udef_publisher.a)}" target="_blank">${data[item].xml_metadata.Udef_publisher.text}</a>
</Udef_publisher>`;}
        else{
            xmlContent += `
<Udef_publisher>${data[item].xml_metadata.Udef_publisher.text}</Udef_publisher>`;}
        if(data[item].xml_metadata.Udef_publish_date!=""){
            xmlContent += `
<Udef_publish_date>${data[item].xml_metadata.Udef_publish_date}</Udef_publish_date>`;}
        if(data[item].xml_metadata.Udef_publisher_location!=""){
            xmlContent += `
<Udef_publisher_location>${data[item].xml_metadata.Udef_publisher_location}</Udef_publisher_location>`;}
        if(data[item].xml_metadata.Udef_book_code!=""){
            xmlContent += `
<Udef_book_code>${data[item].xml_metadata.Udef_book_code}</Udef_book_code>`;}
        // content
        if(data[item].xml_metadata.Udef_edition!=""){
            xmlContent += `
<Udef_edition>${data[item].xml_metadata.Udef_edition}</Udef_edition>`;}
        if(data[item].xml_metadata.Udef_remark!=""){
            xmlContent += `
<Udef_remark>${data[item].xml_metadata.Udef_remark}</Udef_remark>`;}
        if(data[item].xml_metadata.Udef_remarkcontent!=""){
            xmlContent += `
<Udef_remarkcontent>${data[item].xml_metadata.Udef_remarkcontent}</Udef_remarkcontent>`;}
        if(data[item].xml_metadata.Udef_tablecontent!=""){
            xmlContent += `
<Udef_tablecontent>${data[item].xml_metadata.Udef_tablecontent}</Udef_tablecontent>`;}
        // URL
        if(data[item].xml_metadata.Udef_fulltextSrc.a!=""){
            xmlContent += `
<Udef_fulltextSrc>
<a href="${encodeUrl(data[item].xml_metadata.Udef_fulltextSrc.a)}" target="_blank">全文網址</a>
</Udef_fulltextSrc>`;}
        else{
            xmlContent += `
<Udef_fulltextSrc>無全文</Udef_fulltextSrc>`;}
        if(data[item].xml_metadata.Udef_doi.text!="無DOI"){
            xmlContent += `
<Udef_doi>
<a href="${encodeUrl(data[item].xml_metadata.Udef_doi)}" target="_blank">DOI</a>
</Udef_doi>`;}
        else{
            xmlContent += `
<Udef_doi>無DOI</Udef_doi>`;            
        }
            xmlContent += `
<Udef_refSrc>
<a href="${encodeUrl(data[item].xml_metadata.Udef_refSrc.a)}" target="_blank">原書目網址</a>
</Udef_refSrc>`;
        // 叢書
        if(data[item].xml_metadata.Udef_seriesname!=""){
            xmlContent += `
<Udef_seriesname>${data[item].xml_metadata.Udef_seriesname}</Udef_seriesname>`;}
        if(data[item].xml_metadata.Udef_seriessubsidiary!=""){
            xmlContent += `
<Udef_seriessubsidiary>${data[item].xml_metadata.Udef_remark}</Udef_seriessubsidiary>`;}
        if(data[item].xml_metadata.Udef_seriesno!=""){
            xmlContent += `
<Udef_seriesno>${data[item].xml_metadata.Udef_seriesno}</Udef_seriesno>`;}
        // 藝術資料庫
        if(data[item].xml_metadata.Udef_category!=""){
            xmlContent += `
<Udef_category>${data[item].xml_metadata.Udef_category}</Udef_category>`;}
        if(data[item].xml_metadata.Udef_period!=""){
            xmlContent += `
<Udef_period>${data[item].xml_metadata.Udef_period}</Udef_period>`;}
        if(data[item].xml_metadata.Udef_area!=undefined && data[item].xml_metadata.Udef_area!=""){
            xmlContent += `
<Udef_area>${data[item].xml_metadata.Udef_area}</Udef_area>`;}
        if(data[item].xml_metadata.Udef_place!=undefined && data[item].xml_metadata.Udef_place!=""){
            xmlContent += `
<Udef_place>${data[item].xml_metadata.Udef_place}</Udef_place>`;}
        // 碩博士論文
        if(data[item].xml_metadata.Udef_institution!=""){
            xmlContent += `
<Udef_institution>${data[item].xml_metadata.Udef_institution}</Udef_institution>`;}
        if(data[item].xml_metadata.Udef_department!=""){
            xmlContent += `
<Udef_department>${data[item].xml_metadata.Udef_department}</Udef_department>`;}
        if(data[item].xml_metadata.Udef_publish_date!=""){
            xmlContent += `
<Udef_publicationyear>${data[item].xml_metadata.Udef_publish_date.substring(0,4)}</Udef_publicationyear>`;}
        if(data[item].xml_metadata.Udef_degree!=""){
            xmlContent += `
<Udef_degree>${data[item].xml_metadata.Udef_degree}</Udef_degree>`;}
        xmlContent += `
</xml_metadata>
<doc_content>`;
        if(data[item].doc_content.Paragraph!="無摘要"){
            xmlContent += `
<Paragraph>${data[item].doc_content.Paragraph}</Paragraph>`
        }
        xmlContent += `
<MetaTags>
${getMetatagContent("Udef_author", data[item].xml_metadata.Udef_author)}
${getMetatagContent("Udef_keyword", data[item].xml_metadata.Udef_keywords)}
${getMetatagContent("Udef_doctype", data[item].xml_metadata.Udef_doctypes)}
${getMetatagContent("Udef_docclass", data[item].xml_metadata.Udef_biliography_language)}`;
        if(currentFolder!="全部書目" && currentFolder!="垃圾桶"){
            xmlContent += `
${getMetatagContent("Udef_topic", data[item].doculib.topic[currentFolder])}
${getMetatagContent("Udef_tag", data[item].doculib.tag[currentFolder])}`;}
        xmlContent += `
</MetaTags>
</doc_content>
</document>`;
    });
    xmlContent += `
</documents>
</ThdlPrototypeExport>`;
    _xml = xmlContent.replaceAll('&', '&amp;');
}