// DOC: start with the "myMain" function
// storage schema
// allList:{
//   favoriteList:[string containing group name]
//   blackList:[string containing group name]
// }
function filterAttendee(e, allEvents) {
  console.log(e.target);
  let noOfEvents = allEvents.children.length;
  console.log({ noOfEvents });

  for (let i = 0; i <= noOfEvents; i++) {
    const eventElement = allEvents.childNodes[i];
    // no of attendee in the event
    const noOfAttendee = eventElement
      ?.querySelectorAll(".hidden")
      [eventElement?.querySelectorAll(".hidden").length - 1].innerText.split(
        " "
      )[0];
    // show or hide the event if attendee is lower or larger
    if (
      parseInt(noOfAttendee) <
      parseInt(document.getElementById("extInput").value)
    ) {
      eventElement.style.display = "none";
    } else {
      eventElement.style.display = "block";
    }
  }
}
const createAttendeeInputDiv = () => {
  const allEvents =
    document.getElementById("main").childNodes[0].childNodes[1].childNodes[0]
      .childNodes[0].childNodes[0];
  const attendeeInputDiv = document.createElement("div");
  const attendeeInput = document.createElement("input");
  const attendeeInputBtn = document.createElement("button");

  attendeeInput.setAttribute("id", "extInput");
  attendeeInput.setAttribute(
    "style",
    `padding:7.5px 1rem;border:1px solid gray;  border-bottom-left-radius: 0.5rem;
  border-top-left-radius: 0.5rem;`
  );
  attendeeInput.value = 10; // initial value of the minimum attendee

  attendeeInputBtn.setAttribute("id", "extBtn");
  attendeeInputBtn.setAttribute(
    "style",
    `padding: .5rem 1rem; color:white;background-color:#008294;  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;`
  );
  attendeeInputBtn.innerText = "Attendee";
  attendeeInputBtn.addEventListener("click", function (e) {
    filterAttendee(e, allEvents);
  });

  attendeeInputDiv.appendChild(attendeeInput);
  attendeeInputDiv.appendChild(attendeeInputBtn);

  document
    .getElementById("main")
    .childNodes[0].childNodes[0].appendChild(attendeeInputDiv);
};
////////////////////////////////////////////////////////////// when favorite btn is clicked

