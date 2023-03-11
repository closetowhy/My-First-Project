let savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];

let wordTableBody = document.getElementById('word-table-body');

for (let i = 0; i < savedWords.length; i++) {
  let row = "<tr><td>" + savedWords[i].englishWord +
    "</td><td>" + savedWords[i].translation + "</td><td>" +
    savedWords[i].transcription +
    "</td><td><button class='delete-btn'>Delete</button></td></tr>";

  wordTableBody.insertAdjacentHTML('beforeend', row);
}



let addWordBtn = document.getElementById('add-word-btn');

addWordBtn.addEventListener('click', function (event) {
  event.preventDefault();
  let englishWord = document.getElementById('english-word').value;
  let translation = document.getElementById('translation').value;
  let transcription = document.getElementById('transcription').value;

  if (/^\s*$/.test(englishWord) || /^\s*$/.test(translation)) {
    // alert('Please enter an English word and a translation.');
    if (/^\s*$/.test(englishWord)) {
      document.querySelector('#english-word').classList.add('is-invalid');
    }
    if (/^\s*$/.test(translation)) {
      document.querySelector('#translation').classList.add('is-invalid');
    }
  } else {
    document.querySelector('#english-word').classList.remove('is-invalid');
    document.querySelector('#translation').classList.remove('is-invalid');

    let row = "<tr>" +
      "<td>" + englishWord + "</td>" +
      "<td>" + translation + "</td>" +
      "<td>" + transcription + "</td>" +
      "<td><button class='delete-btn'>Delete</button></td>" +
      "<td><button class='spell-btn'>&#x1F50A</button></td>" +
      "<td><button class='learned-btn'>Learned</button></td>" +
      "</tr>";

    wordTableBody.insertAdjacentHTML('beforeend', row);
    document.getElementById('english-word').value = '';
    document.getElementById('translation').value = '';
    document.getElementById('transcription').value = '';


    // Save to local storage
    let wordData = {
      englishWord: englishWord,
      translation: translation,
      transcription: transcription
    };
    savedWords.push(wordData);
    localStorage.setItem('savedWords', JSON.stringify(savedWords));
  }
});

// Add "Spell" buttons
document.querySelectorAll('.table tbody tr').forEach((row) => {
  const spellButton = document.createElement('button');
  spellButton.innerHTML = '&#x1F50A';
  spellButton.classList.add('spell-btn');
  const buttonCell = document.createElement('td');
  buttonCell.appendChild(spellButton);
  row.appendChild(buttonCell);
});


// Add "Learned" buttons
document.querySelectorAll('.table tbody tr').forEach((row) => {
  const spellButton = document.createElement('button');
  spellButton.textContent = 'Learned';
  spellButton.classList.add('learned-btn');
  const buttonCell = document.createElement('td');
  buttonCell.appendChild(spellButton);
  row.appendChild(buttonCell);
});



// Spell button   
wordTableBody.addEventListener('click', (event) => {
  if (event.target.classList.contains('spell-btn')) {
    const row = event.target.parentNode.parentNode;
    let englishWord = row.querySelector('td:first-child').textContent;
    // console.log(englishWord);
    englishWord = encodeURIComponent(englishWord);
    let url = "https://translate.google.com/translate_tts?tl=en&q=" + englishWord + "&client=tw-ob";
    let audioElement = document.querySelector("audio");
    audioElement.setAttribute("src", url);
    audioElement.play();
  }
});


// Delete button
wordTableBody.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete-btn')) {
    let row = event.target.parentNode.parentNode;
    let rowIndex = row.rowIndex - 1;
    wordTableBody.deleteRow(rowIndex);
    savedWords.splice(rowIndex, 1);
    localStorage.setItem('savedWords', JSON.stringify(savedWords));
  }
});


