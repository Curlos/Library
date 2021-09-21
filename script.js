const libraryDiv = document.getElementById('library')
const addBookButton = document.getElementById('addBookSubmit')
const addThroughForm = document.querySelector(".addThroughForm");
const searchFromAPIButton = document.querySelector('.searchFromAPI')
const bookSearchModal = document.querySelector('.bookSearchModal')
const addBookFormModal = document.querySelector('.addBookFormModal')
const searchInput = document.getElementById('searchInput')
const searchResults = document.getElementById('searchResults');
const addBookForm = document.getElementById('addBookForm')
const editBookForm = document.getElementById('editBookForm')
const readButtonSwitchContainer = document.querySelector('.switchContainer')
const removeButton = document.querySelector('.remove')
const editButton = document.querySelector('.edit')
const API_KEY = process.env.API_KEY
let myLibrary = [
	{
		id: "e_ktu1nzmd_gt35kc7qfs5wp9jp4n1ac",
		title: "One Piece, Vol. 98",
		author: "Eiichiro Oda",
		pageCount: "200",
		pagesRead: 188,
		readStatus: "Currently reading",
		imgSrc:
			"http://books.google.com/books/content?id=kX45zgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
		backgroundColor: "gray",
	},
	{
		id: "u_ktu1ofrm_ist1yoypi018vjso6q35p",
		title: "The Mamba Mentality",
		author: "Kobe Bryant",
		pageCount: 208,
		pagesRead: 208,
		readStatus: "Finished reading",
		imgSrc:
			"http://books.google.com/books/content?id=lqRdDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
		backgroundColor: "#53e664",
	},
	{
		id: "b_ktu1oomz_r9drm7sw9og9voikdbxi7",
		title: "Your Next Five Moves",
		author: "Patrick Bet-David",
		pageCount: 320,
		pagesRead: 320,
		readStatus: "Finished reading",
		imgSrc:
			"http://books.google.com/books/content?id=bfj1DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
		backgroundColor: "#53e664",
	},
	{
		id: "x_ktu1otnx_3tpookwmmowwullnlfhrm",
		title: "Atomic Habits",
		author: "James Clear",
		pageCount: 306,
		pagesRead: 306,
		readStatus: "Finished reading",
		imgSrc:
			"http://books.google.com/books/content?id=XfFvDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
		backgroundColor: "#53e664",
	},
	{
		id: "f_ktu1p73d_pimadwr20n9s6ytv522vi",
		title: "Jujutsu Kaisen, Vol. 4",
		author: "Gege Akutami",
		pageCount: "199",
		pagesRead: 0,
		readStatus: "Not started",
		imgSrc:
			"http://books.google.com/books/content?id=b93lDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
		backgroundColor: "gray",
	},
];


if (window.localStorage.getItem('library')) {
    myLibrary = JSON.parse(window.localStorage.getItem('library'))
}


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

const Book = (title, author, pageCount, pagesRead=0, imgSrc) => {
    let pagesReadNum = Number(pagesRead)
    let pageCountNum = Number(pageCount)

    if (pagesReadNum > pageCountNum) {
        pagesReadNum = pageCountNum
    }

    return { 
        id: uniqueId(),
        title: title,
        author: author,
        pageCount: pageCountNum,
        pagesRead: pagesReadNum,
        readStatus: getReadStatus(pagesReadNum, pageCountNum),
        imgSrc: imgSrc || 'http://books.google.com/books/content?id=crFcWYcDuHoC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        backgroundColor: 'gray'
    }
}

const createBookHtml = (bookObj) => {
    const { id, title, author, pageCount, pagesRead, readStatus, imgSrc, backgroundColor } = bookObj

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
    edit.addEventListener('click', () => editBookObj(bookObj))

    editBook.append(remove)
    editBook.append(edit)

    const bookInfo = document.createElement('div')
    bookInfo.classList.add('bookInfo')

    const bookImage = document.createElement('img')
    bookImage.classList.add('bookImage')
    bookImage.src = imgSrc

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
    bookInfo.append(bookImage, bookInfoText)

    const markAsReadSpan = document.createElement('span')
    markAsReadSpan.textContent = 'Mark as read:'

    const switchContainer = document.createElement('div')
    switchContainer.classList.add('switchContainer')

    const switchLabel = document.createElement('label')
    switchLabel.classList.add('switch')

    const checkboxInput = document.createElement('input')
    checkboxInput.setAttribute('type', 'checkbox')
    checkboxInput.checked = bookObj.backgroundColor === 'gray' ? false : true

    checkboxInput.addEventListener('click', () => {
        toggleSlider(id)
    })

    switchLabel.append(checkboxInput)
    switchContainer.append(switchLabel)


    book.append(editBook)
    book.append(bookInfo)
    book.append(markAsReadSpan)
    book.append(switchContainer)

    book.style.backgroundColor = backgroundColor || 'gray'

    return book
}

const toggleSlider = (id) => {
    const foundBook = myLibrary.find(book => book.id === id)

    if (foundBook.backgroundColor === 'gray') {
        // If the book was not read
        foundBook.pagesRead = foundBook.pageCount
        foundBook.readStatus = getReadStatus(foundBook.pagesRead, foundBook.pageCount)
        foundBook.backgroundColor = '#53e664'
    } else {
        // If the book was already read
        foundBook.backgroundColor = 'gray'
    }

    window.localStorage.setItem('library', JSON.stringify(myLibrary))

    resetPage()
}

