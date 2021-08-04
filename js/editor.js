let data = [];
let trArray = [];
axios.get('https://b04106022.github.io/docuLib/data.json')
    .then(function (response) {
        data = response.data[0];
        folder = response.data[1];
        renderData();

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
    

function renderData(){
    const tbody = document.querySelector('tbody');
    let content="";
    data.forEach(function(item){
        trArray.push(item.filename);
        // 核心欄位 & 使用者加值欄位
        content += `
            <tr id="${item.filename}">
                <td><input type="checkbox" name='c' value="${item.filename}"></td>
                <td data-editable="true">${item.title}</td>
                <td data-editable="true">${item.xml_metadata.Udef_author}</td>
                <td data-editable="true">${item.year_for_grouping}</td>
                <td data-editable="true">${item.xml_metadata.Udef_compilation_name.text}</td>
                <td data-editable="true">${item.xml_metadata.Udef_keywords}</td>
                <td data-editable="true"></td>
                <td data-editable="true"></td>
                <td data-editable="true"></td>
                <td data-editable="true"></td>
                <td>
                    <select>
                        <option>未閱讀</option>
                        <option>閱讀中</option>
                        <option>已閱讀</option>
                    <select>
                </td>
                <td data-editable="true"><input type="checkbox" name='important' value="important"></td>
                <td data-editable="true"></td>
                <td><button class="btn btn-light" value="hiddenRow_${item.filename}">+</button></td>
            </tr>
            <tr class="hide" id="hiddenRow_${item.filename}">
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
            content += `<p>作者1網址：<input type="text" id="author1_a_${item.filename}" value='${item.xml_metadata.Udef_author1.a}'></p>`;
        }
        if(item.xml_metadata.Udef_author2!=""){
            content += `<p>作者2網址：<input type="text" id="author2_a_${item.filename}" value='${item.xml_metadata.Udef_author2.a}'></p>`;
        }
        if(item.xml_metadata.Udef_author3!=""){
            content += `<p>作者3網址：<input type="text" id="author3_a_${item.filename}" value='${item.xml_metadata.Udef_author3.a}'></p>`;
        }
        if(item.xml_metadata.Udef_author4!=""){
            content += `<p>作者4網址：<input type="text" id="author4_a_${item.filename}" value='${item.xml_metadata.Udef_author4.a}'></p>`;
        }
        if(item.xml_metadata.Udef_author5!=""){
            content += `<p>作者5網址：<input type="text" id="author5_a_${item.filename}" value='${item.xml_metadata.Udef_author5.a}'></p>`;
        }
        if(item.xml_metadata.Udef_author6!=""){
            content += `<p>作者6網址：<input type="text" id="author6_a_${item.filename}" value='${item.xml_metadata.Udef_author6.a}'></p>`;
        }
        content += `<p>出處題名網址：<input type="text" id="compilation_name_a_${item.filename}" value='${item.xml_metadata.Udef_compilation_name.a}'></p>`;
        content += `<p>出版者網址：<input type="text" id="publisher_a_${item.filename}" value='${item.xml_metadata.Udef_publisher.a}'></p>`;
        if(item.xml_metadata.Udef_fulltextSrc.a!=""){
            content += `<p>全文網址：<input type="text" id="fulltextSrc_a_${item.filename}" value='${item.xml_metadata.Udef_fulltextSrc.a}'</p>`;
        }
        else{
            content += `<p>全文網址：<input type="text" id="fulltextSrc_text_${item.filename}" value='${item.xml_metadata.Udef_fulltextSrc.text}'</p>`;
        }
        if(item.xml_metadata.Udef_doi!=""){
            content += `<p>DOI：<input type="text" id="doi_${item.filename}" value='${item.xml_metadata.Udef_doi}'></p></details>`;
        }
        else{
            content += `<p>DOI：<input type="text" id="doi_${item.filename}" value='無DOI'></p></details>`;
        }
        // 輔助欄位
        if(item.xml_metadata.Udef_seriesname!="" || item.xml_metadata.Udef_seriessubsidiary!="" || item.xml_metadata.Udef_seriesno!="" || item.xml_metadata.Udef_remark!="" || item.xml_metadata.Udef_remarkcontent!="" || item.xml_metadata.Udef_edition!="" || item.xml_metadata.Udef_category!="" || item.xml_metadata.Udef_period!="" || item.xml_metadata.Udef_area!="" || item.xml_metadata.Udef_place!="" || item.xml_metadata.Udef_institution!="" || item.xml_metadata.Udef_department!="" || item.xml_metadata.Udef_publicationyear!="" || item.xml_metadata.Udef_degree!=""){
            content += `<details><summary class="mb-3">輔助欄位</summary>`;
            // 叢書
            if(item.xml_metadata.Udef_seriesname!=""){
                content += `<p>叢書名：<input type="text" id="seriesname_${item.filename}" value='${item.xml_metadata.Udef_seriesname}'></p>`;
            }if(item.xml_metadata.Udef_seriessubsidiary!=""){
                content += `<p>附屬叢書：<input type="text" id="seriessubsidiary_${item.filename}" value='${item.xml_metadata.Udef_seriessubsidiary}'></p>`;
            }if(item.xml_metadata.Udef_seriesno!=""){
                content += `<p>叢書號：<input type="text" id="seriesno_${item.filename}" value='${item.xml_metadata.Udef_seriesno}'></p>`;
            }
            // 藝術資料庫
            if(item.xml_metadata.Udef_category!=""){
                content += `<p>研究類別：<input type="text" id="category_${item.filename}" value='${item.xml_metadata.Udef_category}'></p>`;
            }if(item.xml_metadata.Udef_period!=""){
                content += `<p>研究時代：<input type="text" id="period_${item.filename}" value='${item.xml_metadata.Udef_period}'></p>`;
            }if(item.xml_metadata.Udef_area!=""){
                content += `<p>研究地區：<input type="text" id="area_${item.filename}" value='${item.xml_metadata.Udef_area}'></p>`;
            }if(item.xml_metadata.Udef_place!=""){
                content += `<p>研究地點：<input type="text" id="place_${item.filename}" value='${item.xml_metadata.Udef_place}'></p>`;
            }
            // 碩博士論文
            if(item.xml_metadata.Udef_institution!=""){
                content += `<p>校院名稱：<input type="text" id="institution_${item.filename}" value='${item.xml_metadata.Udef_institution}'></p>`;
            }if(item.xml_metadata.Udef_department!=""){
                content += `<p>系所名稱：<input type="text" id="department_${item.filename}" value='${item.xml_metadata.Udef_department}'></p>`;
            }if(item.xml_metadata.Udef_publicationyear!=""){
                content += `<p>畢業年度：<input type="text" id="publicationyear_${item.filename}" value='${item.xml_metadata.Udef_publicationyear}'></p>`;
            }if(item.xml_metadata.Udef_degree!=""){
                content += `<p>學位類別：<input type="text"id="degree_${item.filename}" value='${item.xml_metadata.Udef_degree}'></p>`;
            }
            // 內容
            if(item.xml_metadata.Udef_edition!=""){
                content += `<p>版本項：<input type="text" id="edition_${item.filename}" value='${item.xml_metadata.Udef_edition}'></p>`;
            }if(item.xml_metadata.Udef_remark!=""){
                content += `<p>附註項：<input type="text" id="remark_${item.filename}" value='${item.xml_metadata.Udef_remark}'></p>`;
            }if(item.xml_metadata.Udef_remarkcontent!=""){
                content += `<p>內容註：<input type="text" id="remarkcontent_${item.filename}" value='${item.xml_metadata.Udef_remarkcontent}'></p>`;
            }
            content += `</details>`;
        }
        content += `</td></tr>`;
    })
    tbody.innerHTML = content;
}

function addFolder(){
    alert("請輸入名稱");
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
        data.forEach(function(dataItem){
            if(dataItem.filename==item){
                // 核心欄位
                dataItem.title = tr1.children[1].textContent;
                dataItem.xml_metadata.Udef_author = tr1.children[2].textContent;
                dataItem.year_for_grouping = tr1.children[3].textContent;
                dataItem.xml_metadata.Udef_compilation_name.text = tr1.children[4].textContent;
                dataItem.xml_metadata.Udef_keywords = tr1.children[5].textContent;
                // 使用者加值欄位
                // dataItem.filename = tr1.children[6].textContent;
                // dataItem.filename = tr1.children[7].textContent;
                // dataItem.filename = tr1.children[8].textContent;
                // dataItem.filename = tr1.children[9].textContent;
                // dataItem.filename = tr1.children[10].textContent;
                // dataItem.filename = tr1.chridren[11].firstChild.value
                // dataItem.filename = tr1.children[12].textContent;
                // dataItem.filename = tr1.children[13].textContent;
                // 共同欄位
                dataItem.xml_metadata.Udef_compilation_vol_page = tr2.children[1].children[0].firstElementChild.value;
                dataItem.xml_metadata.Udef_publisher.text = tr2.children[1].children[1].firstElementChild.value;
                dataItem.time_orig_str = tr2.children[1].children[2].firstElementChild.value;
                dataItem.xml_metadata.Udef_publisher_location = tr2.children[1].children[3].firstElementChild.value;
                dataItem.xml_metadata.Udef_Udef_book_code = tr2.children[1].children[4].firstElementChild.value;
                dataItem.doc_content.MetaTags.Udef_doctype = tr2.children[1].children[5].firstElementChild.value;
                dataItem.doc_content.MetaTags.Udef_docclass = tr2.children[1].children[6].firstElementChild.value;
                dataItem.doc_content.Paragraph = tr2.children[1].children[7].lastElementChild.value;
                dataItem.xml_metadata.Udef_tablecontent = tr2.children[1].children[8].lastElementChild.value;
                // 共同欄位－網址
                if(document.getElementById("author1_a_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_author1.a = document.getElementById("author1_a_"+dataItem.filename).value;
                }
                if(document.getElementById("author2_a_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_author2.a = document.getElementById("author2_a_"+dataItem.filename).value;
                }
                if(document.getElementById("author3_a_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_author3.a = document.getElementById("author3_a_"+dataItem.filename).value;
                }
                if(document.getElementById("author4_a_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_author4.a = document.getElementById("author4_a_"+dataItem.filename).value;
                }
                if(document.getElementById("author5_a_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_author5.a = document.getElementById("author5_a_"+dataItem.filename).value;
                }
                if(document.getElementById("author6_a_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_author6.a = document.getElementById("author6_a_"+dataItem.filename).value;
                }
                if(document.getElementById("compilation_name_a_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_compilation_name.a = document.getElementById("compilation_name_a_"+dataItem.filename).value;
                }
                if(document.getElementById("publisher_a_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_publisher.a = document.getElementById("publisher_a_"+dataItem.filename).value;
                }
                if(document.getElementById("fulltextSrc_a_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_fulltextSrc.a = document.getElementById("fulltextSrc_a_"+dataItem.filename).value;
                }
                if(document.getElementById("fulltextSrc_text_"+dataItem.filename)!=null){
                    // 預設填入網址
                    if(document.getElementById("fulltextSrc_text_"+dataItem.filename).value=="無全文"){
                        dataItem.xml_metadata.Udef_fulltextSrc.a = "";
                        dataItem.xml_metadata.Udef_fulltextSrc.text = "無全文";
                    }else{
                        dataItem.xml_metadata.Udef_fulltextSrc.a = document.getElementById("fulltextSrc_text_"+dataItem.filename).value;
                    }
                }
                // 輔助欄位
                // 叢書
                if(document.getElementById("seriesname_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_seriesname = document.getElementById("seriesname_"+dataItem.filename).value;
                }if(document.getElementById("seriessubsidiary_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_seriessubsidiary = document.getElementById("seriessubsidiary_"+dataItem.filename).value;
                }if(document.getElementById("seriesno_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_seriesno = document.getElementById("seriesno_"+dataItem.filename).value;
                }
                // 藝術資料庫
                if(document.getElementById("category_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_category = document.getElementById("category_"+dataItem.filename).value;
                }if(document.getElementById("period_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_period = document.getElementById("period_"+dataItem.filename).value;
                }if(document.getElementById("area_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_area = document.getElementById("area_"+dataItem.filename).value;
                }if(document.getElementById("place_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_place = document.getElementById("place_"+dataItem.filename).value;
                }
                // 碩博士論文
                if(document.getElementById("institution_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_institution = document.getElementById("institution_"+dataItem.filename).value;
                }if(document.getElementById("department_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_department = document.getElementById("department_"+dataItem.filename).value;
                }if(document.getElementById("publicationyear_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_publicationyear = document.getElementById("publicationyear_"+dataItem.filename).value;
                }if(document.getElementById("degree_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_degree = document.getElementById("degree_"+dataItem.filename).value;
                }if(document.getElementById("doi_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_doi = document.getElementById("doi_"+dataItem.filename).value;
                }
                // 內容
                if(document.getElementById("edition_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_edition = document.getElementById("edition_"+dataItem.filename).value;
                }if(document.getElementById("remark_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_remark = document.getElementById("remark_"+dataItem.filename).value;
                }if(document.getElementById("remarkcontent_"+dataItem.filename)!=null){
                    dataItem.xml_metadata.Udef_remarkcontent = document.getElementById("remarkcontent_"+dataItem.filename).value;
                }
            }
        })
    })
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
        data.forEach(function(dataItem){
            if(dataItem.filename==item){
                let row = [dataItem.title, dataItem.xml_metadata.Udef_author, dataItem.year_for_grouping, dataItem.xml_metadata.Udef_compilation_name.text, dataItem.xml_metadata.Udef_keywords, 
                    "", "", "", "", "", "", "", "", 
                    dataItem.xml_metadata.Udef_compilation_vol_page, dataItem.xml_metadata.Udef_publisher.text, dataItem.time_orig_str, dataItem.xml_metadata.Udef_publisher_location, dataItem.xml_metadata.Udef_Udef_book_code, dataItem.doc_content.MetaTags.Udef_doctype, dataItem.doc_content.MetaTags.Udef_docclass, dataItem.doc_content.Paragraph, dataItem.xml_metadata.Udef_tablecontent, 
                    dataItem.xml_metadata.Udef_author1.a, dataItem.xml_metadata.Udef_author2.a, dataItem.xml_metadata.Udef_author3.a, dataItem.xml_metadata.Udef_author4.a, dataItem.xml_metadata.Udef_author5.a, dataItem.xml_metadata.Udef_author6.a, dataItem.xml_metadata.Udef_compilation_name.a, dataItem.xml_metadata.Udef_publisher.a, dataItem.xml_metadata.Udef_fulltextSrc.a,
                    dataItem.xml_metadata.Udef_seriesname, dataItem.xml_metadata.Udef_seriessubsidiary, dataItem.xml_metadata.Udef_seriesno, dataItem.xml_metadata.Udef_category, dataItem.xml_metadata.Udef_period, dataItem.xml_metadata.Udef_area, dataItem.xml_metadata.Udef_place, dataItem.xml_metadata.Udef_institution, dataItem.xml_metadata.Udef_department, dataItem.xml_metadata.Udef_publicationyear, dataItem.xml_metadata.Udef_degree, dataItem.xml_metadata.Udef_doi, dataItem.xml_metadata.Udef_edition, dataItem.xml_metadata.Udef_remark, dataItem.xml_metadata.Udef_remarkcontent];
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
            }
        })
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
    // corpus name need to be edited
    let xmlContent = 
`<ThdlPrototypeExport>
<corpus name="佛圖資料2">
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
        data.forEach(function(dataItem){
            if(dataItem.filename==item){
                // corpus name need to be edited
                xmlContent += `
<document filename="${dataItem.filename}">
<corpus>佛圖資料2</corpus>
<title>${dataItem.title}</title>
<compilation_name>${dataItem.compilation_name}</compilation_name>
<compilation_vol>${dataItem.compilation_vol}</compilation_vol>
<time_orig_str>${dataItem.time_orig_str}</time_orig_str>
<year_for_grouping>${dataItem.year_for_grouping}</year_for_grouping>
<geo_level1>${dataItem.geo_level1}</geo_level1>
<geo_level2>${dataItem.geo_level2}</geo_level2>
<geo_level3>${dataItem.geo_level3}</geo_level3>
<doctype>${dataItem.doctype}</doctype>
<docclass>${dataItem.docclass}</docclass>
<book_code>${dataItem.book_code}</book_code>
<doc_source>${dataItem.doc_source}</doc_source>
<xml_metadata>
<Udef_author>${dataItem.xml_metadata.Udef_author}</Udef_author>
<Udef_doctypes>${dataItem.xml_metadata.Udef_doctypes}</Udef_doctypes>
<Udef_biliography_language>${dataItem.xml_metadata.Udef_biliography_language}</Udef_biliography_language>`;
                // Udef_author1 - Udef_author6
                if(dataItem.xml_metadata.Udef_author1!=""){
                    if(dataItem.xml_metadata.Udef_author1.a!=""){
                        xmlContent += `
<Udef_author1>
<a href="${dataItem.xml_metadata.Udef_author1.a}" target="_blank">${dataItem.xml_metadata.Udef_author1.text}</a>
</Udef_author1>`;}
                    else{
                        xmlContent += `
<Udef_author1>${dataItem.xml_metadata.Udef_author1.text}</Udef_author1>`;}}
                if(dataItem.xml_metadata.Udef_author2!=""){
                    if(dataItem.xml_metadata.Udef_author2.a!=""){
                        xmlContent += `
<Udef_author2>
<a href="${dataItem.xml_metadata.Udef_author2.a}" target="_blank">${dataItem.xml_metadata.Udef_author2.text}</a>
</Udef_author2>`;}
                    else{
                        xmlContent += `
<Udef_author2>${dataItem.xml_metadata.Udef_author2.text}</Udef_author2>`;}}
                if(dataItem.xml_metadata.Udef_author3!=""){
                    if(dataItem.xml_metadata.Udef_author3.a!=""){
                        xmlContent += `
<Udef_author3>
<a href="${dataItem.xml_metadata.Udef_author3.a}" target="_blank">${dataItem.xml_metadata.Udef_author3.text}</a>
</Udef_author3>`;}
                    else{
                        xmlContent += `
<Udef_author3>${dataItem.xml_metadata.Udef_author3.text}</Udef_author3>`;}}
                if(dataItem.xml_metadata.Udef_author4!=""){
                    if(dataItem.xml_metadata.Udef_author4.a!=""){
                        xmlContent += `
<Udef_author4>
<a href="${dataItem.xml_metadata.Udef_author4.a}" target="_blank">${dataItem.xml_metadata.Udef_author4.text}</a>
</Udef_author4>`;}
                    else{
                        xmlContent += `
<Udef_author4>${dataItem.xml_metadata.Udef_author4.text}</Udef_author4>`;}}
                if(dataItem.xml_metadata.Udef_author5!=""){
                    if(dataItem.xml_metadata.Udef_author5.a!=""){
                        xmlContent += `
<Udef_author5>
<a href="${dataItem.xml_metadata.Udef_author5.a}" target="_blank">${dataItem.xml_metadata.Udef_author5.text}</a>
</Udef_author5>`;}
                    else{
                        xmlContent += `
<Udef_author5>${dataItem.xml_metadata.Udef_author5.text}</Udef_author5>`;}}
                if(dataItem.xml_metadata.Udef_author6!=""){
                    if(dataItem.xml_metadata.Udef_author6.a!=""){
                        xmlContent += `
<Udef_author6>
<a href="${dataItem.xml_metadata.Udef_author6.a}" target="_blank">${dataItem.xml_metadata.Udef_author6.text}</a>
</Udef_author6>`;}
                    else{
                        xmlContent += `
<Udef_author6>${dataItem.xml_metadata.Udef_author6.text}</Udef_author6>`;}}
                // compilation
                if(dataItem.xml_metadata.Udef_compilation_name.a!=""){
                    xmlContent += `
<Udef_compilation_name>
<a href="${dataItem.xml_metadata.Udef_compilation_name.a}" target="_blank">${dataItem.xml_metadata.Udef_compilation_name.text}</a>
</Udef_compilation_name>`;}
                else{
                    xmlContent += `
<Udef_compilation_name>${dataItem.xml_metadata.Udef_compilation_name.text}</Udef_compilation_name>`;}
                if(dataItem.xml_metadata.Udef_compilation_vol_page!=""){
                    xmlContent += `
<Udef_compilation_vol_page>${dataItem.xml_metadata.Udef_compilation_vol_page}</Udef_compilation_vol_page>`;}
                // publisher
                if(dataItem.xml_metadata.Udef_publisher.a!=""){
                    xmlContent += `
<Udef_publisher>
<a href="${dataItem.xml_metadata.Udef_publisher.a}" target="_blank">${dataItem.xml_metadata.Udef_publisher.text}</a>
</Udef_publisher>`;}
                else{
                    xmlContent += `
<Udef_publisher>${dataItem.xml_metadata.Udef_publisher.text}</Udef_publisher>`;}
                if(dataItem.xml_metadata.Udef_publish_date!=""){
                    xmlContent += `
<Udef_publish_date>${dataItem.xml_metadata.Udef_publish_date}</Udef_publish_date>`;}
                if(dataItem.xml_metadata.Udef_publisher_location!=""){
                    xmlContent += `
<Udef_publisher_location>${dataItem.xml_metadata.Udef_publisher_location}</Udef_publisher_location>`;}
                if(dataItem.xml_metadata.Udef_book_code!=""){
                    xmlContent += `
<Udef_book_code>${dataItem.xml_metadata.Udef_book_code}</Udef_book_code>`;}
                // content
                if(dataItem.xml_metadata.Udef_edition!=""){
                    xmlContent += `
<Udef_edition>${dataItem.xml_metadata.Udef_edition}</Udef_edition>`;}
                if(dataItem.xml_metadata.Udef_remark!=""){
                    xmlContent += `
<Udef_remark>${dataItem.xml_metadata.Udef_remark}</Udef_remark>`;}
                if(dataItem.xml_metadata.Udef_remarkcontent!=""){
                    xmlContent += `
<Udef_remarkcontent>${dataItem.xml_metadata.Udef_remarkcontent}</Udef_remarkcontent>`;}
                if(dataItem.xml_metadata.Udef_tablecontent!=""){
                    xmlContent += `
<Udef_tablecontent>${dataItem.xml_metadata.Udef_tablecontent}</Udef_tablecontent>`;}
                if(dataItem.xml_metadata.Udef_keywords!=""){
                    xmlContent += `
<Udef_keywords>${dataItem.xml_metadata.Udef_keywords}</Udef_keywords>`;}
                // URL
                if(dataItem.xml_metadata.Udef_fulltextSrc.a!=""){
                    xmlContent += `
<Udef_fulltextSrc>
<a href="${dataItem.xml_metadata.Udef_fulltextSrc.a}" target="_blank">全文網址</a>
</Udef_fulltextSrc>`;}
                else{
                    xmlContent += `
<Udef_fulltextSrc>無全文</Udef_fulltextSrc>`;}
                if(dataItem.xml_metadata.Udef_doi!="無DOI"){
                    xmlContent += `
<Udef_doi>
<a href="${dataItem.xml_metadata.Udef_doi}" target="_blank">DOI</a>
</Udef_doi>`;}
                    xmlContent += `
<Udef_refSrc>
<a href="${dataItem.xml_metadata.Udef_refSrc.a}" target="_blank">原書目網址</a>
</Udef_refSrc>`;
                // 叢書
                if(dataItem.xml_metadata.Udef_seriesname!=""){
                    xmlContent += `
<Udef_seriesname>${dataItem.xml_metadata.Udef_seriesname}</Udef_seriesname>`;}
                if(dataItem.xml_metadata.Udef_seriessubsidiary!=""){
                    xmlContent += `
<Udef_seriessubsidiary>${dataItem.xml_metadata.Udef_remark}</Udef_seriessubsidiary>`;}
                if(dataItem.xml_metadata.Udef_seriesno!=""){
                    xmlContent += `
<Udef_seriesno>${dataItem.xml_metadata.Udef_seriesno}</Udef_seriesno>`;}
                // 藝術資料庫
                if(dataItem.xml_metadata.Udef_category!=""){
                    xmlContent += `
<Udef_category>${dataItem.xml_metadata.Udef_category}</Udef_category>`;}
                if(dataItem.xml_metadata.Udef_period!=""){
                    xmlContent += `
<Udef_period>${dataItem.xml_metadata.Udef_period}</Udef_period>`;}
                if(dataItem.xml_metadata.Udef_area!=""){
                    xmlContent += `
<Udef_area>${dataItem.xml_metadata.Udef_area}</Udef_area>`;}
                if(dataItem.xml_metadata.Udef_place!=""){
                    xmlContent += `
<Udef_place>${dataItem.xml_metadata.Udef_place}</Udef_place>`;}
                // 碩博士論文
                if(dataItem.xml_metadata.Udef_institution!=""){
                    xmlContent += `
<Udef_institution>${dataItem.xml_metadata.Udef_institution}</Udef_institution>`;}
                if(dataItem.xml_metadata.Udef_department!=""){
                    xmlContent += `
<Udef_department>${dataItem.xml_metadata.Udef_department}</Udef_department>`;}
                if(dataItem.xml_metadata.Udef_publicationyear!=""){
                    xmlContent += `
<Udef_publicationyear>${dataItem.xml_metadata.Udef_publicationyear}</Udef_publicationyear>`;}
                if(dataItem.xml_metadata.Udef_degree!=""){
                    xmlContent += `
<Udef_degree>${dataItem.xml_metadata.Udef_degree}</Udef_degree>`;}
                xmlContent += `
</xml_metadata>
<doc_content>`;
                if(dataItem.doc_content.Paragraph!="無摘要"){
                    xmlContent += `
<Paragraph>${dataItem.doc_content.Paragraph}</Paragraph>`
                }
                xmlContent += `
<MetaTags>`;
                if(Array.isArray(dataItem.doc_content.MetaTags.Udef_author)){
                    let authorTags = "";
                    for(i=0; i<dataItem.doc_content.MetaTags.Udef_author.length; i++){
                        authorTags += `
<Udef_author>${dataItem.doc_content.MetaTags.Udef_author[i]}</Udef_author>`;       
                    }
                    xmlContent += authorTags;
                }else{
                    xmlContent += `
<Udef_author>${dataItem.doc_content.MetaTags.Udef_author}</Udef_author>`;
                }
                if(Array.isArray(dataItem.doc_content.MetaTags.Udef_keywords)){
                    let keywordTags = "";
                    for(i=0; i<dataItem.doc_content.MetaTags.Udef_keywords.length; i++){
                        keywordTags += `
<Udef_keywords>${dataItem.doc_content.MetaTags.Udef_keywords[i]}</Udef_keywords>`;       
                    }
                    xmlContent += keywordTags;
                }else{
                    xmlContent += `
<Udef_keywords>${dataItem.doc_content.MetaTags.Udef_keywords}</Udef_keywords>`;
                }
                if(Array.isArray(dataItem.doc_content.MetaTags.Udef_doctype)){
                    let doctypeTags = "";
                    for(i=0; i<dataItem.doc_content.MetaTags.Udef_doctype.length; i++){
                        doctypeTags += `
<Udef_doctype>${dataItem.doc_content.MetaTags.Udef_doctype[i]}</Udef_doctype>`;       
                    }
                    xmlContent += doctypeTags;
                }else{
                    xmlContent += `
<Udef_doctype>${dataItem.doc_content.MetaTags.Udef_doctype}</Udef_doctype>`;
                }
                if(Array.isArray(dataItem.doc_content.MetaTags.Udef_docclass)){
                    let docclassTags = "";
                    for(i=0; i<dataItem.doc_content.MetaTags.Udef_docclass.length; i++){
                        docclassTags += `
<Udef_docclass>${dataItem.doc_content.MetaTags.Udef_docclass[i]}</Udef_docclass>`;       
                    }
                    xmlContent += docclassTags;
                }else{
                    xmlContent += `
<Udef_docclass>${dataItem.doc_content.MetaTags.Udef_docclass}</Udef_docclass>`;
                }
                xmlContent += `
</MetaTags>
</doc_content>
</document>`;
            }
        });
    });
    xmlContent += `
</documents>
</ThdlPrototypeExport>`;
    // using FileSaver
    let blob = new Blob([xmlContent], {type: "text/xml;charset=utf-8"});
    saveAs(blob, "corpus.xml");
}