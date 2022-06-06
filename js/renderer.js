/*
1. Data records all bibliography objects. 
    e.g., [{bib0}, {bib1}, {bib2}]
2. folder does not contain folder '全部書目'.
    e.g., ['阿閦佛', '潘重規']
3. trArray records the index of the bibliography object in the current folder.
    e.g., [0, 1, 2] in 全部書目 folder
4. counter records the number of bibliographies in each folder.
    e.g., {folder1: 3, folder2: 1}
*/
let data = [];
let folder = [];
let trArray = [];
let counter = {};

$(document).ready(function(){
    doculibInitialize();
    // if(localStorage.hasOwnProperty("userData")){
    //     let userData = JSON.parse(localStorage.getItem('userData'))
    //     data = userData[0];
    //     folder = userData[1];
    //     doculibInitialize();
    // }else{
    //     jsonUrl = 'https://b04106022.github.io/docuLib/UserJsonFiles/workshop16.json'
    //     getUserJsonData(jsonUrl);
    // }
})
window.addEventListener("beforeunload", function(e) {
    e.preventDefault(); // firefox
    e.returnValue = ''; // Chrome
});

function doculibInitialize(){
    const tbody = document.querySelector('#tbody');
    let previousCell = null;
    tbody.addEventListener('click', function(e){
        // let fields be editable
        if(e.target.getAttribute('data-editable')){
            if(!previousCell){
                e.target.setAttribute('contenteditable', true);
                previousCell = e.target;
            }else if(previousCell != e.target){
                previousCell.setAttribute('contenteditable', false);
                e.target.setAttribute('contenteditable', true);
                previousCell = e.target;
            }
        }else if(e.target.getAttribute('auto-edit')){
            alert('自動提取自「出版日期」欄位，請由「出版日期」修改')
        }
        // collapse or expand details
        if(e.target.nodeName == 'BUTTON'){
            console.log('click')
            document.getElementById(e.target.value).classList.toggle("hide");
        }
    })
}

function toggleMenu(){
    let menuBtn = document.getElementById("sidebarToggle");
    if(menuBtn.innerHTML === '<i class="fas fa-chevron-left"></i>') {
      menuBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    }else{
        menuBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    }
  }
// Right Click Sidebar - contextMenu
// Two functions: edit foldername and delete folder
$(function(){
    $.contextMenu({
        selector: '.context-menu-one', 
        items: {
            "edit": {name: "Edit", icon: "edit", 
                callback: function(){
                    $('#editFolderModal').modal('show');
                    oldFolderName = $(this).text().split('(')[0].trim();
                }
            },
            "delete": {name: "Delete", icon: "delete", 
                callback: function(){
                    let delFolder = $(this).text().split('(')[0].trim();
                    trArray = getTrArray(delFolder);
                    if(trArray.length > 0){
                        if(confirm(delFolder + "內存有書目，請確定是否刪除")){
                            folder.splice(folder.indexOf(delFolder), 1);
                            trArray.forEach(function(item){
                                let index = data[item].doculib.folder.indexOf(delFolder);
                                data[item].doculib.folder.splice(index, 1);
                                // doculib.folder: removed
                                // doculib.topic, socialTagging, important: still stored
                            });
                        }
                    }else{
                        folder.splice(folder.indexOf(delFolder), 1);
                    }
                    renderFolder();
                    renderData('全部書目');
                    alert(delFolder + " 已刪除，回到全部書目列表");
                }
            }  
        }
    });
});

// render folderlist in addBibModal
function renderFolderList(){
    let checkboxHtml = ''
    if(folder.length > 0){
        folder.forEach(function(folderName){
            checkboxHtml += `<input type="checkbox" name="importFolder" value="${folderName}"> ${folderName}<br>`
        })
        $('#u_folder_p').html('匯入資料夾<br>' + checkboxHtml)
    }else{
        $('#u_folder_p').html('')
    }
}

