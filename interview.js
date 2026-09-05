const practiceToolbar =
    document.getElementById(
        "practice-toolbar"
    );

const interviewMode =
    sessionStorage.getItem(
        "interviewMode"
    );


if(interviewMode === "practice"){

    practiceToolbar.classList.remove(
        "hidden"
    );

}else{

    practiceToolbar.classList.add(
        "hidden"
    );

}
const hintBtn =
    document.getElementById("hint-btn");

const hintPanel =
    document.getElementById("hint-panel");

const hintCloseBtn =
    document.getElementById(
        "hint-close-btn"
    );


hintBtn.addEventListener(
    "click",
    function(){

        hintPanel.classList.add(
            "show"
        );

    }
);


hintCloseBtn.addEventListener(
    "click",
    function(){

        hintPanel.classList.remove(
            "show"
        );

    }
);