//Learned button
wordTableBody.addEventListener('click', function (event) {
  if (event.target.classList.contains('learned-btn')) {

    const row = event.target.closest('tr');

    const englishWord = row.querySelector('td:first-child').textContent;

    row.remove();

    const learnedWords = JSON.parse(localStorage.getItem('learnedWords')) || [];
    learnedWords.push(englishWord);
    localStorage.setItem('learnedWords', JSON.stringify(learnedWords));
    
    // event.target.disabled = true;
    // event.target.textContent = 'Learned';


    // Find the index of the word in the savedWords array
    const wordIndex = savedWords.findIndex((word) => word.englishWord === englishWord);
    if (wordIndex !== -1) {
      // If the word is found in the array, remove it
      savedWords.splice(wordIndex, 1);
      localStorage.setItem('savedWords', JSON.stringify(savedWords));
    }
  }
});




// Add an event listener to the button
let showLearnedWordsButton = document.getElementById('show-learned-words-btn');
showLearnedWordsButton.addEventListener('click', () => {
  // Getlocal storage
  let learnedWords = JSON.parse(localStorage.getItem('learnedWords')) || [];

  let modal = document.getElementById('modal');
  let list = document.getElementById('learned-words-list');
  let wordCount = document.getElementById('word-count');

  // Clearlist
  list.innerHTML = '';
  wordCount.innerHTML = '';


  for (let i = 0; i < learnedWords.length; i++) {
    let word = learnedWords[i];
    let listItem = document.createElement('li');
    listItem.textContent = word;
    list.appendChild(listItem);
  }


  modal.style.display = 'block';
  wordCount.textContent = `You learned ${learnedWords.length} words.`;

  //Close button
  let closeButton = document.getElementsByClassName('close')[0];
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

});



//-------------Quiz-----------------//

const tableBody = document.getElementById('word-table-body');
const rows = Array.from(tableBody.children);

// Randomize order of rows
function randomizeRows() {
  const tableBody = document.getElementById('word-table-body');
  const rows = Array.from(tableBody.children);

  for (let i = rows.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rows[i], rows[j]] = [rows[j], rows[i]];
  }
  tableBody.append(...rows);
}

//Reset order of rows
function resetRows() {
  const tableBody = document.getElementById('word-table-body');
  const rows = Array.from(tableBody.children);

  rows.sort((a, b) => a.dataset.index - b.dataset.index);
  tableBody.append(...rows);
}



// Add dataset index to each row for resetting the order
rows.forEach((row, index) => row.dataset.index = index);


const quizButton = document.getElementById('quiz-button');
const stopButton = document.getElementById('stop-button');
const englishCells = document.querySelectorAll('#word-table-body td:nth-of-type(1)');
let originalBackgroundColors = [];
let originalTextColors = [];
const learnedBtns = document.querySelectorAll('.learned-btn');
const spellBtns = document.querySelectorAll('.spell-btn');
const deleteBtns = document.querySelectorAll('.delete-btn');


function checkInputsDisabled() {
  const inputs = document.querySelectorAll('#word-table-body input');
  for (let i = 0; i < inputs.length; i++) {
    if (!inputs[i].disabled) {
      return false;
    }
  }
  return true;
}

quizButton.addEventListener('click', quizEnglishWords);

