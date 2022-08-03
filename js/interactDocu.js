let username = "";
let _docuSkyObj = null;

function docuWidgetInitialize(){
	_docuSkyObj = docuskyManageDbListSimpleUI;
    _docuSkyObj.getUserProfile(null, getUsername);

	// remove default DocuSky login widget
    let removeWidgetLogin  = function(){
        if($("#DbList_loginContainer_0").is(':visible')){
            $("#DbList_loginContainer_0").hide();    
        }
    }
    setInterval(removeWidgetLogin, 100);
    $('#loginModal').modal('show');

    $("#manageDbList").click(function(e) {
        _docuSkyObj.manageDbList(e);
    });
}
function login(){
    _docuSkyObj.login($("#username").val(), $("#password").val(), loginSuccFunc, loginFailFunc);
}
function loginSuccFunc(){
    alert("登入成功");
    $('#loginModal').modal('hide');
    _docuSkyObj.getUserProfile(null, getUsername);
	_docuSkyObj.manageDbList(null, uploadXML2DocuSky);
    $('#logoutDiv').removeClass('hide');
}
function loginFailFunc(){
    alert("帳號或密碼錯誤");
    $("#password").val("");
}
function logout(){
    _docuSkyObj.logout();
    username = '';
    $('#logoutDiv').addClass('hide');
    renderData('全部書目')
}
function getUsername(userData){
    username = userData.username;
}

// upload DocuXML to DocuSky directly
function uploadXML(){
    jsonToDocuXML();
    if(username == ''){
        docuWidgetInitialize();
    }else{
	    _docuSkyObj.manageDbList(null, uploadXML2DocuSky);
    }
}
function uploadXML2DocuSky(){
	_docuSkyObj.hideWidget();

	var dbTitle = 'DB-' + now();
	var formData = { 
		dummy: {
			name: 'dbTitleForImport', 
			value: dbTitle 
		}, 
		file: {
			value: _xml, 
			filename: dbTitle + '.xml', 
			name: 'importedFiles[]'
		}
	};
	_docuSkyObj.uploadMultipart(formData, succUploadFunc, failUploadFunc);
}
function succUploadFunc(){
	alert("已成功上傳檔案至 DocuSky");
    window.open('https://docusky.org.tw/DocuSky/docuTools/userMain/index.html')
}
function failUploadFunc(){
    // using FileSaver
    let blob = new Blob([_xml], {type: "text/xml;charset=utf-8"});
    saveAs(blob, currentFolder  + '_' + now() + ".xml");
	alert("上傳失敗，已將 DocuXML 下載至本機");
}
function now(){
    let year = (new Date()).getFullYear();
    let month = parseInt((new Date()).getMonth())+1;
    let date = (new Date()).getDate();
    let ymd = `${year}.${month}.${date}`;
    
    let hour = (new Date()).getHours();
	let minute = (new Date()).getMinutes();
	let second = (new Date()).getSeconds();
    return `${ymd}_${hour}.${minute}.${second}`;
}