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
let myLibrary = [
    {
        id: "c_ktt512pj_gf5n5mk7kecdgm4xuhkps",
        title: "One Piece, Vol. 1",
        author: "Eiichiro Oda",
        pageCount: 210,
        pagesRead: 0,
        readStatus: "Not started",
    },
    {
        id: "v_ktt518ls_vo2u8mqmciken90fwk99l",
        title: "One Piece Box Set 4",
        author: "Eiichiro Oda",
        pageCount: 4328,
        pagesRead: 0,
        readStatus: "Not started",
    },
    {
        id: "w_ktt51fkn_qeen03q7m4ycwiq5mv99v",
        title: "Shoe Dog",
        author: "Phil Knight",
        pageCount: 400,
        pagesRead: 0,
        readStatus: "Not started",
    },
    {
        id: "o_ktt51jta_gqx7ldqnohicfbs84lufo",
        title: "Atomic Habits",
        author: "James Clear",
        pageCount: 306,
        pagesRead: 0,
        readStatus: "Not started",
    },
    {
        id: "a_ktt51u7u_bvmh9ei6pqsf8lhiy0flb",
        title: "Creativity, Inc.",
        author: "Ed Catmull",
        pageCount: 368,
        pagesRead: 0,
        readStatus: "Not started",
    },
    {
        id: "d_ktt52f13_xqb2u5h7odlxennphwak8",
        title: "Demon Slayer",
        author: "Koyoharu Gotouge",
        pageCount: 192,
        pagesRead: 0,
        readStatus: "Not started",
    },
    {
        id: "v_ktt52oo3_1uu9gqy1ftnoa9wh589ju",
        title: "Demon Slayer",
        author: "Koyoharu Gotouge",
        pageCount: 232,
        pagesRead: 0,
        readStatus: "Not started",
    },
]

let searchText = ''

const uniqueId = () => {
    // desired length of Id
    var idStrLen = 32;
    // always start with a letter -- base 36 makes for a nice shortcut
    var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
    // add a timestamp in milliseconds (base 36 again) as the base
    idStr += (new Date()).getTime().toString(36) + "_";
    // similar to above, complete the Id using random, alphanumeric characters
    do {
        idStr += (Math.floor((Math.random() * 35))).toString(36);
    } while (idStr.length < idStrLen);

    return (idStr);
}

const Book = (title, author, pageCount, pagesRead=0) => {
    const pagesReadNum = Number(pagesRead)
    const pageCountNum = Number(pageCount)

    const getReadStatus = () => {
        if (pagesReadNum === 0) {
            return 'Not started'
        }
        
        if (pagesReadNum < pageCountNum) {
            return 'Currently reading'
        }

        if (pagesReadNum === pageCountNum) {
            return 'Finished reading'
        }
    }
    console.log(JSON.stringify(myLibrary))

    return { 
        id: uniqueId(),
        title: title,
        author: author,
        pageCount: Number(pageCount),
        pagesRead: Number(pagesRead),
        readStatus: getReadStatus()
    }
}

const createBookHtml = (bookObj) => {
    const { id, title, author, pageCount, pagesRead, readStatus } = bookObj
    const book = document.createElement('div')
    book.classList.add('book')

    const editBook = document.createElement('div')
    editBook.classList.add('editBook')

    const remove = document.createElement('span')
    remove.classList.add('remove')
    remove.textContent = 'Remove'
    remove.addEventListener('click', () => removeBook(bookObj))

    const edit = document.createElement('span')
    edit.classList.add('edit')
    edit.textContent = 'Edit'
    edit.setAttribute('bookID', id)

    editBook.append(remove)
    editBook.append(edit)

    const bookInfo = document.createElement('div')
    bookInfo.classList.add('bookInfo')

    const bookInfoText = document.createElement('div')
    bookInfoText.classList.add('bookInfoText')

    const titleDiv = document.createElement('div')
    titleDiv.classList.add('title')
    titleDiv.textContent = title

    const authorDiv = document.createElement('div')
    authorDiv.classList.add('author')
    authorDiv.textContent = author

    const pagesDiv = document.createElement('div')
    pagesDiv.classList.add('pages')
    pagesDiv.textContent = `Pages read: ${pagesRead}/${pageCount}`

    const readStatusDiv = document.createElement('div')
    readStatusDiv.classList.add('readStatus')
    readStatusDiv.textContent = readStatus

    bookInfoText.append(titleDiv, authorDiv, pagesDiv, readStatusDiv)
    bookInfo.append(bookInfoText)

    const markAsReadSpan = document.createElement('span')
    markAsReadSpan.textContent = 'Mark as read:'

    const switchContainer = document.createElement('div')
    switchContainer.classList.add('switchContainer')

    const switchLabel = document.createElement('label')
    switchLabel.classList.add('switch')

    const checkboxInput = document.createElement('input')
    checkboxInput.setAttribute('type', 'checkbox')

    const sliderRound = document.createElement('span')
    sliderRound.classList.add('slider', 'round')

    switchLabel.append(checkboxInput, sliderRound)
    switchContainer.append(switchLabel)


    book.append(editBook)
    book.append(bookInfo)
    book.append(markAsReadSpan)
    book.append(switchContainer)

    return book
}

const addBookThroughForm = (e) => {
    e.preventDefault()
    const title = document.getElementById('bookTitleInput').value
    const author = document.getElementById('bookAuthorInput').value
    const pagesRead = document.getElementById('pagesReadInput').value
    const pageCount = document.getElementById('pageCountInput').value

    if (!title || !author || !pagesRead || pageCount) {

    }
    

    const newBook = Book(title, author, pageCount, pagesRead)
    const newBookElem = createBookHtml(newBook)

    libraryDiv.append(newBookElem)

    myLibrary.push(newBook)
    console.log(myLibrary)
    toggleModal()
}

const addBookToLibraryFromSearch = (event) => {
    const bookElem = event.target
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

    const newBook = Book(title, author, pageCount, pagesRead)
    const newBookElem = createBookHtml(newBook)

    libraryDiv.append(newBookElem)

    myLibrary.push(newBook)
    toggleModal()
}

const removeBook = (book) => {
    console.log(book)
    console.log(`Removing book ${book.title} ${book.id}`)

    myLibrary = myLibrary.filter(libraryBook => libraryBook.id !== book.id)

    resetPage()
}

const editBook = (event) => {

}

const fetchFromAPI = async (event) => {
    const searchText = event.target.value
    
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchText}&key=${API_KEY}`)
    const data = await response.json()
    const books = data.items
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

const resetPage = () => {
    libraryDiv.innerHTML = ''

    console.log(myLibrary)

    myLibrary.forEach((book) => {
        const bookElem = createBookHtml(book)
        libraryDiv.append(bookElem)
    })
}

const windowOnClick = (event) => {
    if (event.target === modal) {
        toggleModal();
    }
}

resetPage()

let toggleReadClick = 0
searchInput.addEventListener('change', fetchFromAPI)
addThroughForm.addEventListener('click', toggleModal)
searchFromAPIButton.addEventListener('click', toggleModalAPI)
addBookForm.addEventListener('click', addBookThroughForm)
closeButton.addEventListener("click", toggleModal)
window.addEventListener("click", windowOnClick)