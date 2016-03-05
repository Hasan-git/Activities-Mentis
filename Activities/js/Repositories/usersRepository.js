
function users() {

   
    var usersRepository = [
    {
        id: 1,
        name: "John Smith",
        username: "user",
        password: "abc123"

    },
    {
        id: 2,
        name: "Alan Jones",
        username: "alan",
        password: "abc123"

    }
    ];


    var getUser = function (index) {

        return usersRepository[index];
    }

    var getProfiles = function () {

        return usersRepository;
    }

    return {
        getUser: getUser,
        getAllUsers: getProfiles
    }
}



angular
.module('active')
.factory('usersRepo', users);
