using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Data.OleDb;

public class DBClass : BaseServ
{
    int result;
    public DBClass()
    {
        result = 0;
    }

    #region sqlHelp
    public void ImporttoSQL(string sPath, string sqlfromExcel, string toTable)
    {
        string sSourceConstr = string.Format(@"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=""Excel 12.0 Xml;HDR=YES;""", sPath);

        string sDestConstr = dbConnString;
        OleDbConnection sSourceConnection = new OleDbConnection(sSourceConstr);
        using (sSourceConnection)
        {
            // string sql = string.Format("Select [Employee ID],[Employee Name],[Designation],[Posting],[Dept] FROM [{0}]", "Sheet1$");
            OleDbCommand command = new OleDbCommand(sqlfromExcel, sSourceConnection);
            sSourceConnection.Open();
            using (OleDbDataReader dr = command.ExecuteReader())
            {
                using (SqlBulkCopy bulkCopy = new SqlBulkCopy(sDestConstr))
                {
                    bulkCopy.DestinationTableName = toTable;
                    //You can mannualy set the column mapping by the following way.
                    //bulkCopy.ColumnMappings.Add("Employee ID", "Employee Code");
                    bulkCopy.WriteToServer(dr);
                }
            }
        }
    }
    public DataTable sqlGetData(string sqlCommand)
    {
        try
        {
            DataTable dt = new DataTable();
            SqlConnection con = new SqlConnection(dbConnString);
            con.Open();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand, con);
            adapter.Fill(dt);
            return dt;
        }
        catch (Exception) { return null; }
    }
    public DataRow sqlGetDataRow(string sqlCommand)
    {
        try
        {
            DataTable dt = new DataTable();
            SqlConnection con = new SqlConnection(dbConnString);
            con.Open();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand, con);
            adapter.Fill(dt);
            return dt.Rows[0];
        }
        catch (Exception) { return null; }
    }
    public int sqlSetData(string sqlCommand)
    {
        try
        {
            DataTable dt = new DataTable();
            SqlConnection con = new SqlConnection(dbConnString);
            con.Open();
            SqlCommand cmd = new SqlCommand(sqlCommand, con);
            cmd.ExecuteNonQuery();
            return 1;
        }
        catch (Exception) { return 0; }
    }
   
  

   

    #endregion

   
}