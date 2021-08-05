const libraryDiv = document.getElementById('library')
const addBookButton = document.getElementById('addBookSubmit')
const searchInput = document.getElementById('searchInput')
const searchResults = document.getElementById('searchResults');
const API_KEY = 'AIzaSyAA44LXlUJizXoq017jBx9Q2eFdI1W6Kng'
let myLibrary = []
let searchText = ''

const Book = () => {

}

const addBookToLibrary = (book) => {
    myLibrary.push(book)
    console.log(book)
    const bookDiv = document.createElement('div')
    bookDiv.classList.add('')
}

const fetchFromAPI = async (event) => {
    const searchText = event.target.value
    
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchText}&key=${API_KEY}`)
    const data = await response.json()
    const books = data.items
    console.log(data)
    displaySearchResults(books.slice(0, 10))
}

const displaySearchResults = (books) => {
    searchResults.innerHTML = ''
    for (let book of books) {
        console.log(book.volumeInfo)
        createBookElement(book.volumeInfo)
    }
}

const createBookElement = (book) => {
    if (!book.imageLinks) {
        return
    }

    const bookElem = document.createElement('div')
    const linkElem = document.createElement('a')
    const imgElem = document.createElement('img')
    const titleElem = document.createElement('div')
    const authorElem = document.createElement('div')
    const ratingsElem = document.createElement('div')
    const pageCountElem = document.createElement('div')

    linkElem.setAttribute('href', book.canonicalVolumeLink)
    linkElem.setAttribute('target', '_blank')
    imgElem.src = book.imageLinks.thumbnail
    imgElem.classList.add('bookCover')
    titleElem.textContent = 'Title: ' + book.title
    authorElem.textContent = 'Author: ' + book.authors[0]
    ratingsElem.textContent = 'Rating: ' + (book.averageRating != undefined ? book.averageRating : 'No ratings')
    pageCountElem.textContent = 'Page count: ' + book.pageCount
    
    linkElem.append(imgElem)
    bookElem.append(linkElem)
    bookElem.append(titleElem)
    bookElem.append(authorElem)
    bookElem.append(ratingsElem)
    bookElem.append(pageCountElem)
    bookElem.classList.add('bookSearchResult')
    searchResults.append(bookElem)
}

const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");

const toggleModal = () => {
    modal.classList.toggle("show-modal");
}

const windowOnClick = (event) => {
    if (event.target === modal) {
        toggleModal();
    }
}
searchInput.addEventListener('change', fetchFromAPI)
trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
