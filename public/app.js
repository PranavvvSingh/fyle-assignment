const url = "https://api.github.com/users/"

let username = "egoist"
const profile = document.querySelector("#profile")
const repos = document.querySelector("#repos")
const search = document.querySelector("#search")
const searchButton = document.querySelector("#button")
const spinner = document.querySelector("#loading")
const currPage = document.querySelector("#currentPage")
let currentTag = document.querySelector("#currentTag")
let currentPage = 1
let perPage = 10
let totalPages = 100

const getUser = async (username, page) => {
   
   repos.style.display = "none"
   profile.style.display = "none"
   spinner.style.display = "block"
   const response = await fetch(url + username)
   const data = await response.json()
   console.log(data)
   totalPages = Math.ceil(data.public_repos/perPage)
   console.log(data.public_repos)

   const profileDiv = `
         <div class="d-flex justify-content-center mb-5">
            <img src="${data.avatar_url}" class="rounded-circle" style="width:250px;height:250px" alt="">
            <div class="d-flex flex-column justify-content-evenly ps-5" style="width:300px;height:250px">
               <h2>${data.name}</h2>
               <p>${data.bio}</p>
               <h6><i class="bi bi-geo-alt-fill"></i>${data.location}</h6>
               <h6><i class="bi bi-twitter-x"></i>${data.twitter_username}</h6>
            </div>
         </div>
         <div class="d-flex justify-content-between">
            <div class="d-inline-flex gap-1">
               <i class="bi bi-github"></i>
               <h5 class="mb-5 text-center ">${data.html_url}</h5>
            </div>
            <p>Page <span id="currentTag">${currentPage}</span> of <span id="totalTag">${totalPages}</span></p>
         </div>
            
         `
   profile.innerHTML = profileDiv
   while (repos.firstChild) repos.removeChild(repos.firstChild)
   getRepositories(username, page)
}

const getRepositories = async (username, page) => {
   const response = await fetch(
      url + username + "/repos" + `?page=${page}&per_page=${perPage}`,
   )
   const data = await response.json()
   // repos = document.querySelector("#repos")
   const repoDiv = (repository) => `
            <div class="col-5 border border-2 border-black p-3 rounded-2 shadow">
               <div class="d-flex justify-content-between">
               <h5 class="d-inline-block">${repository.name}</h5>
               <div class="d-flex justify-content-center gap-3">
                  <i class="fa-solid fa-code-branch" style="vertical-align: middle;line-height: 30px;letter-spacing: .2rem;">${
                     repository.forks_count
                  }</i>
                  <i class="fa-solid fa-star" style="vertical-align: middle;line-height: 30px; letter-spacing: .2rem;">${
                     repository.stargazers_count
                  }</i>
               </div>
               </div>
               <p>${repository.description}</p>
               <div id="topics" class="d-flex flex-wrap justify-content-start gap-2">
            ${
               repository.topics && repository.topics.length > 0
                  ? repository.topics
                       .map(
                          (topic) =>
                             `<button type="button" class="btn btn-primary btn-sm">${topic}</button>`,
                       )
                       .join("")
                  : '<span class="fw-light">No topics available</span>'
            }
               </div>
            </div>
   `
   data.forEach((repo) => {
      repos.innerHTML += repoDiv(repo)
   })
   spinner.style.display = "none"
   profile.style.display = "block"
   repos.style.display = "block"
}

const getNextPage = () => {
   currentPage++
   document.querySelector("#currentTag").textContent = currentPage
   currPage.textContent = currentPage
   while (repos.firstChild) repos.removeChild(repos.firstChild)
   getRepositories(username, currentPage)
   profile.scrollIntoView(false)
}

const getPreviousPage = () => {
   if (currentPage > 1) {
      currentPage--
      document.querySelector("#currentTag").textContent = currentPage
      currPage.textContent = currentPage
      while (repos.firstChild) repos.removeChild(repos.firstChild)
      getRepositories(username, currentPage)
   }
   profile.scrollIntoView(false)
}

document.getElementById("prevPage").addEventListener("click", () => {
   console.log("preview clicked")
   getPreviousPage()
})

document.getElementById("nextPage").addEventListener("click", () => {
   console.log("next clicked")
   getNextPage()
})

const formSubmit = () => {
   if (search.value !== "") {
      console.log(search.value)
      username = search.value
      getUser(username)
   }
}

document.getElementById("form").addEventListener("submit", function (event) {
   event.preventDefault()
   formSubmit()
})

searchButton.addEventListener("click", formSubmit)

getUser(username, currentPage)
