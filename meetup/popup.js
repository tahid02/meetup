chrome.storage.sync.get("allList", (obj) => {
  document.getElementById("favListsBtn").click(); ///// by default . only favorites will be displayed
  if (obj.allList) {
    const { blackList, favoriteList } = obj.allList;
    if (blackList.length) {
      blackList.map((black) => {
        const p = document.createElement("p");

        p.innerHTML = `<p class="info" style="background-color: wheat;  box-shadow: 5px 10px #888888;">
                        <div class="groupName">
                            <div>${black}</div>
                            <div> 
                                <img
                                src="delete-icon.png"
                                alt=""
                                style="width: 0.9rem; height: 0.9rem;margin-left:auto"
                                />
                            </div>
                         </div>
                     </p>`;
        p.getElementsByTagName("img")[0].addEventListener(
          "click",
          function (e) {
            const listToRemove = e.target.parentNode.parentNode.parentNode;
            chrome.storage.sync.get("allList", (obj) => {
              let { favoriteList, blackList } = obj.allList;

              const newBlackList = blackList.filter(
                (black) => !black.includes(listToRemove.innerText)
              );
              console.log({ newBlackList });
              chrome.storage.sync.set(
                {
                  allList: {
                    favoriteList,
                    blackList: newBlackList,
                  },
                },
                function () {
                  listToRemove.style.display = "none";
                }
              );
            });
          }
        );
        document.getElementById("blackListEvents").appendChild(p);
      });
    } else {
      document.getElementById("blackListEvents").innerHTML =
        "no group is blacklisted  yet";
    }

    // fabovrite

    if (favoriteList.length) {
      favoriteList.map((fav) => {
        const p = document.createElement("p");

        p.innerHTML = `<p id="" class="info" style="background-color: wheat;  box-shadow: 5px 10px #888888;">
                        <div class="groupName">
                            <div>${fav}</div>
                            <div> 
                                <img
                                src="delete-icon.png"
                                alt=""
                                style="width: 0.9rem; height: 0.9rem;margin-left:auto"
                                />
                            </div>
                         </div>
                     </p>`;
        p.getElementsByTagName("img")[0].addEventListener(
          "click",
          function (e) {
            const listToRemove = e.target.parentNode.parentNode.parentNode;
            chrome.storage.sync.get("allList", (obj) => {
              let { favoriteList, blackList } = obj.allList;

              const newFavList = favoriteList.filter(
                (fav) => !fav.includes(listToRemove.innerText)
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
                  listToRemove.style.display = "none";
                }
              );
            });
          }
        );
        document.getElementById("favoriteListEvents").appendChild(p);
      });
    } else {
      document.getElementById("favoriteListEvents").innerHTML =
        "no favorite group added yet";
    }
  } else {
    document.getElementById("noEvent").innerHTML = "no event added yet";
  }
});

document.getElementById("blackListsBtn").addEventListener("click", function () {
  document.getElementById("favoriteListEvents").style.display = "none";
  document.getElementById("blackListEvents").style.display = "block";
  document.getElementById("blackListsBtn").style.backgroundColor = "#f65858";
  document.getElementById("favListsBtn").style.backgroundColor = "inherit";
});
document.getElementById("favListsBtn").addEventListener("click", function () {
  document.getElementById("favoriteListEvents").style.display = "block";
  document.getElementById("blackListEvents").style.display = "none";
  document.getElementById("favListsBtn").style.backgroundColor = "#f65858";
  document.getElementById("blackListsBtn").style.backgroundColor = "inherit";
});

// setInterval(function () {
//   var z = document.getElementsByClassName(
//     "oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl gokke00a"
//   );

//   let lastScrollHeight = 0;
//   const sh = document.documentElement.scrollHeight;
//   for (let i = 0; i < z.length; i++) {
//     z[i].click();
//   }
//   if (sh != lastScrollHeight) {
//     lastScrollHeight = sh;
//     document.documentElement.scrollTop = sh;
//   }
// }, 5000);

// for (let i = 0; i < z.length; i++) {
//   z[i].click();
// }

// var z = document.getElementsByClassName(
//   "oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 mg4g778l pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr du4w35lb n00je7tq arfg74bv qs9ysxi8 k77z8yql pq6dq46d btwxx1t3 abiwlrkh p8dawk7l lzcic4wl gokke00a"
// );
// let post = 0;
// let like = setInterval(() => {
//   z[post].click();
//   post++;
// }, 5000);
// setTimeout(() => {
//   clearInterval(like)
// },z.length*5000);
