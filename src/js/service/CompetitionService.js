'use strict';

var server = 'http://localhost:8080/';

angular.module('wma').factory('CompetitionService',
    ['$http', function ($http) {
        return {
            createCompetition: function (competitionData) {
                return $http({
                    method: 'POST',
                    data: competitionData,
                    url: server + 'api/admin/competition'
                });
            },
            getCompetitionById: function (id) {
                return $http({
                    method: 'GET',
                    params: {competition: id},
                    url: server + 'api/admin/competition/info'
                });
            },
            createTeam: function (teamData) {
                return $http({
                    method: 'POST',
                    data: teamData,
                    url: server + 'api/admin/team'
                });
            },
            getTeams: function(competitionId) {
                var prms = {};
                if(competitionId) prms['competition'] = competitionId;

                return $http({
                    method: 'GET',
                    params: prms,
                    url: server + 'api/admin/teams'
                });
            },
            attachTeamToCompetition: function(competitionId, teamId) {
                var prms = {};
                prms['competition'] = competitionId;
                prms['team'] = teamId;

                return $http({
                    method: 'POST',
                    params: prms,
                    url: server + 'api/admin/attach/team'
                });
            },
            detachTeamFromCompetition: function(competitionId, teamId) {
                var prms = {};
                prms['competition'] = competitionId;
                prms['team'] = teamId;

                return $http({
                    method: 'POST',
                    params: prms,
                    url: server + 'api/admin/detach/team'
                });
            },
            createSportsman: function (sportsmanData) {
                return $http({
                    method: 'POST',
                    data: sportsmanData,
                    url: server + 'api/admin/sportsman'
                });
            },
            updateParticipant: function(participantId, teamId, personalScore, tags) {
                var prms = {};
                prms['participant'] = participantId;
                prms['team'] = teamId;
                prms['personal_score'] = personalScore;
                prms['types'] = tags;

                return $http({
                    method: 'POST',
                    params: prms,
                    url: server + 'api/admin/participant/edit'
                });
            },
            getSportsmen: function (competitionId, isRegistered) {
                var prms = {};
                var url = 'api/admin/sportsmen';
                if(competitionId) prms['competition'] = competitionId;
                if(isRegistered === true) {
                    url = 'api/admin/participants';
                }

                return $http({
                    method: 'GET',
                    params: prms,
                    url: server + url
                });
            },
            updateSportsman: function (sportsmanData) {
                return $http({
                    method: 'POST',
                    data: sportsmanData,
                    url: server + 'api/admin/edit/sportsman'
                });
            },
            attachSportsmanToTeam: function (competitionId, teamId, sportsmanId) {
                var prms = {};
                prms['competition'] = competitionId;
                prms['team'] = teamId;
                prms['sportsman'] = sportsmanId;

                return $http({
                    method: 'POST',
                    params: prms,
                    url: server + 'api/admin/attach/sportsman'
                });
            },
            detachSportsmanFromTeam: function (competitionId, teamId, sportsmanId) {
                var prms = {};
                prms['competition'] = competitionId;
                prms['team'] = teamId;
                prms['sportsman'] = sportsmanId;

                return $http({
                    method: 'POST',
                    params: prms,
                    url: server + 'api/admin/detach/sportsman'
                });
            },
            getCompetitions: function (startDate, endDate) {
                var prms = {};
                if(startDate) prms['from'] = startDate;
                if(endDate) prms['to'] = endDate;

                return $http({
                    method: 'GET',
                    params: prms,
                    url: server + 'api/admin/competitions'
                });
            },
            getSportTypes: function (competitionId) {
                var prms = {};
                if(competitionId) prms['competition'] = competitionId;

                return $http({
                    method: 'GET',
                    params: prms,
                    url: server + 'api/admin/types-of-sport'
                });
            },
            registerSportsman: function (competitionId, teamId, sportsmanId) {
                var prms = {};
                prms['competition'] = competitionId;
                prms['team'] = teamId;
                prms['sportsman'] = sportsmanId;

                return $http({
                    method: 'POST',
                    params: prms,
                    url: server + 'api/admin/register/sportsman'
                });
            },
            getResults: function (competitionId, sportId) {
                var prms = {};
                prms['competition'] = competitionId;
                prms['sport'] = sportId;

                return $http({
                    method: 'GET',
                    params: prms,
                    url: server + 'api/admin/results'
                });
            },
            writeTimeResults: function (participantId, sportId, hours, minutes, seconds, miliseconds) {
                var prms = {};
                prms['participant'] = participantId;
                prms['sport'] = sportId;
                prms['hh'] = hours;
                prms['mm'] = minutes;
                prms['ss'] = seconds;
                prms['ms'] = miliseconds;

                return $http({
                    method: 'POST',
                    params: prms,
                    url: server + 'api/admin/result/time'
                });
            },
            updateTimeResults: function (participantId, sportId, attemptId, hours, minutes, seconds, miliseconds) {
                var prms = {};
                prms['participant'] = participantId;
                prms['sport'] = sportId;
                prms['attempt'] = attemptId;
                prms['hh'] = hours;
                prms['mm'] = minutes;
                prms['ss'] = seconds;
                prms['ms'] = miliseconds;

                return $http({
                    method: 'POST',
                    params: prms,
                    url: server + 'api/admin/result/time/update'
                });
            },
            updateDistanceResults: function (participantId, sportId, attemptId, attempt, result) {
                var prms = {};
                prms['participant'] = participantId;
                prms['attemptId'] = attemptId;
                prms['sport'] = sportId;
                prms['result'] = result;
                prms['attempt'] = attempt;

                return $http({
                    method: 'POST',
                    params: prms,
                    url: server + 'api/admin/result/distance/update'
                });
            },
            writeDistanceResults: function (participantId, sportId, attempt, result) {
                var prms = {};
                prms['participant'] = participantId;
                prms['sport'] = sportId;
                prms['result'] = result;
                prms['attempt'] = attempt;

                return $http({
                    method: 'POST',
                    params: prms,
                    url: server + 'api/admin/result/distance'
                });
            },
            downloadCompetitionReport: function (competitionId) {
                var prms = {};
                prms['competition'] = competitionId;

                return $http({
                    method: 'GET',
                    params: prms,
                    url: server + 'api/admin/report/by-team'
                });
            },
            getWMAFactors: function () {
                return $http({
                    method: 'GET',
                    url: server + 'api/admin/wma'
                });
            },
            saveWMAFactors: function (factors) {
                return $http({
                    method: 'POST',
                    data: factors,
                    url: server + 'api/admin/wma'
                });
            },
            saveNewSport: function (sport) {
                return $http({
                    method: 'POST',
                    data: sport,
                    url: server + 'api/admin/types-of-sport'
                });
            },
            editSportInfo: function (sport) {
                return $http({
                    method: 'POST',
                    data: sport,
                    url: server + 'api/admin/types-of-sport/edit'
                });
            }
        }
    }]
);
