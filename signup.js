var Login = {
    accounts: ['fb', "google"],
    saveURL: 'social/save',
    fb: function() {
      FB.login(function (response) {
        ga('send', 'event', 'Nav Menu', 'submit', 'facebook');
        if (response.authResponse && response.status == 'connected') {
            // Get and display the user profile data
            FB.api('/me', {locale: 'en_US', fields: 'id,first_name,last_name,email,link,gender,locale,picture'},
              function (fbresponse) {
                if(fbresponse !=  undefined){
                  if(fbresponse.email == undefined || fbresponse.email == null){
                    fbresponse.email = '';
                  }
                  var fb_data = {
                      "facebook_id" : fbresponse.id,
                      "name" : fbresponse.first_name,
                      "lastname" : fbresponse.last_name,
                      "email" : fbresponse.email,
                      "picture" : fbresponse.picture,
                      "gender" : fbresponse.gender,
                      "social" : "facebook"
                  };

                  var res = Login.save(fb_data);
            }
          });
        } else {
            document.getElementById('status').innerHTML = 'User cancelled login or did not fully authorize.';
        }
    }, {scope: 'email'});
    },
    initGoogle: function (element) {
        auth2.attachClickHandler(element, {},
            Login.google, function(error) {
                //console.log(JSON.stringify(error, undefined, 2));
            });
    },
    google: function(googleUser) {
        ga('send', 'event', 'Nav Menu', 'submit', 'google');
        var email = googleUser.getBasicProfile().getEmail();
        var name = googleUser.getBasicProfile().getName();
        var response = {
            'google_id': googleUser.getBasicProfile().getId(),
            'token': googleUser.getAuthResponse().id_token,
            'email': email,
            'name': name,
            'social': 'google',
            "lastname" : "",
            "gender" : ""
        };
        var res = Login.save(response);
    },
    save: function(data) {
        $.post(base_url + Login.saveURL, {'data': data } , function(response) {
            response = JSON.parse(response);
            if(response.success === true) {
                window.location.href = window.location.href;
            }else{
                $("#snackbarplan").text('Email or phone not found. Please try another method.');
                var x = document.getElementById("snackbarplan");
                x.className = "show";
                $("#snackbarplan").addClass('mandatory');
                setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
            }
        });
    }
};

window.fbAsyncInit = function() {
    // FB JavaScript SDK configuration and setup
    FB.init({
      appId      : '1003110159784040', // FB App ID
      cookie     : true,  // enable cookies to allow the server to access the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.8' // use graph api version 2.8
    });
  };

// Logout from facebook
function fbLogout() {
    FB.logout(function() {
        document.getElementById('fbLink').setAttribute("onclick","fbLogin()");
        document.getElementById('fbLink').innerHTML = '<img src="fblogin.png"/>';
        document.getElementById('userData').innerHTML = '';
        document.getElementById('status').innerHTML = 'You have successfully logout from Facebook.';
    });
}

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://vimages.vresorts.in/assets/js/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// SDK for Google Plus
var googleUser = {};
window.onload = function() {
    gapi.load('auth2', function(){
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '####################################################',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        });
        Login.initGoogle(document.getElementById('login-google'));
    });
};
window.onload = function() {
    gapi.load('auth2', function(){
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '#############################################',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        });
        Login.initGoogle(document.getElementById('signup-google'));
        Login.initGoogle(document.getElementById('login-google'));
    });
};
