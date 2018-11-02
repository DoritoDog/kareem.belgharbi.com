setInterval(function() {
  var options = {
    timeZone: 'Europe/Bratislava',
    hour: 'numeric', minute: 'numeric',
  };
  var formatter = new Intl.DateTimeFormat([], options);
  $('.time').html(formatter.format(new Date()) + ' in Slovakia');
}, 1000);

var selectedGraphicIndex = 8;
var graphics = null;

window.onload = function() {
  setCV('en');

  // Email copying
  var email = document.getElementById('email');
  var copyEmail = document.getElementById('copy-email');
  email.addEventListener("mouseover", function(){ copyEmail.style.display = 'inline'; });
  email.addEventListener("mouseleave", function(){ copyEmail.style.display = 'none'; });
  email.addEventListener("click", function(){ copyToClipboard('email-copy-text'); });

  // Skills display
  var skills = document.getElementsByClassName('skill');
  var descriptions = document.getElementsByClassName('skill-description');
  for (var i = 0; i < skills.length; i++) (function(i){
    skills[i].addEventListener('mouseenter', function() {
      var display = descriptions[i].style.display;
      descriptions[i].style.display = display == 'block' ? 'none' : 'block';
    });

    skills[i].addEventListener('mouseleave', function() {
      var display = descriptions[i].style.display;
      descriptions[i].style.display = display == 'block' ? 'none' : 'block';
    });

    skills[i].addEventListener('mouseenter', function() {
      var caret = findFirstChildByClass(skills[i], 'fa');
      caret.style.transform = 'rotate(90deg)';
    });
    skills[i].addEventListener('mouseleave', function() {
      var caret = findFirstChildByClass(skills[i], 'fa');
      caret.style.transform = 'rotate(0deg)';
    });
  })(i);

  firstImg = document.getElementById('first-image');
  firstImg.style.marginLeft = '250px';

  $.getJSON("js/graphics.json", function(json) {
    graphics = json;
    var graphic = graphics[selectedGraphicIndex];
    document.getElementById('selected-graphic-name').innerHTML = graphic.name;
    document.getElementById('selected-graphic-image').src = 'img/Clear renders/' + graphic.image;
    //setObject(graphic.mesh, graphic.texture);
  });

  // nBase Slideshow
  slideshowCircles = document.getElementsByClassName('slideshow-circle');
  interval = setInterval(changeSlide, 5000);

  // ICO links
  var icoFeatures = document.getElementsByClassName('ico-feature');
  var links = [
    'https://ico.kareemsprojects.site', 'https://ico.kareemsprojects.site/users/add',
    'https://ico.kareemsprojects.site/users', 'https://ico.kareemsprojects.site/users/buy-and-transfer',
    'https://ico.kareemsprojects.site/stories/view/SEC-Official-Defends-Balanced-ICO-Oversight-in-Congress',
    'https://ico.kareemsprojects.site/users/block-explorer', 'https://ico.kareemsprojects.site/users'
  ];
  for (var i = 0; i < icoFeatures.length; i++) (function(i){
    icoFeatures[i].addEventListener('click', function() {
      window.open(links[i], '_blank');
    });
  })(i);

  // Particles.js
  particlesJS.load('header', 'js/particles.json', null);

  // Skill search
  document.getElementById('skill-search').addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      var keyword = $('.skill-search').val();

      var skills = $('.skill-name');
      for (var i = 0; i < skills.length; i++) {
        let isResult = skills[i].innerHTML.toLowerCase().includes(keyword.toLowerCase());
        if (isResult) {
          var output = skills[i].closest(".col-lg-6").classList[1] + ' > ' + skills[i].innerHTML;
          document.getElementById('skill-search-output').innerHTML += '<br>' + output;
        }
      }

      var lists = $('.skill-description');
      for (var i = 0; i < lists.length; i++) {
        var listItems = lists[i].getElementsByTagName("li");
        for (var c = 0; c < listItems.length; c++) {
          let isResult = listItems[c].innerHTML.toLowerCase().includes(keyword.toLowerCase());
          if (isResult) {
            var column = lists[i].closest(".col-lg-6");
            var skill = findFirstChildByClass(column, 'skill');
            var skillName = findFirstChildByClass(skill, 'skill-name');
            var output = column.classList[1] + ' > ' + skillName.innerHTML + ' > ' + listItems[c].innerHTML;
            document.getElementById('skill-search-output').innerHTML += '<br>' + output;
          }
        }
      }
    }
  });

  // Preloading icon
  $(".preload-icon").fadeOut("slow");
}

var interval;
var slideshowCircles;
var slides = ['Screenshot.png', 'CryptoGold screenshot.jpg', 'Feature Graphic 2.jpg'];
var currentSlideIndex = 0;

