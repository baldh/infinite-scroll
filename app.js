const quotesElement = document.querySelector(".quotes")
const loader = document.querySelector(".loader")

let currentPage = 1
let limit = 10
let remaining

const getQuotes = async(page,limit) => {
  const API_URL = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`
  try{
    return  await fetch(API_URL).then(res=> res.json())
  }catch (e) {
    console.error(e)
  }
}

const createQuotes = (quotes) => {
  quotes.forEach(quote => {
    const quoteElement = document.createElement("blockquote")
    quoteElement.classList.add("quote")

    quoteElement.innerHTML = `
      "${quote.quote}" 
      <footer>- ${quote.author}</footer>
    `
    quotesElement.appendChild(quoteElement)
  })
}

const showQuotes = async (page, limit) => {
  showLoader()
  try {
    if(remaining !== 0) {
      limit =remaining < limit ? remaining : limit
      const response = (await getQuotes(currentPage, limit))
      createQuotes(response.data)
      !remaining ? remaining = response.total - limit : remaining -= limit
      currentPage+=1
      return
    }
    hideLoader()
    quotesObserver.unobserve(loader)
  } catch(e) {
    console.error(e.message)
  }
}
const showLoader = () => {
  const skeleton = loader.children[0]
  const spinner = loader.children[1]
  if(currentPage !== 1){
    skeleton.classList.add("hide")
    spinner.classList.remove("hide")
  }
}

const hideLoader = () => {
  loader.classList.add("hide")
}

//load quotes with intersection observer
function createQuotesObserver() {
  const options = {
    root: null,
    rootMargin: "0px 0px 100px 0px",
    threshold: 0
  }
  const observer = new IntersectionObserver(entries => {
    console.log("observer loaded")
    entries.forEach(async entry => {
      if(entry.isIntersecting) {
        await showQuotes(currentPage, limit)
      }
    })
  }, options)

  observer.observe(loader)
}

window.addEventListener("load", (e)=> {
  createQuotesObserver()
}, false)