function quizEnglishWords() {
  const englishCells = document.querySelectorAll('#word-table-body td:nth-of-type(1)');
  const learnedBtns = document.querySelectorAll('.learned-btn');
  const spellBtns = document.querySelectorAll('.spell-btn');
  const deleteBtns = document.querySelectorAll('.delete-btn');
  learnedBtns.forEach(btn => btn.style.display = 'none');
  spellBtns.forEach(btn => btn.style.display = 'none');
  deleteBtns.forEach(btn => btn.style.display = 'none');

  englishCells.forEach(cell => {
    stopButton.style.display = 'inline';
    quizButton.style.display = 'none';
    originalBackgroundColors.push(cell.style.backgroundColor);
    originalTextColors.push(cell.style.color);

    cell.style.backgroundColor = 'lightblue';
    cell.style.color = 'lightblue';
    cell.style.position = 'relative';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter English Word';
    input.style.position = 'absolute';
    input.style.top = 0;
    input.style.left = 0;
    input.style.width = '100%';
    input.style.height = '100%';
    cell.appendChild(input);

    const answerCell = cell.nextElementSibling.nextElementSibling;

    answerCell.style.backgroundColor = 'white';
    answerCell.style.color = 'white';

    const transcriptionHeaders = document.querySelectorAll('thead th:nth-of-type(3)');
    transcriptionHeaders.forEach(header => header.textContent = 'Your answer is');
    const deleteHeaders = document.querySelectorAll('thead th:nth-of-type(4)');
    deleteHeaders.forEach(header => header.textContent = '');
    const spellHeaders = document.querySelectorAll('thead th:nth-of-type(5)');
    spellHeaders.forEach(header => header.textContent = '');
    const learnedHeaders = document.querySelectorAll('thead th:nth-of-type(6)');
    learnedHeaders.forEach(header => header.textContent = '');

    input.addEventListener('input', function () {
      const englishWord = cell.textContent.trim();
      if (input.value.trim().toLowerCase() === englishWord.toLowerCase()) {
        answerCell.style.backgroundColor = 'lightgreen';
        answerCell.style.color = 'black';
        answerCell.textContent = 'Correct!';
        input.disabled = true;

        if (checkInputsDisabled()) {
          setTimeout(() => {
            alert('Congratulations, everything is correct!');
            stopGame();
          }, 1500);

        }
      } else {
        answerCell.style.backgroundColor = 'pink';
        answerCell.style.color = 'black';
        answerCell.textContent = 'Wrong :(';
      }
    });
    randomizeRows();
  });

  const transcriptionCells = document.querySelectorAll('tbody td:nth-of-type(3)');
  transcriptionCells.forEach(cell => {
    cell.dataset.originalText = cell.textContent;
    cell.dataset.originalStyle = cell.style.cssText;

  });
}


function stopGame() {
  const learnedBtns = document.querySelectorAll('.learned-btn');
  const spellBtns = document.querySelectorAll('.spell-btn');
  const deleteBtns = document.querySelectorAll('.delete-btn');

  learnedBtns.forEach(btn => btn.style.display = 'inline-block');
  spellBtns.forEach(btn => btn.style.display = 'inline-block');
  deleteBtns.forEach(btn => btn.style.display = 'inline-block');

  const allEnglishCells = document.querySelectorAll('#word-table-body td:nth-of-type(1)');
  allEnglishCells.forEach((cell, index) => {
    cell.style.backgroundColor = originalBackgroundColors[index];
    cell.style.color = originalTextColors[index];
    const input = cell.querySelector('input');
    if (input) {
      input.remove();
    }
    resetRows();
  });

  // clear the original background and text color arrays
  originalBackgroundColors = [];
  originalTextColors = [];

  stopButton.style.display = 'none';
  quizButton.style.display = 'inline';


  const transcriptionHeaders = document.querySelectorAll('thead th:nth-of-type(3)');
  transcriptionHeaders.forEach(header => header.textContent = 'Transcription');

  const deleteHeaders = document.querySelectorAll('thead th:nth-of-type(4)');
  deleteHeaders.forEach(header => header.textContent = 'Delete');

  const spellHeaders = document.querySelectorAll('thead th:nth-of-type(5)');
  spellHeaders.forEach(header => header.textContent = 'Spell');

  const learnedHeaders = document.querySelectorAll('thead th:nth-of-type(6)');
  learnedHeaders.forEach(header => header.textContent = 'Learned');



  const transcriptionCells = document.querySelectorAll('tbody td:nth-of-type(3)');
  transcriptionCells.forEach(cell => {
    cell.textContent = cell.dataset.originalText;
    cell.style.cssText = cell.dataset.originalStyle;
    cell.style.color = 'black';
  });

}

stopButton.addEventListener('click', stopGame);