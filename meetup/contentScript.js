(() => {
  window.addEventListener("load", myMain, false);

  //////////////////////////////////////////////////////////////// event data  /////////////////////////////////////////////////////////////
  const eventInfo = (eventElement) => {
    //  group name
    // const groupName = eventElement.getElementsByTagName("p")[1].innerText;
    eventElement.getElementsByTagName("p")[1].innerHtml = "<div>bitch</div>";
    // no of  attendee
    const noOfAttendee =
      eventElement.querySelectorAll(".hidden").length < 3
        ? eventElement.querySelectorAll(".hidden")[1].innerText
        : eventElement.querySelectorAll(".hidden")[2].innerText;

    // is favorite
    const isFavorite = false;

    // is blackListed
    const isBlackListed = false;

    return { groupName, noOfAttendee, isFavorite, isBlackListed };
  };

  /////////////////////////////////////////////////////////////// create button element  /////////////////////////////////////////////////////////////
  const createButton = (btnText) => {
    // const btnElement = document.createElement("button");
    // btnElement.innerText = btnText;
    var btnElement = document.createElement("button");
    btnElement.style.backgroundColor = "#f65858";
    btnElement.style.border = "1px solid black";
    var buttonText = document.createTextNode(btnText);
    btnElement.appendChild(buttonText);

    return btnElement;
  };
  ///////////////////////////////////////////////////////////////  auto scroll /////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////  main func /////////////////////////////////////////////////////////////
  function myMain(evt) {
    console.log("hello meetup");
    const autoLoad = setInterval(function () {
      let lastScrollHeight = 0;
      const sh = document.documentElement.scrollHeight;
      if (sh != lastScrollHeight) {
        lastScrollHeight = sh;
        document.documentElement.scrollTop = sh;
      } else {
        console.log("loaded");
        clearInterval(autoLoad);

        const allEvents =
          document.getElementById("main").childNodes[0].childNodes[1]
            .childNodes[0].childNodes[0].childNodes[0];
        // no of events
        let noOfEvents = allEvents.children.length;

        for (let i = 0; i < 5; i++) {
          const eventElement = allEvents.childNodes[i];
          const { groupName, noOfAttendee, isBlackListed, isFavorite } =
            eventInfo(eventElement);
          const addToFavoriteBtn = createButton("Add to Favorite");
          const addToBlackListBtn = createButton("Add to BlackList");
          eventElement.appendChild(addToFavoriteBtn);
          eventElement.appendChild(addToBlackListBtn);
        }
      }
    }, 5000);
  }
})();
