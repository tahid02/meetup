// /////////////////////////////////after feed loaded////////////////

/////////////////////////////////////////////////////////////////////// modify event ui ///////////////////////
const changeEventUI = (eventElement) => {
  const { noOfAttendee, isBlackListed, isFavorite } = eventInfo;
  if (noOfAttendee < document.getElementById("attendeeInput").value) {
    eventElement.style.display = "none";
  }
  if (isFavorite) {
    eventElement.style.border = "5px solid yellow";
  }
  if (isBlackListed) {
    eventElement.style.border = "5px solid red";
  }
};
/////////////////////////////////////////////////////////////////////// create  btn ///////////////////////
const createButton = (btnType, eventElement, eventInfo) => {
  const { groupName, isBlackListed, isFavorite } = eventInfo;

  const btnElement = document.createElement("button");
  btnElement.style.backgroundColor = "#f65858";
  btnElement.style.border = "none";
  btnElement.style.padding = ".5rem 1rem";
  btnElement.style.borderRadius = "40px ";
  btnElement.style.color = "white ";
  btnElement.style.marginRight = ".5rem";
  if (btnType.toLowerCase().includes("favorite")) {
    btnElement.setAttribute("class", "favoriteBtn");
    btnElement.addEventListener("click", (e) =>
      setFavoriteList(e, eventElement, groupName)
    );
    if (isFavorite) {
      btnElement.value = "Add to Favorite";
    } else {
      btnElement.value = "Remove from Favorite";
    }
  } else if (btnType.toLowerCase().includes("blacklist")) {
    btnElement.setAttribute("class", "blacklistBtn");
    if (isBlackListed) {
      btnElement.value = "Add to backlist";
    } else {
      btnElement.value = "Remove from backlist";
    }
  }

  btnElement.appendChild(buttonText);

  return btnElement;
};
/////////////////////////////////////////////////////////////////////// create add and favorite btn ///////////////////////
const createAddAndFavoriteBtn = (eventElement, eventInfo) => {
  console.log("hello create btn");
  const btnDiv = document.createElement("div");
  btnDiv.style.display = "flex";
  btnDiv.style.justifyContent = "end";
  btnDiv.style.paddingBottom = "10px";
  const FavBtn = createButton("favorite", eventElement, eventInfo);
  const BlackBtn = createButton("blackList", eventElement, eventInfo);

  btnDiv.appendChild(FavBtn);
  btnDiv.appendChild(BlackBtn);
  eventElement.appendChild(btnDiv);
};
//////////////////////////////////////////////////////////////////////fdf df /////////////////////
function removeLoserAttendeeEvent(eventElement, noOfAttendee) {
  if (noOfAttendee < 10) {
    eventElement.style.border = "5px solid blue";
  }
}
//////////////////////////////////////////////////////////////////////fdf df /////////////////////
function getEventInfo(eventElement, obj) {
  const { favoriteList, blackList } = obj.allList;
  //  group name
  const groupName = eventElement
    .getElementsByTagName("p")[1]
    .innerText.split("\n")[1]
    .split("•")[0];
  // no of  attendee
  const noOfAttendee =
    eventElement.querySelectorAll(".hidden").length < 3
      ? eventElement.querySelectorAll(".hidden")[1].innerText
      : eventElement.querySelectorAll(".hidden")[2].innerText;
  let isFavorite = favoriteList.indexOf(groupName) > -1 || false;
  let isBlackListed = blackList.indexOf(groupName) > -1 || false;

  return { groupName, noOfAttendee, isFavorite, isBlackListed };
}
///////////////////////////////////////////////////////////////////////main events task ///////////////////////

const manipulateEvents = (obj) => {
  const allEvents =
    document.getElementById("main").childNodes[0].childNodes[1].childNodes[0]
      .childNodes[0].childNodes[0];
  let noOfEvents = allEvents.children.length;

  for (let i = 0; i <= noOfEvents; i++) {
    const eventElement = allEvents.childNodes[i];
    const eventInfo = getEventInfo(eventElement, obj);
    removeLowerAttendeeEvent(eventElement, eventInfo.noOfAttendee);
    createAddAndFavoriteBtn(eventElement, eventInfo);
    changeEventUI(eventElement, eventInfo);
  }
};

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const autoLoad = setInterval(function () {
  let lastScrollHeight = 0;
  const sh = document.documentElement.scrollHeight;
  const allLoaded = isInViewport(document.getElementById("main_footer"));
  if (sh != lastScrollHeight) {
    lastScrollHeight = sh;
    document.documentElement.scrollTop = sh;
  }
  if (allLoaded) {
    clearInterval(autoLoad);
    chrome.storage.sync.get("allList", (obj) => {
      manipulateEvents(obj);
    });
  }
}, 5000);

// empty storage
// chrome.storage.sync.set(
//   {
//     allList: {
//       favoriteList: [],
//       blackList: [],
//     },
//   },
//   function () {
//     chrome.storage.sync.get("allList", function (obj) {
//       console.log({ obj });
//     });
//   }
// );
