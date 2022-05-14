let username = "";
let _docuSkyObj = null;

function docuWidgetInitialize(){
	_docuSkyObj = docuskyManageDbListSimpleUI;
    _docuSkyObj.getUserProfile(null, getUsername);

	// remove default DocuSky login widget
    let removeWidgetLogin  = function(){
        if($("#DbList_loginContainer_0").is(':visible')){
            $("#DbList_loginContainer_0").hide();
            $('#loginModal').modal('show');
        }
      }
    setInterval(removeWidgetLogin, 100);

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
}
function loginFailFunc(){
    alert("帳號或密碼錯誤");
    $("#password").val("");
}
function logout(){
    _docuSkyObj.logout();
    location.reload();
}
function getUsername(userData){
    username = userData.username;
    getUSerJsonFile()
}

function getUSerJsonFile(){
    console.log('Func: '+username)
}

// upload DocuXML to DocuSky directly
function uploadXML(){
    jsonToDocuXML();
	_docuSkyObj.manageDbList(null, uploadXML2DocuSky);
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
    saveAs(blob, currentFolder+".xml");
	alert("上傳失敗，已將 DocuXML 下載至本機");
}
function now(){
	let date = (new Date()).getFullYear()+"."+(new Date()).getMonth()+"."+(new Date()).getDate();
	let hour = (new Date()).getHours();
	let minute = (new Date()).getMinutes();
	let second = (new Date()).getSeconds();
    return `${date}_${hour}.${minute}.${second}`;
}