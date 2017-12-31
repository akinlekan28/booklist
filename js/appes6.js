class Book {
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  //Add book
  addBookToList(book){
    const list = document.getElementById('book-list');
    const row = document.createElement('tr');
    row.innerHTML = `<td>${book.title}</td>
                     <td>${book.author}</td>  
                     <td>${book.isbn}</td>
                     <td><a href="#" class="delete">X</a></td>
    `;

    list.appendChild(row);
  }

  //Alert 
  showAlert(message, className){
    //Create div element
    const div = document.createElement('div');
    //add alert class
    div.className = `alert ${className}`;
    //Append error message
    div.appendChild(document.createTextNode(message));
    //Get container class
    const container = document.querySelector('.container');
    //Get form class
    const form = document.querySelector('#book-form');
    //Insert alert div before the form
    container.insertBefore(div, form);

    //Set timeout to remove alert
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  //Delete book
  deleteBook(target){
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  //Clear fields 
  clearFields(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

class Store {
  static getBooks(){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks(){
    const books = Store.getBooks();

    books.forEach(function(book){
      const ui = new UI();

      //Add book to ui
      ui.addBookToList(book);
    });
  }

  static addBook(book){
    const books = Store.getBooks();
    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn){
    const books = Store.getBooks();

    books.forEach(function(book, index){
      if(book.isbn === isbn){
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

//DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks());

//Event listner for add book
document.getElementById('book-form').addEventListener('submit', function (e) {

  //Form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  //Book Object instantiation
  const book = new Book(title, author, isbn);

  //UI Object instantiation
  const ui = new UI();

  //Entry validation
  if (title === '' && author === '' && isbn === '') {

    //Error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    //Add book to list
    ui.addBookToList(book);

    //Add book to local storage
    Store.addBook(book);

    //Success alert
    ui.showAlert('Book Added', 'success');

    //Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

//Event listner for delete book
document.getElementById('book-list').addEventListener('click', function (e){
  const ui = new UI();

  //Delete book
  ui.deleteBook(e.target);

  //Remove from localstorage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //Show message
  ui.showAlert('Book Removed!', 'success');

  e.preventDefault();
});