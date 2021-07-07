let data = [];
axios.get('https://b04106022.github.io/docuLib/data.json')
    .then(function (response) {
        data = response.data;
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
    
function check_all(obj,cName){
    let checkboxs = document.getElementsByName(cName);
    for(let i=0; i<checkboxs.length; i++){
        checkboxs[i].checked = obj.checked;
    }
}

function renderData(){
    const tbody = document.querySelector('tbody');
    let content="";
    data.forEach(function(item){
        // 核心欄位 & 使用者加值欄位
        content += `<tr>
            <td><input type="checkbox" name='c' size="10"></td>
            <td data-editable="true">${item.title}</td>
            <td data-editable="true">${item.doc_content.MetaTags.Udef_author}</td>
            <td data-editable="true">${item.year_for_grouping}</td>
            <td data-editable="true">${item.compilation_name}</td>
            <td data-editable="true">${item.xml_metadata.Udef_keywords}</td>
            <td data-editable="true"></td>
            <td data-editable="true"></td>
            <td data-editable="true"></td>
            <td data-editable="true"></td>
            <td data-editable="true"></td>
            <td><input type="number" min="1" max="5" step="1" value="3"></td>
            <td data-editable="true"></td>
            <td data-editable="true"></td>
            <td><button class="btn btn-light" value="hiddenRow_${item.filename}">+</button></td>
            </tr>
            <tr class="hide" id="hiddenRow_${item.filename}">
            <td></td>
            <td colspan="14">`;
        // 共同欄位
        if(item.xml_metadata.Udef_author1!=""){
            content += `<p>作者1網址：<input type="text" value='${item.xml_metadata.Udef_author1.a}'></p>`;
        }
        if(item.xml_metadata.Udef_author2!=""){
            content += `<p>作者2網址：<input type="text" value='${item.xml_metadata.Udef_author2.a}'></p>`;
        }
        if(item.xml_metadata.Udef_author3!=""){
            content += `<p>作者3網址：<input type="text" value='${item.xml_metadata.Udef_author3.a}'></p>`;
        }
        if(item.xml_metadata.Udef_author4!=""){
            content += `<p>作者4網址：<input type="text" value='${item.xml_metadata.Udef_author4.a}'></p>`;
        }
        if(item.xml_metadata.Udef_author5!=""){
            content += `<p>作者5網址：<input type="text" value='${item.xml_metadata.Udef_author5.a}'></p>`;
        }
        if(item.xml_metadata.Udef_author6!=""){
            content += `<p>作者6網址：<input type="text" value='${item.xml_metadata.Udef_author6.a}'></p>`;
        }
        content += `<p>出處題名網址：<input type="text" value='${item.xml_metadata.Udef_compilation_name.a}'></p>`;
        content += `<p>卷期 / 頁次：<input type="text" value='${item.xml_metadata.Udef_compilation_vol_page}'></p>`;
        content += `<p>出版者：<input type="text" value='${item.xml_metadata.Udef_publisher.text}'></p>`;
        content += `<p>出版者網址：<input type="text" value='${item.xml_metadata.Udef_publisher.a}'></p>`;
        content += `<p>出版日期：<input type="text" value='${item.time_orig_str}'></p>`;
        content += `<p>出版地：<input type="text" value='${item.xml_metadata.Udef_publisher_location}'></p>`;
        content += `<p>ISSN/ISBN/ISRC：<input type="text" value='${item.xml_metadata.Udef_book_code}'</p>`;
        content += `<p>資料類型：<input type="text" value='${item.doc_content.MetaTags.Udef_doctype}'</p>`;
        content += `<p>語言：<input type="text" value='${item.doc_content.MetaTags.Udef_docclass}'</p>`;
        content += `<p>全文網址：<input type="text" value='${item.xml_metadata.Udef_fulltextSrc.a}'</p>`;
        content += `<p>摘要：<br><textarea rows="4">${item.doc_content.Paragraph}</textarea></p>`;
        // 輔助欄位

        content += `</td></tr>`;
    })
    tbody.innerHTML = content;
}