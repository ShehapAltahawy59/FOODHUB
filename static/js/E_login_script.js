

let firsttry=true;

// const firebaseConfig = {
//     apiKey: "AIzaSyBkuZTtYT_Kk0v50TCjJn0oV25hykAoQpA",
//     authDomain: "foodorderapp-2b2df.firebaseapp.com",
//     projectId: "foodorderapp-2b2df",
//     storageBucket: "foodorderapp-2b2df.appspot.com",
//     messagingSenderId: "255365039854",
//     appId: "1:255365039854:web:da178754d3b0450f6315ff",
//     measurementId: "G-EHD8B4S495"
//   };
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// Reference to the Firebase Auth service

function set_login_action(){
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const button = document.getElementById("loginbutton");
    
    button.disabled=true;
    const button_span= document.getElementById("button_span");
    
    button_span.style.display = "none";
    const loadingIndicator = document.getElementById("loadingIndicator");
    loadingIndicator.style.display = "block";
    errorMessage_div=document.getElementById("error_message");

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (await checkEmailVerification(email) == true){
    // Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Get the user's UID
        var user = userCredential.user;
        var uid = user.uid;
        

        
        // Send UID to Flask backend to store in Firestore
        fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: uid, email: email }),
          })
          .then(response => response.json())
          .then(data => {
            if (data.redirect_url) {
              
              window.location.href = data.redirect_url;
            } else {
                errorMessage_div.innerHTML=`${data.message}`
                errorMessage_div.style.display="flex"
                button.disabled=false;
                loadingIndicator.style.display="none";
                button_span.style.display="block"
                
              
            }
          });
      

          
        
        
      })
      .catch((error) => {
        var errorMessage = error.message;
        errorMessage_div.innerHTML=`${errorMessage}`
        errorMessage_div.style.display="flex"
        button.disabled=false;
        loadingIndicator.style.display="none";
        button_span.style.display="block"
        
      });
    }
    else{
        errorMessage_div.innerHTML=`Please verify your Account`
        errorMessage_div.style.display="flex"
            button.disabled=false;
            loadingIndicator.style.display="none";
            button_span.style.display="block"
    }
  });

}


function set_signup_action(){
    const errorMessage_div=document.getElementById("error_message");
    document.getElementById("signupForm").addEventListener("submit", function(e) {
        e.preventDefault();
        
        

        const button_name = document.getElementById("button_name")
        button_name.style.display="none";

        const loadingIndicator = document.getElementById("loadingIndicator");
        loadingIndicator.style.display = "block";

        const signup_button=document.getElementById("signup_button");
        signup_button.disabled=true;

        
        const email = document.querySelector("input[name='email']").value;
        const password = document.querySelector("input[name='password']").value;
        
        const firstName = document.querySelector("input[name='firstName']").value;
        const lastName = document.querySelector("input[name='lastName']").value;
        const fullname= firstName+lastName;
        const phone = document.querySelector("input[name='phone']").value;
        
        // Firebase Create User
        if(firsttry){
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Get the user's UID
            var user = userCredential.user;
            var uid = user.uid;
            user.sendEmailVerification()
          .then(() => {
            firsttry=false;
            signup_button.disabled=false;
            loadingIndicator.style.display = "none";
            
            button_name.innerHTML='Continue'
            button_name.style.display="block"
            alert('Verification email sent! Please check your inbox.');
            // You can redirect or wait for user to confirm email before further actions
          })
          .catch((error) => {
            
            errorMessage_div.innerHTML=`Error sending verification email: ${error.message}`;
            errorMessage_div.style.display="flex";
            signup_button.disabled=false;
            loadingIndicator.style.display = "none";
            button_name.style.display="block"
          });
            // Send UID to Flask backend to store in Firestore
            
          })
          .catch((error) => {
            var errorMessage = error.message;
            errorMessage_div.innerHTML=`${errorMessage}`;
            errorMessage_div.style.display="flex";
            signup_button.disabled=false;
            loadingIndicator.style.display = "none";
            button_name.style.display="block"
          });
      
      
        }
        else{
            firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Get the user's UID
        var user = userCredential.user;
        var uid = user.uid;
            if (user.emailVerified) {
                fetch("/login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ uid: uid, email: email,phone:phone,username:fullname,img:[] }),
                })
                .then(response => response.json())
                .then(data => {
                  if (data.redirect_url) {
                    
                    window.location.href = data.redirect_url;
                  } else {
                    
                    errorMessage_div.innerHTML=`${data.message}`;
                    errorMessage_div.style.display="flex";
                    signup_button.disabled=false;
                    loadingIndicator.style.display = "none";
                    button_name.style.display="block"
                  }
                });}
            else{
                
                errorMessage_div.innerHTML= "Please verify your email first.";
                errorMessage_div.style.display="flex";
                signup_button.disabled=false;
                loadingIndicator.style.display = "none";
                button_name.style.display="block"
            }
        }
      )}
        })};



