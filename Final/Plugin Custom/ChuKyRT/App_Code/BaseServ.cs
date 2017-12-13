using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

public class BaseServ
{
    protected static string dbConnString;
    //protected static string dbConnString1;
	public BaseServ()
	{
        dbConnString = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
        //dbConnString1 = ConfigurationManager.ConnectionStrings["ConnectionString1"].ConnectionString;
	}
}