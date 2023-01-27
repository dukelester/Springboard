const $gameHolder = $('#game-holder');
const $gameSpace = $('#game-space');
const $startButton = $('#restart');
const $body = $('body');
const $imgHolder = $('#loadingHolder');

async function getCategoryIds() {
    const idInfo = await axios.get('http://jservice.io/api/categories?count=100');
    let catId = [];
    for (let i = 0; i <= 5; i++) { 
        const index = Math.floor(Math.random() * 100-i); 
        const item = idInfo.data[index];
        if (item.clues_count > 5) {
        idInfo.data.splice(index, 1); 
        catId.push(item.id); 
        }
        else {
            i--;
        }
    }
    return catId; 
}

async function getCategory() {
    const catIds = await getCategoryIds(); 
    let obj = {} 
    for (let i = 0; i < 6; i++) {
        let cat = await axios.get(`http://jservice.io/api/category?id=${catIds[i]}`); 
        obj[cat.data.title] = cat.data.clues; 
    }
    return obj;
}

async function fillTable(categories, data) {
    const table = document.createElement('table'); 
    table.classList.add('table'); 
    const tHRow = table.insertRow(); 
    tHRow.setAttribute('id', 'tHRow'); 
    const data2 = await data; 
    for (n of categories) { 
        const hCell = tHRow.insertCell(); 
        const uCN = n.toUpperCase(); 
        hCell.innerHTML = `<b> ${uCN} </b>`; 
    }
    for (let j = 0; j < data2.length; j++) {  
        const row = document.createElement('tr'); 
        table.appendChild(row); 
        for (let i = 0; i < 6; i++) { 
            const cell = document.createElement('td'); 
            cell.classList.add('bodyCell'); 
            row.appendChild(cell); 
            cell.innerHTML = `<div class = pH> <div class = holder>?</div> <div class = question hidden >${data2[i][j].question} </div>
            <div class = response hidden >${data2[i][j].answer}</div></div>` ; 
        }
        
    }
    $gameSpace.append(table); 
}

$gameSpace.on('click', 'td', function handleClick(evt) { 
    const nextSibling = evt.target.nextElementSibling; 
    if (nextSibling.hasAttribute('hidden')) { 
        evt.target.setAttribute('style', 'display : none')  
    }
    nextSibling.removeAttribute('hidden');
});

function showLoadingView()
