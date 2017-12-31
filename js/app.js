const store = new Store();
//Book constructor
function Book(title, author, isbn){
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

function Store(){

  Store.prototype.getBooks = function(){
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  Store.prototype.addBook = function(book){
    const books = store.getBooks();
    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  Store.prototype.displayBooks = function(){
    const books = store.getBooks();

    books.forEach(function (book) {
      const ui = new UI();

      //Add book to ui
      ui.addBookToList(book);
    });
  }

  Store.prototype.removeBook = function(isbn){
    const books = store.getBooks();

    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

//UI constructor
function UI(){

  //Add book
  UI.prototype.addBookToList = function(book){
    const list = document.getElementById('book-list');
    const row = document.createElement('tr');
    row.innerHTML = `<td>${book.title}</td>
                     <td>${book.author}</td>  
                     <td>${book.isbn}</td>
                     <td><a href="#" class="delete">X</a></td>
    `;

      list.appendChild(row);
  }

  //Clear fields
  UI.prototype.clearFields = function(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

  //Alert 
  UI.prototype.showAlert = function(message, className){
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
    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  //Delete Book
  UI.prototype.deleteBook = function(target){
    if(target.className === 'delete'){
      target.parentElement.parentElement.remove();
    }
  }

}

document.addEventListener('DOMContentLoaded', store.displayBooks());
//Event listner for add book
document.getElementById('book-form').addEventListener('submit', function(e){

  //Form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

  //Book Object instantiation
  const book = new Book(title, author, isbn);

  //UI Object instantiation
  const ui = new UI();

  //Entry validation
  if(title === '' && author === '' && isbn ===''){
    
    //Error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    //Add book to list
    ui.addBookToList(book);

    //Add book to local storage
    store.addBook(book);

    //Success alert
    ui.showAlert('Book Added', 'success');

    //Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

//Event listner for delete book
document.getElementById('book-list').addEventListener('click', function(e){
  const ui = new UI();

  //Delete book
  ui.deleteBook(e.target);

  //Remove from localstorage
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //Show message
  ui.showAlert('Book Removed!', 'success');

  e.preventDefault();
});