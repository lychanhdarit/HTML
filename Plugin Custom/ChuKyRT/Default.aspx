<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Công cụ tính chu kỳ rụng trứng - dự kiến sinh.</title>
    <link href="../fonts/font.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" />
    <link rel="stylesheet" href="https://jqueryui.com/datepicker/resources/demos/style.css" />
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" />
    <meta name="viewport" content="width=device-width" />
		<link rel="shortcut icon" href="favicon.ico.png" />
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script>
        $(function () {
            $("#txtNgay").datepicker();
            $("#txtNgay").datepicker("dateFormat", "dd/mm/yy");
        });

    </script>
    <style>
        html {
            background: url(../Images/b-g.jpg) right bottom no-repeat #fff;
            background-size: cover;
            
        }

        * {
            margin: 0;
            padding: 0;
        }

        body {
            font-family: utmavo;
            padding: 50px 0;
        }

        .wrapper {
            max-width: 470px;
            margin: auto;
            background: rgba(243, 243, 243, 0.95);
            padding: 10px;
            font-family: UtmAvo;
            border-radius: 10px;
            color:#5f5c5c
        }

        .txtBox {
            margin: 5px 0;
            padding: 10px;
            border: 1px solid rgba(241, 212, 192, 0.96);
            width: 95%;
            font-family: UtmAvo;
        }

        .ddlBox {
            margin: 5px 0;
            padding: 10px;
            border: 1px solid rgba(241, 212, 192, 0.96);
            font-family: UtmAvo;
        }

        .btnClick {
            margin: 5px 0;
            padding: 10px;
            border: 1px solid #ff6a00;
            background: #ff6a00;
            color: #fff;
            text-transform: uppercase;
            font-family: UtmAvo;
            width: 100%;
            font-weight: 600;
            font-size: 1em;
            cursor: pointer;
            border-radius: 5px;
        }

        .KQ {
        }

            .KQ ul li {
                background: #fff;
                padding: 10px;
                list-style: none;
                margin-left: 0px;
                margin-top: 5px;
                font-size: 0.9em;
                line-height: 2em;
            }

                .KQ ul li b {
                    color: #007793;
                }

                .KQ ul li i {
                    color: #007793;
                }

        h1 {
            padding: 10px;
            background: #007793;
            color: #fff;
            text-align: center;
            text-transform: uppercase;
            border: 5px solid rgba(255, 255, 255, 0.9);
            font-size: 1.2em;
            margin-bottom: 15px;
            border-radius: 10px;
        }
        @media (max-width:470px) {
            
            body {
                font-family: utmavo;
                padding: 0px;
            }
            .wrapper {
                border-radius:0;
            }
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="wrapper">
            <h1>
                <i class="fa fa-venus" aria-hidden="true"></i> Ngày rụng trứng - Dự kiến Ngày sinh
            </h1>
            <div>
                <i class="fa fa-calendar-check-o" aria-hidden="true"></i> Ngày đầu tiên của kỳ kinh cuối:
                <asp:TextBox ID="txtNgay" runat="server" ClientIDMode="Static" CssClass="txtBox" placeholder="chọn ngày đầu kỳ kinh cuối"></asp:TextBox>
            </div>
            <div>
                <i class="fa fa-calendar" aria-hidden="true"></i> Chu kỳ kinh:<br />
                <asp:DropDownList ID="ddlChuKy" runat="server" CssClass="ddlBox"></asp:DropDownList>
            </div>
            <asp:Button ID="btnXem" runat="server" Text="Xem kết quả" OnClick="btnXem_Click" CssClass="btnClick" />
            <div class="KQ">

                <ul>
                    <li><i class="fa fa-heartbeat" aria-hidden="true"></i> Ngày rụng trứng: 
                      <b>
                          <asp:Literal ID="ltKQ_NgayRungTrung" runat="server"></asp:Literal></b>
                    </li>
                    <li><i class="fa fa-heartbeat" aria-hidden="true"></i> Những ngày dễ thụ thai:<br />
                        từ 
                         <b>
                             <asp:Literal ID="ltKQ_NgayThuThai" runat="server"></asp:Literal></b>
                    </li>
                    <li><i class="fa fa-heartbeat" aria-hidden="true"></i> Dự kiến Ngày sinh (38 tuần):
                         <b>
                             <asp:Literal ID="ltKQ_DukienSinh" runat="server"></asp:Literal></b>
                        <br />
                        <p style="border-top: 1px dashed #007793">
                            <i class="fa fa-star" aria-hidden="true"></i> Bé sẽ được sinh ra vào khoảng tuần thứ 38 kể từ ngày thụ thai. Tuy nhiên, thời điểm thụ thai thường không được biết một cách chính xác. Vì vậy, ngày dự sinh thường ở trong khoảng tuần thứ 40 kể từ ngày đầu tiên của kỳ kinh nguyệt cuối cùng của bạn (LMP).<br />

                            <i class="fa fa-star" aria-hidden="true"></i> Ngày dự sinh còn tùy thuộc vào độ dài của chu kỳ của bạn hãy nhớ rằng cách tính ngày sự sinh này chỉ mang tính chất tham khảo.<br />
                            <i class="fa fa-long-arrow-right" aria-hidden="true"></i> <b>Lưu ý:</b> Công cụ này chỉ mang tính tham khảo. Bạn nên hỏi ý kiến bác sĩ để có được ngày dự sinh chính xác.
                        </p>
                    </li>

                </ul>

            </div>

        </div>

    </form>
</body>
</html>
