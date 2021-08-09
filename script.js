const libraryDiv = document.getElementById('library')
const addBookButton = document.getElementById('addBookSubmit')
const addThroughForm = document.querySelector(".addThroughForm");
const searchFromAPIButton = document.querySelector('.searchFromAPI')
const bookSearchModal = document.querySelector('.bookSearchModal')
const addBookFormModal = document.querySelector('.addBookFormModal')
const searchInput = document.getElementById('searchInput')
const searchResults = document.getElementById('searchResults');
const addBookForm = document.getElementById('addBookForm')
const readButtonSwitchContainer = document.querySelector('.switchContainer')
const removeButton = document.querySelector('.remove')
const editButton = document.querySelector('.edit')
const API_KEY = 'AIzaSyAA44LXlUJizXoq017jBx9Q2eFdI1W6Kng'
let myLibrary = []
let searchText = ''

const Book = (title, author, pageCount, pagesRead=0) => {
    const getTitle = () => title
    const getAuthor = () => author
    const getPageCount = () => pageCount
    const getPagesRead = () => pagesRead

    return { getTitle, getAuthor, getPageCount, getPagesRead }
}

const createBookHtml = (title, author, pageCount, pagesRead) => {
    const bookHtml = `<div class="book">
        <div class="editBook">
            <span class="remove">Remove</span>
            <span class="edit">Edit</span>
        </div>

        <div class="bookInfo">
            <div class="bookInfoText">
                <div class="title">${title}</div>
                <div class="author">By: ${author}</div>
                <div class="pages">Pages read: ${pagesRead}/${pageCount}</div>
            </div>
        </div>

        <span>Mark as read:</span>
        <div class="switchContainer">
            <label class="switch">
            <input type="checkbox">
            <span class="slider round"></span>
            </label>
        </div>
    </div>`

    return bookHtml
}

const addBookThroughForm = () => {
    const title = document.getElementById('bookTitleInput').value
    const author = document.getElementById('bookAuthorInput').value
    const pagesRead = document.getElementById('pagesReadInput').value
    const pageCount = document.getElementById('pageCountInput').value

    if (!title || !author || !pagesRead || pageCount) {

    }
    

    const newBook = Book(title, author, pageCount, pagesRead, readStatus)
    const newBookHtml = createBookHtml(title, author, pageCount, pagesRead, readStatus)

    libraryDiv.innerHTML += newBookHtml

    myLibrary.push(newBook)
    toggleModal()
}

const addBookToLibraryFromSearch = (event) => {
    const bookElem = event.target
    console.log(bookElem.parentElement)
    const children = bookElem.parentElement.children
    const keys = Object.keys(bookElem.parentElement.children)
    const bookInfo = []

    for (let i = 1; i < keys.length - 1; i++) {
        if (i != 3) {
            bookInfo.push(children[keys[i]].textContent.split(':')[1].trim())
        }
    }

    const [ title, author, pageCount ] = bookInfo
    const pagesRead = 0

    const newBook = Book(title, author, pageCount, pagesRead, readStatus)
    const newBookHtml = createBookHtml(title, author, pageCount, pagesRead)

    libraryDiv.innerHTML += newBookHtml

    myLibrary.push(newBook)
    toggleModal()
}

const deleteBookFromLibrary = (event) => {
    console.log(event.target.value)
}

const fetchFromAPI = async (event) => {
    const searchText = event.target.value
    
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchText}&key=${API_KEY}`)
    const data = await response.json()
    const books = data.items
    console.log(data)
    displaySearchResults(books)
}

const displaySearchResults = (books) => {
    searchResults.innerHTML = ''
    let index = 0
    for (let book of books) {
        console.log(book.volumeInfo)
        createBookElement(book.volumeInfo, index, 'add')
        index++
    }
}

const createBookElement = (book, index, buttonType) => {
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
    let bookButton = ''

    if (buttonType == 'add') {
        const addBookButton = document.createElement('button')
        addBookButton.value = `book${index}`
        addBookButton.textContent = 'Add book'
        addBookButton.classList.add('button-primary')
        addBookButton.addEventListener('click', addBookToLibraryFromSearch)
        bookButton = addBookButton
    } else if (buttonType == 'delete') {
        const deleteBookButton = document.createElement('button')
        deleteBookButton.value = `book${index}`
        deleteBookButton.textContent = 'Remove book'
        deleteBookButton.classList.add('button-primary')
        deleteBookButton.addEventListener('click', deleteBookFromLibrary)
        bookButton = deleteBookButton
    }
    

    linkElem.setAttribute('href', book.canonicalVolumeLink)
    linkElem.setAttribute('target', '_blank')
    imgElem.src = book.imageLinks.thumbnail
    imgElem.classList.add('bookCover')
    titleElem.textContent = 'Title: ' + (book.title != undefined ? book.title : 'Unknown')
    authorElem.textContent = 'Author: ' + (book.authors != undefined ? book.authors[0] : 'Unknown')
    ratingsElem.textContent = 'Rating: ' + (book.averageRating != undefined ? book.averageRating : 'Unknown')
    pageCountElem.textContent = 'Page count: ' + (book.pageCount != undefined ? book.pageCount : 'Unknown')
    
    linkElem.append(imgElem)
    bookElem.append(linkElem)
    bookElem.append(titleElem)
    bookElem.append(authorElem)
    bookElem.append(ratingsElem)
    bookElem.append(pageCountElem)
    bookElem.append(bookButton)
    bookElem.classList.add('bookSearchResult', `book${index}`)
    searchResults.append(bookElem)
}

const modal = document.querySelector(".modal")
const closeButton = document.querySelector(".close-button")

const toggleModal = () => {
    modal.classList.toggle("show-modal")
    bookSearchModal.style.display = "none"
    addBookFormModal.style.display = "block"
}

const toggleModalAPI = () => {
    modal.classList.toggle("show-modal")
    bookSearchModal.style.display = "block"
    addBookFormModal.style.display = "none"
}

// Slider is firing event once and button another time so two times undos my effects
const toggleRead = (event) => {
    toggleReadClick += 1
    const bookElem = event.target.parentElement.parentElement.parentElement
    console.log(bookElem.classList)
    console.log(bookElem.classList.contains('bookRead'))

    if (bookElem.classList.contains('bookRead') && toggleReadClick % 2 != 0) {
        bookElem.classList.add("bookRead")
    } else {
        bookElem.classList.remove("bookRead")
    }
}

const windowOnClick = (event) => {
    if (event.target === modal) {
        toggleModal();
    }
}

let toggleReadClick = 0
searchInput.addEventListener('change', fetchFromAPI)
addThroughForm.addEventListener('click', toggleModal)
searchFromAPIButton.addEventListener('click', toggleModalAPI)
addBookForm.addEventListener('click', addBookThroughForm)
readButtonSwitchContainer.addEventListener('dbclick', toggleRead)
closeButton.addEventListener("click", toggleModal)
removeButton.addEventListener('click', removeBook)
editButton.addEventListener('click', editBook)
window.addEventListener("click", windowOnClick)
