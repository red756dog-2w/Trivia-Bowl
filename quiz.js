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

let url = `https://the-trivia-api.com/api/questions?categories=${newCategory}&limit=1`;
// let timer = 10;
let numberPoints = 0;
let currentQuestionAmount = 1;
let currentQuestionNumber = 1;
const totalQuestionAmount = 7;
let paused = false;
let answersArray;
let rankingsArray = [
  "Knowledgable Beyond the Universe",
  "Einstein Smart",
  "One Smart Cookie",
  "Eh, Not Good, not Bad",
  "You Got Some Studying to do",
  "You Have Got to Read Some Books",
];

let sampleOne = totalQuestionAmount - 1;
let sampleTwo = totalQuestionAmount - 5;
let sampleThree = totalQuestionAmount - 6;

// use these ranks when testing 25 questions, delete samples above
// let firstRank = totalQuestionAmount - 1;
// let secondRank = totalQuestionAmount - 4;
// let thirdRank = totalQuestionAmount - 7;
// let fourthRank = totalQuestionAmount - 11;
// let fifthRank = totalQuestionAmount - 14;
// let sixthRank = totalQuestionAmount - 17;

finalScoreMessage.classList.toggle("hidden");
// questionInfoBox.classList.toggle("hidden");

// let timer = 10;
// let timerClock = setInterval(() => {
//   if (timer > -1) {
//     currentTime.textContent = timer;
//   } else {
//     submitAnswerButton.disabled = true;
//     nextQuestionButton.disabled = false;
//     messageBelowQuestion.innerText =
//       "Sorry, you ran out of time.  No points this time. The correct answer was, of course, blah. Keep trying!!";
//   }
//   timer--;
// }, 1000);

// function startTimer() {
//   let timer = 10;
//   if (timer > -1) {
//     currentTime.textContent = timer;
//   } else {
//     submitAnswerButton.disabled = true;
//     nextQuestionButton.disabled = false;
//     messageBelowQuestion.innerText =
//       "Sorry, you ran out of time.  No points this time. The correct answer was, of course, blah. Keep trying!!";
//   }
//   timer--;
// }

// function stopTimer() {
//   clearInterval(timerClock);
// }
if ((currentQuestionNumber = 1)) {
  questionNumber.textContent = `${currentQuestionNumber} / ${totalQuestionAmount}`;
}
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
    // console.log(oneAnswer); //delete
    // console.log(quizAnswers[0]); //delete
  });
}