const getReadStatus = (pagesReadNum, pageCountNum) => {
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

const addBookThroughForm = (e) => {
    e.preventDefault()
    const title = document.getElementById('bookTitleInput')
    const author = document.getElementById('bookAuthorInput')
    const pagesRead = document.getElementById('pagesReadInput')
    const pageCount = document.getElementById('pageCountInput')
    const bookCoverLink = document.getElementById('bookCoverLink')

    if (!title.value || !author.value || !pagesRead.value || !pageCount.value) {
        return false
    }
    

    const newBook = Book(title.value, author.value, pageCount.value, pagesRead.value, bookCoverLink.value)
    const newBookElem = createBookHtml(newBook)

    libraryDiv.append(newBookElem)
    myLibrary.push(newBook)

    window.localStorage.setItem('library', JSON.stringify(myLibrary))

    toggleModal()
}

const addBookToLibraryFromSearch = (bookInfo) => {

    const { title, author, pageCount, imageLinks } = bookInfo
    const pagesRead = 0
    const imgSrc = imageLinks.thumbnail

    const newBook = Book(title, author || bookInfo.authors[0], pageCount, pagesRead, imgSrc)
    const newBookElem = createBookHtml(newBook)

    libraryDiv.append(newBookElem)

    myLibrary.push(newBook)
    window.localStorage.setItem('library', JSON.stringify(myLibrary))
    toggleModal()
}

const removeBook = (book) => {
    myLibrary = myLibrary.filter(libraryBook => libraryBook.id !== book.id)
    window.localStorage.setItem('library', JSON.stringify(myLibrary))
    resetPage()
}

const editBookObj = (bookObj) => {
    toggleModal()
    addBookForm.style.display = 'none'
    editBookForm.style.display = 'block'

    const title = document.getElementById('bookTitleInput')
    const author = document.getElementById('bookAuthorInput')
    const pagesRead = document.getElementById('pagesReadInput')
    const pageCount = document.getElementById('pageCountInput')
    const bookCoverLink = document.getElementById('bookCoverLink')

    title.value = bookObj.title
    author.value = bookObj.author
    pagesRead.value = bookObj.pagesRead
    pageCount.value = bookObj.pageCount
    bookCoverLink.value = bookObj.imgSrc

    editBookForm.setAttribute('book_id', bookObj.id)
}

const editBookThroughForm = (e) => {
    e.preventDefault()
    const title = document.getElementById('bookTitleInput')
    const author = document.getElementById('bookAuthorInput')
    const pagesRead = document.getElementById('pagesReadInput')
    const pageCount = document.getElementById('pageCountInput')
    const bookCoverLink = document.getElementById('bookCoverLink')
    const bookID = editBookForm.getAttribute('book_id')

    if (!title.value || !author.value || !pagesRead.value || !pageCount.value) {
        return false
    }

    const pagesReadNum = Number(pagesRead.value)
    const pagesCountNum = Number(pageCount.value)

    const bookToEdit = myLibrary.find(book => book.id === bookID)
    bookToEdit.title = title.value
    bookToEdit.author = author.value
    bookToEdit.pagesRead = pagesReadNum > pagesCountNum ? pagesCountNum : pagesReadNum
    bookToEdit.pageCount = pageCount.value
    bookToEdit.imgSrc = bookCoverLink.value
    bookToEdit.readStatus = getReadStatus(pagesReadNum, pagesCountNum)


    addBookForm.style.display = 'block'
    editBookForm.style.display = 'none'

    window.localStorage.setItem('library', JSON.stringify(myLibrary))

    toggleModal()
    resetPage()
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
        if (book.volumeInfo.imageLinks) {
            createBookElement(book.volumeInfo, index, 'add')
        } else {
            createBookElement(book.volumeInfo, index, 'add')
        }

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
        addBookButton.addEventListener('click', () => {
            addBookToLibraryFromSearch(book)
        })
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
    imgElem.classList.add('bookImage')
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
    const title = document.getElementById('bookTitleInput')
    const author = document.getElementById('bookAuthorInput')
    const pagesRead = document.getElementById('pagesReadInput')
    const pageCount = document.getElementById('pageCountInput')
    const bookCoverLink = document.getElementById('bookCoverLink')

    title.value = ''
    author.value = ''
    pagesRead.value = ''
    pageCount.value = ''
    bookCoverLink.value = ''


    modal.classList.toggle("show-modal")
    bookSearchModal.style.display = "none"
    addBookFormModal.style.display = "block"

    addBookForm.style.display = 'block'
    editBookForm.style.display = 'none'
}

const toggleModalAPI = () => {
    modal.classList.toggle("show-modal")
    bookSearchModal.style.display = "block"
    addBookFormModal.style.display = "none"
}

const resetPage = () => {
    libraryDiv.innerHTML = ''

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
editBookForm.addEventListener('click', editBookThroughForm)
closeButton.addEventListener("click", toggleModal)
window.addEventListener("click", windowOnClick)