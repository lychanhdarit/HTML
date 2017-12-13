using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
            getData();
    }
    private void getData()
    {
        for (int i = 10; i < 41; i++)
        {
            ddlChuKy.Items.Insert(0, new ListItem(i.ToString() + " ngày", i.ToString()));
        }
    }
    protected void btnXem_Click(object sender, EventArgs e)
    {
        int SoNgayCK = ToSQL.SQLToInt(ddlChuKy.SelectedValue);
        int NgayRung = 0;
        DBClass _db = new DBClass();
        DataRow info = _db.sqlGetDataRow("select * from ChuKy where ChuKyKinh = " + SoNgayCK);
        if (info != null)
        {
            NgayRung = BaseView.GetIntFieldValue(info, "NgayRungTrung");
        }
        DateTime ngayKinhCuoi = ToSQL.SQLToDateTime(txtNgay.Text);

       

        DateTime ngayRungTrung = ngayKinhCuoi.AddDays(NgayRung);
        
        //Ngày rụng trứng
        ltKQ_NgayRungTrung.Text = "Ngày "+ngayRungTrung.Day +" Tháng "+ ngayRungTrung.Month+ " Năm "+ngayRungTrung.Year;
        
        //Ngày Thu Thai
        DateTime ngayBD_ThuThai = ngayRungTrung.AddDays(-1);
        DateTime ngayKT_ThuThai = ngayRungTrung.AddDays(1);

        ltKQ_NgayThuThai.Text = "Ngày " + ngayBD_ThuThai.Day + " Tháng " + ngayBD_ThuThai.Month + " Năm " + ngayBD_ThuThai.Year + " - " + "Ngày " + ngayKT_ThuThai.Day + " Tháng " + ngayKT_ThuThai.Month + " Năm " + ngayKT_ThuThai.Year;
        
        
        //Ngày Dự Kiến Sinh
        DateTime ngayDK_Sinh = ngayKT_ThuThai.AddDays(266);
        ltKQ_DukienSinh.Text = "Ngày " + ngayDK_Sinh.Day + " Tháng " + ngayDK_Sinh.Month + " Năm " + ngayDK_Sinh.Year;
    }
}