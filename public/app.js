const url = "https://api.github.com/users/"

let username = "egoist"
const content = document.querySelector("#content")
const profile = document.querySelector("#profile")
const repos = document.querySelector("#repos")
const search = document.querySelector("#search")
const searchButton = document.querySelector("#button")
const spinner = document.querySelector("#loading")
const currPage = document.querySelector("#currentPage")
const reposPerPage = document.getElementById("reposPerPage")
let currentTag = document.querySelector("#currentTag")
let currentPage = 1
let perPage = 10
let totalPages = 100

const getUser = async (username, page) => {
   content.style.display = "none"
   spinner.style.display = "block"
   const response = await fetch(url + username)
   const data = await response.json()
   console.log(data)
   totalPages = Math.ceil(data.public_repos / perPage)
   console.log(data.public_repos)

   const profileDiv = `
         <div class="d-flex justify-content-center">
            <img src="${data.avatar_url}" class="rounded-circle" style="width:200px;height:200px" alt="">
            <div class="d-flex flex-column justify-content-evenly ps-5" style="width:320px;height:200px">
               <h2>${data.name}</h2>
               <i>${data.bio}</i>
               <h6><i class="bi bi-geo-alt-fill me-1"></i>${data.location}</h6>
               <h6><i class="bi bi-twitter-x me-1"></i>${data.twitter_username}</h6>
               <h6><i class="bi bi-github me-1"></i>${data.html_url}</h6>
            </div>
         </div>
         <div class="d-flex justify-content-between align-items-center p-5">
            <div class="input-group w-25">
               <span class="input-group-text bg-primary-subtle" id="basic-addon1"><i class="bi bi-search"></i></span>
               <input type="text" class="form-control" placeholder="Search Respository" aria-label="Username" aria-describedby="basic-addon1">
            </div>
            <input class="rounded-1 border fs-5 text-center text-secondary" type="number" id="reposPerPage" min="10" max="100" value="${perPage}">
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
               <h5 class="d-inline-block text-primary">${repository.name}</h5>
               <div class="d-flex justify-content-center gap-3">
                  <i class="fa-solid fa-code-branch" style="vertical-align: middle;line-height: 30px;letter-spacing: .2rem;">${
                     repository.forks_count
                  }</i>
                  <i class="fa-solid fa-star" style="vertical-align: middle;line-height: 30px; letter-spacing: .2rem;">${
                     repository.stargazers_count
                  }</i>
               </div>
               </div>
               <p class="mt-2">${repository.description}</p>
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
   content.style.display = "block"
}

const getNextPage = () => {
   if (currPage <= totalPages) {
      currentPage++
      currPage.textContent = currentPage
      while (repos.firstChild) repos.removeChild(repos.firstChild)
      getRepositories(username, currentPage)
      profile.scrollIntoView(false)
   }
}

const getPreviousPage = () => {
   if (currentPage > 1) {
      currentPage--
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

// document.getElementById("reposPerPage").addEventListener("input", function () {
//    const reposPerPage = document.getElementById("reposPerPage")
//    perPage = parseInt(reposPerPage.value, 10)
//    getRepositories(username, currentPage)
// })

getUser(username, currentPage)
