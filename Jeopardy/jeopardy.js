const $gameHolder = $('#game-holder');
const $gameSpace = $('#game-space');
const $startButton = $('#restart');
const $body = $('body');
const $imgHolder = $('#loadingHolder');

async function getCategoryIds() {
    const idInfo = await axios.get('http://jservice.io/api/categories?count=100');
    let catId = [];
    for (let i = 0; i <= 5; i++) { //get six random id's
        const index = Math.floor(Math.random() * 100 - i); // this will generate a random index to access from the idInfo
        const item = idInfo.data.at(index); //create item variable based on value returned from index
        if (item.clues_count > 5) {
        idInfo.data.splice(index, 1); // remove that item from the array so it isn't selected twice 
        catId.push(item.id); //put that item into the catId to be transferred to the next function 
        }
        else {
            i-- //decrements the loop in case the category contains less than six clues
        }
    }
    return catId; //return catId to be used in other functions 
}

 async function getCategory() {
    const catIds = await getCategoryIds(); //wait for the getCategoryIds array to be generated 
    let obj = {} //create empty object to put title and clues in
    for (let i = 0; i < 6; i++) {
        let cat = await axios.get(`http://jservice.io/api/category?id=${catIds[i]}`); //get title based on id returned from catIds
        obj[cat.data.title] = cat.data.clues; //add the title and clues to object as key value pair 
    }
    return obj
}

async function fillTable(categories, data) {
    const table = document.createElement('table') //create table element
    table.classList.add('table') //add class to the table for easy reference 
    const tHRow = table.insertRow(); //add header row
    tHRow.setAttribute('id', 'tHRow'); //add id for easy styling 
    const data2 = await data; //import data
    for (n of categories) { //loop through each category to get title, where categories is an array containing the title of the category 
        const hCell = tHRow.insertCell(); //insert a cell for each category
        const uCN = n.toUpperCase(); //uppercase the n string for stylistic purposes
        hCell.innerHTML = `<b> ${uCN} </b>`; //add the category to the head cell and bold it for stylistic purposes 
        
    }
    for (let j = 0; j < data2.length; j++) {  //create a loop to make a new, individual row for each item within the main array data2, which is an array full of subarrays that contain multiple objects within 
        const row = document.createElement('tr'); //create a row for each iteration of the loop
        table.appendChild(row); //add each row to the table 
        for (let i = 0; i < 6; i++) { //create inner loop to iterate over each subarray based on the value of i and prior loop value j
            const cell = document.createElement('td'); //create cell to hold information
            cell.classList.add('bodyCell'); //add class for easy styling 
            row.appendChild(cell); //add each cell to the row
            cell.innerHTML = `<div class = pH> <div class = holder>?</div> <div class = question hidden >${data2[i][j].question} </div>
            <div class = response hidden >${data2[i][j].answer}</div></div>` ; //this creates a nested div situation to interact with the $gameSpace event handler 
        }
        
    }
    $gameSpace.append(table); //append table to $gameSpace div 
}

$gameSpace.on('click', 'td', function handleClick(evt) { //handler to cycle through placeholder, question, and response 
    const nextSibling = evt.target.nextElementSibling; //creates variable to alter the adjacent div element, as defined in the fillTable function
    if (nextSibling.hasAttribute('hidden')) { //check to see if nextSibling has attribute hidden, if so, hide the target of the click event;
        evt.target.setAttribute('style', 'display : none')  
    }
    nextSibling.removeAttribute('hidden') //reveals nextSibling
})

function showLoadingView() { //function to show load circle 
    if (!document.querySelector('.table')) { //if the table doesn't exist, add the following to the page
            const img = document.createElement('img'); //new image 
            img.classList.add('img');
            img.setAttribute('src', 'jeopardy.gif'); //set image attribute to loading gif
             $imgHolder.append(img) } //add img to the $imgHolder element to put on page 
}

function hideLoadingView() { //check to remove loading gif 
    setInterval(() => { //use a set-interval function to constantly check if the condition below is met, so the gif can be removed whenever the table is generated 
        if (document.querySelector('.table')) { //check to see if the table exists
            $('img').remove(); //remove the image
        }
    }, 50) //low time between function runs to respond as quickly as possible 
}


async function setupAndStart() {
    const obj = await getCategory(); //run getCategory function and set results to variable obj
    const categories = Object.keys(obj) //let the categories be an array of the keys from the getCategory function
    const data = Object.values(obj) //let remaining data be set in separate array for easy handling and separation
    fillTable(categories, data); //run fillTable function, passing in arrays categories and data
    
}


$gameHolder.on('submit', async function(e) { //event handler for submit button
    e.preventDefault(); //prevent page refresh
    $gameSpace.empty(); //clear out gameSpace if there was already a board in place
    showLoadingView(); //run showLoadingView function so loading gif can be shown
    hideLoadingView(); //begin to run the hideLoadingView function so gif can be removed as soon as the table is added 
    await setupAndStart(); //run setupAndStart function 
    $startButton.val('Restart Game');  //change text of start game button to restart game to accurately reflect the function of button 
})