const setBlackList = (e, eventElement, groupName) => {
  //  ////                                 ////////////////////    if add to favorite btn is clicked            ////////////

  if (e.target.innerText.toLowerCase().includes("add")) {
    chrome.storage.sync.get("allList", (obj) => {
      let { favoriteList, blackList } = obj.allList;

      chrome.storage.sync.set(
        {
          allList: {
            blackList: [...blackList, groupName],
            favoriteList: favoriteList.filter((fav) => fav !== groupName),
          },
        },
        function () {
          eventElement.querySelector(".blackListBtn").innerText =
            "Remove from BlackList";
          eventElement.querySelector(".favoriteBtn").innerText =
            "Add to Favorite";
          eventElement.style.border = "5px solid black";
        }
      );
    });
  }

  //                                                   /// if remove from favorite btn is clicked       ////////////////////////
  else if (e.target.innerText.toLowerCase().includes("remove")) {
    // if blacklisted events are hidden , then this remove this block of code, because user cant view the "remove from blacklist" button to click it
    chrome.storage.sync.get("allList", (obj) => {
      let { favoriteList, blackList } = obj.allList;

      const newBlackList = blackList.filter(
        (black) => black.toLowerCase() !== groupName.toLowerCase()
      );
      chrome.storage.sync.set(
        {
          allList: {
            blackList: newBlackList,
            favoriteList,
          },
        },
        function () {
          eventElement.querySelector(".blackListBtn").innerText =
            "Add to blacklist";
          eventElement.style.border = "none";
        }
      );
    });
  }
};
const setFavoriteList = (e, eventElement, groupName) => {
  //  ////                                 ////////////////////    if add to favorite btn is clicked            ////////////

  if (e.target.innerText.toLowerCase().includes("add")) {
    chrome.storage.sync.get("allList", (obj) => {
      let { favoriteList, blackList } = obj.allList;
      console.log("allList", { obj });
      // checking in blackList
      const backlistIndex = blackList.indexOf(groupName);
      if (backlistIndex > -1) {
        blackList = blackList.filter((black) => black !== groupName);
        eventElement.querySelector(".blackListBtn").innerText =
          "Add to BlackList";
      }

      //now  checking in favorite list
      const groupFoundInFavoriteList = favoriteList.indexOf(groupName) > -1;
      if (groupFoundInFavoriteList) {
        console.log("already in favorite list");
        return;
      } else {
        chrome.storage.sync.set(
          {
            allList: {
              favoriteList: [...favoriteList, groupName],
              blackList,
            },
          },
          function () {
            eventElement.querySelector(".favoriteBtn").innerText =
              "Remove from favorite";
            eventElement.style.border = "5px solid #f65858";
          }
        );
      }
    });
  }

  //                                                   /// if remove from favorite btn is clicked       ////////////////////////
  else if (e.target.innerText.toLowerCase().includes("remove")) {
    chrome.storage.sync.get("allList", (obj) => {
      let { favoriteList, blackList } = obj.allList;

      const newFavList = favoriteList.filter(
        (fav) => fav.toLowerCase() !== groupName.toLowerCase()
      );
      console.log({ newFavList });
      chrome.storage.sync.set(
        {
          allList: {
            favoriteList: newFavList,
            blackList,
          },
        },
        function () {
          eventElement.querySelector(".favoriteBtn").innerText =
            "Add to favorite";
          eventElement.style.border = "none";
        }
      );
    });
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
    btnElement.addEventListener("click", (e) => {
      setFavoriteList(e, eventElement, groupName); ///////////// add or remove element in  favorite list
    });
    if (!isFavorite) {
      btnElement.innerText = "Add to Favorite";
    } else {
      btnElement.innerText = "Remove from Favorite";
    }
  } else if (btnType.toLowerCase().includes("blackList".toLowerCase())) {
    btnElement.setAttribute("class", "blackListBtn");
    btnElement.addEventListener("click", (e) => {
      setBlackList(e, eventElement, groupName); /////////////  add or remove the element in blacklist
    });

    if (!isBlackListed) {
      btnElement.innerText = "Add to blackList";
    } else {
      btnElement.innerText = "Remove from blackList";
    }
  }

  return btnElement;
};
const createAddAndFavoriteBtn = (eventElement, eventInfo) => {
  const btnDiv = document.createElement("div");
  btnDiv.style.display = "flex";
  btnDiv.style.justifyContent = "end";
  btnDiv.style.paddingBottom = "10px";
  const FavBtn = createButton("favorite", eventElement, eventInfo); // creates favorite button and add the functionality to make changes in storage
  const BlackBtn = createButton("blackList", eventElement, eventInfo); // creates blacklist button and add the functionality to make changes in storage

  btnDiv.appendChild(FavBtn);
  btnDiv.appendChild(BlackBtn);
  eventElement.appendChild(btnDiv);
};
/////////////////////////////////////////////////////////////////////// remove lower attendee events ///////////////////////

function removeLowerAttendeeEvent(eventElement, noOfAttendee) {
  if (noOfAttendee < 10) {
    eventElement.style.display = "none";
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
  // const noOfAttendee =
  //   eventElement.querySelectorAll(".hidden").length < 3
  //     ? eventElement.querySelectorAll(".hidden")[1].innerText.split(" ")[0]
  //     : eventElement.querySelectorAll(".hidden")[2].innerText.split(" ")[0];
  const noOfAttendee = eventElement // it's the last element of all .hidden class
    ?.querySelectorAll(".hidden")
    [eventElement?.querySelectorAll(".hidden").length - 1].innerText.split(
      " "
    )[0];
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
  // now one after another call these function for each element
  for (let i = 0; i <= noOfEvents; i++) {
    const eventElement = allEvents.childNodes[i];
    eventInfo = getEventInfo(eventElement, obj); // groupName, isFavorite,isBlackListed,noOfAttendee
    removeLowerAttendeeEvent(eventElement, eventInfo.noOfAttendee); // check the events(elements) no of attendee and if its lower then the input filed in filter then remove the event
    createAddAndFavoriteBtn(eventElement, eventInfo);
    if (eventInfo.isFavorite) {
      eventElement.style.border = "5px solid #f65858";
    } else if (eventInfo.isBlackListed) {
      eventElement.style.border = "5px solid black"; // you can hide the event also => eventElement.style.display = "none"
    }
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
    //  scroll automatically
    if (sh != lastScrollHeight) {
      lastScrollHeight = sh;
      document.documentElement.scrollTop = sh;
    }
    // stop automatically scrolling and manipulate the events
    if (allLoaded) {
      clearInterval(autoLoad);
      window.scrollTo(0, 0);
      createAttendeeInputDiv();
      chrome.storage.sync.get("allList", (obj) => {
        manipulateEvents(obj);
      });
    }
  }, 5000);
};

(() => {
  window.addEventListener("load", myMain, false);
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    // listen for messages sent from background.js
    if (request.message === "hello!") {
      console.log(request.url); // new url is now in content scripts!
      location.reload();
      return false;
    }
  });
})();
