using System;
using System.Collections.Generic;

namespace DatingApp.API.Helpers
{
    //Generic Method
    public class PagedList<T> : List<T>
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; } //Total number of items
        public int TotalPages { get; set; } //Total number of pages

        public PagedList(List<T> items, int count, int pageSize, int pageNumber)
        {
            TotalCount = count;
            PageSize = pageSize;
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);  //if items are 13 and pagesize is 5 then result=3 pages
            this.AddRange(items);
        }

    }
}