////////////////////////////////////////////////////////////////////// check if viewed  ///////////////////////////////////////////
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

//////////////////////////////////////////////////////////////// event data  /////////////////////////////////////////////////////////////
const getEventInfo = (eventElement) => {
  // is favorite event
  let isFavorite;
  let isBlackListed;
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

  console.log({ groupName });
  chrome.storage.sync.get("allList", (list) => {
    if (obj.allList.length) {
      const blacklisted = obj.allList.filter((event) =>
        event.listType.toLowerCase().includes("blacklist")
      );
      console.log(blacklisted);
      blacklisted.map((black) => {
        // console.log(favE.groupName.toLowerCase());
        // console.log(groupName.toLowerCase());
        isBlackListed =
          black.groupName.toLowerCase() === groupName.toLowerCase();
        console.log(isFavorite);
        console.log(black.groupName.toLowerCase() === groupName.toLowerCase());
        if (isBlackListed) {
          console.log(black);
          eventElement.style.border = "5px solid red";
          eventElement.style.display = "none";
        }
        return "isFavorite";
      });
    }
  });

  chrome.storage.sync.get("allList", (obj) => {
    if (obj.allList.length) {
      const fav = obj.allList.filter((event) =>
        event.listType.toLowerCase().includes("favorite")
      );
      console.log(fav);
      fav.map((favE) => {
        // console.log(favE.groupName.toLowerCase());
        // console.log(groupName.toLowerCase());
        isFavorite = favE.groupName.toLowerCase() === groupName.toLowerCase();
        console.log(isFavorite);
        console.log(favE.groupName.toLowerCase() === groupName.toLowerCase());
        if (isFavorite) {
          console.log(favE);
          eventElement.style.border = "5px solid yellow";
        }
        return "isFavorite";
      });
    }
  });

  // is blackListed event

  return { groupName, noOfAttendee, isFavorite, isBlackListed };
};

/////////////////////////////////////////////////////////////// create button element  /////////////////////////////////////////////////////////////
const createButton = (btnText, eventInfo) => {
  const btnElement = document.createElement("button");
  btnElement.style.backgroundColor = "#f65858";
  btnElement.style.border = "none";
  btnElement.style.padding = ".5rem 1rem";
  btnElement.style.borderRadius = "40px ";
  btnElement.style.color = "white ";
  btnElement.style.marginRight = ".5rem";

  const buttonText = document.createTextNode(btnText);
  btnElement.appendChild(buttonText);
  btnElement.addEventListener("click", function (e) {
    const { groupName, noOfAttendee, isBlackListed, isFavorite } = eventInfo;
    console.log({ groupName, noOfAttendee, isBlackListed, isFavorite });

    chrome.storage.sync.get("allList", (obj) => {
      if (obj.allList) {
        console.log({ obj });
        let current = obj.allList;
        chrome.storage.sync.set(
          {
            allList: [
              ...current,
              {
                listType: e.target.innerText,
                groupName,
              },
            ],
          },
          function () {
            console.log("hello preset old");
            // allPreset();
          }
        );
      } else {
        console.log("its new one");
        chrome.storage.sync.set(
          {
            allList: [
              {
                listType: e.target.innerText,
                groupName,
              },
            ],
          },
          function () {
            console.log("hello preset");
            // allPreset();
          }
        );
      }
    });
  });
  return btnElement;
};
const createAddAndFavoriteBtn = (eventElement, eventInfo) => {
  console.log("hello create btn");
  const btnDiv = document.createElement("div");
  btnDiv.style.display = "flex";
  btnDiv.style.justifyContent = "end";
  btnDiv.style.paddingBottom = "10px";
  const addToFavoriteBtn = createButton("Add to Favorite", eventInfo);
  const addToBlackListBtn = createButton("Add to BlackList", eventInfo);

  btnDiv.appendChild(addToFavoriteBtn);
  btnDiv.appendChild(addToBlackListBtn);
  eventElement.appendChild(btnDiv);
};
///////////////////////////////////////////////////////////////  main func /////////////////////////////////////////////////////////////
function myMain(evt) {
  console.log("hello meetup");
  const autoLoad = setInterval(function () {
    let lastScrollHeight = 0;
    const sh = document.documentElement.scrollHeight;
    const allLoaded = isInViewport(document.getElementById("main_footer"));
    if (sh != lastScrollHeight) {
      lastScrollHeight = sh;
      document.documentElement.scrollTop = sh;
    }
    if (allLoaded) {
      console.log("loaded");
      clearInterval(autoLoad);

      const allEvents =
        document.getElementById("main").childNodes[0].childNodes[1]
          .childNodes[0].childNodes[0].childNodes[0];
      // no of events
      let noOfEvents = allEvents.children.length;

      for (let i = 0; i <= noOfEvents; i++) {
        const eventElement = allEvents.childNodes[i];

        const eventInfo = getEventInfo(eventElement);
        const { groupName, noOfAttendee, isBlackListed, isFavorite } =
          eventInfo;
        console.log(isFavorite);

        createAddAndFavoriteBtn(eventElement, eventInfo);
      }
    }
  }, 5000);
}
(() => {
  window.addEventListener("load", myMain, false);
  // const dateBtn = document.getElementById("day-filter-drop-down");
  // dateBtn.addEventListener("click", myMain);
})();
