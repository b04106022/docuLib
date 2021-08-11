let data = [];
let folder = [];
let trArray = [];
let currentFolder = "全部書目";
let counter = {}
axios.get('https://b04106022.github.io/docuLib/data.json')
    .then(function (response) {
        data = response.data[0];
        folder = response.data[1];
        renderData('全部書目');
        renderFolder();

        const tbody = document.querySelector('tbody');
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
            }
            // collapse or expand details
            if(e.target.nodeName=='BUTTON'){
                document.getElementById(e.target.value).classList.toggle("hide");
            }
        });
    })
    .catch(function (error) {
        console.log(error);
    })

// Right Click Sidebar - contextMenu
$(function() {
    $.contextMenu({
        selector: '.context-menu-one', 
        items: {
            "edit": {name: "Edit", icon: "edit", 
                callback: function() {
                    let oldFolder = $(this).text().split('(')[0].trim();
                    document.querySelector('#edit'+oldFolder).classList.toggle('hide')
                }
            },
            "delete": {name: "Delete", icon: "delete", 
                callback: function() {
                    let delFolder = $(this).text().split('(')[0].trim();
                    renderData(delFolder);
                    if(trArray.length>0){
                        if(confirm(delFolder+"內存有書目，請確定是否刪除")){
                            folder.splice(folder.indexOf(delFolder), 1);
                            trArray.forEach(function(item){
                                data[item].folder = ["垃圾桶"];
                            });
                        }
                    }else{
                        folder.splice(folder.indexOf(delFolder), 1);
                    }
                    renderFolder();
                    renderData('全部書目');
                    alert(delFolder+"已刪除，回到全部書目列表");
                }
            }  
        }
    });
});

