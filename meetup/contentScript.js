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
  console.log("fav", btnType.toLowerCase().includes("favorite"));
  console.log("black", btnType.toLowerCase().includes("blacklist"));

  if (btnType.toLowerCase().includes("favorite")) {
    btnElement.setAttribute("class", "favoriteBtn");
    btnElement.addEventListener("click", (e) => {
      console.log(e.target.value);
    });
    console.log({ isFavorite });
    if (!isFavorite) {
      btnElement.value = "Add to Favorite";
      btnElement.textContent = "Add to Favorite";
    } else {
      btnElement.value = "Remove from Favorite";
      btnElement.textContent = "Remove from Favorite";
    }
  } else if (btnType.toLowerCase().includes("blacklist")) {
    btnElement.setAttribute("class", "blacklistBtn");
    if (!isBlackListed) {
      btnElement.value = "Add to blacklist";
      btnElement.textContent = "Add to blacklist";
    } else {
      btnElement.value = "Remove from blacklist";
      btnElement.textContent = "Remove from blacklist";
    }
  }

  return btnElement;
};
const createAddAndFavoriteBtn = (eventElement, eventInfo) => {
  // console.log("hello create btn");
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
/////////////////////////////////////////////////////////////////////// remove lower attendee events ///////////////////////

function removeLowerAttendeeEvent(eventElement, noOfAttendee) {
  console.log({ noOfAttendee });
  if (noOfAttendee < 10) {
    eventElement.style.border = "5px solid blue";
  }
}
/////////////////////////////////////////////////////////////////////// get the event info  ///////////////////////

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
      ? eventElement.querySelectorAll(".hidden")[1].innerText.split(" ")[0]
      : eventElement.querySelectorAll(".hidden")[2].innerText.split(" ")[0];
  let isFavorite = favoriteList.indexOf(groupName) > -1 || false;
  let isBlackListed = blackList.indexOf(groupName) > -1 || false;

  return {
    groupName,
    isFavorite,
    isBlackListed,
    noOfAttendee: parseInt(noOfAttendee),
  };
}
/////////////////////////////////////////////////////////////////////// manipulate the event ui///////////////////////

const manipulateEvents = (obj) => {
  const allEvents =
    document.getElementById("main").childNodes[0].childNodes[1].childNodes[0]
      .childNodes[0].childNodes[0];
  let noOfEvents = allEvents.children.length;
  let eventInfo = {};

  for (let i = 0; i <= noOfEvents; i++) {
    const eventElement = allEvents.childNodes[i];
    eventInfo = getEventInfo(eventElement, obj);
    removeLowerAttendeeEvent(eventElement, eventInfo.noOfAttendee);
    createAddAndFavoriteBtn(eventElement, eventInfo);
    // do action when btn is clicked
  }
};
/////////////////////////////////////////////////////////////////////// check if full feed is loaded ///////////////////////

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
/////////////////////////////////////////////////////////////////////// main func to execute ///////////////////////

const myMain = () => {
  const autoLoad = setInterval(function () {
    let lastScrollHeight = 0;
    const sh = document.documentElement.scrollHeight;
    const allLoaded = isInViewport(document.getElementById("main_footer"));
    if (sh != lastScrollHeight) {
      lastScrollHeight = sh;
      document.documentElement.scrollTop = sh;
    }
    if (allLoaded) {
      console.log("all loaded");
      clearInterval(autoLoad);
      window.scrollTo(0, 0);
      chrome.storage.sync.get("allList", (obj) => {
        console.log({ obj });
        manipulateEvents(obj);
      });
    }
  }, 5000);
};

(() => {
  window.addEventListener("load", myMain, false);
})();
