const url = "https://api.github.com/users/"
const searchUrl = "https://api.github.com/search/repositories?"

let username = "homanp" // default user
const content = document.querySelector("#content")
const profile = document.querySelector("#profile")
const repos = document.querySelector("#repos")
const search = document.querySelector("#search")
const searchButton = document.querySelector("#button")
const spinner = document.querySelector("#loading")
const currPage = document.querySelector("#currentPage")
const reposPerPage = document.getElementById("reposPerPage")
const searchRepo = document.getElementById("searchRepo")
let currentTag = document.querySelector("#currentTag")
let publicReposCount = 0

let currentPage = 1
let perPage = 10
let totalPages = 100
let searchQuery = null

const getUser = async (username, page) => {
   displayLoader(true)
   const response = await fetch(url + username)
   const data = await response.json()
   if (response.status === 404) {
      displayLoader(false)
      content.style.display = "none"
      document.getElementById("userError").classList.remove("d-none")
      return
   }
   // re-intializing default values for each user
   searchRepo.value = ""
   searchQuery = ""
   currentPage = 1
   resetButtonStyles()
   totalPages = Math.ceil(data.public_repos / perPage)
   publicReposCount = data.public_repos

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
         `
   profile.innerHTML = profileDiv
   while (repos.firstChild) repos.removeChild(repos.firstChild)
   getRepositories(username, page, searchQuery)
}

const getRepositories = async (username, page, query = null) => {
   const finalUrl = query
      ? `${searchUrl}q=user:${username}+${query}&page=${page}&per_page=${perPage}`
      : url + username + "/repos" + `?page=${page}&per_page=${perPage}`
   const response = await fetch(finalUrl)
   let data = await response.json()

   if (query) {
      totalPages = Math.ceil(data.total_count / perPage)
      data = data.items
   } else {
      totalPages = Math.ceil(publicReposCount / perPage)
   }
   // displaying no repository found error message
   if (data.length === 0){
      document.getElementById("repoError").classList.remove("d-none")
      document.getElementById("nav").classList.add("d-none")
   } 
   else{
      document.getElementById("repoError").classList.add("d-none")
      document.getElementById("nav").classList.remove("d-none")
   } 
   // console.log("total pages ", totalPages)

   const repoDiv = (repository) => `
            <div class="col-5 border border-2 border-black p-3 rounded-2 shadow">
               <div class="d-flex justify-content-between">
               <h5 class="d-inline-block text-primary">${repository.name}</h5>
               <div class="d-flex justify-content-center gap-3">
                  <i class="fa-solid fa-code-branch" style="vertical-align: middle;line-height: 30px;letter-spacing: .2rem;">${repository.forks_count}</i>
                  <i class="fa-solid fa-star" style="vertical-align: middle;line-height: 30px; letter-spacing: .2rem;">${repository.stargazers_count}</i>
               </div>
               </div>
               <p class="mt-2">${repository.description}</p>
               <div id="topics" class="d-flex flex-wrap justify-content-start gap-2">
            ${repository.topics && repository.topics.length > 0
                  ? repository.topics.map((topic) =>
                             `<button type="button" class="btn btn-primary btn-sm">${topic}</button>`,
                       ).join("")
                  : '<span class="fw-light">No topics available</span>'
            }
               </div>
            </div>
         `
   while (repos.firstChild) repos.removeChild(repos.firstChild)
   data.forEach((repo) => {
      repos.innerHTML += repoDiv(repo)
   })
   displayLoader(false)
   setButtonStyles()
}

// function to toggle loading state
const displayLoader = (status) => {
   if (status) {
      content.style.display = "none"
      spinner.style.display = "block"
   } else {
      spinner.style.display = "none"
      content.style.display = "block"
   }
}

const getNextPage = () => {
   if (currentPage < totalPages) {
      currentPage++
      currPage.textContent = currentPage
      getRepositories(username, currentPage, searchQuery)
      profile.scrollIntoView(false)
      setButtonStyles()
   }
}

const getPreviousPage = () => {
   if (currentPage > 1) {
      currentPage--
      currPage.textContent = currentPage
      getRepositories(username, currentPage, searchQuery)
      profile.scrollIntoView(false)
      setButtonStyles()
   }
}

// edge cases for first and last page
const setButtonStyles = () => {

   if (currentPage === 1)
      document.getElementById("prevButton").classList.add("text-secondary")
   else
      document.getElementById("prevButton").classList.remove("text-secondary")

   if (currentPage === totalPages)
      document.getElementById("nextButton").classList.add("text-secondary")
   else
      document.getElementById("nextButton").classList.remove("text-secondary")
}

const resetButtonStyles = () => {
   currPage.textContent = currentPage
   document.getElementById("prevButton").classList.add("text-secondary")
   document.getElementById("nextButton").classList.remove("text-secondary")
}

document.getElementById("prevPage").addEventListener("click", () => {
   getPreviousPage()
})

document.getElementById("nextPage").addEventListener("click", () => {
   getNextPage()
})

// handling new github user input
const formSubmit = () => {
   if (search.value !== "") {
      document.getElementById("userError").classList.add("d-none")
      username = search.value
      getUser(username)
   }
}

document.getElementById("form").addEventListener("submit", function (event) {
   event.preventDefault()
   formSubmit()
})
searchButton.addEventListener("click", formSubmit)

reposPerPage.addEventListener("change", () => {
   let newPerPage = parseInt(reposPerPage.value, 10)
   newPerPage = Math.min(Math.max(newPerPage, 10), 100)
   reposPerPage.value = newPerPage
   perPage = newPerPage
   displayLoader(true)
   getRepositories(username, currentPage, searchQuery)
})

searchRepo.addEventListener("change", () => {
   searchQuery = searchRepo.value
   currentPage = 1
   currPage.textContent = currentPage
   getRepositories(username, currentPage, searchQuery)
})

getUser(username, currentPage)
