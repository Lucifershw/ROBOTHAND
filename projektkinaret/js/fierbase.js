// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABfXhXBw9XspIbEHX2HFk6gbf1g4W6whA",
  authDomain: "robot-bf963.firebaseapp.com",
  databaseURL: "https://robot-bf963-default-rtdb.firebaseio.com",
  projectId: "robot-bf963",
  storageBucket: "robot-bf963.firebasestorage.app",
  messagingSenderId: "510218937512",
  appId: "1:510218937512:web:1b65120133325e8539ce9d",
  measurementId: "G-07052Z4F32"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
console.log(app);

// DOM elements
let user = {};
const log_inbtn = document.getElementById("log-in");
const log_outbtn = document.getElementById("log-out");
const courses_btn = document.getElementById("coursesbtn");
const modelout = document.getElementById("signupmodal");
const modelin = document.getElementById("loginmodal");
const navcourses = document.getElementById("coursesnav");
const controlbtn = document.getElementsByClassName("controlbtn");
const watchbtn = document.getElementById("watchbtn");

// Authentication state change
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    var uid = user.uid;
    console.log(uid);

    // UI updates when user is signed in
    log_inbtn.style.display = "none";
    log_outbtn.style.display = "block";
    courses_btn.style.display = "block";
    navcourses.style.display = "block";
    controlbtn.style.display = "block";

    // Fetch user data from Firebase
    firebase.database().ref("/users/" + user.uid).get().then((snapshot) => {
      console.log(snapshot.val());
      user = snapshot.val();
    }).catch((error) => {
      console.error(error);
    });
  } else {
    // User is signed out
    log_inbtn.style.display = "block";
    log_outbtn.style.display = "none";
    courses_btn.style.display = "none";
    navcourses.style.display = "none";
    controlbtn.style.display = "none";
  }
});

