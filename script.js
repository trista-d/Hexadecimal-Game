if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
} // if

let colorSample = document.getElementById("colorSample"); // the color sample element
let codeContainer = document.getElementById("code"); //  container element for question in 'choosing between colors' mode
let mark = document.getElementById("mark"); // container element for 'incorrect' and 'correct' messages
let answers = []; // array of the different answer elements
let correctColorCode = null; // color code of the actual color sample
let score = 0; // number of correct answers
let total = 0; // total number of questions
let level = 2; // start on the easiest level. Easy = 2, normal = 4, hard = 8
let mode = -1; // -1 = user is choosing between codes, -2 = user is choosing between colors
let root = document.documentElement; // used to access CSS custom properties
// start game
window.onload = initGame();

// initialize gameplay
function initGame() {
  let answerContainer = document.getElementById("answer-container");
  
  // initialize array of elements with all possible answers
  for (let i = level; i > 0; i--) {
    let choice = document.createElement('DIV');
    choice.setAttribute ('class', 'answer btn btn-dark');
    answers.push(choice);
    answerContainer.appendChild(choice);
  } // for

  // add onclick events to all possible answers
  for (let i = 0; i < answers.length; i++) {
    answers[i].addEventListener("click", function() {
      markIt(this);
    });
  } // for

  let grid = document.getElementById("grid");
  
  // give answers proper spacing
  if (level == 2) {
      grid.style.left = "45%";
  } else if (window.matchMedia('(max-width: 900px)').matches) {
      grid.style.left = "44%";
      grid.style.top = "70%";
  } else {
      grid.style.left = "23%";
  } // else

  // Load a new question
  loadNewQuestion();
};

// marks current question
function markIt(elem) {
  let gotItRight = false;
  total++;
  let chosenCode = ''; // user's guess
  
  // check to see if user is guessing code or color
  if (mode == -1) {
    chosenCode = elem.innerHTML;
  } else {
    
    // backgroundColor is in rgb
    chosenCode = convertToHex(elem.style.backgroundColor);  
  } // else
  
    if (chosenCode == correctColorCode) {
      score++;
      gotItRight = true;
    } // else
  
  document.getElementById("score").innerHTML = score + " / " + total;

  if (total == 10) {
    let end = document.getElementById("endgame");  
    end.innerHTML += "You got " + (score / total * 100) + "% of questions right" +
                              "<br><br><button class='btn btn-dark' onclick='resetGame(level)'>Play again</button>";
    
    document.getElementById('sample-container').style.zIndex = "99";
    document.getElementById("blockClicks").style.display = "block";
    end.style.display = "inline-block";
    codeContainer.style.display = "none";
    mark.style.display = "none";
    
    // stop user from choosing answers
    for (let i = 0; i < answers.length; i ++) {
      answers[i].removeAttribute("onclick");
    } // for
    
    return;
  } // if

  window.setTimeout(function() {
    if (gotItRight) {
      mark.innerHTML = "&nbsp;Correct!&nbsp;";
    } else {
      mark.innerHTML = "Incorrect!";
    } // else
    mark.style.display = "inline-block";
  }, 100);
  
  
  // stop user from clicking and answering question without seeing it
  root.style.setProperty('--screenWidth', window.innerWidth + "px");
  root.style.setProperty('--screenHeight', window.innerHeight + "px");
  document.getElementById("blockClicks").style.display = "block";

  window.setTimeout(function() {
    loadNewQuestion();
  }, 1300);
} // markIt

// Load a new question
function loadNewQuestion() {
  
  // get a color for colorSample
  let colorCode = getRandomHexCode();
  mark.style.display = 'none';

  // pick a random location for the correct answer
  let solution = Math.floor(Math.random() * level);

  // display answers and questions for correct game mode
  if (mode == -1) {
    colorSample.style.fill = colorCode;
  for (let i = 0; i < answers.length; i++) {
    if (i == solution) {
      answers[i].innerHTML = colorCode;
    } else {
      answers[i].innerHTML = getRandomHexCode();
    } // else
  } // for

} else { 
      codeContainer.style.display = "block"
      codeContainer.innerHTML = colorCode;
      colorSample.style.fill = "#eee";
      
      for (let i = 0; i < answers.length; i++) {
        answers[i].innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    if (i == solution) {
      answers[i].style.backgroundColor = colorCode;
    } else {
      answers[i].style.backgroundColor = getRandomHexCode();
    } // else
  } // for
} // else
  
  // store correct answer to this question globally
  correctColorCode = colorCode;
  
    // let user click again
  document.getElementById("blockClicks").style.display = "none";
} // loadNewQuestion

// create random hex code
function getRandomHexCode() {
  let result = []; // final code
  let hexRef = ["0","1","2","3","4","5","6","7",
                "8","9","a","b","c","d","e","f"];

  result.push("#");

  for (let n = 0; n < 6; n++) {
    result.push(hexRef[Math.floor(Math.random() * 16)]);
  } // for

  return result.join(""); // #rrggbb
} // getRandomHexCode

// re-initialize variables and restart game
function resetGame(difficulty) {
  correctColorCode = null;
  score = 0;
  total = 0; 
  level = difficulty;
  answers = [];
  
  if (mode == -1) {
   codeContainer.style.display = "none";  
  } // if
  
  document.getElementById('sample-container').style.zIndex = "0";
  document.getElementById("blockClicks").style.display = "none";
  document.getElementById('answer-container').innerHTML = '';
  document.getElementById("score").innerHTML = score + " / " + total;
  document.getElementById("endgame").style.display = "none";
  
  initGame();
} // resetGame


// change between guessing color or code
function switchMode(type) {
  mode = type;
  resetGame(level);
} // switchMode

function convertToHex(rgb) {
  
  // get index of seperator ","  
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  
  // split at seperator
  rgb = rgb.substr(4).split(")")[0].split(sep);

  // turn rgb numbers into base 16 values
  let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);

  // add zereoes if base 16 values are 1 digit
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
} // convertToHex