
//retrieve information in variables through local storage from app.js - which was entered on index.html (the home page for the quiz)
//includes player name which is displayed up top, and category, which will help determine the type of questions

let playerName = document.querySelector("#player_name");
const newPlayer = localStorage.getItem("nickname");
const newCategory = localStorage.getItem("category");
playerName.textContent = newPlayer;

let questionInfoBox = document.querySelector("#question_box");
let triviaQuestion = document.querySelector("#question_text");
let selectAnswerButtons = document.querySelectorAll(".ans_radio_btn");
let quizAnswers = document.querySelectorAll(".answers");
let rightOrWrongSymbols = document.querySelectorAll(".right_wrong_symbol");
let messageBelowQuestion = document.querySelector("#answer_info");

let currentScore = document.querySelector("#current_score");
let currentTime = document.querySelector("#current_time");
let questionNumber = document.querySelector("#question_number");

let submitAnswerButton = document.querySelector("#submit_ans_btn");
let nextQuestionButton = document.querySelector("#next_question");

//hides the div with the concluding score and ranking at start of quiz
let finalScoreMessage = document.querySelector("#final_stats");
const nameFinal = document.querySelector("#name_final");
const finalScore = document.querySelector("#points_final");
const amountOfQuestions = document.querySelector("#question_amount");
const ranking = document.querySelector("#ranking");

//url will be used to get category of questions for quiz bowl
let url = `https://the-trivia-api.com/api/questions?categories=${newCategory}&limit=1`;
let numberPoints = 0;
let timerClock;
let currentQuestionAmount = 0;
let currentQuestionNumber = 0;
const totalQuestionAmount = 25;
let paused = false;
let answersArray;
let rankingsArray = [
  "Knowledgable Beyond the Universe",
  "Einstein Smart",
  "One Smart Cookie",
  "Eh, Not Good, not Bad",
  "You Got Some Studying to do",
  "Please, please Read Some Books",
];

const rankings = {
  "Knowledgable Beyond the Universe": 24,
  "Einstein Smart": 21,
  "One Smart Cookie": 16,
  "Eh, Not Good, not Bad": 12,
  "You Got Some Studying to do": 5,
  "Please, please Read Some Books": 0,
};

//hides the final stats modal 
finalScoreMessage.classList.toggle("hidden"); 

//sets the initial question/total on the page
if ((currentQuestionNumber = 1)) {
  questionNumber.textContent = `${currentQuestionNumber} / ${totalQuestionAmount}`;
}

//calls function to call api and get question and answers to populate the quiz
getNewQuestionAndAnswers();

//function takes array parameter and mixes the order of the array elements (quiz answers)
function randomlyPositionAnswers(arr) {
  for (let answer = arr.length - 1; answer > 0; answer--) {
    let currentPosition = arr[answer];
    let position = Math.floor(Math.random() * answer);
    arr[answer] = arr[position];
    arr[position] = currentPosition;
  }
}

//function assigns answers from the answersArray and puts each answer in one element to display
function assignAnswers() {
  let numAnswers = 0;
  quizAnswers.forEach((oneAnswer) => {
    oneAnswer.innerText = answersArray[numAnswers];
    numAnswers++;
  
  });
}

//function deletes each answer from page - no longer visible
function deleteAnswers() {
  let numAnswers = 0;
  quizAnswers.forEach((oneAnswer) => {
    oneAnswer.innerText = "";
    numAnswers++;
  });
}

//function clears the old question, answers and right / wrong symbol to prepare for the next question
function clearAndReset() {
  answersArray = [];
  deleteAnswers();
  triviaQuestion.innerText = "";
  submitAnswerButton.disabled = false;
  messageBelowQuestion.innerHTML = "";

  selectAnswerButtons.forEach((radioBtn) => {
    radioBtn.checked = false;
  });
  rightOrWrongSymbols.forEach((symbol) => {
    symbol.innerText = "";
  });
}

