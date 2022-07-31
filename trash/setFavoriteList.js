////////////////////////////////////////////////////////////// when favorite btn is clicked
// allList:{
//   favoriteList:[]
//   blackList:[]
// }
const setFavoriteList = (e, eventElement, groupName) => {
  //  ////                                 ////////////////////    if add to favorite btn is clicked            ////////////
  if (e.target.innerText.toLowerCase().includes("add")) {
    chrome.storage.sync.get("allList", (obj) => {
      let { favoriteList, blacklist } = obj.allList;
      // checking in blacklist
      const backlistIndex = blacklist.indexOf(groupName);
      if (backlistIndex > -1) {
        // only splice array when item is found
        blacklist.splice(backlistIndex, 1); // 2nd parameter means remove one item only
        eventElement.querySelector(".blacklistBtn").value = "Add to BlackList";
      }

      // checking in favorite list
      const groupFoundInFavoriteList = favoriteList.indexOf(groupName) > -1;
      if (groupFoundInFavoriteList) {
        return;
      } else {
        chrome.storage.sync.set(
          {
            allList: {
              favoriteList: [...favoriteList, groupName],
              blacklist,
            },
          },
          function () {
            eventElement.querySelector(".favoriteBtn").value =
              "Remove from favorite";
            eventElement.style.border = "5px solid yellow";
          }
        );
      }
    });
  }
  //   /////
  //                                                   /// if remove from favorite btn is clicked       ////////////////////////
  //   //////////////////////
  else if (e.target.innerText.toLowerCase().includes("remove")) {
    chrome.storage.sync.get("allList", (obj) => {
      let { favoriteList, blacklist } = obj.allList;
      const favoriteIndex = favoriteList.indexOf(groupName);
      chrome.storage.sync.set(
        {
          allList: {
            favoriteList: favoriteList.splice(favoriteIndex, 1),
            blacklist,
          },
        },
        function () {
          eventElement.querySelector(".favoriteBtn").value = "Add to favorite";
          eventElement.style.border = "none";
        }
      );
    });
  }
};
