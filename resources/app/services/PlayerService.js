teamPlayerApp.factory('PlayerService', ['PlayerAdapter', function(PlayerAdapter){
    return {
        getAll: function(){
            return firebase.database().ref('/players').once('value').then(function(snapshot) {
                return PlayerAdapter.collectionToArray(snapshot.val());
            });
        },
        update: function(player){
            firebase.database().ref('/players/'+player.id).set(PlayerAdapter.normalize(player));
        },
        add: function(player){
            return firebase.database().ref().child('players').push(PlayerAdapter.normalize(player));
        },
        delete: function(player){
            firebase.database().ref('/players/'+player.id).remove();
        }
    };
}]);