// set the preset in local storage when 'add' button is clicked
const presetName = document.getElementById("preset_name");
const presetDescription = document.getElementById("preset_description");
const addPreset = document.getElementById("add_preset");
const presetCreateInput = document.getElementById("preset_create_input");
const createPreset = document.getElementById("create_preset");
const managePreset = document.getElementById("manage_preset");
const accWrapper = document.getElementsByClassName("accordionWrapper")[0];

presetCreateInput.style.display = "none";
accWrapper.style.display = "none";
createPreset.addEventListener("click", function () {
  presetCreateInput.style.display = "block";
  createPreset.style.display = "none";
  accWrapper.style.display = "none";
});
managePreset.addEventListener("click", function () {
  presetCreateInput.style.display = "none";
  createPreset.style.display = "block";
  if (accWrapper.style.display === "none") {
    accWrapper.style.display = "block";
  } else {
    accWrapper.style.display = "none";
  }
});

addPreset.addEventListener("click", function () {
  console.log("add clicked");

  chrome.storage.sync.get("allPresets", (obj) => {
    if (obj.allPresets) {
      console.log({ obj });
      let current = obj.allPresets;
      chrome.storage.sync.set(
        {
          allPresets: [
            ...current,
            {
              presetName: presetName.value,
              presetDescription: presetDescription.value,
            },
          ],
        },
        function () {
          console.log("hello preset");
          allPreset();
        }
      );
    } else {
      console.log("its new");
      chrome.storage.sync.set(
        {
          allPresets: [
            {
              presetName: presetName.value,
              presetDescription: presetDescription.value,
            },
          ],
        },
        function () {
          console.log("hello preset");
          allPreset();
        }
      );
    }
  });
});
function allPreset() {
  // get and show the presets
  chrome.storage.sync.get("allPresets", (obj) => {
    const wrapper = document.querySelector(".accordionWrapper");
    wrapper.innerHTML = "";
    if (obj.allPresets.length) {
      // show all preset in accordion
      console.log(obj.allPresets);
      // create the accordion item
      for (let index = 0; index < obj.allPresets.length; index++) {
        const accItemDiv = document.createElement("div");

        accItemDiv.innerHTML = `<div class='${
          index == 0 ? "accordionItem open" : "accordionItem close"
        }'>
                              <h2 
                                class="accordionItemHeading" onclick='${toggleItem}' 
                                style="display: flex;justify-content: space-between;"
                              >
                                <span> ${
                                  obj.allPresets[index].presetName
                                }</span>  
                                
                                  <img 
                                    src="https://spng.pngfind.com/pngs/s/99-992375_png-file-delete-icon-svg-transparent-png.png"
                                    alt="delete" 
                                    style="width:15px;height:15px"
                                    class="accordionDelete"
                                  />                            
                              </h2>
                              <div class="accordionItemContent">
                                <button class="copy_cover_letter">copy</button>
                                <p style="font-size: 14px;
                                font-weight: 400;">
                                ${obj.allPresets[index].presetDescription}
                                </p>
                              </div>
                            </div>  `;
        wrapper.appendChild(accItemDiv);
      }

      // add toggle func in all accordion item's header
      const accItem = document.getElementsByClassName("accordionItem");
      const accHD = document.getElementsByClassName("accordionItemHeading");
      const accDelete = document.getElementsByClassName("accordionDelete");
      const copyBtn = document.getElementsByClassName("copy_cover_letter");
      for (let i = 0; i < accHD.length; i++) {
        accHD[i].addEventListener("click", toggleItem, false);
        accDelete[i].addEventListener("click", deleteItem, false);
        copyBtn[i].addEventListener("click", copyText, false);
      }
      function toggleItem() {
        const itemClass = this.parentNode.className;
        for (let i = 0; i < accItem.length; i++) {
          accItem[i].className = "accordionItem close";
        }
        if (itemClass == "accordionItem close") {
          this.parentNode.className = "accordionItem open";
        }
      }
      // delete a preset
      function deleteItem(e) {
        // grab the item
        const selectedDeleteItem = e.target.parentNode.parentNode;
        // item heading
        const selectedHD = selectedDeleteItem.getElementsByClassName(
          "accordionItemHeading"
        )[0].innerText;

        // get the allpresets from storage then delete item by filtering  it and set new filtered presets
        chrome.storage.sync.get("allPresets", (obj) => {
          if (obj.allPresets) {
            console.log({ obj });
            let current = obj.allPresets;
            const filteredPresets = current.filter((pre) => {
              return pre.presetName.trim() !== selectedHD.trim();
            });
            console.log({ filteredPresets });
            chrome.storage.sync.set(
              {
                allPresets: filteredPresets,
              },
              function () {
                selectedDeleteItem.remove();
              }
            );
          }
        });
      }

      // copy to clipboard
      function copyText(e) {
        const clickedCopyBtn =
          e.target.parentNode.parentNode.getElementsByTagName("p")[0].innerText;
        console.log({ clickedCopyBtn });
        navigator.clipboard.writeText(clickedCopyBtn);
      }
    } else {
      wrapper.innerHTML = `<p style="text-align:center;font-size:14px"> "No preset added yet"</p>`;
    }
  });
}
allPreset();
