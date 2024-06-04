import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, update, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://champions-2b11d-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const commendationInDB = ref(database, "conmendation")

const textAreaEl = document.getElementById("textArea")
const publishButtonEl = document.getElementById("Publish")
const commendListEl = document.getElementById("commend-list")
const fromEl = document.getElementById("from")
const toEl = document.getElementById("to")
const svgEl = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>`

publishButtonEl.addEventListener("click", function() {
    let textValue = textAreaEl.value
    let fromValue = fromEl.value
    let toValue = toEl.value

    push(commendationInDB, {
        commendation: textValue,
        from:fromValue,
        to:toValue,
        likeCount:0
    })
    
    cleartextAreaEl()

    clearfromToEl()

})

function clearcommendListEl() {
    commendListEl.innerHTML = ""
}

function cleartextAreaEl() {
    textAreaEl.value = ""
}

function clearfromToEl(){
    fromEl.value = ""
    toEl.value = ""
}

onValue(commendationInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearcommendListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            console.log(currentItemValue)
            appendItemTocommendListEl(currentItem)
        }    
    } else {
        commendListEl.innerHTML = "No items here... yet"
    }
})


function appendItemTocommendListEl(item) {
    let itemID = item[0]
    let itemValue = item[1] 

    let newEl = document.createElement("li")
    let fromsEl = document.createElement("h3")
    let tosEl = document.createElement("h3")
    let commendationsEl = document.createElement("p")
    let footerDiv = document.createElement("div")
    let likeCount = document.createElement("p")
    let likeDiv = document.createElement ("div")
    

    fromsEl.textContent = "From " + itemValue.from
    tosEl.textContent = "To " + itemValue.to
    commendationsEl = itemValue.commendation
    likeCount.textContent = itemValue.likeCount


    footerDiv.append(tosEl)
    footerDiv.appendChild(likeDiv)

    likeDiv.innerHTML = svgEl
    likeDiv.appendChild(likeCount)

    footerDiv.classList.add("footer-div")
    likeDiv.classList.add("likeDiv")

    footerDiv.addEventListener("click", function(){
        update(ref(database, 'conmendation/' + itemID), {
            likeCount: itemValue.likeCount + 1
        })
    })
    
    newEl.append(fromsEl) 
    newEl.append(commendationsEl)  
    newEl.append(footerDiv)
    commendListEl.append(newEl)
}
