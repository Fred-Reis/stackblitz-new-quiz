import React from 'react';
import concProducts from './concealerResults.json';
import questions from './questions.json';

import './style.css';

import quizzService from './quiz.service';

const QUIZ_MODEL = {
  quizID: 'XYZ',
  marketAvailability: ['US'],
  questionsID: [
    'ad3f2510-de17-4fbe-bb7f-782f35d59a50',
    '0229393e-94c8-4ae2-aa8d-8e2b19fad35f',
    'd4c081e3-2b3d-4147-a2e2-cc7ced96133e',
    '4a55e608-c3ee-40ba-92c6-f3e716f6d63c',
  ],
  categories: ['Only'],
  quizType: 'concealer',
  resultTypes: ['regular'],
  // {...}
};

const MOCK_CONC_ANSWERS = [
  [
    {
      name: 'Medium',
      type: 'Concealer',
    },
  ],
  [
    {
      name: 'Medium',
      type: 'Concealer',
    },
  ],
  [
    {
      name: 'Neutral',
      type: 'Concealer',
    },
  ],
  [
    {
      name: 'Neutral',
      type: 'Concealer',
    },
  ],
];

export default function Conc() {
  const productQualifierKey = 'name';
  const answerQualifierKey = 'qualifier';

  const quizz = quizzService(QUIZ_MODEL);

  const foundQuestions = quizz.handleGetQuestionsByID(questions);

  // console.log({ foundQuestions });

  // quizz.handleGetRegularResults([]);
  // quizz.handleGetUserAnswers([]);

  const answersArr = quizz.handleGetUserAnswers(
    MOCK_CONC_ANSWERS,
    productQualifierKey
  );
  console.log({ answersArr });

  const tiedProducts = quizz.handleGetProductsResultByAnswers(
    concProducts,
    answersArr,
    productQualifierKey
  );

  const catProducts = quizz.handleGetRegularResultsByCategory(
    concProducts,
    answersArr,
    productQualifierKey
  );

  console.log('tiedProducts', tiedProducts);
  // console.log('catProducts', catProducts);
  console.log(tiedProducts.map((e) => e.quizzAttributes.qualifiers).flat());

  return (
    <div>
      <h1>Welcome to Conc Quiz!</h1>
    </div>
  );
}

// const test = [
//   {
//     name: 'Protect from sun damage - No Product - goal 2 reference - Treat & Prep',
//     default: false,
//     category: 'treat&prep',
//     qualifiers: [
//       {
//         name: 'goal-2',
//         type: 'goal',
//       },
//       {
//         name: 'Protect from sun damage',
//         type: 'treat&prep',
//       },
//     ],
//     productRecommended: null,
//   },
//   {
//     name: 'Target under-eye area - No Product - goal 2 reference - Treat & Prep',
//     default: false,
//     category: 'treat&prep',
//     qualifiers: [
//       {
//         name: 'goal-2',
//         type: 'goal',
//       },
//       {
//         name: 'Target under eye area',
//         type: 'treat&prep',
//       },
//     ],
//     productRecommended: null,
//   },
// ]?.map((ele) => {
//   const newValue = structuredClone(ele);
//   newValue.quizzAttributes = {
//     qualifiers: ele.qualifiers,
//     category: ele.category,
//     default: ele.default,
//   };

//   delete newValue.qualifiers;
//   delete newValue.category;
//   delete newValue.default;

//   return newValue;
// });

// console.log(JSON.stringify(test))
