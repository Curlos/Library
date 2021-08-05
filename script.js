const libraryDiv = document.getElementById('library')
const addBookButton = document.getElementById('addBookSubmit')
let myLibrary = []

const Book = () => {

}

const addBookToLibrary = (book) => {
    myLibrary.push(book)
    console.log(book)
    const bookDiv = document.createElement('div')
    bookDiv.classList.add('')
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

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
