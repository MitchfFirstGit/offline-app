var btn = document.querySelector('#reset-btn');

function addToHomeScreen() {

  if(deferredPrompt){
    console.log("deferredPrompt is true");
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then( function(choiceResult){
      if(choiceResult.outcome === 'dismissed'){
        console.log('user cancelled');
      }
      else{
        console.log('user  added');
      }
    });
    deferredPrompt = null;
  }
}

btn.addEventListener('click', addToHomeScreen);

