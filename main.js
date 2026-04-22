class Card {
    constructor(q, a) {
        this.id = Date.now();
        this.q = q;
        this.a = a;
        this.done = false;
    }
}

let saved = localStorage.getItem('flashcards-deck');
let decks = saved ? JSON.parse(saved) : [{ name: "Основная колода", cards: [] }];

if (decks.length === 0) {
    decks.push({ name: "Основная колода", cards: [] });
}

let curDeckId = 0;
let learnArr = [];
let learnId = 0;
let isQ = true;

setInterval(() => localStorage.setItem('flashcards-deck', JSON.stringify(decks)), 5000);

const getCards = () => {
    if (!decks[curDeckId]) return [];
    return decks[curDeckId].cards;
};

const drawStudy = () => {
    let prevBtn = document.getElementById('prevBtn');
    let nextBtn = document.getElementById('nextBtn');
    let flipBtn = document.getElementById('flipBtn');
    let cardText = document.getElementById('cardText');
    let prog = document.getElementById('prog');

    if (learnArr.length === 0) {
        cardText.innerText = "Колода пуста";
        prog.innerText = "0/0";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        flipBtn.disabled = true;
        return;
    }

    flipBtn.disabled = false;
    let el = learnArr[learnId];
    cardText.innerText = isQ ? el.q : el.a;
    prog.innerText = (learnId + 1) + " / " + learnArr.length;

    prevBtn.disabled = (learnId === 0);
    nextBtn.disabled = (learnId === learnArr.length - 1);
};

const draw = () => {
    let deckSel = document.getElementById('deckSel');
    deckSel.innerHTML = "";
    decks.forEach((deck, i) => {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerText = deck.name;
        if (i === curDeckId) opt.selected = true;
        deckSel.appendChild(opt);
    });

    let tBody = document.getElementById('tBody');
    tBody.innerHTML = "";
    getCards().forEach(el => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${el.q}</td>
            <td>${el.a}</td>
            <td><input type="checkbox" ${el.done ? 'checked' : ''} onchange="window.checkCard(${el.id})"></td>
            <td>
                <button onclick="window.editCard(${el.id})">Ред</button>
                <button onclick="window.delCard(${el.id})">Удал</button>
            </td>
        `;
        tBody.appendChild(tr);
    });

    let cb = document.getElementById('unlearnedCb').checked;
    if (cb) {
        learnArr = getCards().filter(el => el.done === false);
    } else {
        learnArr = [...getCards()];
    }
    
    learnId = 0;
    isQ = true;
    drawStudy();
};

window.delCard = (id) => {
    decks[curDeckId].cards = getCards().filter(el => el.id !== id);
    draw();
};

window.editCard = (id) => {
    let el = getCards().find(x => x.id === id);
    if (el) {
        document.getElementById('qInp').value = el.q;
        document.getElementById('aInp').value = el.a;
        window.delCard(id);
    }
};

window.checkCard = (id) => {
    let el = getCards().find(x => x.id === id);
    if (el) {
        el.done = !el.done;
        draw();
    }
};

document.getElementById('addDeckBtn').onclick = () => {
    let name = document.getElementById('newDeckInp').value.trim();
    if (name === "") return;
    decks.push({ name: name, cards: [] });
    document.getElementById('newDeckInp').value = "";
    curDeckId = decks.length - 1;
    draw();
};

document.getElementById('deckSel').onchange = (e) => {
    curDeckId = parseInt(e.target.value);
    draw();
};

document.getElementById('addBtn').onclick = () => {
    let qInp = document.getElementById('qInp');
    let aInp = document.getElementById('aInp');
    let q = qInp.value.trim();
    let a = aInp.value.trim();
    if (q === "" || a === "") return;

    let newCard = new Card(q, a);
    
    getCards().push(newCard);
    
    qInp.value = "";
    aInp.value = "";
    draw();
};

document.getElementById('unlearnedCb').onchange = () => draw();

document.getElementById('shufBtn').onclick = () => {
    learnArr.sort(() => Math.random() - 0.5);
    learnId = 0;
    isQ = true;
    drawStudy();
};

document.getElementById('flipBtn').onclick = () => {
    isQ = !isQ;
    drawStudy();
};

document.getElementById('prevBtn').onclick = () => {
    if (learnId > 0) {
        learnId--;
        isQ = true;
        drawStudy();
    }
};

document.getElementById('nextBtn').onclick = () => {
    if (learnId < learnArr.length - 1) {
        learnId++;
        isQ = true;
        drawStudy();
    }
};

draw();