function getNewQuestionAndAnswers() {
  //api call to get new question and answers
  // requestQuestion

  submitAnswerButton.disabled = true;
  nextQuestionButton.disabled = true;

  axios.get(url).then(function (response) {

    //takes the question from the response object and displays the question in triviaQuestion element
    triviaQuestion.innerText = response.data[0].question;
    let rightAnswer = response.data[0].correctAnswer;
    
    //answersArray is storing 4 answers, 1 incorrect, 3 correct pulled from response object -flatten nested array (incorrect answers) - make one array with 4 elements
    answersArray = [rightAnswer, response.data[0].incorrectAnswers].flat();
    // console.log(answersArray); //delete

    randomlyPositionAnswers(answersArray); //randomly positions order of elements in array

    assignAnswers(); //displays answers

    let timer = 30;
    timerClock = setInterval(() => {
      if (timer > -1) {
        currentTime.textContent = timer;
        selectAnswerButtons.forEach((radioBtn) => {
          if (radioBtn.checked === true) {
            submitAnswerButton.disabled = false;
          }
        });
      } else {
        submitAnswerButton.disabled = true;
        nextQuestionButton.disabled = false;
        messageBelowQuestion.innerText = `Sorry, you ran out of time.  No points this time. The correct answer was, of course, ${rightAnswer}. Keep trying!!`;
      }
      timer--;
    }, 1000);


    submitAnswerButton.addEventListener("click", () => {
      let numButton = 0;

      paused = true;

      selectAnswerButtons.forEach((answerBtn) => {
        let answerText = quizAnswers[numButton].innerText;

        if (answerBtn.checked === true) {
          submitAnswerButton.disabled = true;
          nextQuestionButton.disabled = false;

          if (answerText != rightAnswer) {
            //inserts wrong symbol after the radio button
            rightOrWrongSymbols[numButton].innerText = "❌";

            messageBelowQuestion.innerHTML = `Darn, good try, but incorrect!  The correct answer is actually ${rightAnswer} !`;
          } else if (answerText === rightAnswer) {
            rightOrWrongSymbols[numButton].innerText = "✔️";
            messageBelowQuestion.innerHTML =
              "Nice job!!  You are correct!  You get a point.  Keep going!!";
      
            numberPoints++;
            
            currentScore.innerHTML = numberPoints;
          }
        }

        clearInterval(timerClock);

        numButton++;
      });

      if (currentQuestionNumber == totalQuestionAmount) {
        nextQuestionButton.textContent = "Check out Scores!";
      }
    });
  });
}

nextQuestionButton.addEventListener("click", () => {

  if (!paused) {
    clearInterval(timerClock);
  }

 

  paused = false;

  currentQuestionAmount++;
  currentQuestionNumber++;

  nextQuestionButton.disabled = true;
  submitAnswerButton.disabled = false;

  let finalPlayerScore = currentScore.textContent;

  questionNumber.textContent = `${currentQuestionNumber} / ${totalQuestionAmount}`;
  
  if (currentQuestionAmount == totalQuestionAmount) {
    finalScoreMessage.classList.toggle("hidden");
    questionInfoBox.classList.add("hidden");
    nameFinal.textContent = newPlayer;
    finalScore.textContent = finalPlayerScore;

    switch (true) {
      case finalPlayerScore >= Object.values(rankings)[0]:
        ranking.textContent = Object.keys(rankings)[0];
        break;
      case finalPlayerScore >= Object.values(rankings)[1]:
        ranking.textContent = Object.keys(rankings)[1];
        break;
      case finalPlayerScore >= Object.values(rankings)[2]:
        ranking.textContent = Object.keys(rankings)[2];
        break;
      case finalPlayerScore >= Object.values(rankings)[3]:
        ranking.textContent = Object.keys(rankings)[3];
        break;
      case finalPlayerScore >= Object.values(rankings)[4]:
        ranking.textContent = Object.keys(rankings)[4];
        break;
      default:
        ranking.textContent = Object.keys(rankings)[5];
    }
  }

  clearAndReset();
  getNewQuestionAndAnswers();

});


