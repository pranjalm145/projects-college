document.addEventListener("DOMContentLoaded", function () {
    loadBooks();
    loadBorrowedBooks();
    checkDueDateAlerts();
});

const books = [
    { id: 1, title: "Book1", author: "xyz", category: "Fiction" },
    { id: 2, title: "Book2", author: "xyz", category: "Classic" },
    { id: 3, title: "Book3", author: "xyz", category: "Dystopian" }
];

function loadBooks() {
    const bookContainer = document.querySelector(".books-container");
    bookContainer.innerHTML = "";
    books.forEach(book => {
        let bookItem = document.createElement("div");
        bookItem.classList.add("book-item");
        bookItem.innerHTML = `<h3>${book.title}</h3><p>${book.author}</p><p>${book.category}</p>
            <button onclick="borrowBook(${book.id})">Borrow</button>`;
        bookContainer.appendChild(bookItem);
    });
}

function searchBooks() {
    const query = document.getElementById("searchBar").value.toLowerCase();
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
    );
    const bookContainer = document.querySelector(".books-container");
    bookContainer.innerHTML = "";
    filteredBooks.forEach(book => {
        let bookItem = document.createElement("div");
        bookItem.classList.add("book-item");
        bookItem.innerHTML = `<h3>${book.title}</h3><p>${book.author}</p><p>${book.category}</p>
            <button onclick="borrowBook(${book.id})">Borrow</button>`;
        bookContainer.appendChild(bookItem);
    });
}

function borrowBook(bookId) {
    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    if (borrowedBooks.length >= 3) {
        alert("You can only borrow up to 3 books at a time!");
        return;
    }
    const book = books.find(b => b.id === bookId);
    if (!borrowedBooks.some(b => b.id === bookId)) {
        borrowedBooks.push({ ...book, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) });
        localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
        loadBorrowedBooks();
    }
}

function loadBorrowedBooks() {
    const borrowedList = document.getElementById("borrowedList");
    borrowedList.innerHTML = "";
    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    borrowedBooks.forEach(book => {
        let listItem = document.createElement("li");
        let dueDate = new Date(book.dueDate);
        listItem.innerHTML = `${book.title} - Due: ${dueDate.toDateString()} 
            <button onclick="returnBook(${book.id})">Return</button>`;
        borrowedList.appendChild(listItem);
    });
}

function returnBook(bookId) {
    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    borrowedBooks = borrowedBooks.filter(b => b.id !== bookId);
    localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
    loadBorrowedBooks();
}

function checkDueDateAlerts() {
    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    if (borrowedBooks.length === 0) return;

    fetch("alerts.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "borrowedBooks=" + encodeURIComponent(JSON.stringify(borrowedBooks))
    })
        .then(response => response.text())
        .then(alertMessage => {
            if (alertMessage.trim() !== "") {
                alert(alertMessage);
            }
        });
}
