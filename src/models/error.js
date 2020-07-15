var error = {
    handle: (response) => {
        if (response.error.code == 403 || response.error.code == 498) {
            m.route.set("/login");
            alert("Error: " + response.error.message);
        }
        else {
            console.log("ERROR: failed to add fields");
            console.log(response);
            alert("Error: " + response.error.message);
        }
    }
}

module.exports = error;