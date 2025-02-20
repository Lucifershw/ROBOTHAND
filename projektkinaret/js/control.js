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
    console.log(app)
// Save the start time if not already set
if (!localStorage.getItem('startTime')) {
    localStorage.setItem('startTime', Date.now());
}

// Check every minute if an hour has passed
setInterval(() => {
    const startTime = localStorage.getItem('startTime');
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime >= 3600000) { // 1 hour in milliseconds
        window.location.href = "/hero.html"
    }
}, 60000); // Check every minute  
