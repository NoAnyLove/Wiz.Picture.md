(function () {
    var objApp = WizExplorerApp;
    var objWindow = objApp.Window;

    function getString(id) {
        var pluginPath = objApp.GetPluginPathByScriptFileName("MdPicGlobal.js");
        var languageFileName = pluginPath + "plugin.ini";
        var strLanguage;
        try {
            var strLanguage = objApp.LoadStringFromFile(languageFileName, id);
        } catch (e) {
            alert(e);
        }
        return strLanguage
    }

    //
    try {
        var pluginPath = objApp.GetPluginPathByScriptFileName("MdPicGlobal.js");
        var pagePath = pluginPath + "download.htm";
        var initParam = 3; // select documents and download all picture attachments
        var strCaption = getString("btnDownloadAllPicture");
        objWindow.ShowHtmlDialogEx(false, strCaption, pagePath, 850, 500, "", initParam, function (ret) {});
    } catch (e) {
        alert(e);
    }

})();