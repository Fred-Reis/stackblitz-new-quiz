import React, { useEffect } from 'react';
import products from './products.json';
import concProducts from './concealerResults.json';
// import advProducts from './advancedProducts.json';
import advProducts from './newAdv.json';
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
      name: 'Dry',
      _id: 'e2cdf941-860e-4bc2-9a1c-ac783a306cb3',
    },
  ],
  [
    {
      type: 'skinTone',
      name: 'Light',
      _id: '579d58e1-c6d0-4430-ab72-76f9ad8e4ca9',
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
      name: 'Clarify acne blemishes',
      _id: 'c21ac12a-ec23-4b7c-b299-e0eda1c28628',
    },
  ],
  [
    {
      type: 'treat&prep',
      name: 'Protect from sun damage',
      _id: 'c21ac12a-ec23-4b7c-b299-e0eda1c28628',
    },
  ],
  [
    {
      type: 'breakouts',
      name: 'Breakouts all time',
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
      name: 'Protect from sun damage',
      _id: 'b15d6ad1-4a35-498d-b4d6-5ce25b35b810',
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

const MOCK_MULTIPLE = [
  {
    answersQualifiers: [
      {
        type: 'treat&prep',
        name: 'Target under eye area',
        _id: '774415ba-6de6-409f-8ab6-a9ffeb346d50',
      },
    ],
    questionType: 'Primary Goal',
    subQuestion: {
      questionText: 'What would you like to address around your eyes?',
      name: 'sub-under-eye',
      answers: [
        {
          answersQualifiers: [
            {
              type: 'treat&prep',
              name: 'Dark circles',
              _id: 'fbcefd67-6552-436f-a8d8-632bcd26a4fe',
            },
          ],
          subQuestion: null,
          name: 'dark-circles',
          answerText: 'Dark circles',
          _id: '7a758495-f03d-41dd-a72b-b61196f0d5ff',
        },
        {
          answersQualifiers: [
            {
              type: 'treat&prep',
              name: 'Dryness',
              _id: 'a5ef1114-64db-4075-af13-1c4fb3fe7a9a',
            },
          ],
          questionType: 'Primary Goal',
          subQuestion: null,
          images: [],
          name: 'dryness',
          answerText: 'Dryness',
          _id: 'f161e9bb-8b7c-41cb-ac44-45363a8260b6',
        },
        {
          answersQualifiers: [
            {
              type: 'treat&prep',
              name: 'Fine lines wrinkles',
              _id: 'c0900952-1e84-4621-99e7-43c1f7e74b5d',
            },
          ],
          subQuestion: null,
          name: 'fine-lines-wrinkles',
          answerText: 'Fine lines & wrinkles',
          _id: 'b2ebe9cf-045f-4693-9352-37c3d148f328',
        },
        {
          answersQualifiers: [
            {
              type: 'treat&prep',
              name: 'Puffiness',
              _id: 'bf922a28-8d07-4656-a393-18b470eeee13',
            },
          ],
          subQuestion: null,
          name: 'puffiness',
          answerText: 'Puffiness',
          _id: 'fbf401d3-28b5-4dcf-823c-15cba7990ce3',
        },
      ],
      _id: '1c8b3ab5-d512-4d89-9932-5502e88842d2',
    },
    images: [],
    name: 'target-under-eye-area',
    answerText: 'Target under-eye area',
    _id: 'f070bf3f-170b-4588-b6cd-ddd7f71cec00',
  },
  {
    answersQualifiers: [
      {
        type: 'treat&prep',
        name: 'Protect from sun damage',
        _id: 'b15d6ad1-4a35-498d-b4d6-5ce25b35b810',
      },
    ],
    questionType: 'Primary Goal',
    subQuestion: null,
    images: [],
    name: 'protect-from-sun-damage',
    answerText: 'Protect from sun damage',
    _id: 'f99d6d26-c7aa-4b65-b152-d317b03b4f91',
  },
  {
    answersQualifiers: [
      {
        type: 'treat&prep',
        name: 'Improve digestive health',
        _id: '3158f560-6a32-41a9-a7f6-12ccb636c56c',
      },
    ],
    questionType: 'Primary Goal',
    subQuestion: null,
    images: [],
    name: 'improve-digestive-health',
    answerText: 'Improve digestive health',
    _id: 'fae2e82d-7a49-4b76-afed-b6f59ff32ebb',
  },
];

export default function Skin() {
  const productQualifierKey = 'name';
  const answerQualifierKey = 'qualifier';

  const quizz = quizzService(QUIZ_MODEL);

  const foundQuestions = quizz.handleGetQuestionsByID(questions);

  const answersArr = quizz.handleGetUserAnswers(
    MOCK_ANSWERS,
    productQualifierKey
  );

  const answersAdvArr = quizz.handleGetUserAnswers(
    MOCK_ANSWERS_ADV,
    productQualifierKey
  );

  const tiedProducts = quizz.handleGetProductsResultByAnswers(
    products,
    answersArr,
    productQualifierKey
  );

  const catProducts = quizz.handleGetRegularResultsByCategory(
    products,
    answersArr,
    productQualifierKey,
    MOCK_MULTIPLE
  );

  const advRoutine = quizz.handleGetAdvancedResults(
    advProducts,
    answersAdvArr,
    products,
    catProducts,
    MOCK_MULTIPLE
  );

  console.log('SKIN', { advRoutine });
  console.log('SKIN', { catProducts });
  // console.log(tiedProducts.map((e) => e.quizzAttributes.qualifiers));aazaz

  return (
    <div>
      <h1>Welcome to Skin quiz!</h1>
    </div>
  );
}

// const test = advProducts?.map((ele) => {
//   const newValue = { ...structuredClone(ele?.productRecommended) };
//   newValue.quizzAttributes = {
//     qualifiers: ele.qualifiers,
//     category: ele.category,
//     default: ele.default,
//     priorityOrder: ele.priorityOrder,
//   };

//   delete newValue.qualifiers;
//   delete newValue.priorityOrder;
//   delete newValue.category;
//   delete newValue.default;
//   delete newValue.productRecommended;
//   delete newValue.metafields;

//   return newValue;
// });

// console.log({ test });
// console.log(JSON.stringify(test));