function renderData(foldername){
    const folderID = document.querySelector('#folderID');
    folderID.textContent = foldername;    
    
    const tbody = document.querySelector('tbody');
    const selectAll = document.querySelector('#selectAll');
    selectAll.checked=false;
    let content = "";
    trArray = [];
    data.forEach(function(item, index){
        if(item.folder.includes(foldername)){
            trArray.push(index);

            let folderOption = "";
            let selected, trashSelected;
            folder.forEach(function(folderItem){
                if(item.folder[1]==folderItem){
                    selected = "selected";
                }else{
                    selected = "";
                }
                if(item.folder.length==1){
                    trashSelected = "selected";
                }else{
                    trashSelected = "";
                }
                folderOption += `<option value='${folderItem}' ${selected}>${folderItem}</option>`;
            })
            folderOption += `<option value='垃圾桶' ${trashSelected}>垃圾桶</option>`;  

            // 核心欄位 & 使用者加值欄位
            content += `
                <tr id="${index}">
                    <td><input type="checkbox" name='c' value="${index}"></td>
                    <td data-editable="true">${item.title}</td>
                    <td data-editable="true">${item.xml_metadata.Udef_author}</td>
                    <td data-editable="true">${item.year_for_grouping}</td>
                    <td data-editable="true">${item.xml_metadata.Udef_compilation_name.text}</td>
                    <td data-editable="true">${item.xml_metadata.Udef_keywords}</td>
                    <td data-editable="true"></td>
                    <td data-editable="true"></td>
                    <td data-editable="true"></td>
                    <td data-editable="true"></td>
                    <td data-editable="true"><input type="checkbox" name='important' value="important"></td>
                    <td>
                        <select>
                            <option value='未閱讀'>未閱讀</option>
                            <option value='閱讀中'>閱讀中</option>
                            <option value='已閱讀'>已閱讀</option>
                        <select>
                    </td>
                    <td>
                        <select>
                            ${folderOption}
                        <select>
                    </td>
                    <td data-editable="true"></td>
                    <td><button class="btn btn-light" value="hiddenRow_${index}">+</button></td>
                </tr>
                <tr class="hide" id="hiddenRow_${index}">
                    <td></td>
                    <td colspan="14">`;
            // 共同欄位
            content += `<p>卷期 / 頁次：<input type="text" value='${item.xml_metadata.Udef_compilation_vol_page}'></p>`;
            content += `<p>出版者：<input type="text" value='${item.xml_metadata.Udef_publisher.text}'></p>`;
            content += `<p>出版日期：<input type="text" value='${item.time_orig_str}'></p>`;
            content += `<p>出版地：<input type="text" value='${item.xml_metadata.Udef_publisher_location}'></p>`;
            content += `<p>ISSN/ISBN/ISRC：<input type="text" value='${item.xml_metadata.Udef_book_code}'</p>`;
            content += `<p>資料類型：<input type="text" value='${item.doc_content.MetaTags.Udef_doctype}'</p>`;
            content += `<p>語言：<input type="text" value='${item.doc_content.MetaTags.Udef_docclass}'</p>`;
            if(item.doc_content.Paragraph!=""){
                content += `<p>摘要：<br><textarea rows="4">${item.doc_content.Paragraph}</textarea></p>`;
            }
            else{
                content += `<p>摘要：<br><textarea rows="4">無摘要</textarea></p>`;
            }
            if(item.xml_metadata.Udef_tablecontent!=""){
                content += `<p>目次：<br><textarea rows="4">${item.xml_metadata.Udef_tablecontent}</textarea></p>`;
            }
            else{
                content += `<p>目次：<br><textarea rows="4">無目次</textarea></p>`;
            }
            // 共同欄位－網址
            content += `<details><summary class="mb-3">網址</summary>`;
            if(item.xml_metadata.Udef_author1!=""){
                content += `<p>作者1網址：<input type="text" id="author1_a_${index}" value='${item.xml_metadata.Udef_author1.a}'></p>`;
            }
            if(item.xml_metadata.Udef_author2!=""){
                content += `<p>作者2網址：<input type="text" id="author2_a_${index}" value='${item.xml_metadata.Udef_author2.a}'></p>`;
            }
            if(item.xml_metadata.Udef_author3!=""){
                content += `<p>作者3網址：<input type="text" id="author3_a_${index}" value='${item.xml_metadata.Udef_author3.a}'></p>`;
            }
            if(item.xml_metadata.Udef_author4!=""){
                content += `<p>作者4網址：<input type="text" id="author4_a_${index}" value='${item.xml_metadata.Udef_author4.a}'></p>`;
            }
            if(item.xml_metadata.Udef_author5!=""){
                content += `<p>作者5網址：<input type="text" id="author5_a_${index}" value='${item.xml_metadata.Udef_author5.a}'></p>`;
            }
            if(item.xml_metadata.Udef_author6!=""){
                content += `<p>作者6網址：<input type="text" id="author6_a_${index}" value='${item.xml_metadata.Udef_author6.a}'></p>`;
            }
            content += `<p>出處題名網址：<input type="text" id="compilation_name_a_${index}" value='${item.xml_metadata.Udef_compilation_name.a}'></p>`;
            content += `<p>出版者網址：<input type="text" id="publisher_a_${index}" value='${item.xml_metadata.Udef_publisher.a}'></p>`;
            if(item.xml_metadata.Udef_fulltextSrc.a!=""){
                content += `<p>全文網址：<input type="text" id="fulltextSrc_a_${index}" value='${item.xml_metadata.Udef_fulltextSrc.a}'</p>`;
            }
            else{
                content += `<p>全文網址：<input type="text" id="fulltextSrc_text_${index}" value='${item.xml_metadata.Udef_fulltextSrc.text}'</p>`;
            }
            if(item.xml_metadata.Udef_doi!=""){
                content += `<p>DOI：<input type="text" id="doi_${index}" value='${item.xml_metadata.Udef_doi}'></p></details>`;
            }
            else{
                content += `<p>DOI：<input type="text" id="doi_${index}" value='無DOI'></p></details>`;
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
    currentFolder = foldername;
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
        <a id="edit${folderName}" class="list-group-item list-group-item-action list-group-item-light p-3 hide"><input id="new${folderName}" type="text" size=15 placeholder="新資料夾名稱"><button class="btn btn-light" onclick="checkEditFolder('${folderName}');">修改</button></a>`;
    });
    folderList.innerHTML = folderListContent;
}
function getCounter(){
    let src = currentFolder;
    renderData("全部書目");
    counter["全部書目"] = trArray.length;
    renderData("垃圾桶");
    counter["垃圾桶"] = trArray.length;
    folder.forEach(function(item){
        renderData(item);
        counter[item] = trArray.length;
    });
    renderData(src);
    return counter
}

function deleteData(){
    saveToJson();
    let checkedboxArray = getCheckedboxArray();
    if(currentFolder=="垃圾桶"){
        if(confirm("刪除後將無法復原，請確定是否刪除")){
            checkedboxArray.reverse().forEach(function(item){
                data.splice(item, 1);
            })
        }
        alert('刪除成功');
    }else{
        if(checkedboxArray.length>0){
            checkedboxArray.forEach(function(item){
                data[item].folder = ['垃圾桶'];
            })
        }else{
            alert("請選取欲操作的書目");
        }
    }
    renderData(currentFolder);
    renderFolder();
}
function copyData(){
    saveToJson();
    let checkedboxArray = getCheckedboxArray();
    if(checkedboxArray.length>0){
        checkedboxArray.forEach(function(item){
            let obj = deepClone(data[item]);
            data.push(obj);
        })
    }else{
        alert("請選取欲操作的書目");
    }
    renderData(currentFolder);
    renderFolder();
}
function deepClone(obj){
    let copy = {};
    for (let attr in obj) {
          copy[attr] = obj[attr];
    }
    return copy;
}

const folderInput = document.querySelector('#folderInput');
function addFolder(){
    folderInput.classList.toggle('hide');
}
function checkFolder(){
    const folderName = document.querySelector('#folderName');
    if(folderName.value==''){
        alert("請輸入資料夾名稱")
    }else if(folder.includes(folderName.value)){
        alert("資料夾 "+folderName.value+" 已存在")
    }else{
        folder.push(folderName.value);
        alert(folderName.value + " 新建成功");
        folderName.value='';
        folderInput.classList.add('hide');
        renderFolder();
        renderData(currentFolder);
    }
}
function checkEditFolder(oldName){
    const newName = document.getElementById('new'+oldName);
    const editFolder = document.getElementById('edit'+oldName);
    if(newName.value==''){
        alert("請輸入資料夾名稱")
    }else if(folder.includes(newName.value)){
        alert("資料夾 "+newName.value+" 已存在")
    }else{
        folder[folder.indexOf(oldName)] = newName.value;
        renderData(oldName);
        trArray.forEach(function(item){
            data[item].folder[data[item].folder.indexOf(oldName)] = newName.value;
        });
        alert("資料夾 "+newName.value+" 修改成功");
        renderData(currentFolder);
        renderFolder();
        newName.value='';
        editFolder.classList.add('hide');
    }
}

function check_all(obj,cName){
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

function saveToJson(){
    trArray.forEach(function(item){
        let tr1 = document.getElementById(item);
        let tr2 = document.getElementById("hiddenRow_"+item);
        // 核心欄位
        data[item].title = tr1.children[1].textContent;
        data[item].xml_metadata.Udef_author = tr1.children[2].textContent;
        data[item].year_for_grouping = tr1.children[3].textContent;
        data[item].xml_metadata.Udef_compilation_name.text = tr1.children[4].textContent;
        data[item].xml_metadata.Udef_keywords = tr1.children[5].textContent;
        // 使用者加值欄位
        // data[item] = tr1.children[6].textContent;
        // data[item] = tr1.children[7].textContent;
        // data[item] = tr1.children[8].textContent;
        // data[item] = tr1.children[9].textContent;
        // data[item] = tr1.children[10].textContent;
        // data[item] = tr1.chridren[11].firstChild.value
        if(tr1.children[12].firstElementChild.value=="垃圾桶"){
            data[item].folder = ["垃圾桶"];
        }else{
            data[item].folder = ["全部書目", tr1.children[12].firstElementChild.value];
        }
        // console.log(data[item].title, data[item].folder)
        // data[item] = tr1.children[13].textContent;
        // 共同欄位
        data[item].xml_metadata.Udef_compilation_vol_page = tr2.children[1].children[0].firstElementChild.value;
        data[item].xml_metadata.Udef_publisher.text = tr2.children[1].children[1].firstElementChild.value;
        data[item].time_orig_str = tr2.children[1].children[2].firstElementChild.value;
        data[item].xml_metadata.Udef_publisher_location = tr2.children[1].children[3].firstElementChild.value;
        data[item].xml_metadata.Udef_Udef_book_code = tr2.children[1].children[4].firstElementChild.value;
        data[item].doc_content.MetaTags.Udef_doctype = tr2.children[1].children[5].firstElementChild.value;
        data[item].doc_content.MetaTags.Udef_docclass = tr2.children[1].children[6].firstElementChild.value;
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
        if(document.getElementById("fulltextSrc_a_"+item)!=null){
            data[item].xml_metadata.Udef_fulltextSrc.a = document.getElementById("fulltextSrc_a_"+item).value;
        }
        if(document.getElementById("fulltextSrc_text_"+item)!=null){
            // 預設填入網址
            if(document.getElementById("fulltextSrc_text_"+item).value=="無全文"){
                data[item].xml_metadata.Udef_fulltextSrc.a = "";
                data[item].xml_metadata.Udef_fulltextSrc.text = "無全文";
            }else{
                data[item].xml_metadata.Udef_fulltextSrc.a = document.getElementById("fulltextSrc_text_"+item).value;
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
        }if(document.getElementById("doi_"+item)!=null){
            data[item].xml_metadata.Udef_doi = document.getElementById("doi_"+item).value;
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
    // let json = [data, folder];
    // let link = document.createElement('a');
    // let blob = new Blob([JSON.stringify(json)], {type:""});
    // let url = URL.createObjectURL(blob);
    // link.href = url;
    // link.setAttribute('download', 'matadata.json');
    // link.click();
}

function jsonToCsv(){
    saveToJson();
    let checkedboxArray = getCheckedboxArray()
    if(checkedboxArray.length==0){
        checkedboxArray = trArray;
    }
    // header
    let csvContent = `文獻題名,作者,出版年,出處題名,關鍵字,主題分類一,主題分類二,主題分類三,主題詞,Social Tagging,重要度,筆記,評註,卷期 / 頁次,出版者,出版日期,出版地,ISSN/ISBN/ISRC,資料類型,語言,摘要,目次,作者1網址,作者2網址,作者3網址,作者4網址,作者5網址,作者6網址,出處題名網址,出版者網址,全文網址,叢書名,附屬叢書,叢書號,研究類別,研究時代,研究地區,研究地點,校院名稱,系所名稱,畢業年度,學位類別,DOI,版本項,附註項,內容項\r\n`;
    checkedboxArray.forEach(function(item){
        // content
        let row = [data[item].title, data[item].xml_metadata.Udef_author, data[item].year_for_grouping, data[item].xml_metadata.Udef_compilation_name.text, data[item].xml_metadata.Udef_keywords, 
                    "", "", "", "", "", "", "", "", 
                    data[item].xml_metadata.Udef_compilation_vol_page, data[item].xml_metadata.Udef_publisher.text, data[item].time_orig_str, data[item].xml_metadata.Udef_publisher_location, data[item].xml_metadata.Udef_Udef_book_code, data[item].doc_content.MetaTags.Udef_doctype, data[item].doc_content.MetaTags.Udef_docclass, data[item].doc_content.Paragraph, data[item].xml_metadata.Udef_tablecontent, 
                    data[item].xml_metadata.Udef_author1.a, data[item].xml_metadata.Udef_author2.a, data[item].xml_metadata.Udef_author3.a, data[item].xml_metadata.Udef_author4.a, data[item].xml_metadata.Udef_author5.a, data[item].xml_metadata.Udef_author6.a, data[item].xml_metadata.Udef_compilation_name.a, data[item].xml_metadata.Udef_publisher.a, data[item].xml_metadata.Udef_fulltextSrc.a,
                    data[item].xml_metadata.Udef_seriesname, data[item].xml_metadata.Udef_seriessubsidiary, data[item].xml_metadata.Udef_seriesno, data[item].xml_metadata.Udef_category, data[item].xml_metadata.Udef_period, data[item].xml_metadata.Udef_area, data[item].xml_metadata.Udef_place, data[item].xml_metadata.Udef_institution, data[item].xml_metadata.Udef_department, data[item].xml_metadata.Udef_publicationyear, data[item].xml_metadata.Udef_degree, data[item].xml_metadata.Udef_doi, data[item].xml_metadata.Udef_edition, data[item].xml_metadata.Udef_remark, data[item].xml_metadata.Udef_remarkcontent];
        row.forEach(function(cell){
            if(cell!=undefined){
                cell = cell.replaceAll(',', ' ');
                cell = cell.replaceAll('\n', ' ');
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
    link.setAttribute('download', 'matadata.csv');
    link.click();
}

function jsonToDocuXML(){
    saveToJson();
    let checkedboxArray = getCheckedboxArray()
    if(checkedboxArray.length==0){
        checkedboxArray = trArray;
    }
    let xmlContent = 
`<ThdlPrototypeExport>
<corpus name="${currentFolder}">
<metadata_field_settings>
<compilation_name show_spotlight="Y" display_order="999">compilation_name</compilation_name>
<year_for_grouping show_spotlight="Y" display_order="999">year_for_grouping</year_for_grouping>
<geo_level1 show_spotlight="Y" display_order="999">geo_level1</geo_level1>
<geo_level2 show_spotlight="Y" display_order="999">geo_level2</geo_level2>
<geo_level3 show_spotlight="Y" display_order="999">geo_level3</geo_level3>
<doctype show_spotlight="Y" display_order="999">doctype</doctype>
<docclass show_spotlight="Y" display_order="999">docclass</docclass>
<book_code show_spotlight="Y" display_order="999">book_code</book_code>
<doc_source show_spotlight="Y" display_order="999">doc_source</doc_source>
</metadata_field_settings>
<feature_analysis>
<spotlight category="Udef_author" sub_category="-" display_order="1" title="作者"/>
<tag type="contentTagging" name="Udef_author" default_category="Udef_author" default_sub_category="-"/>
<spotlight category="Udef_keywords" sub_category="-" display_order="2" title="關鍵字"/>
<tag type="contentTagging" name="Udef_keywords" default_category="Udef_keywords" default_sub_category="-"/>
<spotlight category="Udef_docclass" sub_category="-" display_order="3" title="語言"/>
<tag type="contentTagging" name="Udef_docclass" default_category="Udef_docclass" default_sub_category="-"/>
<spotlight category="Udef_doctype" sub_category="-" display_order="4" title="資料類型"/>
<tag type="contentTagging" name="Udef_doctype" default_category="Udef_doctype" default_sub_category="-"/>
</feature_analysis>
</corpus>
<documents>`;
    checkedboxArray.forEach(function(item){
        xmlContent += `
<document filename="${data[item].filename}">
<corpus>${currentFolder}</corpus>
<title>${data[item].title}</title>
<compilation_name>${data[item].compilation_name}</compilation_name>
<compilation_vol>${data[item].compilation_vol}</compilation_vol>
<time_orig_str>${data[item].time_orig_str}</time_orig_str>
<year_for_grouping>${data[item].year_for_grouping}</year_for_grouping>
<geo_level1>${data[item].geo_level1}</geo_level1>
<geo_level2>${data[item].geo_level2}</geo_level2>
<geo_level3>${data[item].geo_level3}</geo_level3>
<doctype>${data[item].doctype}</doctype>
<docclass>${data[item].docclass}</docclass>
<book_code>${data[item].book_code}</book_code>
<doc_source>${data[item].doc_source}</doc_source>
<xml_metadata>
<Udef_author>${data[item].xml_metadata.Udef_author}</Udef_author>
<Udef_doctypes>${data[item].xml_metadata.Udef_doctypes}</Udef_doctypes>
<Udef_biliography_language>${data[item].xml_metadata.Udef_biliography_language}</Udef_biliography_language>`;
        // Udef_author1 - Udef_author6
        if(data[item].xml_metadata.Udef_author1!=""){
            if(data[item].xml_metadata.Udef_author1.a!=""){
                xmlContent += `
<Udef_author1>
<a href="${data[item].xml_metadata.Udef_author1.a}" target="_blank">${data[item].xml_metadata.Udef_author1.text}</a>
</Udef_author1>`;}
            else{
                xmlContent += `
<Udef_author1>${data[item].xml_metadata.Udef_author1.text}</Udef_author1>`;}}
        if(data[item].xml_metadata.Udef_author2!=""){
            if(data[item].xml_metadata.Udef_author2.a!=""){
                xmlContent += `
<Udef_author2>
<a href="${data[item].xml_metadata.Udef_author2.a}" target="_blank">${data[item].xml_metadata.Udef_author2.text}</a>
</Udef_author2>`;}
            else{
                xmlContent += `
<Udef_author2>${data[item].xml_metadata.Udef_author2.text}</Udef_author2>`;}}
        if(data[item].xml_metadata.Udef_author3!=""){
            if(data[item].xml_metadata.Udef_author3.a!=""){
                xmlContent += `
<Udef_author3>
<a href="${data[item].xml_metadata.Udef_author3.a}" target="_blank">${data[item].xml_metadata.Udef_author3.text}</a>
</Udef_author3>`;}
            else{
                xmlContent += `
<Udef_author3>${data[item].xml_metadata.Udef_author3.text}</Udef_author3>`;}}
        if(data[item].xml_metadata.Udef_author4!=""){
            if(data[item].xml_metadata.Udef_author4.a!=""){
                xmlContent += `
<Udef_author4>
<a href="${data[item].xml_metadata.Udef_author4.a}" target="_blank">${data[item].xml_metadata.Udef_author4.text}</a>
</Udef_author4>`;}
            else{
                xmlContent += `
<Udef_author4>${data[item].xml_metadata.Udef_author4.text}</Udef_author4>`;}}
        if(data[item].xml_metadata.Udef_author5!=""){
            if(data[item].xml_metadata.Udef_author5.a!=""){
                xmlContent += `
<Udef_author5>
<a href="${data[item].xml_metadata.Udef_author5.a}" target="_blank">${data[item].xml_metadata.Udef_author5.text}</a>
</Udef_author5>`;}
            else{
                xmlContent += `
<Udef_author5>${data[item].xml_metadata.Udef_author5.text}</Udef_author5>`;}}
        if(data[item].xml_metadata.Udef_author6!=""){
            if(data[item].xml_metadata.Udef_author6.a!=""){
                xmlContent += `
<Udef_author6>
<a href="${data[item].xml_metadata.Udef_author6.a}" target="_blank">${data[item].xml_metadata.Udef_author6.text}</a>
</Udef_author6>`;}
            else{
                xmlContent += `
<Udef_author6>${data[item].xml_metadata.Udef_author6.text}</Udef_author6>`;}}
                // compilation
        if(data[item].xml_metadata.Udef_compilation_name.a!=""){
            xmlContent += `
<Udef_compilation_name>
<a href="${data[item].xml_metadata.Udef_compilation_name.a}" target="_blank">${data[item].xml_metadata.Udef_compilation_name.text}</a>
</Udef_compilation_name>`;}
        else{
            xmlContent += `
<Udef_compilation_name>${data[item].xml_metadata.Udef_compilation_name.text}</Udef_compilation_name>`;}
        if(data[item].xml_metadata.Udef_compilation_vol_page!=""){
            xmlContent += `
<Udef_compilation_vol_page>${data[item].xml_metadata.Udef_compilation_vol_page}</Udef_compilation_vol_page>`;}
        // publisher
        if(data[item].xml_metadata.Udef_publisher.a!=""){
            xmlContent += `
<Udef_publisher>
<a href="${data[item].xml_metadata.Udef_publisher.a}" target="_blank">${data[item].xml_metadata.Udef_publisher.text}</a>
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
        if(data[item].xml_metadata.Udef_keywords!=""){
            xmlContent += `
<Udef_keywords>${data[item].xml_metadata.Udef_keywords}</Udef_keywords>`;}
        // URL
        if(data[item].xml_metadata.Udef_fulltextSrc.a!=""){
            xmlContent += `
<Udef_fulltextSrc>
<a href="${data[item].xml_metadata.Udef_fulltextSrc.a}" target="_blank">全文網址</a>
</Udef_fulltextSrc>`;}
        else{
            xmlContent += `
<Udef_fulltextSrc>無全文</Udef_fulltextSrc>`;}
        if(data[item].xml_metadata.Udef_doi!="無DOI"){
            xmlContent += `
<Udef_doi>
<a href="${data[item].xml_metadata.Udef_doi}" target="_blank">DOI</a>
</Udef_doi>`;}
            xmlContent += `
<Udef_refSrc>
<a href="${data[item].xml_metadata.Udef_refSrc.a}" target="_blank">原書目網址</a>
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
        if(data[item].xml_metadata.Udef_area!=""){
            xmlContent += `
<Udef_area>${data[item].xml_metadata.Udef_area}</Udef_area>`;}
        if(data[item].xml_metadata.Udef_place!=""){
            xmlContent += `
<Udef_place>${data[item].xml_metadata.Udef_place}</Udef_place>`;}
        // 碩博士論文
        if(data[item].xml_metadata.Udef_institution!=""){
            xmlContent += `
<Udef_institution>${data[item].xml_metadata.Udef_institution}</Udef_institution>`;}
        if(data[item].xml_metadata.Udef_department!=""){
            xmlContent += `
<Udef_department>${data[item].xml_metadata.Udef_department}</Udef_department>`;}
        if(data[item].xml_metadata.Udef_publicationyear!=""){
            xmlContent += `
<Udef_publicationyear>${data[item].xml_metadata.Udef_publicationyear}</Udef_publicationyear>`;}
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
<MetaTags>`;
        if(Array.isArray(data[item].doc_content.MetaTags.Udef_author)){
            let authorTags = "";
            for(i=0; i<data[item].doc_content.MetaTags.Udef_author.length; i++){
                authorTags += `
<Udef_author>${data[item].doc_content.MetaTags.Udef_author[i]}</Udef_author>`;       
            }
            xmlContent += authorTags;
        }else{
            xmlContent += `
<Udef_author>${data[item].doc_content.MetaTags.Udef_author}</Udef_author>`;
        }
        if(Array.isArray(data[item].doc_content.MetaTags.Udef_keywords)){
            let keywordTags = "";
            for(i=0; i<data[item].doc_content.MetaTags.Udef_keywords.length; i++){
                keywordTags += `
<Udef_keywords>${data[item].doc_content.MetaTags.Udef_keywords[i]}</Udef_keywords>`;       
            }
            xmlContent += keywordTags;
        }else{
            xmlContent += `
<Udef_keywords>${data[item].doc_content.MetaTags.Udef_keywords}</Udef_keywords>`;
        }
        if(Array.isArray(data[item].doc_content.MetaTags.Udef_doctype)){
            let doctypeTags = "";
            for(i=0; i<data[item].doc_content.MetaTags.Udef_doctype.length; i++){
                doctypeTags += `
<Udef_doctype>${data[item].doc_content.MetaTags.Udef_doctype[i]}</Udef_doctype>`;       
            }
            xmlContent += doctypeTags;
        }else{
            xmlContent += `
<Udef_doctype>${data[item].doc_content.MetaTags.Udef_doctype}</Udef_doctype>`;
        }
        if(Array.isArray(data[item].doc_content.MetaTags.Udef_docclass)){
            let docclassTags = "";
            for(i=0; i<data[item].doc_content.MetaTags.Udef_docclass.length; i++){
                docclassTags += `
<Udef_docclass>${data[item].doc_content.MetaTags.Udef_docclass[i]}</Udef_docclass>`;       
            }
            xmlContent += docclassTags;
        }else{
            xmlContent += `
<Udef_docclass>${data[item].doc_content.MetaTags.Udef_docclass}</Udef_docclass>`;
        }
        xmlContent += `
</MetaTags>
</doc_content>
</document>`;
    });
    xmlContent += `
</documents>
</ThdlPrototypeExport>`;
    // using FileSaver
    let blob = new Blob([xmlContent], {type: "text/xml;charset=utf-8"});
    saveAs(blob, "corpus.xml");
}