const nameOfPlayer = document.querySelector("#nickname");
const categoryList = document.querySelector("#category");
const startButton = document.querySelector("#start_btn");

startButton.addEventListener("click", () => {
  // localStorage.setItem("categories", example);
  const categoryLocation = categoryList.selectedIndex;
  const questionCategory = categoryList[categoryLocation].value;
  const actualPlayerName = nameOfPlayer.value;

  //sets player name and category and puts in local storage in order to use on other html page (quizpage.html)
  localStorage.setItem("category", questionCategory);
  localStorage.setItem("nickname", actualPlayerName);

  //goes to new html page when start button clicked
  window.location.href = "quizpage.html";
});
