    $(document).ready(function () {  
        //Setting a reference to the article-container div where all the dynamic content will go
        //Adding the event listeners to any dynamically generated "save article" and scrape new articles
        var articleContainer = $(".article-container");
        $(document).on("click", ".btn.save", handleArticleSave);
        $(document).on("click", "scrape-new", handleArticleScarpe);

        //Once the page is ready , run the initPage function to kick things off
        initPage();

        function initPage() {  
        //Empty the article container, run the AJax request for any unsaved headlines
        articleContainer.empty();
        $.get("api/headlines?saved=false")
        .then(function(data){
            //If we have headlines,render them to the page
            if (data && data.length) {
                renderArticles(data);
            }
            else {
                //Otherwise render a message indicating we have no articles
                renderEmpty();
            }
        });
        
    }

        function renderArticles(articles) {  
            //This fucntion handles appending HTML containing our article data to the page
            //pass an array of JSON a containing all available articles in our database
            var articlesPanels = [];
            //We pass each article JSON object to the createPanel function which returns a bootstap
            //panel article data inside
            for (var i = 0; i < articles.length; i++) {
                articlesPanels.push(createPanel(articles[i]));
            }
            //Once we have all of the html for the articles store in our articlePanel array,and append them to the 
            //articlesPanels container
            articleContainer.append(articlesPanels);
        }

        function createPanel(article) {  
            //Function takes in a single object for an article/headline and Constructs a Jquery element containing all of the formatted
            //HTML for the article panel
            var panel =
            $(["<div class='panel panel-default'>",
              "<div class='panel-heading'>",
              "<h3>",
              article.headline,
              "<a class='btn btn-success save'>",
              "Save Article",
              "</a>",
              "<h3>",
              "<div>",
              "<div class='panel-body'>",
              article.summary,
              "<div>",
              "<div>"
            ].join(""));
            //Attach the article's id to the JQuery element
            //We will you this when trying to figure out which article the user wants to save
            panel.data("_id", article.id_id);
            //Return the constructed panel Jquery element
            return panel;
        }

        function renderEmpty() {
            //This function renders some Html to the page expplaining, explaining we dont have articles to view
            //Using a joined array of HTML string data because its easier to read.change than a concatenated string
            var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
              "<h4> Oh. Looks like we dont have any new articles.</h4>",
              "</div>",
              "<div class='panel panel default'>",
              "<div class= 'panel-heading text-center'>",
              "<h3>What would you like to do?</h3>",
              "<div>",
              "<div class='panel-body text-center'>",
              "<h4><a class='scrape-new'>Try Scraping New Articles</a><h4>",
              "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
              "</div",
              "</div>"
            ].join(""));
            //Appending this data to the page
            articleContainer.append(emptyAlert);
        }

        function handleArticleSave() {
            //function is trigger when the user want to save an article
            //when we render the article initially, we attached a javascript object containing the headline id
            //to the element using the .data method. here we retrieve that
            var articleToSave = $(this).parents(".panel").data();
            articleToSave.saved = true;
            //This is an update to an existing record in our collection
            $ajax({
                method: "PATCH",
                url: "/api/headlines",
                data: articleToSave
            })
            .then(function(data){
                //If successful, mongoose will send back an object containing a key of ok with the value of 1
                //which casts to ''true'
                if (data.ok) {
                    //Run the initPage function again.This will reload the entire list of articles
                    initPage();
                }
            });
        }

        function handleArticleScarpe() {
            //This fucntion handles the user clicking any scrape new article buttons
            $.get("/api/fetch")
             .then(function(data){
                 //If we are to succesfully scrape the NYTIMES and compare the article to those
                 //already in our collection,re render the articles on the page
                 //and let the user know how many unique articles we were able to save
                 initPage();
                 bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
             });
        }
    });