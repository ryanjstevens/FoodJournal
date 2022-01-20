using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FoodJournal.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public FileResult Export()
        {
            return File(Request.InputStream, "application/json", "JournalData.json");
        }


        public class JournalData
        {

        }
    }
}