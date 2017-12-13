using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SampleReCaptchaApplication
{
    public partial class _Default : System.Web.UI.Page
    {
        GoogleReCaptcha.GoogleReCaptcha ctrlGoogleReCaptcha = new GoogleReCaptcha.GoogleReCaptcha();
        protected override void CreateChildControls()
        {
            base.CreateChildControls();
            ctrlGoogleReCaptcha.PublicKey = "6LfVDgMTAAAAAJnH9GV0i7r_Pl3FfC_hyfh2Cgnq";
            ctrlGoogleReCaptcha.PrivateKey = "6LfVDgMTAAAAAPfTlH1n7z72CvS46c2C_qkTmFsZ";
            this.Panel1.Controls.Add(ctrlGoogleReCaptcha);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            btn.Click += new EventHandler(btn_Click);
            //btn2.Click += new EventHandler(btn2_Click);
        }

        //void btn2_Click(object sender, EventArgs e)
        //{
        //    if (ctrlGoogleReCaptcha2.Validate())
        //    {
        //        //submit form
        //        lbl2.Text = "Success 2";
        //    }
        //    else
        //    {
        //        lbl2.Text = "Captcha 2 Failed!! Please try again!!";
        //    }
        //}

        protected void btn_Click(object sender, EventArgs e)
        {
            if (ctrlGoogleReCaptcha.Validate())
            {
                //submit form
                lblStatus.Text = "Success";
            }
            else
            {
                lblStatus.Text = "Captcha Failed!! Please try again!!";
            }
        }
    }
}
