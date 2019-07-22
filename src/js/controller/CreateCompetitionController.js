'use strict';

angular.module('wma').controller('CreateCompetitionController',
    function ($scope, $location, $mdDialog, $routeParams, $timeout, UtilService, CompetitionService) {
        var self = this;
        self.newResult = {};
        self.newCompetition = {};
        self.newTeam = {};
        self.newSportsman = {};
        self.newRegisteredSportsman = {};
        self.newAttempt = {};
        self.newSport = {};
        self.teamsList = [];
        self.sportsmenList = [];
        self.competitionsList = [];
        self.selectedTeam = null;

        self.isAddNewResultWithAttemptActive = false;
        self.isStartDateOpen = false;
        self.isEndDateOpen = false;
        self.isDOBOpen = false;
        self.genders = ['Чоловіча', 'Жіноча'];

        self.gendersForWMA = ['Чоловіки', 'Жінки'];
        self.sportsmenGender = self.gendersForWMA[0];

        self.allTeamsAreAttached = false;
        self.competitionTab = 'unregistered';

        self.competitionTypes = [
            {
                name: 'Поза приміщенням (Outdoor)',
                value: 'outdoor'
            },
            {
                name: 'В приміщенні (Indoor)',
                value: 'indoor'
            },
            {
                name: 'Поза стадіоном (Non-Stadia)',
                value: 'nonstadia'
            }
        ];

        self.competitionClasses = [
            {
                name: 'Світовий',
                value: 'world'
            },
            {
                name: 'Національний',
                value: 'national'
            },
            {
                name: 'Регіональний',
                value: 'regional'
            }
        ];

        self.attempts = [
            {
                name: 'Пропущено',
                value: 0
            },
            {
                name: 'Невдала',
                value: -1
            },
            {
                name: 'Вдала',
                value: 1
            }
        ];

        self.sportTypes = ['Біг', 'Метання', 'Стрибки'];

        self.getCurrentCompetitionInfo = function () {
            CompetitionService.getCompetitionById($routeParams.competition).then(
                function (result) {
                    self.currentCompetition = result.data;
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.querySearch = function (query) {
            var teams = self.teamsList;

            if (query) {
                teams = self.teamsList.filter(function (value) {
                    return value.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
                })
            }

            return teams;
        };

        $scope.loadTags = function (query) {
            return self.sportTypesList ? self.sportTypesList.filter(function (type) {
                return type.typeName.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            }) : null
        };

        function formatDateWithDot(date) {
            return moment(date).format('MM.DD.YYYY');
        }

        self.closeDialog = function () {
            $mdDialog.cancel();
        };

        self.displayAddTeamDialog = function (team) {
            self.newTeam = team;

            $mdDialog.show({
                contentElement: '#addTeamDialog',
                clickOutsideToClose: true
            });
        };

        self.displayEditWMADialog = function (parameters) {
            self.selectedWMAParameters = parameters;

            $mdDialog.show({
                contentElement: '#editWMAFactorDialog',
                clickOutsideToClose: true
            });
        };

        self.displayRegisterParticipantDialog = function () {
            self.isAddNewSportsmanTab = false;

            $mdDialog.show({
                contentElement: '#registerParticipantDialog',
                clickOutsideToClose: true
            });
        };

        self.editWMAFactors = function () {
            CompetitionService.saveWMAFactors(self.selectedWMAParameters).then(
                function (result) {
                    $mdDialog.cancel();
                    self.initWMAFactorsList();
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.isNewSportsmanIsNotEmpty = function () {
            var s = self.newSportsman;
            return s.firstName && s.lastName && s.firstNameEng && s.lastNameEng &&
                s.dob && s.gender && s.email && s.address && s.phone;
        };

        self.displayAddSportsmanDialog = function (sportsman) {
            self.newSportsman = sportsman ? JSON.parse(JSON.stringify(sportsman)) : {};

            $mdDialog.show({
                contentElement: '#addSportsmanDialog',
                clickOutsideToClose: true
            });
        };

        self.goToAddSportsmenPage = function (competition) {
            $location.path('/competition/' + competition);
        };

        self.goToAddCompetitionResultsPage = function (competition) {
            $location.path('/competition/results/' + competition);
        };

        self.displayUpdateParticipantDialog = function (participant) {
            var types = [];
            if (participant.results) {
                types = participant.results.map(function (value) {
                    return {
                        id: value.sport.id,
                        typeName: value.sport.typeName,
                        attempts: value.attempts
                    }
                })
            }

            self.newRegisteredSportsman = {
                participant: participant.id,
                sportsman: participant.sportsman.id,
                team: participant.team,
                number: participant.number,
                personalScore: participant.personalScore,
                sportTypes: types
            };

            $mdDialog.show({
                contentElement: '#updateParticipantDialog',
                clickOutsideToClose: true
            });
        };

        self.setStartDate = function () {
            self.isStartDateOpen = false;
            self.newCompetition.startDate = formatDateWithDot(self.startDate);
        };

        self.setDOB = function () {
            self.isDOBOpen = false;
            self.newSportsman.dob = formatDateWithDot(self.dob);
        };

        self.initTeamsList = function () {
            CompetitionService.getTeams().then(
                function (result) {
                    self.teamsList = result.data.teams;
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.initSportsmenList = function (isRegistered) {
            var competitionId = isRegistered === null ? null : $routeParams.competition;

            CompetitionService.getSportsmen(competitionId, isRegistered).then(
                function (result) {
                    self.sportsmenList = result.data.sportsmen;

                    if (isRegistered === true) {
                        self.registeredSportsmenList = result.data.sportsmen;
                    }
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.initCompetitionsList = function () {
            CompetitionService.getCompetitions(null, null).then(
                function (result) {
                    self.competitionsList = result.data.competitions;
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.initSportTypesList = function () {
            CompetitionService.getSportTypes($routeParams.competition).then(
                function (result) {
                    self.sportTypesList = result.data.types;
                    self.typeOfSportForResults = self.sportTypesList[0];

                    if ($location.path().indexOf('/results') > -1) {
                        self.getResultsList();
                    }
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.initWMAFactorsList = function () {
            CompetitionService.getWMAFactors().then(
                function (result) {
                    self.WMAFactors = result.data.factors;
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.changeSportTypesTags = function (user) {
            if (user.sportTypes) {
                user.sportTypes = user.sportTypes.filter(function (item) {
                    if (item.id) {
                        return item.id;
                    }
                });
            } else {
                user.sportTypes = [];
            }
        };

        self.editParticipantInfo = function () {
            var tags = self.newRegisteredSportsman.sportTypes.map(function (value) {
                return value.id;
            });

            CompetitionService.updateParticipant(self.newRegisteredSportsman.participant,
                self.newRegisteredSportsman.team.id, self.newRegisteredSportsman.personalScore, tags).then(
                function (result) {
                    $mdDialog.cancel();
                    self.initSportsmenList(true);
                    self.newRegisteredSportsman = {};
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.registerSportsmanOnCompetition = function () {
            CompetitionService.registerSportsman($routeParams.competition, self.newRegisteredSportsman.team.id,
                self.newRegisteredSportsman.sportsman).then(
                function (result) {
                    $mdDialog.cancel();
                    self.initSportsmenList(true);
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.saveTeamInfo = function (form) {
            CompetitionService.createTeam(self.newTeam).then(
                function (result) {
                    $mdDialog.cancel();
                    self.initTeamsList();
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.editSportsman = function () {
            delete self.newSportsman.checked;
            CompetitionService.updateSportsman(self.newSportsman).then(
                function (result) {
                    $mdDialog.cancel();
                    self.initSportsmenList(null);
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.saveNewSportInfo = function () {
            var isJumping = false;
            var isRunning = false;
            var isThrowing = false;

            var isOutdoor = false;
            var isIndoor = false;
            var isNonstadia = false;

            if (self.newSport.sportType === 'Біг') isRunning = true;
            else if (self.newSport.sportType === 'Метання') isThrowing = true;
            else if (self.newSport.sportType === 'Стрибки') isJumping = true;

            if (self.newSport.competitionType === 'outdoor') isOutdoor = true;
            else if (self.newSport.competitionType === 'indoor') isIndoor = true;
            else if (self.newSport.competitionType === 'nonstadia') isNonstadia = true;

            var processedSportInfo = {
                typeName: self.newSport.typeName,
                recordMale: self.newSport.recordMale,
                recordFemale: self.newSport.recordFemale,
                isJumping: isJumping,
                isRunning: isRunning,
                isThrowing: isThrowing,
                isOutdoor: isOutdoor,
                isIndoor: isIndoor,
                isNonstadia: isNonstadia
            };

            CompetitionService.saveNewSport(processedSportInfo).then(
                function (result) {
                    self.sportTypesList = result.data.types;
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            )
        };

        self.editSportInfo = function () {
            var isJumping = false;
            var isRunning = false;
            var isThrowing = false;

            var isOutdoor = false;
            var isIndoor = false;
            var isNonstadia = false;

            if (self.newSport.sportType === 'Біг') isRunning = true;
            else if (self.newSport.sportType === 'Метання') isThrowing = true;
            else if (self.newSport.sportType === 'Стрибки') isJumping = true;

            if (self.newSport.competitionType === 'outdoor') isOutdoor = true;
            else if (self.newSport.competitionType === 'indoor') isIndoor = true;
            else if (self.newSport.competitionType === 'nonstadia') isNonstadia = true;

            var processedSportInfo = {
                id: self.newSport.id,
                typeName: self.newSport.typeName,
                recordMale: self.newSport.recordMale,
                recordFemale: self.newSport.recordFemale,
                isJumping: isJumping,
                isRunning: isRunning,
                isThrowing: isThrowing,
                isOutdoor: isOutdoor,
                isIndoor: isIndoor,
                isNonstadia: isNonstadia
            };

            CompetitionService.editSportInfo(processedSportInfo).then(
                function (result) {
                    self.sportTypesList = result.data.types;
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            )
        };

        self.showCreateSportTypeDialog = function () {
            self.newSport = {};

            $mdDialog.show({
                contentElement: '#addSportDialog',
                clickOutsideToClose: true
            });
        };

        self.showEditSportTypeDialog = function (sport) {
            self.newSport = sport;

            if(sport.isRunning) self.newSport.sportType = 'Біг';
            else if(sport.isThrowing) self.newSport.sportType = 'Метання';
            else if(sport.isJumping) self.newSport.sportType = 'Стрибки';

            if(sport.isIndoor) self.newSport.competitionType = 'indoor';
            else if(sport.isOutdoor) self.newSport.competitionType = 'outdoor';
            else if(sport.isNonstadia) self.newSport.competitionType = 'nonstadia';

            $mdDialog.show({
                contentElement: '#addSportDialog',
                clickOutsideToClose: true
            });
        };

        function attachTeam(teamId, index) {
            CompetitionService.attachTeamToCompetition($routeParams.competition, teamId).then(
                function (result) {
                },
                function (error) {
                    self.teamsList[index].isAttached = false;
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        }

        //TODO
        function detachTeam(teamId, index) {
            CompetitionService.detachTeamFromCompetition($routeParams.competition, teamId).then(
                function (result) {
                },
                function (error) {
                    self.teamsList[index].isAttached = true;
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        }

        //TODO
        function attachSportsman(sportsmanId, index) {
            CompetitionService.attachSportsmanToTeam($routeParams.competition, self.selectedTeam, sportsmanId).then(
                function (result) {
                },
                function (error) {
                    self.sportsmenList[index].isAttached = false;
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        }

        //TODO
        function detachSportsman(sportsmanId, index) {
            CompetitionService.detachSportsmanFromTeam($routeParams.competition, self.selectedTeam, sportsmanId).then(
                function (result) {
                },
                function (error) {
                    self.sportsmenList[index].isAttached = true;
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        }

        //TODO
        self.attachOrDetachAllTeams = function () {
            self.allTeamsAreAttached = !self.allTeamsAreAttached;

            self.teamsList.map(function (value, index) {
                if (self.allTeamsAreAttached && !value.isAttached) {
                    value.isAttached = true;
                    attachTeam(value.id, index);
                } else if (!self.allTeamsAreAttached && value.isAttached) {
                    value.isAttached = false;
                    detachTeam(value.id, index);
                }
            });
        };

        self.goToCompetitionsList = function () {
            $location.path('/competitions');
        };

        self.goToCompetitionSetupPage = function () {
            $location.path('/competition/setup/step1')
        };

        //TODO
        self.attachOrDetachTeam = function (team, index) {
            team.isAttached ? attachTeam(team.id, index) : detachTeam(team.id, index);
            checkIfAllTeamsAttached();
        };

        //TODO
        self.attachOrDetachSportsman = function (sportsman, index) {
            sportsman.isAttached ? attachSportsman(sportsman.id, index) : detachSportsman(sportsman.id, index);
        };

        //TODO
        function checkIfAllTeamsAttached() {
            self.allTeamsAreAttached = true;
            var detachedTeams = self.teamsList.filter(function (value) {
                return !value.isAttached;
            });
            if (detachedTeams.length > 0) {
                self.allTeamsAreAttached = false;
            }
        }

        self.setEndDate = function () {
            self.isEndDateOpen = false;
            self.newCompetition.endDate = formatDateWithDot(self.endDate);
        };

        self.saveGeneralCompetitionInfo = function () {
            CompetitionService.createCompetition(self.newCompetition).then(
                function (result) {
                    $location.path('/competition/' + result.data.id);
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.saveSportsmanInfo = function () {
            CompetitionService.createSportsman(self.newSportsman).then(
                function (result) {
                    $mdDialog.cancel();
                    self.initSportsmenList(null);
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        };

        self.getResultsList = function () {
            CompetitionService.getResults($routeParams.competition, self.typeOfSportForResults.id).then(
                function (result) {
                    self.resultList = result.data.sportsmen;
                },
                function (error) {
                }
            );
        };

        self.goToResultsList = function () {
            $location.path('/results/' + $routeParams.competition);
        };

        self.goToResultsListWithId = function (id) {
            $location.path('/results/' + id);
        };

        self.displayWriteResultsDialog = function (result) {
            self.newResult = {};
            self.newResult = result.result;
            self.newResult.participant_id = result.id;

            $mdDialog.show({
                contentElement: '#writeResultsDialog',
                clickOutsideToClose: true
            });
        };

        self.closeResultDialog = function () {
            $mdDialog.cancel();
            self.newResult = {};
            self.getResultsList();
        };

        self.goToEditAttemptPage = function (attempt) {
            self.newAttempt = attempt;
            self.isAddNewResultWithAttemptActive = true;
        };

        self.saveDistanceResult = function (attempt) {
            if (attempt.id) {
                CompetitionService.updateDistanceResults(self.newResult.participant_id, self.typeOfSportForResults.id,
                    attempt.id, attempt.attempt, attempt.actualResult).then(
                    function (result) {
                        self.newAttempt = {};
                        self.closeResultDialog();
                        self.isAddNewResultWithAttemptActive = false;
                    },
                    function (error) {
                        UtilService.showAlert(error.data.message, 'Error');
                    }
                );
            } else {
                CompetitionService.writeDistanceResults(self.newResult.participant_id, self.typeOfSportForResults.id,
                    attempt.attempt, attempt.actualResult).then(
                    function (result) {
                        self.newAttempt = {};
                        self.closeResultDialog();
                        self.isAddNewResultWithAttemptActive = false;
                    },
                    function (error) {
                        UtilService.showAlert(error.data.message, 'Error');
                    }
                );
            }
        };

        self.saveTimeResult = function () {
            if (self.newResult.attempts[0].id) {
                CompetitionService.updateTimeResults(self.newResult.participant_id, self.typeOfSportForResults.id,
                    self.newResult.attempts[0].id, self.newResult.attempts[0].resultHours, self.newResult.attempts[0].resultMinutes,
                    self.newResult.attempts[0].resultSeconds, self.newResult.attempts[0].resultMiliseconds).then(
                    function (result) {
                        self.closeResultDialog();
                    },
                    function (error) {
                        UtilService.showAlert(error.data.message, 'Error');
                    }
                );
            } else {
                CompetitionService.writeTimeResults(self.newResult.participant_id, self.typeOfSportForResults.id,
                    self.newResult.attempts[0].resultHours, self.newResult.attempts[0].resultMinutes,
                    self.newResult.attempts[0].resultSeconds, self.newResult.attempts[0].resultMiliseconds).then(
                    function (result) {
                        self.closeResultDialog();
                    },
                    function (error) {
                        UtilService.showAlert(error.data.message, 'Error');
                    }
                );
            }
        };

        function formatDateForRequest(date) {
            return moment(date).format('YYYY-MM-DD');
        }

        self.downloadReport = function () {
            CompetitionService.downloadCompetitionReport($routeParams.competition).then(
                function (result) {
                    var filename = 'TEAMS_SCORE_REPORT-' + formatDateForRequest(new Date()) + '.csv';
                    var linkElement = document.createElement('a');
                    document.body.appendChild(linkElement);
                    try {
                        var blob = new Blob([result.data], {type: 'application/csv'});
                        linkElement.href = window.URL.createObjectURL(blob);
                        linkElement.download = filename;
                        linkElement.click();
                        setTimeout(function () {
                            window.URL.revokeObjectURL(blob);
                        }, 100);
                    } catch (ex) {
                        UtilService.showAlert(ex, 'Exception');
                    }
                },
                function (error) {
                    UtilService.showAlert(error.data.message, 'Error');
                }
            );
        }
    }
);