document.addEventListener('DOMContentLoaded', function() {
    updatecardcount();

});

function updatecardcount(){
    const item = document.querySelector('.button-overlay');
    const count=getCartItemscount();
    if (count > 0){
        item.innerHTML = `${count}`
    console.log(count);
    }
    
}

function getCartItemscount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.length;
}


function hideLabel() {
    
    const firstname = document.querySelector("input[name='firstName']")
    const lastname =document.querySelector("input[name='lastName']")
    const password = document.querySelector("input[name='password']");
    const firstnamespan = document.getElementById("firstnamespan");
    const lastnamespan = document.getElementById("lastnamespan");
    const passwordspan = document.getElementById("passwordspan");
    // Hide label if the input has any value
    if (firstname.value.trim() !== '') {
        
        firstnamespan.style.visibility = 'hidden';
    } else {
        firstnamespan.style.opacity  = 'visible';
    }
    if (lastname.value.trim() !== '') {
        lastnamespan.style.visibility = 'hidden';
    } else {
        lastnamespan.style.opacity  = 'visible';
    }
    if (password.value.trim() !== '') {
        passwordspan.style.visibility = 'hidden';
    } else {
        passwordspan.style.opacity  = 'visible';
    }
}
// firebase-auth.js

// Firebase configuration


// Function to handle Google Sign-In
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            // Get user info
            const user = result.user;
            
            const email = user.email; // User's email
            const name = user.displayName; // User's name
            const photoURL = user.photoURL; // User's profile picture URL

            // You may need to handle additional user fields (like phone) separately
            const phone = user.phoneNumber;
            const uid = user.uid;

            

            // Optional: Use Flask-Login to handle the session (send email to the server)
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email,name,photoURL,phone,uid })
            })
            .then(response => response.json())
            .then(data => {
                if (data.redirect_url) {
                    // Redirect to the specified URL
                    window.location.href = data.redirect_url;
                } else {
                    console.error('Login failed:', data.error);
                }
            })
            .catch((error) => {
                console.error('Error during login:', error);
            });
        })
        .catch((error) => {
            console.error('Google Sign-In Error:', error);
        });
    }

// Call the function to sign in when the button is clicked

