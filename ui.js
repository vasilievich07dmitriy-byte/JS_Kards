class FlashcardUI {
    constructor() {
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.flipBtn = document.getElementById('flipBtn');
        this.cardText = document.getElementById('cardText');
        this.prog = document.getElementById('prog');
        this.deckSel = document.getElementById('deckSel');
        this.tBody = document.getElementById('tBody');
        this.unlearnedCb = document.getElementById('unlearnedCb');
        this.qInp = document.getElementById('qInp');
        this.aInp = document.getElementById('aInp');
        this.newDeckInp = document.getElementById('newDeckInp');
        this.addDeckBtn = document.getElementById('addDeckBtn');
        this.addBtn = document.getElementById('addBtn');
        this.shufBtn = document.getElementById('shufBtn');
    }

    drawStudy(data) {
        if (data.learnArr.length === 0) {
            this.cardText.innerText = "Колода пуста";
            this.prog.innerText = "0/0";
            this.prevBtn.disabled = true;
            this.nextBtn.disabled = true;
            this.flipBtn.disabled = true;
            return;
        }

        this.flipBtn.disabled = false;
        let el = data.learnArr[data.learnId];
        this.cardText.innerText = data.isQ ? el.q : el.a;
        this.prog.innerText = (data.learnId + 1) + " / " + data.learnArr.length;

        this.prevBtn.disabled = (data.learnId === 0);
        this.nextBtn.disabled = (data.learnId === data.learnArr.length - 1);
    }

    drawList(data) {
        this.deckSel.innerHTML = "";
        data.decks.forEach((deck, i) => {
            let opt = document.createElement('option');
            opt.value = i;
            opt.innerText = deck.name;
            if (i === data.curDeckId) opt.selected = true;
            this.deckSel.appendChild(opt);
        });

        this.tBody.innerHTML = "";
        data.getCards().forEach(el => {
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
            this.tBody.appendChild(tr);
        });
    }
}