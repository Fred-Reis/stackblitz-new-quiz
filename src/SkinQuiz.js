import React, { useEffect } from 'react';
import products from './products.json';
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
  categories: ['eye-balm', 'moisturizer', 'treat&prep', 'cleanser', 'spf'],
  quizType: 'skin',
  resultTypes: ['regular', 'advanced'],
  // {...}
};

const MOCK_ANSWERS = [
  [
    {
      type: 'skinType',
      qualifier: 'Dry',
      _id: 'e2cdf941-860e-4bc2-9a1c-ac783a306cb3',
    },
  ],
  [
    {
      type: 'skinTone',
      qualifier: 'Light',
      _id: '579d58e1-c6d0-4430-ab72-76f9ad8e4ca9',
    },
  ],
  [
    {
      type: 'sensitive',
      qualifier: 'No',
      _id: 'da32d895-7c66-4e0e-8247-412c69e449b3',
    },
  ],
  [
    {
      type: 'treat&prep',
      qualifier: 'Clarify acne blemishes',
      _id: 'c21ac12a-ec23-4b7c-b299-e0eda1c28628',
    },
  ],
  [
    {
      type: 'breakouts',
      qualifier: 'Breakouts all time',
      _id: '51c6cf07-335e-4c9c-a288-02c4a9239958',
    },
  ],
];

const MOCK_ANSWERS_ADV = [
  [
    {
      type: 'skinType',
      name: 'Oily',
      _id: '2528e981-5f47-487d-88df-4a1105c75c30',
    },
  ],
  [
    {
      type: 'skinTone',
      name: 'Deep',
      _id: 'e6f49597-28b3-4bbf-afbc-653c4c818702',
    },
  ],
  [
    {
      type: 'sensitive',
      name: 'No',
      _id: 'da32d895-7c66-4e0e-8247-412c69e449b3',
    },
  ],
  [
    {
      type: 'treat&prep',
      name: 'Target under eye area',
      _id: '774415ba-6de6-409f-8ab6-a9ffeb346d50',
    },
    {
      type: 'treat&prep',
      name: 'Minimize blackheads pores',
      _id: '083e100c-ce5c-45ca-880c-0f243b7ddcc1',
    },
    {
      type: 'treat&prep',
      name: 'Improve digestive health',
      _id: '3158f560-6a32-41a9-a7f6-12ccb636c56c',
    },
  ],
  [
    {
      type: 'treat&prep',
      name: 'Puffiness',
      _id: 'bf922a28-8d07-4656-a393-18b470eeee13',
    },
  ],
];

export default function Skin() {
  const productQualifierKey = 'name';
  const answerQualifierKey = 'qualifier';

  const quizz = quizzService(QUIZ_MODEL);

  const foundQuestions = quizz.handleGetQuestionsByID(questions);

  // console.log('SKIN', { foundQuestions });

  // quizz.handleGetRegularResults([]);
  // quizz.handleGetUserAnswers([]);

  const answersArr = quizz.handleGetUserAnswers(
    MOCK_ANSWERS,
    answerQualifierKey
  );

  // const answersAdvArr = quizz.handleGetUserAnswers(
  //   MOCK_ANSWERS_ADV,
  //   productQualifierKey
  // );
  // console.log('SKIN', {answersAdvArr});
  console.log('SKIN', products.length);

  const tiedProducts = quizz.handleGetProductsResultByAnswers(
    products,
    answersArr,
    productQualifierKey
  );

  const catProducts = quizz.handleGetRegularResultsByCategory(
    products,
    answersArr,
    productQualifierKey
  );

  // console.log('SKIN', { tiedProducts });
  console.log('SKIN', { catProducts });
  // console.log(tiedProducts.map((e) => e.quizzAttributes.qualifiers));aazaz

  return (
    <div>
      <h1>Welcome to Skin quiz!</h1>
    </div>
  );
}

function getResultByGoalReference(arr) {
  console.group(
    '%c =======>  QUIZ  <========',
    'background-color: #38C6D9; color: #fff',
    'QUIZ'
  );
  console.log({ arr });
  console.log({ multipleChoiceState });
  console.log({ answerState });
  // console.log({sqAdvancedResults})
  // console.log({sqAdvancedResults})
  console.groupEnd();
  var idxForReference =
    arr.length > 1 &&
    arr.reduce((acc, ele) => {
      ele.qualifiers.forEach((el) => {
        el.name.includes('goal') ? (acc = +el.name.split('-')[1]) : null;
      });
      return acc;
    }, '');

  // name of the reference goal
  var referenceGoal =
    multipleChoiceState[idxForReference - 1]?.answersQualifiers[0].name;

  // name of the reference qualifier for goal element
  var referenceQualifier =
    !![
      ...arr.filter((ele) =>
        ele?.qualifiers?.some(
          (el) => el.name === multipleChoiceState[0]?.answersQualifiers[0]?.name
        )
      ),
    ].find((el) => el.qualifiers.some((e) => e.name.includes('goal'))) &&
    multipleChoiceState[0]?.answersQualifiers[0].name;

  // check if the reference is at 1st in multipleChoice

  console.log({ referenceQualifier });

  if (
    multipleChoiceState[0]?.answersQualifiers[0].name === referenceQualifier
  ) {
    // check if there's a product for the reference goal and this one doesn't contain goal in its qualifiers return product for the reference goal
    // console.log('jumping into the #1 if qualifier 1st pos');
    if (
      arr.filter((ele) =>
        ele.qualifiers.some((el) => el.name === referenceGoal)
      ).length > 0 &&
      arr
        .filter((ele) =>
          ele.qualifiers.some((el) => el.name === referenceGoal)
        )[0]
        ?.qualifiers?.some((e) => !e.name.includes('goal'))
    ) {
      // console.log(
      //   'jumping into the #2 if return prod if is okay without goals'
      // );
      return arr
        .filter((ele) => ele.qualifiers.some((el) => el.name === referenceGoal))
        .filter((el) => !el.qualifiers.some((e) => e.name.includes('goal')));
      // else return an array of products without goal in their qualifier
    } else {
      // console.log('jumping into the else return prod filtered without goal');
      return arr.filter(
        (el) => !el.qualifiers.some((e) => e.name.includes('goal'))
      );
    }
    //valition to check if there's a product for 1st position in multipleChoice and this one doesn't contain goal in its qualifiers and return the product for this qualifier
  } else if (
    arr.filter((ele) =>
      ele.qualifiers.some(
        (el) => el.name === multipleChoiceState[0]?.answersQualifiers[0].name
      )
    ).length > 0 &&
    !!arr
      .filter((ele) =>
        ele.qualifiers.some(
          (el) => el.name === multipleChoiceState[0]?.answersQualifiers[0].name
        )
      )[0]
      ?.qualifiers?.some((e) => !e.name.includes('goal'))
  ) {
    // return the product for the qualifier at the first position in multipleChoiceState
    // console.log(
    //   'jumping into the else if to return product for 1st position multichoice'
    // );
    return arr
      .filter((ele) =>
        ele.qualifiers.some(
          (el) => el.name === multipleChoiceState[0]?.answersQualifiers[0].name
        )
      )
      .filter((el) => !el.qualifiers.some((e) => e.name.includes('goal')));
  } else {
    // console.log(
    //   'jumping into the last else to return prod filtered without goal'
    // );
    return arr.filter(
      (el) => !el.qualifiers.some((e) => e.name.includes('goal'))
    );
  }
}