// Account creation function
function createAccount() {
  const pass = document.getElementById("signup-password").value;
  const email = document.getElementById("signup-email").value;
  const names = document.getElementById("signup-username").value;

  firebase.auth().createUserWithEmailAndPassword(email, pass)
    .then((userCredential) => {
      var user = userCredential.user;
      console.log(userCredential);
      console.log(user);
      const tempUser = { name: names, email: email, uid: user.uid };
      firebase.database().ref("users/" + user.uid).set(tempUser);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

// User login function
function login() {
  const email = document.getElementById("emaill").value;
  const password = document.getElementById("passwordl").value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}

// User logout function
function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}

// Navigation state changes
window.addEventListener("popstate", () => {
  const databaseRef = firebase.database().ref("/locasion");
  // Try to claim access to the page
  databaseRef.transaction(currentValue => {
    if (currentValue === null || currentValue === 0) {
      // If no one is on the page, claim it by setting to 1
      return 1;
    }
    // If someone is already on the page, do not alter the value
    return; // Abort the transaction
  }, (error, committed, snapshot) => {
    if (error) {
      console.error("Transaction failed:", error);
    } else if (!committed) {
      // Transaction not committed means the page is already being viewed
      alert("The page is currently in use. Please try again later.");
      window.history.back(); // Optionally send the user back to the previous page
    } else {
      console.log("Access to the page granted.");
      // Additional code to initialize the page could go here
    }
  });
});

window.addEventListener("beforeunload", () => {
  const databaseRef = firebase.database().ref("/locasion");
  // Release the lock when the user leaves the page
  databaseRef.set(0).catch((error) => {
    console.error("Error resetting the flag on unload:", error);
  });
});


// Update chat history
function chatUpdate() {
  const user = firebase.auth().currentUser;
  const comment = document.getElementById("comment").value;
  const chatList = document.getElementById("chat");
  if (user && comment) {
    firebase.database().ref("/chathistory/" + user.uid).push({
      name: user.displayName || "Anonymous",
      message: comment,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then((ref) => {
      console.log("Message added to chat history.");
      comment.value = "";
    }).catch((error) => {
      console.error("Error adding message:", error);
    });
  } else {
    console.error("User is not logged in or comment is empty.");
  }
}

firebase.database().ref("/chathistory").on("value", (snapshot) => {
  const data = snapshot.val();
  const chatList = document.getElementById("chat");
  chatList.innerHTML = ""; // Clear existing content
  if (data) {
    Object.keys(data).forEach((userId) => {
      const userMessages = data[userId];
      Object.keys(userMessages).forEach((messageId) => {
        const messageDetails = userMessages[messageId];
        const listItem = document.createElement("li");
        listItem.classList.add("my-2", "py-2", "px-3", "rounded");
        listItem.style = {
          backgroundColor: "#ffffff",
          textAlign: "left",
          border: "1px solid #ddd",
          marginLeft: "0"
        };
        const nameSpan = document.createElement("span");
        nameSpan.textContent = `${messageDetails.name}: `;
        nameSpan.style = {
          color: "#007bff",
          fontWeight: "bold"
        };
        const messageText = document.createTextNode(messageDetails.message || "No message");
        listItem.appendChild(nameSpan);
        listItem.appendChild(messageText);
        chatList.appendChild(listItem);
      });
    });
  } else {
    chatList.innerHTML = "<li>No chat history available.</li>";
  }
});

let numberUART = [0, 0, 0, 0, 0, 0, 0, 0]; // 8-bit array
let sensorState = [0, 0, 0, 0, 0, 0]; // Sensor states

function NewUart() {
  // Determine which list to use
  let activeList;
  if (numberUART[0] === 1 && numberUART[1] === 1) {
      activeList = sensorState;
  } else {
      activeList = GtroList;
  }

  // Convert the array of bits to a string representation of binary digits
  const binaryString = activeList.join('');

  // Convert binary string to a decimal integer
  const newNumber = parseInt(binaryString, 2); // Using radix 2 for binary conversion

  // Update the value in Firebase
  const ref = firebase.database().ref("/altera/RX");
  ref.transaction((currentValue) => {
      // Only update if the new number is different to avoid unnecessary writes
      return currentValue === newNumber ? undefined : newNumber;
  }).then((result) => {
      if (result.committed) {
          console.log('Number updated successfully in Firebase:', newNumber);
      } else {
          console.log('No update performed, current value matched the new value.');
      }
  }).catch((error) => {
      console.error('Failed to update number in Firebase:', error);
  });
}





function moveRight() {
  sensorState = [0, 1, 1, 0, 0, 1];
  updateUART();
}

function moveLeft() {
  sensorState = [1, 0, 0, 1, 1, 0];
  updateUART();
}

function stopMovement() {
  sensorState = [0, 0, 0, 0, 0, 0];
  updateUART();
}

function moveUp() {
  sensorState = [0, 1, 0, 1, 1, 1];
  updateUART();
}

function moveDown() {
  sensorState = [1, 0, 1, 0, 1, 1];
  updateUART();
}

let isActive = true;
let GtroList = [0, 0, 0, 0, 0, 0, 0, 0];
function updateUART() {

  // Merge sensorState into numberUART starting from the third element
  for (let i = 0; i < sensorState.length; i++) {
      numberUART[i + 2] = sensorState[i];
  }

  console.log('Updated numberUART with sensorState:', numberUART);
  NewUart();
}

function sensorcontrol() {
  const button = document.getElementById("sensorcontrolbuten");
  isActive = !isActive;
  if(isActive){
    button.innerHTML = "stop glove control 🚫"
    numberUART[0]=1
    numberUART[1]=1
  }
  else{
    button.innerHTML = "start glove control ✋"
    numberUART[0]=0
    numberUART[1]=0
  }
} 
  // Adjust as needed based on your application's flow

firebase.database().ref("/GYRO/espServerIP/L").on("value", (snapshot) => {
  const data = snapshot.val();
  // Assuming the data is an object or an array that fits into GtroList
   GtroList = Object.values(data); // Converts object to array if necessary
  console.log("Updated List:", GtroList);
  NewUart();
}, (error) => {
  console.error("Error reading data:", error);
});
