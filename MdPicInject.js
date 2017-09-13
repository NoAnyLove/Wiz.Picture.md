var objMdPicApp;
var objMdPicPluginBrowser;
var MdPic_config_autodownload;

function MdPic_init(app, pluginBrowser) {
    console.log("MdPic_init");
    if (!app || !pluginBrowser)
        return;
    objMdPicApp = app;
    objMdPicPluginBrowser = pluginBrowser;
    MdPic_config_autodownload = MdPic_ReadConfig("AutoDownloadPicture") == "1";
    var attachments = MdPic_get_attachments();

    /*
     * In Wiz 4.9.x, the plugin is been called after the Markdown page is rendered,
     * thus the MutationObserver will not be triggered. We try to replace the image
     * when plugin is loaded.
     */
    if (document.readyState == "complete") {
        MdPic_update_img(attachments);
    }

    /*
     * Before Wiz 4.9.x:
     *
     * Wiz Markdown Rendering doesn't offer a callback when rendering is complete.
     * So we use MutationObserver to monitor the rendering process.
     */
    var observer = new MutationObserver(function (mutations) {
        console.log('MutationObserver');
        console.log(mutations);
        MdPic_update_img(attachments);
    });

    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(document.body, config);
}

function MdPic_get_attachments() {
    var objWindow = objMdPicApp.Window;
    var objDocument = objWindow.CurrentDocument;
    var objAttachments = objDocument.Attachments;
    var attachments = {};
    for (var i = 0; i < objAttachments.Count; i++) {
        var objAttachment = objAttachments.Item(i);
        attachments[objAttachment.Name] = objAttachment;
    }
    return attachments;
}

function MdPic_update_img(attachments) {
    console.log("MdPic_update_img");
    var images = document.getElementsByTagName('img');
    try {
        for (var i = 0; i < images.length; i++) {
            var name = decodeURIComponent(images[i].src.replace("http://wiz/", ""));
            if (name in attachments) {
                // if AutoDownloadPicture=1, make sure this picture attachment is downloaded
                if (MdPic_config_autodownload) {
                    attachments[name].CheckAttachmentData(objMdPicApp.Window.HWND);
                }
                images[i].src = attachments[name].FileName;
                console.debug(`Replacing ${name} with ${attachments[name].FileName}`);
            }
        }
    } catch (e) {
        alert(e);
    }
}

function MdPic_ReadConfig(key) {
    var pluginPath = objMdPicApp.GetPluginPathByScriptFileName("MdPicGlobal.js");
    var iniFile = pluginPath + "plugin.ini";
    var objCommon = objMdPicApp.CreateWizObject("WizKMControls.WizCommonUI");
    var value = objCommon.GetValueFromIni(iniFile, 'Config', key)
    return value;
}
