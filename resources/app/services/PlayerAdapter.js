teamPlayerApp.factory('PlayerAdapter', function(){
    return {

        normalize: function(player){
            player = angular.copy(player);
            if(typeof player.id !== "undefined"){
                delete player.id;
            }
            if(typeof player.new !== "undefined"){
                delete player.new;
            }
            return player;
        },

        collectionToArray: function(collection){
            var players = [];

            $.each(collection, function(index, elem)
            {
                elem.id = index;
                players.push(elem);
            });

            return players;
        }
    };
});