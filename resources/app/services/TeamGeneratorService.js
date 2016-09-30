teamPlayerApp.factory('TeamGeneratorService', [ function(){


    var _teamsPlayerCount = 10;
    var _teamsCount = 2;
    var _teamSize = _teamsPlayerCount / _teamsCount;

    var normalizePlayers = function(players){
        var normalizedPlayers = [];

        var getPosition = function(position){
            switch(position){
                case "offensive":
                    return 1;
                    break;
                default:
                case "defensive":
                    return 0;
                    break;
            }
        };

        var getPhysicalCondition = function(pc){
            switch(pc){
                case "bad":
                    return 0;
                    break;
                default:
                case "medium":
                    return 1;
                    break;
                case "good":
                    return 2;
                    break;
            }
        };

        players.forEach(function(elem){
            normalizedPlayers.push( {
                "id": elem.id,
                "name": elem.name,
                "random": Math.floor((Math.random() * 1000) + 1),
                "score": elem.score,
                "position": getPosition(elem.position),
                "physicalCondition": getPhysicalCondition(elem.physicalCondition)
            });
        });

        return normalizedPlayers;
    };

    var playerCompare = function (a,b) {
        if (a.score < b.score){
            return -1;
        }else if (a.score > b.score){
            return 1;
        }else{
            if(a.random < b.random){
                return -1;
            }else if (a.random > b.random){
                return 1;
            }else{
                return 0;
            }
        }
    };

    var getPlayerById = function (playerList, id) {
        var p = null;
        playerList.forEach(function(elem){
            if(elem.id == id){
                p = elem;
            }
        });
        return p;
    };


    var distributePlayersInTeamsByScore = function(players){

        var teams = [[], []];

        var t1Score = 0;
        var t2Score = 0;

        players = players.sort(playerCompare).reverse();

        players.forEach(function(elem){
            if(t1Score <= t2Score || (t1Score > t2Score && teams[1].length >= _teamSize)){
                teams[0].push(elem);
                t1Score += elem.score;
            }else{
                teams[1].push(elem);
                t2Score += elem.score;
            }
        });

        return teams;
    };

    return {
        generate: function(players){

            var origPlayers = angular.copy(players);

            if(players.length != _teamsPlayerCount){
                throw(_teamsPlayerCount+' players are required to generate the teams.');
            }

            var normPlayers = normalizePlayers(players);

            var teams = distributePlayersInTeamsByScore(normPlayers);

            var getTeamPlayers = function(origPlayers, list){
                var players = [];
                list.forEach(function(elem, index){
                    players[index] = getPlayerById(origPlayers, elem.id);
                });
                return players;
            };

            return [{
                name: "White Team",
                players: getTeamPlayers(origPlayers, teams[0])
            }, {
                name: "Black Team",
                players: getTeamPlayers(origPlayers, teams[1])
            }];
        }
    };
}]);