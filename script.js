const openModal = document.querySelector(".new");
const janelaModal = document.querySelector(".modal-overlay");
const cancelModal = document.querySelector(".cancel")

const modal = {
    open(){
        janelaModal.classList.add('active');
    },

    close(){
        janelaModal.classList.remove('active');
    }
};

openModal.addEventListener('click', modal.open);
cancelModal.addEventListener('click', modal.close);