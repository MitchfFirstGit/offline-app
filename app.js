var deferredPrompt;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js')
    .then(function() {
      console.log('Service worker registered!');
    });
}
window.addEventListener('beforeinstallprompt', function(event){

console.log("Add to home screen event");
  event.preventDefault();
  deferredPrompt = event;
  return false;
})