function signInWithEmail (){
    const div = document.querySelector('.style-6');
    div.innerHTML=`
    <div style="max-width:444px;padding-left:24px;padding-right:24px;background:rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box;text-align:center;padding-top:40px;border-radius:20px;padding-bottom:40px;width: 100%;margin-left: auto;box-sizing:border-box;margin-right: auto;display:block;">
    <div style="display:flex;">
        <div style="margin: auto;">
            <div m="auto" style="position:relative;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;flex-shrink:0;font-family:Poppins, 'Open Sans', sans-serif;font-size:20px;line-height:20px;border-radius:50%;overflow:hidden;user-select:none;width: 100px;height:100px;display:flex;align-self:center;"><img alt="email" src="data:image/png;base64,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" style="filter: invert(0);width: 100%;height:100px;text-align:center;object-fit:cover;color:rgba(0, 0, 0, 0);text-indent:10000px;" /></div>
        </div>
    </div>
    <div style="margin-top:8px;"></div>
    <h5 style="font-weight:700;margin:0px;font-size:24px;line-height:32.016px;letter-spacing:normal;font-family:Poppins, 'Open Sans', sans-serif;">What's your Email?</h5>
    <div style="margin-top:8px;"></div><span style="color:rgb(90, 88, 88);font-size:14px;margin:0px;font-weight:400;line-height:23.24px;letter-spacing:0.46662px;font-family:Poppins, 'Open Sans', sans-serif;">We'll check if you've an account</span>
    <div style="margin-top:32px;"></div>
    
        <div style="display:inline-flex;flex-direction:column;position:relative;min-width:0px;padding:0px;margin:0px;border:0px none rgb(0, 0, 0);vertical-align:top;width: 100%;">
             <label data-shrink="true" style="color: rgb(117, 117, 117);font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;padding:0px;display:block;transform-origin:0px 0px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(133% - 32px);position:absolute;left:0px;top:0px;transform:matrix(0.75, 0, 0, 0.75, 14, -9);transition:color 0.2s cubic-bezier(0, 0, 0.2, 1), transform 0.2s cubic-bezier(0, 0, 0.2, 1), max-width 0.2s cubic-bezier(0, 0, 0.2, 1);z-index:1;pointer-events: auto;user-select:none;" for="mui-2">Email</label>
            <div style="font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(255, 255, 255);box-sizing:border-box;cursor:text;display:flex;-webkit-box-align:center;align-items:center;width: 100%;position:relative;border-radius:4px;">
                <input  aria-invalid="false" name="email" type="email" value="" style="color:rgb(33, 33, 33);font:16px / 23px Poppins, 'Open Sans', sans-serif;letter-spacing:0.15008px;border:0px none rgb(33, 33, 33);box-sizing:content-box;height:23px;margin:0px;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;min-width:0px;width: 100%;animation-name: mui-auto-fill-cancel;animation-duration:0.01s;padding:16.5px 14px;" />
                <fieldset aria-hidden="true" style="border-color:rgb(238, 238, 238);text-align:left;position:absolute;inset:-5px 0px 0px;margin:0px;padding:0px 8px;pointer-events:none;border-radius:4px;border-style:solid;border-width:1px;overflow:hidden;min-width:0%;">
                    <legend style="float:none;width: auto;overflow:hidden;display:block;padding:0px;height:11px;font-size:12px;visibility:hidden;max-width:100%;transition:max-width 0.1s cubic-bezier(0, 0, 0.2, 1) 0.05s;white-space:nowrap;"><span style="padding-left:5px;padding-right:5px;display:inline-block;opacity:0;visibility:visible;">Email</span></legend>
                </fieldset>
            </div>
        </div>
        <h3 id="error_message"></h3>
        <div style="margin-top:64px;"></div>
        <button id="mybutton" onclick="checkemailexist()" tabindex="0" type="email" style="width: 70%;opacity:1;transition:opacity 0.3s;height:50px;border-radius:10px;background-color:rgb(144, 234, 147);display:inline-flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:relative;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);outline:rgb(255, 255, 255) none 0px;border:0px none rgb(255, 255, 255);margin:0px;cursor:pointer;user-select:none;vertical-align:middle;appearance:none;text-decoration:none solid rgb(255, 255, 255);font-weight:500;font-size:14px;line-height:24.5px;letter-spacing:0.39998px;text-transform:uppercase;font-family:Poppins, 'Open Sans', sans-serif;min-width:64px;padding:6px 16px;color:rgb(255, 255, 255);box-shadow:none;">
        <span id="button_span" style="font-size:14px;font-weight:700;margin:0px;line-height:23.24px;letter-spacing:0.46662px;font-family:Poppins, 'Open Sans', sans-serif;">Continue</span>
        <div id="loadingIndicator" style="display: none; width: 24px; height: 24px; border: 3px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top: 3px solid white; animation: spin 1s linear infinite;"></div>
        </button>
    
</div>
    `

}

 async function checkemailexist(){
    
    const email_input = document.querySelector("input[name='email']");
    const email_value=email_input.value;
    const div = document.querySelector('.style-6');

    

    if(validateEmail(email_value)){
        const button= document.getElementById("mybutton");
        const button_span= document.getElementById("button_span");
        button.style.backgroundColor='gray';
        button.style.cursor="default";
        button.disabled=true;
        button_span.style.display = "none";
        document.getElementById("loadingIndicator").style.display = "block";

        if(await checkEmailExists(email_value) == true  ){
            
            div.innerHTML=`
            <div style="max-width:444px;padding-left:24px;padding-right:24px;background:rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box;text-align:center;padding-top:40px;border-radius:20px;padding-bottom:40px;width: 100%;margin-left: auto;box-sizing:border-box;margin-right: auto;display:block;">
    <form id="loginForm">
        <div style="display:flex;">
            <div style="margin: auto;">
                <div m="auto" style="position:relative;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;flex-shrink:0;font-family:Poppins, 'Open Sans', sans-serif;font-size:20px;line-height:20px;border-radius:50%;overflow:hidden;user-select:none;width: 100px;height:100px;display:flex;align-self:center;"><img alt="email" src="https://multivendor.enatega.com/static/media/emailLock.2219c6ed.png" style="filter: invert(0);width: 100%;height:100px;text-align:center;object-fit:cover;color:rgba(0, 0, 0, 0);text-indent:10000px;" /></div>
            </div>
        </div>
        <div style="margin-top:16px;"></div>
        <h5 style="font-weight:700;margin:0px;font-size:24px;line-height:32.016px;letter-spacing:normal;font-family:Poppins, 'Open Sans', sans-serif;">Sign in with your email</h5><span style="color:rgb(117, 117, 117);font-size:14px;margin:0px;font-weight:400;line-height:23.24px;letter-spacing:0.46662px;font-family:Poppins, 'Open Sans', sans-serif;">Type your password</span>
        <div style="margin-top:16px;"></div>
        <div style="display:inline-flex;flex-direction:column;position:relative;min-width:0px;padding:0px;margin:0px;border:0px none rgb(0, 0, 0);vertical-align:top;width: 100%;"><label data-shrink="true" style="color: rgb(117, 117, 117);font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;padding:0px;display:block;transform-origin:0px 0px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(133% - 32px);position:absolute;left:0px;top:0px;transform:matrix(0.75, 0, 0, 0.75, 14, -9);transition:color 0.2s cubic-bezier(0, 0, 0.2, 1), transform 0.2s cubic-bezier(0, 0, 0.2, 1), max-width 0.2s cubic-bezier(0, 0, 0.2, 1);z-index:1;pointer-events: auto;user-select:none;" for="mui-3">Email</label>
            <div style="font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(255, 255, 255);box-sizing:border-box;cursor:text;display:flex;-webkit-box-align:center;align-items:center;width: 100%;position:relative;border-radius:4px;"><input id="email" aria-invalid="false" name="userEmail" type="text" value=${email_value} style="color:rgb(33, 33, 33);font:16px / 23px Poppins, 'Open Sans', sans-serif;letter-spacing:0.15008px;border:0px none rgb(33, 33, 33);box-sizing:content-box;height:23px;margin:0px;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;min-width:0px;width: 100%;animation-name: mui-auto-fill-cancel;animation-duration:0.01s;padding:16.5px 14px;" />
                <fieldset aria-hidden="true" style="border-color:rgb(238, 238, 238);text-align:left;position:absolute;inset:-5px 0px 0px;margin:0px;padding:0px 8px;pointer-events:none;border-radius:4px;border-style:solid;border-width:1px;overflow:hidden;min-width:0%;">
                    <legend style="float:none;width: auto;overflow:hidden;display:block;padding:0px;height:11px;font-size:12px;visibility:hidden;max-width:100%;transition:max-width 0.1s cubic-bezier(0, 0, 0.2, 1) 0.05s;white-space:nowrap;"><span style="padding-left:5px;padding-right:5px;display:inline-block;opacity:0;visibility:visible;">Email</span></legend>
                </fieldset>
            </div>
        </div>
        <div style="margin-top:16px;"></div>
        <div style="display:inline-flex;flex-direction:column;position:relative;min-width:0px;padding:0px;margin:0px;border:0px none rgb(0, 0, 0);vertical-align:top;width: 100%;"><label data-shrink="true" style="color: rgb(117, 117, 117);font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;padding:0px;display:block;transform-origin:0px 0px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(133% - 32px);position:absolute;left:0px;top:0px;transform:matrix(0.75, 0, 0, 0.75, 14, -9);transition:color 0.2s cubic-bezier(0, 0, 0.2, 1), transform 0.2s cubic-bezier(0, 0, 0.2, 1), max-width 0.2s cubic-bezier(0, 0, 0.2, 1);z-index:1;pointer-events: auto;user-select:none;" for="mui-4">Password</label>
            <div style="font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(255, 255, 255);box-sizing:border-box;cursor:text;display:flex;-webkit-box-align:center;align-items:center;width: 100%;position:relative;border-radius:4px;padding-right:14px;"><input id="password" aria-invalid="false" name="userPass" type="password" value="123123" style="color:rgb(33, 33, 33);font:16px / 23px Poppins, 'Open Sans', sans-serif;letter-spacing:0.15008px;border:0px none rgb(33, 33, 33);box-sizing:content-box;height:23px;margin:0px;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;min-width:0px;width: 100%;animation-name: mui-auto-fill-cancel;animation-duration:0.01s;padding:16.5px 0px 16.5px 14px;" />
                <div style="display:flex;height:0.15625px;max-height:32px;-webkit-box-align:center;align-items:center;white-space:nowrap;color:rgba(0, 0, 0, 0.54);margin-left:8px;"><button tabindex="0" type="button" aria-label="toggle password visibility" style="display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:relative;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);background-color:rgba(0, 0, 0, 0);outline:rgba(0, 0, 0, 0.54) none 0px;border:0px none rgba(0, 0, 0, 0.54);margin:0px -12px 0px 0px;cursor:pointer;user-select:none;vertical-align:middle;appearance:none;text-decoration:none solid rgba(0, 0, 0, 0.54);text-align:center;flex: 0 0 auto;border-radius:50%;overflow:visible;color:rgba(0, 0, 0, 0.54);transition:background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);padding:12px;font-size:28px;"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VisibilityOffIcon" style="user-select:none;width: 1em;height:24px;display:block;fill:rgb(144, 234, 147);flex-shrink:0;transition:fill 0.2s cubic-bezier(0.4, 0, 0.2, 1);font-size:24px;color:rgb(144, 234, 147);">
                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7M2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z"></path>
                        </svg><span style="overflow:hidden;pointer-events:none;position:absolute;z-index:0;inset:0px;border-radius:50%;"></span></button></div>
                <fieldset aria-hidden="true" style="border-color:rgb(238, 238, 238);text-align:left;position:absolute;inset:-5px 0px 0px;margin:0px;padding:0px 8px;pointer-events:none;border-radius:4px;border-style:solid;border-width:1px;overflow:hidden;min-width:0%;">
                    <legend style="float:none;width: auto;overflow:hidden;display:block;padding:0px;height:11px;font-size:12px;visibility:hidden;max-width:100%;transition:max-width 0.1s cubic-bezier(0, 0, 0.2, 1) 0.05s;white-space:nowrap;"><span style="padding-left:5px;padding-right:5px;display:inline-block;opacity:0;visibility:visible;">Password</span></legend>
                </fieldset>
            </div>
        </div><a href="#/forgot-password" style="text-decoration: none; display: flex;display:flex;"><button tabindex="0" type="button" style="display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:relative;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);background-color:rgba(0, 0, 0, 0);outline:rgb(144, 234, 147) none 0px;border:0px none rgb(144, 234, 147);margin:0px;cursor:pointer;user-select:none;vertical-align:middle;appearance:none;text-decoration:none solid rgb(144, 234, 147);font-weight:500;font-size:14px;line-height:24.5px;letter-spacing:0.39998px;text-transform:uppercase;font-family:Poppins, 'Open Sans', sans-serif;min-width:64px;padding:6px 8px;border-radius:4px;transition:background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s cubic-bezier(0.4, 0, 0.2, 1);color:rgb(144, 234, 147);"><span style="text-transform: none; display: flex; margin-bottom: 24px;display:flex;margin-bottom:24px;font-weight:700;margin:0px 0px 24px;font-size:12px;line-height:19.92px;letter-spacing:0.39996px;font-family:Poppins, 'Open Sans', sans-serif;">Forgot your password?</span><span style="overflow:hidden;pointer-events:none;position:absolute;z-index:0;inset:0px;border-radius:4px;"></span></button></a>
        <h3 id="error_message"></h3>
        <div style="margin-top:16px;"></div>
        
        <button id="loginbutton" tabindex="0" type="email" style="width: 70%;opacity:1;transition:opacity 0.3s;height:50px;border-radius:10px;background-color:rgb(144, 234, 147);display:inline-flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:relative;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);outline:rgb(255, 255, 255) none 0px;border:0px none rgb(255, 255, 255);margin:0px;cursor:pointer;user-select:none;vertical-align:middle;appearance:none;text-decoration:none solid rgb(255, 255, 255);font-weight:500;font-size:14px;line-height:24.5px;letter-spacing:0.39998px;text-transform:uppercase;font-family:Poppins, 'Open Sans', sans-serif;min-width:64px;padding:6px 16px;color:rgb(255, 255, 255);box-shadow:none;">
        <span id="button_span" style="font-size:14px;font-weight:700;margin:0px;line-height:23.24px;letter-spacing:0.46662px;font-family:Poppins, 'Open Sans', sans-serif;">CONTINUE</span>
        <div id="loadingIndicator" style="display: none; width: 24px; height: 24px; border: 3px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top: 3px solid white; animation: spin 1s linear infinite;"></div>
        
        </button>
        
        <div style="margin-top:16px;"></div>
    </form>
</div>
            `
            set_login_action();

        }
        else{
            
            div.innerHTML=`<div style="max-width:444px;padding-left:24px;padding-right:24px;background:rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box;text-align:center;padding-top:40px;border-radius:20px;padding-bottom:40px;width: 100%;margin-left: auto;box-sizing:border-box;margin-right: auto;display:block;">
                                    <div style="display:flex;">
                                        <div style="margin: auto;">
                                            <div m="auto" style="position:relative;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;flex-shrink:0;font-family:Poppins, 'Open Sans', sans-serif;font-size:20px;line-height:20px;border-radius:50%;overflow:hidden;user-select:none;width: 100px;height:100px;display:flex;align-self:center;"><img alt="email" src="https://multivendor.enatega.com/static/media/emailLock.2219c6ed.png" style="filter: invert(0);width: 100%;height:100px;text-align:center;object-fit:cover;color:rgba(0, 0, 0, 0);text-indent:10000px;" /></div>
                                        </div>
                                    </div>
                                    <div style="margin-top:8px;"></div>
                                    <h5 style="font-weight:700;margin:0px;font-size:24px;line-height:32.016px;letter-spacing:normal;font-family:Poppins, 'Open Sans', sans-serif;">Let's get started!</h5>
                                    <div style="margin-top:8px;"></div><span style="color:rgb(90, 88, 88);font-size:14px;margin:0px;font-weight:400;line-height:23.24px;letter-spacing:0.46662px;font-family:Poppins, 'Open Sans', sans-serif;">Create your Enatega Account</span>
                                    <div style="margin-top:24px;"></div>
                                    <form id="signupForm">
                                        <div style="display:inline-flex;flex-direction:column;position:relative;min-width:0px;padding:0px;margin:0px;border:0px none rgb(0, 0, 0);vertical-align:top;width: 100%;"><label data-shrink="true" style="color: rgb(158, 158, 158);font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;padding:0px;display:block;transform-origin:0px 0px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(133% - 32px);position:absolute;left:0px;top:0px;transform:matrix(0.75, 0, 0, 0.75, 14, -9);transition:color 0.2s cubic-bezier(0, 0, 0.2, 1), transform 0.2s cubic-bezier(0, 0, 0.2, 1), max-width 0.2s cubic-bezier(0, 0, 0.2, 1);z-index:1;pointer-events: auto;user-select:none;" for="mui-6">Email</label>
                                            <div style="font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(255, 255, 255);box-sizing:border-box;cursor:text;display:flex;-webkit-box-align:center;align-items:center;width: 100%;position:relative;border-radius:4px;"><input aria-invalid="false" name="email" type="text" value=${email_value} style="color:rgb(33, 33, 33);font:16px / 23px Poppins, 'Open Sans', sans-serif;letter-spacing:0.15008px;border:0px none rgb(33, 33, 33);box-sizing:content-box;height:23px;margin:0px;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;min-width:0px;width: 100%;animation-name: mui-auto-fill-cancel;animation-duration:0.01s;padding:16.5px 14px;" />
                                                <fieldset aria-hidden="true" style="border-color:rgb(238, 238, 238);text-align:left;position:absolute;inset:-5px 0px 0px;margin:0px;padding:0px 8px;pointer-events:none;border-radius:4px;border-style:solid;border-width:1px;overflow:hidden;min-width:0%;">
                                                    <legend style="float:none;width: auto;overflow:hidden;display:block;padding:0px;height:11px;font-size:12px;visibility:hidden;max-width:100%;transition:max-width 0.1s cubic-bezier(0, 0, 0.2, 1) 0.05s;white-space:nowrap;"><span style="padding-left:5px;padding-right:5px;display:inline-block;opacity:0;visibility:visible;">Email</span></legend>
                                                </fieldset>
                                            </div>
                                        </div>
                                        <div style="margin:8px 0px;display:flex;flex-direction:row;justify-content:space-between;">
                                            <div style="width: 45%;display:flex;flex-direction:column;position:relative;min-width:0px;padding:0px;margin:0px;border:0px none rgb(0, 0, 0);vertical-align:top;">
                                            <label id="firstnamespan" data-shrink="false" style="color: rgb(117, 117, 117);font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;padding:0px;display:block;transform-origin:0px 0px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 24px);position:absolute;left:0px;top:0px;transform:matrix(1, 0, 0, 1, 14, 16);transition:color 0.2s cubic-bezier(0, 0, 0.2, 1), transform 0.2s cubic-bezier(0, 0, 0.2, 1), max-width 0.2s cubic-bezier(0, 0, 0.2, 1);z-index:1;pointer-events:none;" for="mui-7">First Name</label>
                                                <div style="font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(255, 255, 255);box-sizing:border-box;cursor:text;display:flex;-webkit-box-align:center;align-items:center;width: 100%;position:relative;border-radius:4px;">
                                                <input oninput="hideLabel()" aria-invalid="false" name="firstName" type="text" value="" style="color:rgb(33, 33, 33);font:16px / 23px Poppins, 'Open Sans', sans-serif;letter-spacing:0.15008px;border:0px none rgb(33, 33, 33);box-sizing:content-box;height:23px;margin:0px;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;min-width:0px;width: 100%;animation-name: mui-auto-fill-cancel;animation-duration:0.01s;padding:16.5px 14px;" />
                                                    <fieldset aria-hidden="true" style="border-color:rgb(238, 238, 238);text-align:left;position:absolute;inset:-5px 0px 0px;margin:0px;padding:0px 8px;pointer-events:none;border-radius:4px;border-style:solid;border-width:1px;overflow:hidden;min-width:0%;">
                                                        <legend style="float:none;width: auto;overflow:hidden;display:block;padding:0px;height:11px;font-size:12px;visibility:hidden;max-width:0.01px;transition:max-width 0.05s cubic-bezier(0, 0, 0.2, 1);white-space:nowrap;">
                                                        <span  style="padding-left:5px;padding-right:5px;display:inline-block;opacity:0;visibility:visible;">First Name</span>
                                                        </legend>
                                                    </fieldset>
                                                </div>
                                            </div>
                                            <div style="width: 45%;display:flex;flex-direction:column;position:relative;min-width:0px;padding:0px;margin:0px;border:0px none rgb(0, 0, 0);vertical-align:top;">
                                            <label  id="lastnamespan" data-shrink="false" style="color: rgb(117, 117, 117);font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;padding:0px;display:block;transform-origin:0px 0px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 24px);position:absolute;left:0px;top:0px;transform:matrix(1, 0, 0, 1, 14, 16);transition:color 0.2s cubic-bezier(0, 0, 0.2, 1), transform 0.2s cubic-bezier(0, 0, 0.2, 1), max-width 0.2s cubic-bezier(0, 0, 0.2, 1);z-index:1;pointer-events:none;" for="mui-8">Last Name</label>
                                                <div style="font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(255, 255, 255);box-sizing:border-box;cursor:text;display:flex;-webkit-box-align:center;align-items:center;width: 100%;position:relative;border-radius:4px;">
                                                <input oninput="hideLabel()" aria-invalid="false" name="lastName" type="text" value="" style="color:rgb(33, 33, 33);font:16px / 23px Poppins, 'Open Sans', sans-serif;letter-spacing:0.15008px;border:0px none rgb(33, 33, 33);box-sizing:content-box;height:23px;margin:0px;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;min-width:0px;width: 100%;animation-name: mui-auto-fill-cancel;animation-duration:0.01s;padding:16.5px 14px;" />
                                                    <fieldset aria-hidden="true" style="border-color:rgb(238, 238, 238);text-align:left;position:absolute;inset:-5px 0px 0px;margin:0px;padding:0px 8px;pointer-events:none;border-radius:4px;border-style:solid;border-width:1px;overflow:hidden;min-width:0%;">
                                                        <legend style="float:none;width: auto;overflow:hidden;display:block;padding:0px;height:11px;font-size:12px;visibility:hidden;max-width:0.01px;transition:max-width 0.05s cubic-bezier(0, 0, 0.2, 1);white-space:nowrap;"><span style="padding-left:5px;padding-right:5px;display:inline-block;opacity:0;visibility:visible;">Last Name</span></legend>
                                                    </fieldset>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="display:inline-flex;flex-direction:column;position:relative;min-width:0px;padding:0px;margin:0px;border:0px none rgb(0, 0, 0);vertical-align:top;width: 100%;">
                                        <label id="passwordspan" data-shrink="false" style="color: rgb(117, 117, 117);font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;padding:0px;display:block;transform-origin:0px 0px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 24px);position:absolute;left:0px;top:0px;transform:matrix(1, 0, 0, 1, 14, 16);transition:color 0.2s cubic-bezier(0, 0, 0.2, 1), transform 0.2s cubic-bezier(0, 0, 0.2, 1), max-width 0.2s cubic-bezier(0, 0, 0.2, 1);z-index:1;pointer-events:none;" for="mui-9">Password</label>
                                            <div style="font-weight:400;font-size:16px;line-height:23px;letter-spacing:0.15008px;font-family:Poppins, 'Open Sans', sans-serif;color:rgb(255, 255, 255);box-sizing:border-box;cursor:text;display:flex;-webkit-box-align:center;align-items:center;width: 100%;position:relative;border-radius:4px;padding-right:14px;"><input oninput="hideLabel()" aria-invalid="false" name="password" type="password" value="" style="color:rgb(33, 33, 33);font:16px / 23px Poppins, 'Open Sans', sans-serif;letter-spacing:0.15008px;border:0px none rgb(33, 33, 33);box-sizing:content-box;height:23px;margin:0px;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);display:block;min-width:0px;width: 100%;animation-name: mui-auto-fill-cancel;animation-duration:0.01s;padding:16.5px 0px 16.5px 14px;" />
                                                <div style="display:flex;height:0.15625px;max-height:32px;-webkit-box-align:center;align-items:center;white-space:nowrap;color:rgba(0, 0, 0, 0.54);margin-left:8px;"><button tabindex="0" type="button" aria-label="toggle password visibility" style="display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:relative;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);background-color:rgba(0, 0, 0, 0);outline:rgba(0, 0, 0, 0.54) none 0px;border:0px none rgba(0, 0, 0, 0.54);margin:0px -12px 0px 0px;cursor:pointer;user-select:none;vertical-align:middle;appearance:none;text-decoration:none solid rgba(0, 0, 0, 0.54);text-align:center;flex: 0 0 auto;border-radius:50%;overflow:visible;color:rgba(0, 0, 0, 0.54);transition:background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);padding:12px;font-size:28px;"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VisibilityOffIcon" style="user-select:none;width: 1em;height:24px;display:block;fill:rgb(144, 234, 147);flex-shrink:0;transition:fill 0.2s cubic-bezier(0.4, 0, 0.2, 1);font-size:24px;color:rgb(144, 234, 147);">
                                                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7M2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z"></path>
                                                        </svg><span style="overflow:hidden;pointer-events:none;position:absolute;z-index:0;inset:0px;border-radius:50%;"></span></button></div>
                                                <fieldset aria-hidden="true" style="border-color:rgb(238, 238, 238);text-align:left;position:absolute;inset:-5px 0px 0px;margin:0px;padding:0px 8px;pointer-events:none;border-radius:4px;border-style:solid;border-width:1px;overflow:hidden;min-width:0%;">
                                                    <legend style="float:none;width: auto;overflow:hidden;display:block;padding:0px;height:11px;font-size:12px;visibility:hidden;max-width:0.01px;transition:max-width 0.05s cubic-bezier(0, 0, 0.2, 1);white-space:nowrap;"><span  style="padding-left:5px;padding-right:5px;display:inline-block;opacity:0;visibility:visible;">Password</span></legend>
                                                </fieldset>
                                            </div>
                                        </div>
                                        <div style="margin:8px 0px;display:flex;flex-direction:row;justify-content:space-between;">
                                            <div style="text-align: center; margin: auto;margin: auto;font-family:Roboto, sans-serif;font-size:15px;position:relative;width: 100%;">
                                                <input   name="phone" placeholder="Enter phone number" type="tel" value="" style="padding-left: 10px; width: 100%; float: right; border-color: rgb(238, 238, 238); height: 50px;width: 100%;float:right;border-color:rgb(238, 238, 238);height:50px;position:relative;font-size:14px;letter-spacing:0.16px;margin-left:0px;background:rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box;border:1px solid rgb(238, 238, 238);border-radius:5px;line-height:25px;outline:rgb(0, 0, 0) none 0px;margin-top:0px;margin-bottom:0px;box-sizing:border-box;" />
                                                <div style="position:absolute;top:0px;bottom:0px;padding:0px;background-color:rgb(245, 245, 245);border:1px solid rgb(202, 202, 202);border-radius:3px 0px 0px 3px;box-sizing:border-box;">
                                                    
                                                </div>
                                            </div>
                                        </div><span style="color: red;margin:0px;font-weight:400;font-size:12px;line-height:19.92px;letter-spacing:0.39996px;font-family:Poppins, 'Open Sans', sans-serif;"></span>
                                        <h3 id="error_message"></h3>
                                        <div style="margin-top:32px;"></div>
                                        <button id="signup_button" tabindex="0" type="email" style="width: 70%;height:50px;opacity:1;transition:opacity 0.3s;border-radius:10px;background-color:rgb(0, 0, 0);display:inline-flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:relative;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);outline:rgb(255, 255, 255) none 0px;border:0px none rgb(255, 255, 255);margin:0px;cursor:pointer;user-select:none;vertical-align:middle;appearance:none;text-decoration:none solid rgb(255, 255, 255);font-weight:500;font-size:14px;line-height:24.5px;letter-spacing:0.39998px;text-transform:uppercase;font-family:Poppins, 'Open Sans', sans-serif;min-width:64px;padding:6px 16px;color:rgb(255, 255, 255);box-shadow:none;">
                                        <span id="button_name" style="font-size:14px;font-weight:700;margin:0px;line-height:23.24px;letter-spacing:0.46662px;font-family:Poppins, 'Open Sans', sans-serif;">SignUP</span>
                                        <div id="loadingIndicator" style="display: none; width: 24px; height: 24px; border: 3px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top: 3px solid white; animation: spin 1s linear infinite;"></div>
                                        </button>
                                    </form>
                                </div>`
                                set_signup_action();
                                
        }

    }
    else{
        console.log("hereeeeeeeeeee");
        h=document.getElementById("error_message");

        h.innerHTML='please write vaild email';
        h.style.display="flex";
    }
}



