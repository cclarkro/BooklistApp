// Book Class: Represents a Book

class Book {
    constructor(title,author,format,isbn,pages) {
        this.title = title;
        this.author = author;
        this.format = format;
        this.isbn = isbn;
        this.pages = pages;
    }
}

// UI Class: Handle UI Tasks

class UI {
    static displayBooks() {
        
        const books = Store.getBooks();
        
        books.forEach((book) => UI.addBookToList(book));
        
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.format}</td>
        <td>${book.isbn}</td>
        <td>${book.pages}</td>
        <td><a href="" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    } 

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish aftter 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2500);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#format').value = '';
        document.querySelector('#isbn').value = '';
        document.querySelector('#pages').value = '';

    }

    
}

// Store Class: Handles Storage

class Store {
  static getBooks(){
      let books;
      if(localStorage.getItem('books') === null) {
          books = [];
      } else {
          books = JSON.parse(localStorage.getItem('books'));
      }

      return books;
    }

  static addBook(book){
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}


// Event: Display Books in List

document.addEventListener('DOMContentLoaded', UI.displayBooks);

 
// Event: Add a Book

document.querySelector("#book-form").addEventListener('submit', (e) => {

    // Prevent actual submit
    e.preventDefault();

    // Get Form Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const format = document.querySelector('#format').value;
    const isbn = document.querySelector('#isbn').value;
    const pages = document.querySelector('#pages').value;

    // Validate
    if(title === '' || author === '' || format === '' || isbn === '' || pages === '') {
        UI.showAlert('Please Fill in All Fields', 'danger');
    } else {
        // Instanstiate Book
        const book = new Book(title,author,format,isbn,pages);


         // Add Book to UI
        UI.addBookToList(book);

        // Show Success Message
        UI.showAlert('Book Added', 'success');

        // Add Book to Store
        Store.addBook(book)

        // Clear Fields
        UI.clearFields();

    }
    
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {

    // Remove Book from UI
    UI.deleteBook(e.target);
    e.preventDefault();

    // Remove Book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

    // Show Success Message
    UI.showAlert('Book Removed', 'success');

    

});

