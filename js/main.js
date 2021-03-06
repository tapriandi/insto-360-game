var panorama, panorama_1, panorama_2, panorama_3, viewer, typed, typed;
var rulesInfospot, valveInfospot, endingInfospot;
var progressElement = document.querySelector('#progress');
var tweeningDelay = 300,
  typeStartDelay = 1000,
  typeSpeed = 50;

var paragraphs = {
  // welcome: ['360 Games', 'A Journey to find the <strong>insto bottle</strong>', 'Here we go'],
  // rules: ["1.  Find the insto bottle <br> 2.  Press and hold left click for moving area <br> 3.  One left click can hide the object, click again to show it <br> 4. Just click on the object <br>"
  // ],
  // ending: ["let's play!", 'press arrow button']
  welcome: ['welcome'],
  rules: ['rules'],
  ending: ['ending'],
};

// Patch for typed.js of cutting back-to-back words
for (var section in paragraphs) {
  if (paragraphs.hasOwnProperty(section)) {
    paragraphs[section].unshift('');
    paragraphs[section].push('');
  }
}

function delayExecute(func, delay) {
  setTimeout(func, delay);
}

function onLoad() {
  document.getElementById('dialog').classList.add('active');
  type(paragraphs.welcome, onWelcomeComplete, 2000);
}

function onEnter(event) {
  progressElement.style.width = 0;
  progressElement.classList.remove('finish');
}

function onProgress(event) {
  var progress = event.progress.loaded / event.progress.total * 100;
  progressElement.style.width = progress + '%';
  if (progress === 100) {
    progressElement.classList.add('finish');
  }
}

function onWelcomeComplete() {
  delayExecute(rulesInfospot.focus.bind(rulesInfospot), tweeningDelay);
  type(paragraphs.rules, onRulesTourComplete);
}

function onRulesTourComplete() {
  delayExecute(valveInfospot.focus.bind(valveInfospot), tweeningDelay);
  type(paragraphs.ending, onTopboxTourComplete);
}

function onTopboxTourComplete() {
  delayExecute(endingInfospot.focus.bind(endingInfospot), tweeningDelay);
  viewer.OrbitControls.enabled = true;
  document.getElementById('dialog').classList.remove('active');
}

// typing text
function type(stringArray, onComplete, startDelay) {
  onComplete = onComplete || function () {};
  startDelay = startDelay >= 0 ? startDelay : typeStartDelay;
  typed = new Typed("#typed", {
    strings: stringArray,
    typeSpeed: typeSpeed,
    showCursor: false,
    startDelay: startDelay,
    onComplete: onComplete
  });
}


// Infospots
rulesInfospot = new PANOLENS.Infospot();
valveInfospot = new PANOLENS.Infospot();
endingInfospot = new PANOLENS.Infospot(10e-7); // Make it not visible

rulesInfospot.position.set(4610.04, 1000, 1431.29);
valveInfospot.position.set(4637.61, -400, -4000);

rulesInfospot.addHoverText('Rules', 50);

// Panorama
// panorama = new PANOLENS.EmptyPanorama();
panorama = new PANOLENS.ImagePanorama('./assets/1.jpeg');
panorama_1 = new PANOLENS.ImagePanorama('./assets/2.jpeg');
panorama_2 = new PANOLENS.ImagePanorama('./assets/3.jpeg');
panorama.addEventListener('progress', onProgress);
panorama.addEventListener('load', onLoad);
panorama.addEventListener('enter', onEnter);
panorama.add(rulesInfospot, valveInfospot, endingInfospot);

panorama.link( panorama_1, new THREE.Vector3(4637.61, 250, -4000) );
panorama_1.link( panorama, new THREE.Vector3(4637.61, -1098.12, -1071.24) );
panorama_1.link( panorama_2, new THREE.Vector3(4637.61, -598.12, -1071.24) );
panorama_2.link( panorama_1, new THREE.Vector3(4637.61, -598.12, -1071.24) );

// Viewer
viewer = new PANOLENS.Viewer({
  controlBar: false,
  initialLookAt: new THREE.Vector3(0, 0, 5000)
});
viewer.OrbitControls.enabled = false;
viewer.add(panorama, panorama_1, panorama_2);

// insto object
var posterInfospot, posterInfospot_2;
posterInfospot = new PANOLENS.Infospot(300, './assets/insto.png');
posterInfospot_2 = new PANOLENS.Infospot(130, './assets/insto-2.png');
posterInfospot_3 = new PANOLENS.Infospot(1000, './assets/insto-3.png');

posterInfospot.addHoverText('Great, your eyes are good, find me again!', 50)
// posterInfospot_2.addHoverElement(document.getElementById('insto-video'), 200);
posterInfospot_3.addHoverText('Please, Find our friends!', 70)

posterInfospot.position.set(-4774.9, 474.16, 3400);
posterInfospot_2.position.set(-3774.9, 1300, -2200);
posterInfospot_3.position.set(4637.61, -1098.12, -3071.24);

panorama.add(posterInfospot);
panorama_area.add(posterInfospot, posterInfospot_2, posterInfospot_3);

posterInfospot_2.addEventListener('click', function() {
  $('#insto-video').removeClass('hidden');
  $('#insto-video video').get(0).play();
});

// access rule from panel
var posterInfospot_4 = new PANOLENS.Infospot(2000, './assets/rules.png');
posterInfospot_4.position.set(-4774.9, 474.16, -1375.02);
panorama.add(posterInfospot_4);

var controlItemPoster = {
  style: {
    backgroundImage: 'url(./assets/rules-icon.png)',
    float: 'right',
    borderRadius: '50%'
  },
  onTap: function(){
    posterInfospot_4.focus();
  }
};
viewer.appendControlItem(controlItemPoster);