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
        content += `<tr>
            <td><input type="checkbox" name='c'></td>
            <td data-editable="true">${item.title}</td>
            <td data-editable="true">${item.doc_content.MetaTags.Udef_author}</td>
            <td data-editable="true">${item.year_for_grouping}</td>
            <td data-editable="true">${item.compilation_name}</td>
            <td data-editable="true">${item.doc_content.MetaTags.Udef_keywords}</td>
            <td data-editable="true"></td>
            <td data-editable="true"></td>
            <td><button value="hiddenRow_${item.filename}">+</button></td>
            </tr>
            <tr class="hide" id="hiddenRow_${item.filename}">
            <td colspan="9">
                摘要：<br><textarea cols="145" rows="5">${item.doc_content.Paragraph}</textarea>
            </td>
            </tr>`;
    })
    tbody.innerHTML = content;
}