// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth, 
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA8Ebdt28rQGrnTrAjiQgr1rAv0ozVSgUk",
    authDomain: "ai-interviewer-b814e.firebaseapp.com",
    projectId: "ai-interviewer-b814e",
    storageBucket: "ai-interviewer-b814e.firebasestorage.app",
    messagingSenderId: "547316676961",
    appId: "1:547316676961:web:a76b121e48e68f47902d20",
    measurementId: "G-SPE9RRCJQB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
//=======================
//側邊選單 
//=======================
const drawerMenu = document.getElementById('drawerMenu');
const closeBtn = document.getElementById('closeBtn');
const sideDrawer = document.getElementById('sideDrawer');
const overlay = document.getElementById('overlay');

if(drawerMenu){
    drawerMenu.addEventListener("click", function(){
        if(window.innerWidth <= 850){
            sideDrawer.classList.toggle('is-open');
            overlay.classList.toggle('is-open');
        }else{
            sideDrawer.classList.toggle('collapsed');
            const dashboardMain = document.querySelector('.dashboard-main');
            if(dashboardMain){
                dashboardMain.classList.toggle('sidebar-collapsed');
            }
        }
    });
}
function closeMenu(){
    sideDrawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
}

if(closeBtn){
    closeBtn.addEventListener('click', closeMenu);
}
if(overlay){
    overlay.addEventListener('click', closeMenu);
}


//=======================
//忘記密碼
//=======================
const resetBtn = document.getElementById('reset-btn');
const resetMessage = document.getElementById('reset-message');

if(resetBtn){
    resetBtn.addEventListener('click', function(){
    if(!resetBtn){
        resetBtn.addEventListener("click",function(){
            const resetEmailInput = document.getElementById("reset-email-input");
            if(!resetEmailInput){
                return;
            }
            const email = resetEmailInput.ariaValueMax.trim();
            if(!email){
                resetMessage.textContent = "請輸入電子郵件";
                resetMessage.style.color = "red";
                return;
            }
            resetMessage.textContent = "發送郵件中";
            resetMessage.style.color = "blue";
            sendPasswordResetEmail(auth,email)
                .then(() =>{
                    resetMessage.textContent = "請檢察gmail";
                    resetMessage.style.color = "green";
                })
                .catch((error) =>{
                    console.error(
                        "重設密碼",
                        error.code,
                        error.message
                    );
                    resetMessage.textContent = "電子郵件錯誤或無法寄送";
                    resetMessage.style.color = "red";
                });
            })
        }
    });
}


//================
//google登入
//================
const googleProvider = new GoogleAuthProvider();
const googleLoginBtn = document.getElementById('google-login-btn');

if(googleLoginBtn){
    googleLoginBtn.addEventListener('click', function(){

        signInWithPopup(auth, googleProvider)
            .then((result) =>{
                const user = result.user;

                console.log("登入成功");
                console.log("使用者名稱：", user.displayName);
                console.log("Email：", user.email);
                console.log("UID：", user.uid);

                alert(`登入成功！歡迎 ${user.displayName || "使用者"}`);

                window.location.href = "main.html";
            })
            .catch((error) =>{
                console.error("登入失敗：", error.code);
                console.error(error.message);
                alert("登入失敗");
            });
    });
}


//===============
//main dashboard
//===============
const userProfile = document.getElementById('user-profile');
const userPhoto = document.getElementById('user-photo');
const userName = document.getElementById('user-name');
const welcomeName = document.getElementById('welcome-email');
const logoutBtn = document.getElementById('logout-btn');

if(userProfile){
    onAuthStateChanged(auth, async function(user){
        if(user){
            console.log("目前使用者：", user);
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if(!userSnap.exists()){
                await setDoc(userRef,{
                    displayName: user.displayName || "使用者",
                    email: user.email || "",
                    photoURL: user.photoURL || "",
                    createdAT: serverTimestamp()
                });
                console.log("建立使用者資料成功");
            }
        }else{
            console.log("目前沒有登入");
            window.location.href = "login.html";
        }
    });
}



//================
//logout
//================
if(logoutBtn){
    logoutBtn.addEventListener("click", function(){
        signOut(auth).then(() =>{
            console.log("已登出");
            window.location.href = "login.html";
        })
        .catch((error) =>{
            console.error("登出失敗", error);
        });
    });
}


//==============
//resume
//==============
const resumeFile = document.getElementById("resume-file");
const selectResumeBtn = document.getElementById("select-resume-btn");
const changeResumeBtn = document.getElementById("change-resume-btn");
const resumeDropZone = document.getElementById("resume-drop-zone");
const resumeFileName = document.getElementById("resume-file-name");
const resumeFileSize = document.getElementById("resume-file-size");
const resumeCheck = document.getElementById("resume-check");
const resumePreview = document.getElementById("resume-preview");
const startInterviewBtn = document.getElementById("start-interview-btn");

let selectedResume = null;
function openResumeSelector(){
    if(resumeFile){
        resumeFile.click();
    }
}
if(selectResumeBtn){
    selectResumeBtn.addEventListener("click", function(event){
        event.stopPropagation();
        openResumeSelector();
    });
}
if(changeResumeBtn){
    changeResumeBtn.addEventListener("click", openResumeSelector);
}
if(resumeDropZone){
    resumeDropZone.addEventListener("click", openResumeSelector);
}
if(resumeFile){
    resumeFile.addEventListener("change",function(){
        const file = resumeFile.files[0];
        if(!file){
            return;
        }
        selectedResume = file;
        console.log("目前選擇履歷", selectedResume);
        if(resumeFileName){
            resumeFileName.textContent = file.name;
        }
        if(resumeFileSize){
            const sizeMB = file.size / 1024 / 1024;
            resumeFileSize.textContent = sizeMB.toFixed(2) + "MB";
        }
        if(resumeCheck){
            resumeCheck.textContent = "✓";
        }
        if(resumePreview){
            resumePreview.classList.remove("empty");
        }
        if(startInterviewBtn){
            startInterviewBtn.disabled = false;
        }
    });
}

const interviewTypes = document.querySelectorAll(".type-option");
interviewTypes.forEach(
    function(option){
        option.addEventListener("click", function(){
            interviewTypes.forEach(function(item){
                item.classList.remove("selected");
            });
            option.classList.add("selected");
        });
    }
);

if(startInterviewBtn){
    startInterviewBtn.addEventListener("click", function(){
        if(!selectedResume){
            alert("請先上傳履歷");
            return;
        }
        const roleSelect = document.getElementById("target-role");
        const selectedType = document.querySelector('input[name="interview-type"]:checked');
        if(!roleSelect || !roleSelect.value){
            alert("請先選擇目標職位");
            return;
        }
        if(!selectedType){
            alert("醒選擇面試類型");
            return;
        }
        const role = roleSelect.value;
        const type = selectedType.value;
        console.log("履歷:", selectedResume);
        console.log("職位:", role);
        console.log("面試類型", type);
        alert(`準備開始 ${role} 的 ${type}`);
    });
}