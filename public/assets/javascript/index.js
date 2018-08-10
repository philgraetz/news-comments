// Document Ready
$(document).ready(function() {
    console.log("document.ready");

    $("#logout-button").on("click", logout);
    $(document).on("click", ".save-article-button", saveArticle);
    $(document).on("click", ".add-comment-button", addComment);
    $(document).on("click", ".comment-submit-button", submitComment);

    $("#login-submit").on("click", function(event) {
        // event.preventDefault();
        loginUser();
    });

    setupLoginButtons();
});

function getLogin() {
    return localStorage.getItem("news-login");
}

function setLogin(login) {
    localStorage.setItem("news-login", login);
}

function clearLogin() {
    localStorage.removeItem("news-login");
}

function setupLoginButtons() {
    console.log("setupLoginButtons");
    login = getLogin();
    if (login) {
        $("#login-modal-button").addClass("d-none");
        $("#logged-in-as-form").removeClass("d-none");
        $("#logged-in-as-span").text("hello " + login);
        $("#new-articles-menu").attr("href", "/new-articles/" + login);
        $("#saved-articles-menu").attr("href", "/saved-articles/" + login);
    } else {
        $("#login-modal-button").removeClass("d-none");
        $("#logged-in-as-form").addClass("d-none");
        $("#logged-in-as-span").text("");
        $("#new-articles-menu").attr("href", "/new-articles/NA");
        $("#saved-articles-menu").attr("href", "/saved-articles/NA");
    }
}

function loginUser() {
    let login = $("#username-login").val();
    let password = $("#userpass-login").val();
    let obj = {login, password};
    $.post("/api/login", obj, function(data) {
        setLogin(login);
        setupLoginButtons();
    });
}

function logout() {
    clearLogin();
    setupLoginButtons();
}

function saveArticle() {
    let thisElt = this;
    let heading = $(this).data("heading");
    let summary = $(this).data("summary");
    let url = $(this).data("url");
    let image = $(this).data("image");
    let savedBy = getLogin();
    let article = {heading, summary, url, image, savedBy};
    console.log(article);
    $.post("/api/save-article", article, function(data) {
        console.log(data);

        // Hide the 'save' button
        $(thisElt).addClass("d-none");

        // Enable the 'delete', 'addcomment' and show 'saved by'
        let d = new Date(data.savedDate);
        let dateString = d.toLocaleDateString() + " at " + d.toLocaleTimeString();
        console.log("dateString " + dateString);
        let s1 = heading.replace(/ /g, "");
        $("#delete-"+s1).removeClass("d-none");
        $("#add-comment-"+s1).removeClass("d-none");
        $("#saved-by-"+s1).removeClass("d-none");
        $("#saved-by-"+s1).html(`Saved by <em>${data.savedBy}</em> on ${dateString}`)
    });
}

function addComment() {
    // Enable the comment input and button
    let articleId = $(this).data("article-id");
    $("#comment-group-" + articleId).removeClass("d-none");
}

function submitComment() {
    console.log("submitComment");
    // Add it to the DB
    let thisElt = this;
    let articleId = $(thisElt).data("article-id");
    console.log("submitComment " + articleId);
    let comment = {
        by       : getLogin(),
        text     : $("#comment-input-"+ articleId).val(),
        articleId: articleId
    };
    console.log(comment);
    $.post("/api/add-comment", comment, function(data) {
        console.log(data);
    });

    $("#comment-group-" + articleId).addClass("d-none");
}
