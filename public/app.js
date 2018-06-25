// // Grab the articles as a json
// $.getJSON("/articles", function(data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//       // Display the information on the page
//       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link +  "<br />" + data[i].summary + "</p>");
//     }
//   });
  
//   // This is create the Article
//   $("#createarticle").on("submit", function(event) {
//     // Make sure to preventDefault on a submit event.
//     event.preventDefault();

//     var newArticle = {
//       plan: $("#createarticle [name=article]").val().trim()
//     };

//     // Send the POST request.
//     $.ajax("/Article", {
//       type: "POST",
//       data: newArticle
//     }).then(
//       function() {
//         console.log("created new article");
//         // Reload the page to get the updated list
//         location.reload();
//       }
//     );
//   });

//   // This will delete the article
//   $(".delarticle").on("click", function(event) {
//     var id = $(this).data("articleid");

//     // Send the DELETE request.
//     $.ajax("/articles/" + id, {
//       type: "DELETE"
//     }).then(
//       function() {
//         console.log("deleted id ", id);
//         // Reload the page to get the updated list
//         location.reload();
//       }
//     );
//   });
  
  