var bookdb = require('google-books-search');




bookdb.search('9788126519705',function(err,results){
    console.log(results);
});