const libraryDiv = document.getElementById('library')
const addBookButton = document.getElementById('addBookSubmit')
const searchInput = document.getElementById('searchInput')
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
    console.log(data)
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
