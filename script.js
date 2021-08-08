const libraryDiv = document.getElementById('library')
const addBookButton = document.getElementById('addBookSubmit')
const searchInput = document.getElementById('searchInput')
const searchResults = document.getElementById('searchResults');
const API_KEY = 'AIzaSyAA44LXlUJizXoq017jBx9Q2eFdI1W6Kng'
let myLibrary = []
let searchText = ''

const Book = (title, author, totalPages, pagesRead=0, readStatus='Not started') => {
    const getTitle = () => title
    const getAuthor = () => author
    const getTotalPages = () => totalPages
    const getPagesRead = () => pagesRead
    const getReadStatus = () => readStatus

    return { getTitle, getAuthor, getTotalPages, getPagesRead, getReadStatus }
}

const addBookToLibrary = (event) => {
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
    console.log(bookInfo)
    console.log(title)
    console.log(author)
    console.log(Number(pageCount))

    // myLibrary.push(book)
    // console.log(book)
    // const bookDiv = document.createElement('div')
    // bookDiv.classList.add('')
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
        addBookButton.addEventListener('click', addBookToLibrary)
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

const modal = document.querySelector(".modal");
const triggerElems = document.querySelectorAll(".trigger");
const closeButton = document.querySelector(".close-button");

const toggleModal = () => {
    modal.classList.toggle("show-modal");
}

const toggleModalAddBook = () => {
    
}

const windowOnClick = (event) => {
    if (event.target === modal) {
        toggleModal();
    }
}
searchInput.addEventListener('change', fetchFromAPI)

for (let elem of triggerElems) {
    elem.addEventListener("click", toggleModal);
}
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
