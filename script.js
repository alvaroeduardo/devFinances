const openModal = document.querySelector(".new");
const janelaModal = document.querySelector(".modal-overlay");
const cancelModal = document.querySelector(".cancel")

// ADICIONA E REMOVE A CLASSE ACTIVE DO BOTÃO DO MODAL
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

const storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transaction')) || [];
    },

    set(transactions){
        localStorage.setItem("dev.finances:transaction", JSON.stringify(transactions))
    }
}

// TRABALHA COM VALORES
const transaction = {
    all: storage.get(),

    add(transc){
        transaction.all.push(transc)
        
        App.reload();
    },

    remove(index){
        transaction.all.splice(index, 1);

        App.reload();
    },

    incomes(){
        let income = 0;

        transaction.all.forEach( transaction =>{
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        
        return income;
    },

    expenses(){
        let expense = 0;

        transaction.all.forEach( transaction =>{
            if(transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        
        return expense;
    },

    total(){
        return transaction.incomes() + transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr);
    },

    innerHTMLTransaction(transaction, index){
        const cssClass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${cssClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" id="remT" onclick="transaction.remove(${index})" alt="Remover Transação">
            </td>
        `;

        return html;
    },

    updateBalance(){
        document.getElementById('incomeDisplay').innerHTML  = Utils.formatCurrency(transaction.incomes());
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(transaction.expenses());
        document.getElementById('totalDisplay').innerHTML   = Utils.formatCurrency(transaction.total());
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Utils = {
    formatDate(date){
        const splittedDate = date.split("-");

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },

    formatAmount(value){
        value = Number(value) * 100;

        return value;
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : "";
        
        value = String(value).replace(/\D/g, "");
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

// TRABALHA COM O FORMULÁRIO
const form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: form.description.value,
            amount: form.amount.value,
            date: form.date.value
        }
    },

    formatValues(){
        let { description, amount, date } = form.getValues();

        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);

        return { 
            description,
            amount,
            date
         }
    },

    validateFields(){
        const { description, amount, date } = form.getValues();

        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos.")
        }
    },

    saveTransaction(transactions){
        transaction.add(transactions);
    },

    clearFields(){
        form.description.value = "";
        form.amount.value = "";
        form.date.value = "";
    },

    submit(event){
        event.preventDefault();

        try {
            form.validateFields();
            const transactions = form.formatValues();

            form.saveTransaction(transactions);
            form.clearFields();

            modal.close();
            App.reload();

        } catch (error) {
            alert(error.message)
        }

    }
}

// TRABALHA COM A INICIALIZAÇÃO DO CÓDIGO
const App = {
    init(){
        transaction.all.forEach(DOM.addTransaction);

        DOM.updateBalance();

        storage.set(transaction.all);
    },

    reload(){
        DOM.clearTransactions();
        App.init();
    }
}

App.init()