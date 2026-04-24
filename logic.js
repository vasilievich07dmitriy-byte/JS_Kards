class FlashcardLogic {
    constructor(data, ui) {
        this.data = data;
        this.ui = ui;
        this.exposeToWindow();
        this.bindEvents();
        this.refresh();
        setInterval(() => this.data.save(), 5000);
    }

    bindEvents() {
        this.ui.addDeckBtn.onclick = () => this.addDeck();
        this.ui.deckSel.onchange = (e) => this.changeDeck(e);
        this.ui.addBtn.onclick = () => this.addCard();
        this.ui.unlearnedCb.onchange = () => this.refresh();
        this.ui.shufBtn.onclick = () => this.shuffle();
        this.ui.flipBtn.onclick = () => this.flip();
        this.ui.prevBtn.onclick = () => this.prev();
        this.ui.nextBtn.onclick = () => this.next();
    }

    refresh() {
        this.ui.drawList(this.data);
        this.data.buildLearnArr(this.ui.unlearnedCb.checked);
        this.ui.drawStudy(this.data);
    }

    addDeck() {
        let name = this.ui.newDeckInp.value.trim();
        if (name === "") return;
        this.data.addDeck(name);
        this.ui.newDeckInp.value = "";
        this.refresh();
    }

    changeDeck(e) {
        this.data.curDeckId = parseInt(e.target.value);
        this.refresh();
    }

    addCard() {
        let q = this.ui.qInp.value.trim();
        let a = this.ui.aInp.value.trim();
        if (q === "" || a === "") return;

        this.data.addCard(q, a);
        this.ui.qInp.value = "";
        this.ui.aInp.value = "";
        this.refresh();
    }

    delCard(id) {
        this.data.deleteCard(id);
        this.refresh();
    }

    editCard(id) {
        let el = this.data.getCard(id);
        if (el) {
            this.ui.qInp.value = el.q;
            this.ui.aInp.value = el.a;
            this.delCard(id);
        }
    }

    checkCard(id) {
        this.data.toggleDone(id);
        this.refresh();
    }

    shuffle() {
        this.data.shuffleLearnArr();
        this.ui.drawStudy(this.data);
    }

    flip() {
        this.data.isQ = !this.data.isQ;
        this.ui.drawStudy(this.data);
    }

    prev() {
        if (this.data.learnId > 0) {
            this.data.learnId--;
            this.data.isQ = true;
            this.ui.drawStudy(this.data);
        }
    }

    next() {
        if (this.data.learnId < this.data.learnArr.length - 1) {
            this.data.learnId++;
            this.data.isQ = true;
            this.ui.drawStudy(this.data);
        }
    }

    exposeToWindow() {
        window.delCard = (id) => this.delCard(id);
        window.editCard = (id) => this.editCard(id);
        window.checkCard = (id) => this.checkCard(id);
    }
}

const appData = new FlashcardData();
const appUI = new FlashcardUI();
const app = new FlashcardLogic(appData, appUI);