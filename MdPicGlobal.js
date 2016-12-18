 var objApp = WizExplorerApp;
 var objWindow = objApp.Window;

 /**
  * Brought from Wiz.Editor.md (https://github.com/akof1314/Wiz.Editor.md)
  * and slightly modified
  */
 function isMarkdown(title) {

     if (!title)
         return false;
     if (-1 != title.indexOf(".md "))
         return true;
     if (-1 != title.indexOf(".md@"))
         return true;
     if (title.match(/\.md$/i))
         return true;
     return false;
 }

 function isPicture(name) {
     if (name.match(/\.(jpg|jpeg|jpe|jfif|png|gif|bmp|dib|tif|tiff|psd|svg|ai|eps|ps|cur|ico)$/)) {
         return true;
     } else {
         return false;
     }
 }

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

 function inject_js() {
     var pluginPath = objApp.GetPluginPathByScriptFileName("MdPicGlobal.js");
     var scriptFile = pluginPath + "MdPicInject.js";
     var objBrowser = objWindow.CurrentDocumentBrowserObject;
     objBrowser.ExecuteScriptFile(scriptFile, function (ret) {
         objBrowser.ExecuteFunction2("MdPic_init", objApp, objBrowser, function (ret) {});
     });
 }

 function MdPicOnDocumentComplete(doc) {
     // Since doc parameter doesn't contain the document title after Wiz 4.5,
     // we need use objWindow.CurrentDocument to obtain the title
     var objDocument = objWindow.CurrentDocument;
     //        alert(objDocument.Title);
     if (isMarkdown(objDocument.Title)) {
         console.log(`${objDocument.Title} is markdown`);
         inject_js();
     }
 }

 function addButtons() {
     var btnDownloadAll = getString("btnDownloadAll");
     var btnDownloadAllPicture = getString("btnDownloadAllPicture");
     objWindow.AddToolButton("document", "MdPicDownloadAll", btnDownloadAll, "", "OnMdPicDownloadAllButtonCliked");
     objWindow.AddToolButton("document", "MdPicDownloadAllPicture", btnDownloadAllPicture, "", "OnMdPicDownloadAllPictureButtonCliked");
 }

 function OnMdPicDownloadAllButtonCliked() {
     console.log("OnMdPicDownloadAllButtonCliked");
     var objDocument = objWindow.CurrentDocument;
     var objAttachments = objDocument.Attachments;
     var allDownloaded = true;
     try {
         for (var i = 0; i < objAttachments.Count; i++) {
             var attachment = objAttachments.Item(i);
             if (attachment.CheckAttachmentData(objWindow.HWND)) {
                 console.log(`${attachment.Name} is already downloaded`);
             } else {
                 allDownloaded = false;
                 console.log(`${attachment.Name} isn't downloaded`);
             }
         }
     } catch (e) {
         alert(e);
     }
     var strAllDownloaded = getString("strAllDownloaded");
     if (allDownloaded) {
         alert(strAllDownloaded);
     }
 }

 function OnMdPicDownloadAllPictureButtonCliked() {
     console.log("OnMdPicDownloadAllPictureButtonCliked");
     var objDocument = objWindow.CurrentDocument;
     var objAttachments = objDocument.Attachments;
     var allDownloaded = true;
     for (var i = 0; i < objAttachments.Count; i++) {
         var attachment = objAttachments.Item(i);
         if (isPicture(attachment.Name)) {
             if (attachment.CheckAttachmentData(objWindow.HWND)) {
                 console.log(`${attachment.Name} is already downloaded`);
             } else {
                 allDownloaded = false;
                 console.log(`${attachment.Name} isn't downloaded`);
             }
         } else {
             console.log(`${attachment.Name} is NOT picture`);
         }
     }
     var strAllPictureDownloaded = getString("strAllPictureDownloaded");
     if (allDownloaded) {
         alert(strAllPictureDownloaded);
     }
 }

 function main() {
     addButtons();
     if (eventsHtmlDocumentComplete) {
         eventsHtmlDocumentComplete.add(MdPicOnDocumentComplete);
     }
 }

 main();