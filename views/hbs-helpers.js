const helpers = {
    disableSave: function(isSaved, loggedInAs) {
        if (isSaved)
            return "d-none";
        if (!loggedInAs || (loggedInAs === "NA"))
            return "d-none";
        return "";
    },
    enableSave: function(isSaved) {
        return (isSaved) ? "" : "d-none";
    },
    disableIfNotYou: function(savedBy, loggedInAs) {
        // console.log("savedBy [" + savedBy + "]  loggedInAs [" + loggedInAs + "]");
        return (savedBy === loggedInAs) ? "" : "d-none";
    },
    disableIfNotSaved: function(isSaved) {
        return isSaved ? "" : "d-none";
    },
    removeSpaces: function(s1) {
        return s1.replace(/ /g, "");
    },
    dateString: function(date) {
        let d = new Date(date);
        return d.toLocaleDateString() + " at " + d.toLocaleTimeString();
    }
};

module.exports = helpers;
