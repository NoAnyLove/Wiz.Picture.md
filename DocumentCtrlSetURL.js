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
        // initialize internationalized string
        var strNoSelectedDocuments = getString('strNoSelectedDocuments');
        var strSelectOnlyOne = getString('strSelectOnlyOne');
        var strSetDocumentURL = getString('strSetDocumentURL');
        var strSetURLHint1 = getString('strSetURLHint1');
        var strSetURLHint2 = getString('strSetURLHint2');
        //
        var objDocumentsCtrl = objWindow.DocumentsCtrl;
        var objCommonUI = objApp.CreateWizObject('WizKMControls.WizCommonUI');
        var objSelectedDocuments = objDocumentsCtrl.SelectedDocuments;
        if (objSelectedDocuments.Count == 0) {
            alert(strNoSelectedDocuments);
            return;
        } else if (objSelectedDocuments.Count != 1) {
            alert(strSelectOnlyOne);
            return;
        }

        var objDocument = objDocumentsCtrl.SelectedDocuments.Item(0);
        var strURL = objDocument.URL;
        var newURL = objCommonUI.InputBox(strSetDocumentURL, strSetURLHint1, strURL).trim();
        if (strURL.length != 0 && newURL.length == 0) {
            alert(strSetURLHint2);
            return;
        }
        objDocument.URL = newURL;
    } catch (e) {
        alert(e);
    }

})();