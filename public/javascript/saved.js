    $(document).ready(function(){
        //Getting a reference to the article container div, will rendering all articles inside of 
        var articleContainer = $(".article-container");
        //Adding event listeners for dynamically generated buttons for deleting articles and
        //pulling up article notes, saving artilce notes,and deleting articles notes

        $(document).on("click", ".btn.delete", handleArticleDelete);
        $(document).on("click", ".btn.notes", handleArticleNotes);
        $(document).on("click", ".btn.save", handleNoteSave);
        $(document).on("click", ".btn.note-delete", handleNoteDelete);

        //kicks off everything when the page is loaded
        initPage();

        function initPage() {  
            //Empty the article container,run an AJAX request for any saved headlines
            articleContainer.empty();
            $.get("/api/headlines?saved=true").then(function(data){
                //If we have headlines, render them to the page
                if (data && data.length) {
                    renderArticles(data);
                } else {
                    //Otherwise render a message explaining we have no articles
                    renderEmpty();
                }
            });
        }

        function renderArticles(articles) {
            // This fucntion handles appending html containing our article data to the page
            //Pass an array of JSON containing all availavle articles in db
            var articlePanels = [];
            //Pass each article JSON object to the createPanel function which returns a bootstrap
            for (var i = 0; i < articles.length; i++) {
                articlePanels.push(createPanel(articles[i]));
            }
            //Once we have all of the html for the articles stored in our articlePanels array.
            articleContainer.append(articlePanels);
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

        function renderNotesList(data) {
            //This handles the rendering note list items to our notes modal
            //Setting up an array of notes to render after finished
            //Setting up a currentNote variable to temporarily store each note
            var notesToRender = [];
            var currentNote;
            if (!data.notes.length) {
                //If we have no notes, just display a message explaining this
                currentNote = [
                    "<li class='list-group-item'>",
                    "No notes for this article yet.",
                    "</li>"
                ].join("");
                notesToRender.push(currentNote);
            }
            else {
                //If we do have notes,go through each one
                for (var i = 0; i < data.notes.length; i++) {
                    //Constructs an li element to contain our noteText and a delete button
                    currentNote = $([
                        "<li class='list-group-item note'>",
                        data.note[i].noteText,
                        "<button class='btn btn-danger note-delete'>x</button>",
                        "<li>"
                        ].join(""));
                        //Store the note id on the delete button for easy access when trying to delete
                        currentNote.children("button").data("_id", data.notes[i._id]);
                        //Adding our currenNote to the noteToRender array
                        notesToRender.push(currentNote);
                }
            }
            //Now append the notesToREnder to the note-container inside the note modal
            $(".note-container").append(notesToRender);
        }

        function handleArticleDelete() {
            //Handles deleting article.headlines
            var articleToDelete = $(this).parents(".panel").data();
            //Using a delete method here to be semantic since we are deleting an article/headline
            $.ajax({
                method: "DELETE",
                url: "/api/headlines/" + articleToDelete._id
            }).then(function(data){
                if (data.ok) {
                    initPage();
                }
            });
        }

            function handleArticleNotes() {
                //handles opending the notes modal and displaying our notes
                //We grab the id of the article to get notes for from the panel element the delete button sits inside
                var currentArticle = $(this).parents(".panel").data();
                $.get("/api/notes" + currentArticle.id).then(function(data){
                    //Constructing our initial Html to add the notes modal
                    var modalText = [
                        "<div class='container-fluid text-center'",
                        "<h4>Notes for Article: ",
                        currentArticle._id,
                        "</h4>",
                         "<hr/>",
                         "<ul class='list-group note-container'",
                         "</ul>",
                         "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                         "<button class='btn btn-success save'>Save Note</button>",
                    ].join("");
                    //Addig the formatted Html to the note modal
                    bootbox.dialog({
                        message: modalText,
                        closeButton: true
                    });
                    var noteData ={
                        _id: currentArticle._id,
                        notes: data || []
                    };
                    //Adding information about the article notes to the save button for easy access
                    $(".btn.save").data("article", noteData);
                    //RenderNotesList will populate the actual note Html inside of the modal we just ceated/opened
                    renderNotesList(noteData);
                });
            }

            function handleNoteSave() {
                //Function handles what happens when a user tries to save a new note for an article
                //Setting a variavle to hold some formatted data about our note
                var noteData;
                var newNote = $(".bootbox-body textarea").val().trim();

                if (newNote) {
                    noteData = {
                        _id: $(this).data("article")._id,
                        noteText: newNote
                    };
                    $.post("/api/notes", noteData).then(function () { 
                        //when complete,close the modal
                        bootbox.hideAll();
                     });
                }
            }

            function handleNoteDelete() {
                //This function handles the deletion of notes

                var noteToDelete = $(this).data("_id");
                //Perform an delete request to api/notes with the id of the note we're deleting as a parameter
                $.ajax({
                    url: "/api/notes/" + noteToDelete,
                    method: "DELETE"
                }).then(function(){
                    bootbox.hideAll();
                });
            }
    });