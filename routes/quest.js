var express = require('express');
var fs = require('fs');
var utils = require('../utils/quest-utils');
var cache = require('memory-cache');

var router = express.Router();

router.get('/start', function(req, res, next) {
    if(req.session.unAsweredQuestions){
        res.send({isNew:false,name:req.session.username});
    }else{
		res.send({isNew:true,name:''});
	}
});

router.get('/recover', function(req, res, next) {
    if(req.session.savedScore){
		req.session.score = req.session.savedScore;
        res.send({unAsweredQuestions:req.session.unAsweredQuestions,answeredQuestions:req.session.answeredQuestions,score:req.session.score});
    }else{
        res.send({unAsweredQuestions:[],answeredQuestions:[],score:0});
    }
});

router.get('/finalScore', function(req, res, next) {
    if(req.session.score){
        res.send({score:req.session.score});
    }else{
        res.send({score:0});
    }
});

router.get('/restartQuiz', function(req, res, next) {
    req.session.savedScore = 0;
    req.session.score = 0;
    req.session.unAsweredQuestions = null;
    req.session.answeredQuestions = null;
    res.send({status: 'ok'});
});

/* GET All Questions */
router.get('/getQuest', function(req, res, next) {
    req.session.username = req.query.name;
	req.session.savedScore = req.session.score;
	req.session.score = 0;
    var answer = cache.get('angularQuiz');
    if(answer){
        res.send(answer);
    }else{
        fs.readFile('./data/quests/angular-quiz.json', 'utf8', function (err, data) {
            if (err) throw err; // we'll not consider error handling for now
            var json = utils.shuffle(JSON.parse(data));
            cache.put('angularQuiz', json);
            res.send(json);
        });
    }
});

router.post('/checkAnswer', function(req, res, next) {
    var answers = cache.get('angularQuizAnswers');
    if (!answers){
        fs.readFile('./data/answers/angular-quiz.json', 'utf8', function (err, data) {
            if (err) throw err; // we'll not consider error handling for now
            var json = JSON.parse(data);
            cache.put('angularQuizAnswers', json);
            sendResponse(json);
        });
    }else{
        sendResponse(answers);
    }
    function sendResponse (ans){
        var correct = [];
        ans.map(function(a){
            if(req.body.id=== a.id){
                correct = a.correctIndex;
            }
        });
        req.session.unAsweredQuestions = req.body.unAsweredQuestions;
        req.session.answeredQuestions = req.body.answeredQuestions;
        if(utils.isArraysEqual(req.body.selectedAnswers,correct)){
            req.session.score += 6;
        }else{
            req.session.score += utils.getPartialAnswerPoints(req.body.selectedAnswers,correct);
        }
        res.send({"status":'done',"correctAnswers":correct,score:req.session.score});
    }
});

module.exports = router;
