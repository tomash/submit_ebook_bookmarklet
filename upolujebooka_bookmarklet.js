(function(){

  // the minimum version of jQuery we want
  var v = "1.3.2";

  // the url form with books will be sent to
  var submit_url = "http://httpbin.org/post";

  // check prior inclusion and version
  if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
    var done = false;
    var script = document.createElement("script");
    script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
    script.onload = script.onreadystatechange = function(){
      if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
        done = true;
        initMyBookmarklet();
      }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  } else {
    initMyBookmarklet();
  }

  function Book(title, author) {
    this.title = title;
    this.author = author
  }

  function process_site() {
    var href = window.location.href;
    var found_books = [];
    if(href.indexOf("publio.pl/klient/publikacje.html") >= 0) {
      // publio.pl cart/shelf
      $('#cartItems .item').each(function(index) {
        var title = $(this).find(".right a.title").text().trim();
        var author = $(this).find(".right .descCol > a:first").text().trim();
        found_books.push(new Book(title, author));
      });
    }
    else if(href.indexOf("virtualo.pl/?lib") >= 0) {
      // virtualo.pl shelf
      $('.library_list_box').each(function(index) {
        var title = $(this).find(".list_title").text().trim();
        var author = $(this).find(".list_authors").text().trim();
        found_books.push(new Book(title, author));
      });
    }
    else {
      alert("nierozpoznana strona z półką");
    }
    return found_books;
  }

  function build_form(books) {
    var form = $('<form></form>', {
      action: submit_url,
      method: "post"
    });
    $.each(books, function(index, book) {
      var author_input = $('<input/>', {
        type: 'hidden',
        name: 'books['+index+'][author]',
        value: book.author
      });
      var title_input = $('<input/>', {
        type: 'hidden',
        name: 'books['+index+'][title]',
        value: book.title
      });
      form.append(author_input);
      form.append(title_input);
    });
    return form;
  }
  
  function initMyBookmarklet() {
    (window.myBookmarklet = function() {
      var found_books = process_site();
      var form = build_form(found_books);
      // le grande finale
      $('body').append(form);
      form.submit();
    })();
  }

})();