//function deletes each answer from page - no longer visible
function deleteAnswers() {
  let numAnswers = 0;
  quizAnswers.forEach((oneAnswer) => {
    oneAnswer.innerText = "";
    numAnswers++;
    console.log(oneAnswer); //delete
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

  nextQuestionButton.disabled = true;

  axios.get(url).then(function (response) {
    console.log(response); //delete

    //takes the question from the response object and displays the question in triviaQuestion element
    triviaQuestion.innerText = response.data[0].question;
    console.log(triviaQuestion.innerText); //delete
    let correctAnswer = response.data[0].correctAnswer;
    console.log(correctAnswer);
    //answersArray is storing 4 answers, 1 incorrect, 3 correct pulled from response object -flatten nested array (incorrect answers) - make one array with 4 elements
    answersArray = [correctAnswer, response.data[0].incorrectAnswers].flat();
    console.log(answersArray); //delete

    randomlyPositionAnswers(answersArray); //randomly positions order of elements in array

    assignAnswers(); //displays answers

    // var timers = setInterval(startTimer, 1000);

    let timer = 10;
    let timerClock = setInterval(() => {
      if (timer > -1) {
        currentTime.textContent = timer;
      } else {
        submitAnswerButton.disabled = true;
        nextQuestionButton.disabled = false;
        messageBelowQuestion.innerText =
          "Sorry, you ran out of time.  No points this time. The correct answer was, of course, blah. Keep trying!!";
      }
      timer--;
    }, 1000);

    console.log(timerClock);

    submitAnswerButton.addEventListener("click", () => {
      let correctAnswer = response.data[0].correctAnswer;
      let numButton = 0;

      paused = true;

      // stopTimer();
      // clearInterval(timerClock);

      selectAnswerButtons.forEach((answerBtn) => {
        let answerText = quizAnswers[numButton].innerText;

        if (answerBtn.checked === true) {
          submitAnswerButton.disabled = true;
          nextQuestionButton.disabled = false;

          if (answerText != correctAnswer) {
            //inserts wrong symbol after the radio button
            rightOrWrongSymbols[numButton].innerText = "❌";

            messageBelowQuestion.innerHTML = `Darn, good try, but incorrect!  The correct answer is actually ${correctAnswer} !`;
          } else if (answerText === correctAnswer) {
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
        // nextQuestionButton.disabled = false;
      }
    });

    nextQuestionButton.addEventListener("click", () => {
      // clearInterval(timerClock);
      // paused = false;

      if (!paused) {
        clearInterval(timerClock);
      }

      console.log(paused);

      paused = false;

      currentQuestionAmount++;
      currentQuestionNumber++;

      console.log(currentQuestionAmount);
      console.log(currentQuestionNumber);

      // currentQuestionAmount = currentQuestionAmount + 1;
      // currentQuestionNumber = currrentNumberAmount + 1;

      // currentQuestionAmount++;
      // currentQuestionNumber++;

      nextQuestionButton.disabled = true;
      submitAnswerButton.disabled = false;

      let finalPlayerScore = currentScore.textContent;

      // questionNumber.textContent =
      //   currentQuestionNumber + "/" + totalQuestionAmount;
      questionNumber.textContent = `${currentQuestionNumber} / ${totalQuestionAmount}`;
      console.log(questionNumber.textContent);
      //
      console.log(currentQuestionAmount);
      console.log(currentQuestionNumber);
      // if (currentQuestionNumber == totalQuestionAmount) {
      //   nextQuestionButton.disabled = true;
      // }

      if (currentQuestionAmount == totalQuestionAmount) {
        finalScoreMessage.classList.toggle("hidden");
        questionInfoBox.classList.add("hidden");
        nameFinal.textContent = newPlayer;
        finalScore.textContent = finalPlayerScore;
        // amountOfQuestions.textContent = totalQuestionAmount;

        switch (true) {
          case finalPlayerScore >= sampleOne:
            ranking.textContent = rankingsArray[0];
            break;
          case finalPlayerScore >= sampleTwo:
            ranking.textContent = rankingsArray[1];
            break;
          default:
            ranking.textContent = rankingsArray[2];
          // case finalPlayerScore
          //need to finish the other cases

          // switch (true) {
          //   case finalPlayerScore >= firstRank:
          //     ranking.textContent = rankingsArray[0];
          //     break;
          //   case finalPlayerScore >= secondRank:
          //     ranking.textContent = rankingsArray[1];
          //     break;
          //   case finalPlayerScore >= thirdRank:
          //     ranking.textContent = rankingsArray[2];
          //     break;
          //   case finalPlayerScore >= fourthRank:
          //     ranking.textContent = rankingsArray[3];
          //     break;
          //     // case finalPlayerScore >= fifthRank;
          //     ranking.textContent = rankingsArray[4];
          //     break;
          //   default:
          //     ranking.textContent = rankingsArray[5];
          // }
        }
        // nextQuestionButton.disabled = true;
      }

      console.log(currentScore.innerHTML);
      clearAndReset();
      getNewQuestionAndAnswers();

      // currentTime.innerText = 10;
      // getNewQuestionAndAnswers();
      // console.log(answersArray);
    });
  });
}

// currentQuestionAmount++;
// currentQuestionNumber++;

// function postQuestionResults(answer, points) {
//   let numButton = 0;

//   selectAnswerButtons.forEach((answerBtn) => {
//     let answerText = quizAnswers[numButton].innerText;

//     if (answerBtn.checked === true) {
//       submitAnswerButton.disabled = true;

//       if (answerText != answer) {
//         //inserts wrong symbol after the radio button
//         rightOrWrongSymbols[numButton].innerText = "❌";

//         messageBelowQuestion.innerHTML = `Darn, good try, but incorrect!  The correct answer is actually ${answer} !`;
//       } else if (answerText === answer) {
//         rightOrWrongSymbols[numButton].innerText = "✔️";
//         messageBelowQuestion.innerHTML =
//           "Nice job!!  You are correct!  You get a point.  Keep going!!";
//         points++;
//         currentScore.innerHTML = points;
//       }
//     }
//     numButton++;
//   });
// }
