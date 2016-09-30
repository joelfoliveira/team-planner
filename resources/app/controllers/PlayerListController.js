teamPlayerApp.controller('PlayerListController', function PlayerListController($scope, isAdmin, PlayerService, TeamGeneratorService) {

    $scope.isAdmin = isAdmin;

    $scope.teams = null;
    $scope.players = null;
    $scope.player = null;
    $scope.tempPlayer = null;
    $scope.playerDetailsModal = null;
    $scope.playerDetailsModalAdd = false;
    $scope.teamsModal = null;
    $scope.teamsModalMessage = "";

    $scope.maxScore = 20;

    $scope.init = function(){
        $scope.setEvents();
        $scope.updatePlayers(function(){
            $('body').removeClass('loading');
        });

        setTimeout(function(){
            if($('html').hasClass('loading')){
                alert('An error has occurred while launching the app.')
            }
        }, 3000);

        $scope.playerDetailsModal = $('#playerDetailsModal');
        $scope.teamsModal = $('#teamsModal');
    };

    $scope.setEvents = function(){
        $(".btn-group > .btn").click(function(){
            $(this).addClass("active").siblings().removeClass("active");
        });
    };

    $scope.updatePlayers = function(callback)
    {
        PlayerService.getAll().then(function(playersList)
        {
            $scope.players = playersList;
            $scope.$apply();

            if (callback && typeof(callback) == "function"){
                callback(playersList);
            }
        });
    };


    $scope.archivePlayer = function(player){
        player.archived = true;
        PlayerService.update(player);
        $scope.updatePlayers();
    };

    $scope.unArchivePlayer = function(player){
        player.archived = false;
        PlayerService.update(player);
        $scope.updatePlayers();
    };

    $scope.deletePlayer = function(player){
        var r = confirm("Do you really want to delete player: "+player.name+"?");
        if (r == true) {
            PlayerService.delete(player);
            $scope.updatePlayers();
        }
    };

    $scope.getPlayerStatsInfoFormatted = function(player){
        return '('+
            (player.score != null ? player.score : '?')
            +' / '+
            (player.position != null ? player.position.substring(0, 1).toUpperCase() : '?')
            +' / '+
            (player.physicalCondition != null ? player.physicalCondition.substring(0, 1).toUpperCase() : '?')
            +')';
    };

    $scope.openPlayerDetails = function(player){

        $scope.tempPlayer = null;

        if(typeof player !== 'undefined' || player != null)
        {
            $scope.playerDetailsModalAdd = false;
            player = angular.copy(player);
        }
        else
        {
            $scope.playerDetailsModelAdd = true;
            player = {
                "name": "",
                "score": null,
                "position": null,
                "physicalCondition": null,
                "archived": false,
                "new": true
            };
        }

        $scope.tempPlayer = player;

        $scope.playerDetailsModal.modal('show');
        $scope.setEvents();
    };

    $scope.closePlayerDetails = function(){
        $scope.tempPlayer = null;
    };

    $scope.savePlayerDetails = function(){
        if(typeof $scope.tempPlayer.new !== 'undefined' && $scope.tempPlayer.new === true)
        {
            delete($scope.tempPlayer.new);
            PlayerService.add($scope.tempPlayer);
            $scope.updatePlayers();
        }
        else
        {
            PlayerService.update($scope.tempPlayer);
            $scope.updatePlayers();
        }

        $scope.playerDetailsModal.modal('hide');
    };


    $scope.openTeamsModal = function(){

        $scope.teams = null;
        $scope.teamsModalMessage = "";

        try
        {
            var activePlayers = [];
            $.each($scope.players, function(index, elem)
            {
                if(elem.archived == false){
                    activePlayers.push(elem);
                }
            });
            $scope.teams = TeamGeneratorService.generate(activePlayers);
        }
        catch(error)
        {
            $scope.teamsModalMessage = error;
        }

        $scope.teamsModal.modal('show');
    };

    $scope.closePlayerDetails = function(){
        $scope.teamsModalMessage = "";
        $scope.teams = null;
    };

    $scope.init();

});