class Card {
    constructor(q, a) {
        this.id = Date.now();
        this.q = q;
        this.a = a;
        this.done = false;
    }
}

class FlashcardData {
    constructor() {
        let saved = localStorage.getItem('flashcards-deck');
        this.decks = saved ? JSON.parse(saved) : [{ name: "Основная колода", cards: [] }];
        
        if (this.decks.length === 0) {
            this.decks.push({ name: "Основная колода", cards: [] });
        }
        
        this.curDeckId = 0;
        this.learnArr = [];
        this.learnId = 0;
        this.isQ = true;
    }

    save() {
        localStorage.setItem('flashcards-deck', JSON.stringify(this.decks));
    }

    getCards() {
        if (!this.decks[this.curDeckId]) return [];
        return this.decks[this.curDeckId].cards;
    }

    addDeck(name) {
        this.decks.push({ name: name, cards: [] });
        this.curDeckId = this.decks.length - 1;
    }

    addCard(q, a) {
        this.getCards().push(new Card(q, a));
    }

    deleteCard(id) {
        this.decks[this.curDeckId].cards = this.getCards().filter(el => el.id !== id);
    }

    toggleDone(id) {
        let el = this.getCards().find(x => x.id === id);
        if (el) el.done = !el.done;
    }

    getCard(id) {
        return this.getCards().find(x => x.id === id);
    }

    buildLearnArr(onlyUnlearned) {
        if (onlyUnlearned) {
            this.learnArr = this.getCards().filter(el => el.done === false);
        } else {
            this.learnArr = [...this.getCards()];
        }
        this.learnId = 0;
        this.isQ = true;
    }

    shuffleLearnArr() {
        this.learnArr.sort(() => Math.random() - 0.5);
        this.learnId = 0;
        this.isQ = true;
    }
}