// Function to log out the user from Firebase and Flask-Login
const logoutUser = async () => {
    try {
        // Log out from Firebase
        await auth.signOut();
        clearCart();
        console.log('User signed out from Firebase.');

        // Log out from Flask-Login
        const response = await fetch('/logout', {
            method: 'POST', // or 'GET', depending on your Flask logout route
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Ensure cookies are included for session management
        });

        if (!response.ok) {
            throw new Error('Error logging out from Flask-Login');
        }

        console.log('User signed out from Flask-Login.');
        // Redirect to home page or show logged out state
        window.location.href = '/'; // Redirect to the home page

    } catch (error) {
        console.error('Error signing out:', error);
    }
};

// Example: Attach logout function to a button

function validateEmail(email) {
    
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email matches the regex pattern
    if (emailRegex.test(email)) {
      return true; // Hide error message if valid
    } else {
      return false; // Show error message if invalid
    }
  }


  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function checkEmailExists(email) {
    try {
        // Use the fetch API to send the email to the Flask backend
        const response = await fetch('/check-email-exists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })  // Send email to backend
        });

        // Parse the response from the server
        const result = await response.json();

        // Check if the response is OK (200 status code)
        if (response.ok) {
            return true;  // Alert user if email exists
        } else {
            return false;  // Alert user if email does not exist
        }
    } catch (error) {
        console.error('Error:', error);  // Log error if something goes wrong
        alert('An error occurred while checking email existence.');
    }
}



// Initialize the Firebase Admin SDK

async function checkEmailVerification(email) {
    try {
        // Use the fetch API to send the email to the Flask backend
        const response = await fetch('/check-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })  // Send email to backend
        });

        // Parse the response from the server
        const result = await response.json();

        // Check if the response is OK (200 status code)
        if (response.ok) {
            return true;  // Alert user if email is verified
        } else {
            return false;  // Alert user if email is not verified
        }
    } catch (error) {
        console.error('Error:', error);  // Log error if something goes wrong
        alert('An error occurred while checking email verification.');
    }
}