function renderFolder(){
    counter = getCounter();
    const folderList = document.querySelector('#folderList');
    const allCount = document.querySelector('#allCount');
    const trashCount = document.querySelector('#trashCount');
    allCount.textContent = counter["全部書目"];
    trashCount.textContent = counter["垃圾桶"];
    let folderListContent = "";
    folder.forEach(function(folderName){
        folderListContent += `<a class="context-menu-one list-group-item list-group-item-action list-group-item-light p-3" onclick="renderData('${folderName}')"><i class="fas fa-folder fa-lg"></i> ${folderName}(<span>${counter[folderName]}</span>)</a>
        <a id="edit${folderName}" class="list-group-item list-group-item-action list-group-item-light p-3 hide"><input id="new${folderName}" type="text" size=15 placeholder="新資料夾名稱"> <button class="btn btn-light" onclick="checkEditFolder('${folderName}');">修改</button></a>`;
    });
    folderList.innerHTML = folderListContent;
}
function getCounter(){
    let countArr = [...folder];
    countArr.push("全部書目", "垃圾桶");
    for(let i=0; i<countArr.length; i++){
        let result = data.filter(el => el.doculib.folder.includes(countArr[i]))
        counter[countArr[i]] = result.length
    }
    return counter
}

function getTrArray(foldername){
    trArray = [];
    data.forEach(function(item, index){
        if(item.doculib.folder.includes(foldername)){
            trArray.push(index);
        }
    });
    return trArray
}
function renderData(foldername){
    currentFolder = foldername;
    const folderID = document.querySelector('#folderID');
    folderID.textContent = foldername;    

    const tbody = document.querySelector('#tbody');
    const selectAll = document.querySelector('#selectAll');
    selectAll.checked = false;
    
    let content = "";
    data.forEach(function(item, index){
        if(item.doculib.folder.includes(foldername)){

            const folderSelector = document.querySelector('#folderSelector');
            let folderOption = "<option value=''>請選擇欲加入的資料夾</option>";
            folder.forEach(function(folderItem){
                folderOption += `<option value='${folderItem}'>${folderItem}</option>`;
            })
            folderSelector.innerHTML = folderOption;

            let folderContent = ""
            for(let i=0; i<item.doculib.folder.length; i++){
                if(item.doculib.folder[i]=="全部書目"){
                    continue;
                }
                folderContent += item.doculib.folder[i] + "; ";
            }

            let readOption = "";
            let readSelected;
            let readStatus = ["未閱讀", "閱讀中", "已閱讀"];
            readStatus.forEach(function(readItem){
                if(item.doculib.read==readItem){
                    readSelected = "selected";
                }else{
                    readSelected = "";
                }
                readOption += `<option value='${readItem}' ${readSelected}>${readItem}</option>`;
            })
            let importantChecked;
            if(item.doculib.important[foldername]=="重要"){
                importantChecked = "checked";
            }

            // 核心欄位 & 使用者加值欄位
            // Metatags: author, keyword, topic, social tagging, doctypes, docclass
            content += `
                <tr id="${index}">
                    <td><input type="checkbox" name='c' value="${index}"></td>
                    <td data-editable="true">${item.title}</td>
                    <td data-editable="true">${arrToStr(item.xml_metadata.Udef_author)}</td>
                    <td auto-edit="true">${item.xml_metadata.Udef_publish_date.substring(0,4)}</td>
                    <td data-editable="true">${item.xml_metadata.Udef_compilation_name.text}</td>
                    <td data-editable="true">${arrToStr(item.xml_metadata.Udef_keywords)}</td>
                    <td data-editable="true" class="folderLevel">${arrToStr(item.doculib.topic[foldername])}</td>
                    <td data-editable="true" class="folderLevel">${arrToStr(item.doculib.socialTagging[foldername])}</td>
                    <td data-editable="true" class="folderLevel"><input type="checkbox" name='important' value="重要" ${importantChecked}></td>
                    <td class="folderLevel-hide">${folderContent}</td>
                    <td>
                    <select>
                        ${readOption}
                    <select>
                    </td>
                    <td><a class="btn btn-light" data-bs-toggle="modal" data-bs-target="#noteModal" id='noteBtn' onclick="renderNoteData('${index}')">edit</a>
                    </td>
                    <td><button class="btn btn-light" value="hiddenRow_${index}">+</button></td>
                </tr>
                <tr class="hide" id="hiddenRow_${index}">
                    <td></td>
                    <td colspan="14">`;
            // 共同欄位
            content += `<p>卷期 / 頁次：<input type="text" value='${item.xml_metadata.Udef_compilation_vol}; ${item.xml_metadata.Udef_compilation_page}'></p>`;
            content += `<p>出版者：<input type="text" value='${item.xml_metadata.Udef_publisher.text}'></p>`;
            content += `<p>出版日期：<input type="text" value='${item.xml_metadata.Udef_publish_date}'></p>`;
            content += `<p>出版地：<input type="text" value='${item.xml_metadata.Udef_publisher_location}'></p>`;
            content += `<p>ISSN/ISBN/ISRC：<input type="text" value='${item.xml_metadata.Udef_book_code}'</p>`;
            content += `<p>資料類型：<input type="text" value='${arrToStr(item.xml_metadata.Udef_doctypes)}'</p>`;
            content += `<p>語言：<input type="text" value='${arrToStr(item.xml_metadata.Udef_biliography_language)}'</p>`;
            content += `<p>摘要：<br><textarea rows="4">${item.doc_content.Paragraph}</textarea></p>`;
            content += `<p>目次：<br><textarea rows="4">${item.xml_metadata.Udef_tablecontent}</textarea></p>`;
            // 共同欄位－網址
            content += `<details><summary class="mb-3">網址</summary>`;
            if(Object.keys(item.xml_metadata.Udef_author1).length>0){
                content += `<p>作者1網址：<input type="text" id="author1_a_${index}" value='${item.xml_metadata.Udef_author1.a}'></p>`;
            }
            if(Object.keys(item.xml_metadata.Udef_author2).length>0){
                content += `<p>作者2網址：<input type="text" id="author2_a_${index}" value='${item.xml_metadata.Udef_author2.a}'></p>`;
            }
            if(Object.keys(item.xml_metadata.Udef_author3).length>0){
                content += `<p>作者3網址：<input type="text" id="author3_a_${index}" value='${item.xml_metadata.Udef_author3.a}'></p>`;
            }
            if(Object.keys(item.xml_metadata.Udef_author4).length>0){
                content += `<p>作者4網址：<input type="text" id="author4_a_${index}" value='${item.xml_metadata.Udef_author4.a}'></p>`;
            }
            if(Object.keys(item.xml_metadata.Udef_author5).length>0){
                content += `<p>作者5網址：<input type="text" id="author5_a_${index}" value='${item.xml_metadata.Udef_author5.a}'></p>`;
            }
            if(Object.keys(item.xml_metadata.Udef_author6).length>0){
                content += `<p>作者6網址：<input type="text" id="author6_a_${index}" value='${item.xml_metadata.Udef_author6.a}'></p>`;
            }
            if(item.filename.includes('DLBS')){
                content += `<p>出處題名網址：<input type="text" id="compilation_name_a_${index}" value='${item.xml_metadata.Udef_compilation_name.a}'></p>`;
                content += `<p>出版者網址：<input type="text" id="publisher_a_${index}" value='${item.xml_metadata.Udef_publisher.a}'></p>`;
            }
            if(item.xml_metadata.Udef_fulltextSrc.a!=""){
                content += `<p>全文網址：<input type="text" id="fulltextSrc_${index}" value='${item.xml_metadata.Udef_fulltextSrc.a}'</p>`;
            }
            else{
                content += `<p>全文網址：<input type="text" id="fulltextSrc_${index}" value='${item.xml_metadata.Udef_fulltextSrc.text}'</p>`;
            }
            if(item.xml_metadata.Udef_doi.a!=""){
                content += `<p>DOI：<input type="text" id="doi_${index}" value='${item.xml_metadata.Udef_doi.a}'></p></details>`;
            }
            else{
                content += `<p>DOI：<input type="text" id="doi_${index}" value='${item.xml_metadata.Udef_doi.text}'></p></details>`;
            }
            // 輔助欄位
            if(item.xml_metadata.Udef_seriesname!="" || item.xml_metadata.Udef_seriessubsidiary!="" || item.xml_metadata.Udef_seriesno!="" || item.xml_metadata.Udef_remark!="" || item.xml_metadata.Udef_remarkcontent!="" || item.xml_metadata.Udef_edition!="" || item.xml_metadata.Udef_category!="" || item.xml_metadata.Udef_period!="" || item.xml_metadata.Udef_area!="" || item.xml_metadata.Udef_place!="" || item.xml_metadata.Udef_institution!="" || item.xml_metadata.Udef_department!="" || item.xml_metadata.Udef_publicationyear!="" || item.xml_metadata.Udef_degree!=""){
                content += `<details><summary class="mb-3">輔助欄位</summary>`;
                // 叢書
                if(item.xml_metadata.Udef_seriesname!=""){
                    content += `<p>叢書名：<input type="text" id="seriesname_${index}" value='${item.xml_metadata.Udef_seriesname}'></p>`;
                }if(item.xml_metadata.Udef_seriessubsidiary!=""){
                    content += `<p>附屬叢書：<input type="text" id="seriessubsidiary_${index}" value='${item.xml_metadata.Udef_seriessubsidiary}'></p>`;
                }if(item.xml_metadata.Udef_seriesno!=""){
                    content += `<p>叢書號：<input type="text" id="seriesno_${index}" value='${item.xml_metadata.Udef_seriesno}'></p>`;
                }
                // 藝術資料庫
                if(item.xml_metadata.Udef_category!=""){
                    content += `<p>研究類別：<input type="text" id="category_${index}" value='${item.xml_metadata.Udef_category}'></p>`;
                }if(item.xml_metadata.Udef_period!=""){
                    content += `<p>研究時代：<input type="text" id="period_${index}" value='${item.xml_metadata.Udef_period}'></p>`;
                }if(item.xml_metadata.Udef_area!=""){
                    content += `<p>研究地區：<input type="text" id="area_${index}" value='${item.xml_metadata.Udef_area}'></p>`;
                }if(item.xml_metadata.Udef_place!=""){
                    content += `<p>研究地點：<input type="text" id="place_${index}" value='${item.xml_metadata.Udef_place}'></p>`;
                }
                // 碩博士論文
                if(item.xml_metadata.Udef_institution!=""){
                    content += `<p>校院名稱：<input type="text" id="institution_${index}" value='${item.xml_metadata.Udef_institution}'></p>`;
                }if(item.xml_metadata.Udef_department!=""){
                    content += `<p>系所名稱：<input type="text" id="department_${index}" value='${item.xml_metadata.Udef_department}'></p>`;
                }if(item.xml_metadata.Udef_publicationyear!=""){
                    content += `<p>畢業年度：<input type="text" id="publicationyear_${index}" value='${item.xml_metadata.Udef_publicationyear}'></p>`;
                }if(item.xml_metadata.Udef_degree!=""){
                    content += `<p>學位類別：<input type="text"id="degree_${index}" value='${item.xml_metadata.Udef_degree}'></p>`;
                }
                // 內容
                if(item.xml_metadata.Udef_edition!=""){
                    content += `<p>版本項：<input type="text" id="edition_${index}" value='${item.xml_metadata.Udef_edition}'></p>`;
                }if(item.xml_metadata.Udef_remark!=""){
                    content += `<p>附註項：<input type="text" id="remark_${index}" value='${item.xml_metadata.Udef_remark}'></p>`;
                }if(item.xml_metadata.Udef_remarkcontent!=""){
                    content += `<p>內容註：<input type="text" id="remarkcontent_${index}" value='${item.xml_metadata.Udef_remarkcontent}'></p>`;
                }
                content += `</details>`;
            }
            content += `</td></tr>`;
        }
    })
    tbody.innerHTML = content;
    const delBtn = document.querySelector('#delBtn');
    const folderLevels = document.getElementsByClassName('folderLevel');
    const folderLevelsHide = document.getElementsByClassName('folderLevel-hide');
    if(foldername == "全部書目" || foldername == "垃圾桶"){
        for (let i=0; i<folderLevels.length; i++) {
            folderLevels[i].classList.add('hide');
        }
        for (let i=0; i<folderLevelsHide.length; i++) {
            if(folderLevelsHide[i].classList.contains('hide')){
                folderLevelsHide[i].classList.remove('hide');
            }
        }
        delBtn.textContent = "Delete";
        folderSelector.style.display = 'inline';
    }
    else{
        for (let i=0; i<folderLevels.length; i++) {
            folderLevels[i].classList.remove('hide');
        }
        for (let i=0; i<folderLevelsHide.length; i++) {
            folderLevelsHide[i].classList.add('hide');
        }
        delBtn.textContent = "Move Out";
        folderSelector.style.display = 'none';
    }
    // show the difference between data and trArray
    // console.log(data)
    // console.log(trArray)
}
function renderNoteData(index){
    document.getElementById('noteId').value = index
    document.getElementById('noteTitle').innerHTML = "筆記 ─ " + data[index].title
    document.getElementById('noteContent').value = data[index].doculib.note 
}