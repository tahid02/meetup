// ////////////////////////////////////////////////////////////////////// check if viewed  ///////////////////////////////////////////
// function isInViewport(element) {
//   const rect = element.getBoundingClientRect();
//   return (
//     rect.top >= 0 &&
//     rect.left >= 0 &&
//     rect.bottom <=
//       (window.innerHeight || document.documentElement.clientHeight) &&
//     rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//   );
// }
// ////////////////////////////////////////////////////////////////////// add to favorite btn clicked///////////////////////////////////////////

// //////////////////////////////////////////////////////////////// event data  /////////////////////////////////////////////////////////////

// //////////////////////////create search ////////////////////////////////////
// const createSearch = () => {
//   const attendeeSearchDiv = document.createElement("div");
//   attendeeSearchDiv.innerHTML = `    <input id="attendeeInput" type="text" placeholder="" value="10" />
//   <button id="attendeeSearch" style="border:3px solid black">
//    search
//   </button>`;
//   return attendeeSearchDiv;
// };
// const getEventInfo = (eventElement) => {
//   // is favorite event
//   let isFavorite;
//   let isBlackListed;
//   //  group name
//   const groupName = eventElement
//     .getElementsByTagName("p")[1]
//     .innerText.split("\n")[1]
//     .split("•")[0];
//   // no of  attendee
//   const noOfAttendee =
//     eventElement.querySelectorAll(".hidden").length < 3
//       ? eventElement.querySelectorAll(".hidden")[1].innerText
//       : eventElement.querySelectorAll(".hidden")[2].innerText;
//   console.log("at", noOfAttendee);
//   if (noOfAttendee.split(" ")[0] < 10) {
//     eventElement.style.border = "5px solid blue";
//   }

//   // console.log({ groupName });
//   chrome.storage.sync.get("allList", (obj) => {
//     if (obj.allList.length) {
//       const blacklisted = obj.allList.filter((event) =>
//         event.listType.toLowerCase().includes("blacklist")
//       );
//       // console.log(blacklisted);
//       blacklisted.map((black) => {
//         isBlackListed =
//           black.groupName.toLowerCase() === groupName.toLowerCase();
//         if (isBlackListed) {
//           // console.log(black);
//           eventElement.style.border = "5px solid red";
//           // eventElement.style.display = "none";
//         }
//         return "isFavorite";
//       });
//     }
//   });

//   chrome.storage.sync.get("allList", (obj) => {
//     if (obj.allList.length) {
//       const fav = obj.allList.filter((event) =>
//         event.listType.toLowerCase().includes("favorite")
//       );
//       console.log(fav);
//       fav.map((favE) => {
//         // console.log(favE.groupName.toLowerCase());
//         // console.log(groupName.toLowerCase());
//         isFavorite = favE.groupName.toLowerCase() === groupName.toLowerCase();
//         // console.log(isFavorite);
//         console.log(favE.groupName.toLowerCase() === groupName.toLowerCase());
//         if (isFavorite) {
//           // console.log(favE);
//           eventElement.style.border = "5px solid yellow";
//         }
//         return "isBacklists";
//       });
//     }
//   });

//   // is blackListed event

//   return { groupName, noOfAttendee, isFavorite, isBlackListed };
// };

// /////////////////////////////////////////////////////////////// create button element  /////////////////////////////////////////////////////////////
// const createButton = (btnText, eventInfo, eventElement) => {
//   const btnElement = document.createElement("button");
//   btnElement.style.backgroundColor = "#f65858";
//   btnElement.style.border = "none";
//   btnElement.style.padding = ".5rem 1rem";
//   btnElement.style.borderRadius = "40px ";
//   btnElement.style.color = "white ";
//   btnElement.style.marginRight = ".5rem";
//   if (btnText.toLowerCase.includes("favorite")) {
//     btnElement.setAttribute("class", "favorite");
//   } else if (btnText.toLowerCase.includes("blacklist")) {
//     btnElement.setAttribute("class", "blacklist");
//   }
//   btnElement.setAttribute("class", btnText.split(" ")[2]); // favorite or blacklist

//   const buttonText = document.createTextNode(btnText);
//   btnElement.appendChild(buttonText);
//   btnElement.addEventListener("click", function (e) {
//     const { groupName, noOfAttendee, isBlackListed, isFavorite } = eventInfo;
//     console.log({ groupName, noOfAttendee, isBlackListed, isFavorite });

