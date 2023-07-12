
let currentWordList = wordPairs[selectedTitle];
let incorrectWordList = [];
let generatedOptions = [];
let isTapMode = true; // true: タップ式, false: 4択式
let is_mistaked = false;
let initialWordNum = currentWordList.length;

function initializeTheme() {
    const themeStylesheet = document.getElementById("theme_stylesheet");
    const body = document.body;
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark") {
        themeStylesheet.setAttribute("href", "{{ url_for('static', filename='dark-theme.css') }}");
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
    } else {
        themeStylesheet.setAttribute("href", "{{ url_for('static', filename='light-theme.css') }}");
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
    }
}

function updateSelectedTitle() {
    selectedTitle = document.getElementById("quiz_title").value;
    document.getElementById("progress").innerText = `1/${initialWordNum}`;
    getNextQuestion();
}

function showAnswer() {
    if (isTapMode) {
        document.getElementById("answer").style.display = "block";
        document.getElementById("next_button").style.display = "block";
        if(window.innerWidth > 768) {
            document.getElementById("next_button").style.display = "inline";
        }
    }
    document.getElementById("show_answer_button").style.display = "none";

}

function checkAnswer(selectedIndex) {
    const resultElement = document.getElementById("result");
    const answerButtons = document.getElementsByClassName("answer_button");

    if (selectedIndex === correctAnswerIndex) {
        resultElement.innerText = "正解！";
        resultElement.style.display = "block";
        document.getElementById("next_button").style.display = "block";
        answerButtons[selectedIndex].classList.add("correct_button");
        if(is_mistaked) {
            incorrectWordList.push(JSON.parse(JSON.stringify(currentWordPair)));
            is_mistaked = false;
        }
    } else {
        resultElement.innerText = "残念！間違いです。もう一度選択してください。";
        resultElement.style.display = "block";
        answerButtons[selectedIndex].disabled = true;
        answerButtons[selectedIndex].classList.add("disabled");
        document.getElementById("next_button").style.display = "none";
        is_mistaked = true;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateOptions(correctPair, wordList) {
    const options = [correctPair];
    const tempList = wordList.filter(pair => pair[1] !== correctPair[1]);

    while (options.length < 4) {
        const randomIndex = Math.floor(Math.random() * tempList.length);
        const randomPair = tempList[randomIndex];

        if (!options.some(option => option[1] === randomPair[1])) {
            options.push(randomPair);
        }
    }

    return shuffle(options);
}

function getNextQuestion() {
    if (currentWordList.length === 0) {
        document.getElementById("english_word").innerText = "クイズが終了しました！";
        document.getElementById("answer_buttons").style.display = "none";
        document.getElementById("next_button").style.display = "none";
        document.getElementById("restart_button").style.display = "block";
        if(!isTapMode && incorrectWordList.length !== 0) {
            document.getElementById("mistake_button").style.display = "block";
        }
        document.getElementById("show_answer_button").style.display = "none"; // 追加：クイズ終了時に「答えを見る」ボタンを非表示にする
    } else {
        const currentIndex = Math.floor(Math.random() * currentWordList.length);
        currentWordPair = currentWordList[currentIndex];
        generatedOptions = generateOptions(currentWordPair, _wordPairs[selectedTitle]);
        currentWordList.splice(currentIndex, 1);

        const answerOptions = generatedOptions.map(option => option[1]);
        correctAnswerIndex = answerOptions.indexOf(currentWordPair[1]);

        document.getElementById("english_word").innerText = currentWordPair[0];

        if (isTapMode) {
            // タップ式の問題表示
            document.getElementById("answer_buttons").style.display = "none";
            document.getElementById("answer").innerText = currentWordPair[1];
            document.getElementById("answer").style.display = "none";
            document.getElementById("show_answer_button").style.display = "block";
            document.getElementById("next_button").style.display = "none";
            const answerButtons = document.getElementsByClassName("answer_button");
            for (let i = 0; i < answerButtons.length; i++) {
                answerButtons[i].style.display = "none"; // 選択肢を非表示にする
                answerButtons[i].disabled = false; // 選択肢を有効にする
                answerButtons[i].classList.remove("disabled"); // 選択肢の色をリセットする
                answerButtons[i].classList.remove("correct_button"); // 選択肢の色をリセットする
            }
            document.getElementById("result").textContent = "";
        } else {
            // 4択式の問題表示
            document.getElementById("answer_buttons").style.display = "block";
            const answerButtons = document.getElementsByClassName("answer_button");
            for (let i = 0; i < answerButtons.length; i++) {
                answerButtons[i].innerText = answerOptions[i];
                answerButtons[i].disabled = false;
                answerButtons[i].classList.remove("disabled");
                answerButtons[i].classList.remove("correct_button"); // 選択肢の色をリセットする
                answerButtons[i].style.display = "inline";
            }
            document.getElementById("answer").style.display = "none";
        }

        document.getElementById("result").style.display = "none";
        document.getElementById("next_button").style.display = "none";
        document.getElementById("answer_buttons").style.display = "block";
    }

    const totalWords = initialWordNum - currentWordList.length;
    document.getElementById("progress").innerText = `${totalWords}/${initialWordNum}`;
    displayCurrentQuestion();
}

function restartQuiz() {
    wordPairs = JSON.parse(JSON.stringify(_wordPairs))
    currentWordList = wordPairs[selectedTitle];
    document.getElementById("restart_button").style.display = "none";
    document.getElementById("mistake_button").style.display = "none";
    initialWordNum = currentWordList.length;
    incorrectWordList = [];
    getNextQuestion();
}

function restartQuizWithMistake() {
    wordPairs = JSON.parse(JSON.stringify(_wordPairs))
    currentWordList = JSON.parse(JSON.stringify(incorrectWordList));
    document.getElementById("restart_button").style.display = "none";
    document.getElementById("mistake_button").style.display = "none";
    initialWordNum = currentWordList.length;
    incorrectWordList = [];
    getNextQuestion();
}

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        if (document.getElementById("english_word").innerText !== "クイズが終了しました！") {
            if (document.getElementById("answer").style.display === "none") {
                showAnswer();
            } else {
                getNextQuestion();
            }
        }
    }
});

