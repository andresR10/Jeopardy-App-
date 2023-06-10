let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {

let idArr = [];

let response = await axios.get(`http://jservice.io/api/categories?count=100`);

let ids = response.data.map(id => ({
    id: id.id
}))

let idArr2 = [];

for(let i = 0; i < 100; i++){
    let id2 = ids[i].id;
    idArr2.push(id2);
}

for(let i = 0; i < 6; i++){
    let randId = Math.floor(Math.random() * 100000);

    if(idArr2.indexOf(randId) !== -1){
        idArr.push(randId);
    }
    else{
        i--;
    }
}

console.log(idArr);

return idArr;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catIds) {
    for(let i = 0; i < 6; i++){
        let response = await axios.get(`http://jservice.io/api/category?id=${catIds[i]}`);

        categories.push(response.data); 
}
    return Object.assign({}, categories);
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
        let $tr = $('<tr>');
        let numOfCats = 6;
        let cluesPerCat = 5;

        for (let iOfCat = 0; iOfCat < numOfCats; iOfCat++) {
            $tr.append($('<th>').text(categories[iOfCat].title))
    }   
        $('#jeopardy thead').append($tr);


        for (let iOfClue = 0; iOfClue < cluesPerCat; iOfClue++) {
            let $tr = $('<tr>');
            for (let iOfCat = 0; iOfCat < numOfCats; iOfCat++) {
                $tr.append($("<td>").attr("id", `${iOfCat}-${iOfClue}`).text("?"));
            }
            $('#jeopardy tbody').append($tr);
        }

    }

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

async function handleClick(e) {
    e.preventDefault();

    let clickedCell = e.target;

    if(categories[clickedCell.id.substring(0, 1)].clues[clickedCell.id.substring(2)] === undefined){
        clickedCell.classList.add("gray");
    }

    if(clickedCell.showing === undefined){
        clickedCell.innerText = categories[clickedCell.id.substring(0, 1)].clues[clickedCell.id.substring(2)].question;
        clickedCell.showing = "question";
        } 
    else if(clickedCell.showing === 'question'){
        clickedCell.innerText = categories[clickedCell.id.substring(0, 1)].clues[clickedCell.id.substring(2)].answer;
        clickedCell.showing = "answer";
    }
    else if(clickedCell.showing === 'answer'){
        return;
}
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    let ids = await getCategoryIds();
    await getCategory(ids);
    
    let restartBtn = document.createElement("button");
    restartBtn.innerText = "Restart";
    $("body").append(restartBtn);
    restartBtn.addEventListener("click", function (e){
        e.preventDefault();
        $("body").empty();
        categories = [];
        setupAndStart();
    })

    let table = document.createElement("table");
    $(table).attr('id', "jeopardy");
    $("body").append(table);

    let thead = document.createElement("thead");

    table.append(thead);

    let tbody = document.createElement("tbody");


    table.append(tbody);

    fillTable();
};

/** On click of start / restart button, set up game. */

// TODO

let startBtn = document.createElement("button");
startBtn.innerText = "Start";
$("body").append(startBtn);
startBtn.addEventListener("click", function (e){
    e.preventDefault();
    setupAndStart();
})

/** On page load, add event handler for clicking clues */
// TODO
$("body").on("click", function (e){
    e.preventDefault();
    handleClick(e);
})