const { Quiz, Tag } = require('../models');

const quizzController = {

  quizzPage: async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await Quiz.findByPk(quizId,{
        include: [
          { association: 'author'},
          { association: 'questions', include: ['answers', 'level']},
          { association: 'tags'}
        ]
      });
      // if (!req.session.user) {
      //   return res.render('quiz', {quiz});
      // }
      res.render('play_quiz', {quiz});
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  listByTag: async (req, res) => {
    // plutot que de faire une requete compliquée
    // on va passer par le tag, et laisser les relations de Sequelize faire le taf !
    try {
      const tagId = parseInt(req.params.id);
      const tag = await Tag.findByPk(tagId,{
        include: [{
          association: 'quizzes',
          include: ['author']
        }]
      });
      const quizzes = tag.quizzes;
      res.render('index', { quizzes });
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  },

  quizzCompare: async (req, res) => {
    // console.log(req.body)
    // Tableau nombre / ou bonnes reponses ?
    let goodAnswers = 0;
    let badAnswers = 0;
    //let goodAnswers = [];
    
    try {
      //recuperation reponse utilisateur
    const userResponses = Object.values(req.body);
    console.log(userResponses);
    const questionId = Object.keys(req.body);
    console.log(questionId);
    for (let index = 0; index < userResponses.length; index++) {
      if (userResponses[index] == questionId[index]) {
        goodAnswers ++;
        console.log(`${goodAnswers} bonnes reponses`);
      };
      if (userResponses[index] !== questionId[index]) { 
        badAnswers ++;
        console.log(`${badAnswers} mauvaises reponse`);
      };
      
    }
      const quizId = parseInt(req.params.id);
      const quiz = await Quiz.findByPk(quizId,{
        include: [
          { association: 'author'},
          { association: 'questions', include: ['answers', 'level']},
          { association: 'tags'}
        ]
      });
      // if (!req.session.user) {
      //   return res.render('quiz', {quiz});
      // }
      res.render('resultat', {goodAnswers, quiz, userResponses});
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
    // donne l id de la question 
    
    // donne  1,2,3,4 en fonction de la reponce choisi
    // const tata = Rid[0]; 
    // const toto = Qid[0];
    // console.log(Qid);
    // console.log(Rid);
    // const question = await Question.findByPk(toto,{where: {answer_id : tata}});
    // const answer = await Answer.findByPk(tata, {where: {question_id : toto}});
    // console.log(question);
    // console.log(answer.question_id);
    
  }
};

module.exports = quizzController;