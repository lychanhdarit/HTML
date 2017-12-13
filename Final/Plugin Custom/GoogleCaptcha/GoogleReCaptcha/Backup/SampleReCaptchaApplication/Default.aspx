<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
    CodeBehind="Default.aspx.cs" Inherits="SampleReCaptchaApplication._Default" %>

<%@ Register Assembly="GoogleReCaptcha" Namespace="GoogleReCaptcha" TagPrefix="cc1" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    <h2>
        Welcome to ASP.NET!
    </h2>
    <p>
        To learn more about ASP.NET visit <a href="http://www.asp.net" title="ASP.NET Website">www.asp.net</a>.
    </p>
    <p>
        You can also find <a href="http://go.microsoft.com/fwlink/?LinkID=152368&amp;clcid=0x409"
            title="MSDN ASP.NET Docs">documentation on ASP.NET at MSDN</a>.
    </p>
    <p>
        <h1>Google ReCaptcha Form</h1>
        <asp:TextBox ID="txt" runat="server"></asp:TextBox>
        <%--<cc1:GoogleReCaptcha ID="ctrlGoogleReCaptcha" runat="server" PublicKey="6LeOVQITAAAAABSAVaUC7h_O9xCWapVbOXYH2fJG" PrivateKey="6LeOVQITAAAAABwoLc1SQ3mP_HdnjJsy_dq9V25L" />--%>
        <asp:Panel ID="Panel1" runat="server">
        </asp:Panel>
        <asp:Label ID="lblStatus" runat="server" Text=""></asp:Label>
        <asp:Button ID="btn" runat="server" Text="Submit" />
    </p>
</asp:Content>
