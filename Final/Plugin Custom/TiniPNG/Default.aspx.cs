using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TinifyAPI;
public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    private async void UploadTiniPng(FileUpload fileupload)
    {
        Tinify.Key = "Djg5SZd_oGhYqe5wR4mqoyP-uvyyVaUI";
        // Luu File goc
        foreach (HttpPostedFile postedFile in fileupload.PostedFiles)
        {
            string namefile = postedFile.FileName;
            string fileName = Path.GetFileName(postedFile.FileName);
            postedFile.SaveAs(Server.MapPath("~/Uploads/") + fileName);
            //Nen File
            var source = Tinify.FromFile(Server.MapPath("~/Uploads/" + namefile));
            await source.ToFile(Server.MapPath("~/Uploads/" + namefile));
        }
       
    }
    private async void ConvertResizeTiniPng(FileUpload fileupload, int _height,int _width)
    {
        Tinify.Key = "Djg5SZd_oGhYqe5wR4mqoyP-uvyyVaUI";
        // Luu File goc
        HttpPostedFile files = fileupload.PostedFile;
        string namefile = files.FileName;
        files.SaveAs(Server.MapPath("~/Upload/") + namefile);
        
        //Resize File
        var source = Tinify.FromFile(Server.MapPath("~/Upload/" + namefile));
        var resized = source.Resize(new
        {
            method = "fit",
            width = _width,
            height = _height
        });
        await resized.ToFile(Server.MapPath("~/Upload/" + namefile));
    }
   

    protected void btnSave_Click(object sender, EventArgs e)
    {
        UploadTiniPng(fUp);
    }
}