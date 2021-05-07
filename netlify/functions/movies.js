// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)


  // 🔥 hw6: your recipe and code starts here!
  // Get the year and genre from the querystring parameters
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre

  // See if any of the above variables result in undefined and if so, return Nope! 
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Nope!` // a string of data
    }
  }
  
  // When conditions have been properly met, run this code
  else {
  
  // Create the object returnValue which stores the count and the movie array
    let returnValue = {
      numResults: 0,
      movies: []
    }
  
  // Loop through all listings   
    for (let i=0; i < moviesFromCsv.length; i++) {
  
  // Store each listing in memory
      let movieResults = moviesFromCsv[i]
      
  // Create a new post object containing the pertinent fields    
      let moviePost = {
        Title: movieResults.primaryTitle,
        Release_Date: movieResults.startYear,
        Genres: movieResults.genres
      }
  
  // Check if it meets the criteria input by the user and also ask it to ignore any //N runtime and genres
      if(movieResults.genres == genre && movieResults.startYear == year && movieResults.runtimeMinutes !== `\\N` && movieResults.genres !== `\\N`){
      
  // Add the results to the array    
      returnValue.movies.push(moviePost)
      
  // Increase the counter by 1    
      returnValue.numResults=returnValue.numResults+1  
    }
  }
    // a lambda function returns a status code and a string of data
  return {
    statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    body: JSON.stringify(returnValue) // a string of data
  }
}
}