function changeSlide() {
  currentSlideIndex++;
  if (currentSlideIndex > slides.length - 1)
     currentSlideIndex = 0;

    setSlide(currentSlideIndex, false);
}

function setSlide(index, stopInterval) {
  currentSlideIndex = index;
  var slideshowBG = document.getElementById('slideshow-bg');

  if (stopInterval)
    clearInterval(interval);

  // Set the slideshow circles on or off.
  for (var i = 0; i < slideshowCircles.length; i++) {
    slideshowCircles[i].style.color = i == index ? '#ffcf68' : 'white';
  }

  slideshowBG.style.opacity = 0;
  setTimeout(function() {
    slideshowBG.src = 'img/' + slides[index];
    slideshowBG.style.opacity = 1;

    if (stopInterval)
      interval = setInterval(changeSlide, 3000);
  }, 700);
}

function moveImage(amount) {
  selectedGraphicIndex = amount < 0 ? ++selectedGraphicIndex : --selectedGraphicIndex;
  if (selectedGraphicIndex < 0) {
    selectedGraphicIndex = 0;
    return;
  }
  else if (selectedGraphicIndex >= graphics.length) {
    selectedGraphicIndex = graphics.length - 1;
    return;
  }

  firstImg = document.getElementById('first-image');
  var margin = firstImg.style.marginLeft;
  var newMargin = parseInt(margin.substring(0, margin.indexOf('p')));
  newMargin += amount;
  firstImg.style.marginLeft = newMargin + 'px';

  var graphic = graphics[selectedGraphicIndex];
  document.getElementById('selected-graphic-name').innerHTML = graphic.name;
  document.getElementById('selected-graphic-image').src = 'img/Clear renders/' + graphic.image;
  //setObject(graphic.mesh, graphic.texture);
}

window.onscroll = adjustNavbar;

var isDropdownOpen;
function toggleDropdown() {
  isDropdownOpen = !isDropdownOpen;
  document.getElementById('dropdown-languages').style.display = isDropdownOpen ? 'block' : 'none';
}

function setCV(lang) {
  if(PDFObject.supportsPDFs) {
    var options = {
      width: '500px',
      height: '400px',
    };
    PDFObject.embed(`./resume/CV_${lang}.pdf`, "#resume-viewer", options);
  }
}

function setLang(language) {
  toggleDropdown();

  $.getJSON(`js/${language}.json`, function(json) {
    var localized = document.getElementsByClassName('localized');
    for (var i = 0; i < localized.length; i++) {
      localized[i].innerHTML = json[localized[i].getAttribute('data-key')];
    }

    var code;
    var languageLocalized;
    if (language == 'english') {
      code = 'us';
      languageLocalized = 'English';
      setCV('en');
    }
    else if (language == 'slovak') {
      code = 'sk';
      languageLocalized = 'Slovenčina';
      setCV('sk');
    }
    document.getElementById('lang-flag').src = `https://www.countryflags.io/${code}/flat/32.png`;
    document.getElementById('lang').innerHTML = languageLocalized;
  });
}

function adjustNavbar() {
  var bottomNavbar = document.getElementById('navigation-bar-links');
  var navbarBg = document.getElementById('bottom-navigation-bar');

  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    // Scrolling
    navbarBg.style.top = 0;
    navbarBg.style.backgroundColor = 'white';
    navbarBg.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)';
    var media = window.matchMedia("(max-width: 800px)");
    $('.bottom-navigation-bar ul li a').css({'color': (media.matches ? 'white' : 'black')});
  } else {
    // Not scrolling
    var media = window.matchMedia("(max-width: 800px)");
    navbarBg.style.top = media.matches ? '120px' : '46px';
    navbarBg.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    navbarBg.style.boxShadow = 'none';
    $('.bottom-navigation-bar ul li a').css({'color': 'white'});
  }
}

var isNavbarOpen;
function toggleNavbar() {
  isNavbarOpen = !isNavbarOpen;
  if (isNavbarOpen) {
    $('.bottom-navigation-bar ul li a').show();
  } else {
    $('.bottom-navigation-bar ul li a').hide();
  }
}

function resetSkillSearch() {
  document.getElementById('skill-search').innerHTML = '';
}

function copyToClipboard(id) {
  var copyText = document.getElementById(id);
  copyText.select();
  document.execCommand("Copy");
}

function findFirstChildByClass(element, className) {
  var foundElement = null, found;
  function recurse(element, className, found) {
    for (var i = 0; i < element.childNodes.length && !found; i++) {
      var el = element.childNodes[i];
      var classes = el.className != undefined? el.className.split(" ") : [];
      for (var j = 0, jl = classes.length; j < jl; j++) {
        if (classes[j] == className) {
          found = true;
          foundElement = element.childNodes[i];
          break;
        }
      }
      if (found) break;
      recurse(element.childNodes[i], className, found);
    }
  }
  recurse(element, className, false);
  return foundElement;
}

function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}