function onScreenTap() {
    if (document.getElementById("english_word").innerText !== "クイズが終了しました！") {
        if (document.getElementById("answer").style.display === "none") {
            showAnswer();
        } else {
            getNextQuestion();
        }
    }
}

function switchTheme() {
    const themeStylesheet = document.getElementById("theme_stylesheet");
    const body = document.body;

    if (body.classList.contains("light-theme")) {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
        body.classList.add("fade-in");
        setTimeout(() => body.classList.remove("fade-in"), 300);
        localStorage.setItem("theme", "dark");
    } else {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
        body.classList.add("fade-in");
        setTimeout(() => body.classList.remove("fade-in"), 300);
        localStorage.setItem("theme", "light");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.style.display = 'block';
});

function displayCurrentQuestion() {
    if (isTapMode) {
        document.getElementById("answer_buttons").style.display = "none";
        document.getElementById("answer").innerText = currentWordPair[1];
        document.getElementById("answer").style.display = "none";
        if (currentWordList.length !== 0) {
            document.getElementById("show_answer_button").style.display = "block";
        }
        document.getElementById("next_button").style.display = "none";
        const answerButtons = document.getElementsByClassName("answer_button");
        for (let i = 0; i < 4; i++) {
            answerButtons[i].style.display = "none"; // 選択肢を非表示にする
        }
    } else {
        document.getElementById("answer_buttons").style.display = "block";
        const answerButtons = document.getElementsByClassName("answer_button");
        for (let i = 0; i < 4; i++) {
            answerButtons[i].innerText = generatedOptions[i][1]; // 四択問題の選択肢を表示する
            answerButtons[i].style.display = "inline";
        }
        // check length
        if(document.getElementsByClassName("answer").length !== 0) {
            document.getElementsByClassName("answer")[0].style.display = "none";
        }
        document.getElementById("show_answer_button").style.display = "none";
    }
}

function switchMode() {
    isTapMode = !isTapMode;
    const switchButton = document.getElementById("switch_mode_button");
    const showAnswerButton = document.getElementById("show_answer_button");
    const answerElement = document.getElementById("answer");
    const nextButton = document.getElementById("next_button");
    const result = document.getElementById("result");

    if (isTapMode) {
        switchButton.innerText = "4択に切り替え";
        showAnswerButton.style.display = "block";
        nextButton.style.display = "block";
        result.style.display = "none";
    } else {
        switchButton.innerText = "タップ式に切り替え";
        showAnswerButton.style.display = "none";
        nextButton.style.display = "none";
        result.style.display = "block";
    }

    // 答えを非表示にする
    answerElement.style.display = "none";
    displayCurrentQuestion(); // 現在の問題を表示する
}