//     chrome.storage.sync.get("allList", (obj) => {
//       if (obj.allList) {
//         console.log({ obj });
//         let current = obj.allList;
//         chrome.storage.sync.set(
//           {
//             allList: [
//               ...current,
//               {
//                 listType: e.target.innerText,
//                 groupName,
//               },
//             ],
//           },
//           function () {
//             console.log("hello preset old");
//             // allPreset();
//             if (btnText.toLowerCase().includes("favorite")) {
//               eventElement.style.border = "5px solid yellow";
//             } else if (btnText.toLowerCase().includes("blacklist")) {
//               eventElement.style.border = "5px solid red";
//             }
//           }
//         );
//       } else {
//         console.log("its new one");
//         chrome.storage.sync.set(
//           {
//             allList: [
//               {
//                 listType: e.target.innerText,
//                 groupName,
//               },
//             ],
//           },
//           function () {
//             console.log("hello preset");
//             // allPreset();
//             if (btnText.toLowerCase().includes("favorite")) {
//               eventElement.style.border = "5px solid yellow";
//             } else if (btnText.toLowerCase().includes("blacklist")) {
//               eventElement.style.border = "5px solid red";
//             }
//           }
//         );
//       }
//     });
//   });
//   return btnElement;
// };
// const createAddAndFavoriteBtn = (eventElement, eventInfo) => {
//   console.log("hello create btn");
//   const btnDiv = document.createElement("div");
//   btnDiv.style.display = "flex";
//   btnDiv.style.justifyContent = "end";
//   btnDiv.style.paddingBottom = "10px";
//   const addToFavoriteBtn = createButton(
//     "Add to Favorite",
//     eventInfo,
//     eventElement
//   );
//   const addToBlackListBtn = createButton(
//     "Add to BlackList",
//     eventInfo,
//     eventElement
//   );

//   btnDiv.appendChild(addToFavoriteBtn);
//   btnDiv.appendChild(addToBlackListBtn);
//   eventElement.appendChild(btnDiv);
// };
// ///////////////////////////////////////////////////////////////  main func /////////////////////////////////////////////////////////////
// function myMain(evt) {
//   console.log("hello meetup");
//   const autoLoad = setInterval(function () {
//     let lastScrollHeight = 0;
//     const sh = document.documentElement.scrollHeight;
//     const allLoaded = isInViewport(document.getElementById("main_footer"));
//     if (sh != lastScrollHeight) {
//       lastScrollHeight = sh;
//       document.documentElement.scrollTop = sh;
//     }
//     if (allLoaded) {
//       console.log("loaded");
//       clearInterval(autoLoad);
//       window.scrollTo(0, 0);
//       const attendeeSearchDiv = createSearch();
//       document
//         .getElementById("find-events-tab")
//         .parentNode.appendChild(attendeeSearchDiv);
//       const allEvents =
//         document.getElementById("main").childNodes[0].childNodes[1]
//           .childNodes[0].childNodes[0].childNodes[0];
//       // no of events
//       let noOfEvents = allEvents.children.length;
//       let searchBtn = document.getElementById("attendeeSearch");
//       console.log(searchBtn);
//       searchBtn.addEventListener("click", function () {
//         console.log("clicked");
//         for (let i = 0; i <= noOfEvents; i++) {
//           const eventElement = allEvents.childNodes[i];

//           const noOfAttendee =
//             eventElement.querySelectorAll(".hidden").length < 3
//               ? eventElement
//                   .querySelectorAll(".hidden")[1]
//                   .innerText.split(" ")[0]
//               : eventElement
//                   .querySelectorAll(".hidden")[2]
//                   .innerText.split(" ")[0];
//           console.log("value", document.getElementById("attendeeInput").value);
//           console.log("attendee", noOfAttendee);

//           if (noOfAttendee < document.getElementById("attendeeInput").value) {
//             console.log("should display none");
//             eventElement.style.display = "none";
//           }
//         }
//       });
//       for (let i = 0; i <= noOfEvents; i++) {
//         const eventElement = allEvents.childNodes[i];

//         const eventInfo = getEventInfo(eventElement);
//         const { groupName, noOfAttendee, isBlackListed, isFavorite } =
//           eventInfo;
//         console.log(isFavorite);

//         createAddAndFavoriteBtn(eventElement, eventInfo);
//       }
//     }
//   }, 5000);
// }
// (() => {
//   window.addEventListener("load", myMain, false);
//   chrome.runtime.onMessage.addListener(function (
//     request,
//     sender,
//     sendResponse
//   ) {
//     // listen for messages sent from background.js
//     if (request.message === "helo!") {
//       console.log(request.url); // new url is now in content scripts!
//       location.reload();
//       return false;
//     }
//   });
//   // const dateBtn = document.getElementById("day-filter-drop-down");
//   // dateBtn.addEventListener("click", myMain)
// })();
