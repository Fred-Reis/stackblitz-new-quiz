export default function quizService(_quizModel = {}) {
  const { categories, questionsID } = _quizModel;

  function handleGetAnswersQualifiers(_answers = [], _key) {
    const answers = _answers.flat().map((e) => e[_key].toLowerCase());

    return answers;
  }

  function handleGetProductQualifiers(_product = [], _key) {
    const answers = _product.quizzAttributes?.qualifiers.map((e) =>
      e[_key].toLowerCase()
    );

    return answers;
  }

  function handleGetProductsResultByAnswers(_products, _answers, _productKey) {
    console.log('FUNC', { _products });
    console.log('FUNC', { _answers });
    console.log('FUNC', { _productKey });
    const result = _products.filter((prod) =>
      handleGetProductQualifiers(prod, _productKey)?.every(
        (key) => _answers.includes(key) || key.includes('goal')
      )
    );

    return result;
  }

  function handleGetRegularResultsByCategory(
    _products,
    _answers,
    _productKey,
    _multipleChoice
  ) {
    let objReturn = {};

    const products = handleGetProductsResultByAnswers(
      _products,
      _answers,
      _productKey
    );

    console.log('SERVICE', { products });
    console.log('SERVICE', { _answers });

    for (const cat of categories) {
      objReturn[cat.toLowerCase()] = products
        .filter(
          (prod) =>
            prod?.quizzAttributes?.category.toLowerCase() === cat.toLowerCase()
        )
        .sort(
          (a, b) =>
            b?.quizzAttributes?.qualifiers.length -
            a?.quizzAttributes?.qualifiers.length
        );

      const includesGoalOnFirstResult = objReturn[
        cat.toLowerCase()
      ][1]?.quizzAttributes?.qualifiers?.some((q) => q.name.includes('goal'));

      objReturn[cat.toLowerCase()] = includesGoalOnFirstResult
        ? getResultByGoalReference(
            objReturn[cat.toLowerCase()],
            _productKey,
            _multipleChoice
          )
        : objReturn[cat.toLowerCase()];
    }

    return objReturn;
  }

  function handleGetQuestionsByID(_questions = []) {
    let questions = [];

    for (const question of questionsID) {
      const foundQuestion = _questions.find((q) => q._id === question);
      questions = [...questions, foundQuestion];
    }

    return questions;
  }

  function handleGetUserAnswers(_answers, key) {
    return handleGetAnswersQualifiers(_answers, key);
  }

  function handleGetAdvancedResults(_answers = []) {
    // Bind advanced results based on answers qualifiersand results
    return console.log(
      '_answers, quiz marketAvailability',
      _answers,
      _quizModel.marketAvailability
    );
  }

  function getResultByGoalReference(_arr, _productKey, _multipleChoice) {
    console.log({ _arr });
    console.log({ _multipleChoice });
    // console.log({ answerState });
    // console.log({sqAdvancedResults})
    // console.log({sqAdvancedResults})
    var idxForReference = handleGetProductQualifiers(_arr[0], _productKey)
      .find((el) => el.includes('goal'))
      .split('-')[1];

    // var idxForReference =
    //   _arr.length > 1 &&
    //   _arr.reduce((acc, ele) => {
    //     ele.quizzAttributes?.qualifiers.forEach((el) => {
    //       el.name.includes('goal') ? (acc = +el.name.split('-')[1]) : null;
    //     });
    //     return acc;
    //   }, '');

    console.log('SERVICE', { idxForReference });

    // name of the reference goal
    var referenceGoal =
      _multipleChoice.length >= idxForReference
        ? _multipleChoice[idxForReference - 1]?.answersQualifiers[0]?.name
        : _multipleChoice.at(-1)?.answersQualifiers[0]?.name;

    console.log('SERVICE', { referenceGoal });

    return handleGetProductsResultByAnswers(
      _arr,
      [referenceGoal.toLowerCase()],
      _productKey
    ).filter(
      (res) =>
        !handleGetProductQualifiers(res, _productKey).some((e) =>
          e.includes('goal')
        )
    );

    // name of the reference qualifier for goal element
    // var referenceQualifier =
    //   !![
    //     ..._arr.filter((ele) =>
    //       ele?.quizzAttributes?.qualifiers?.some(
    //         (el) => el.name === _multipleChoice[0]?.answersQualifiers[0]?.name
    //       )
    //     ),
    //   ].find((el) => el.qualifiers.some((e) => e.name.includes('goal'))) &&
    //   _multipleChoice[0]?.answersQualifiers[0]?.name;

    // check if the reference is at 1st in multipleChoice

    // if (_multipleChoice[0]?.answersQualifiers[0]?.name === referenceQualifier) {
    //   // check if there's a product for the reference goal and this one doesn't contain goal in its qualifiers return product for the reference goal
    //   // console.log('jumping into the #1 if qualifier 1st pos');
    //   if (
    //     _arr.filter((ele) =>
    //       ele.qualifiers.some((el) => el.name === referenceGoal)
    //     ).length > 0 &&
    //     _arr
    //       .filter((ele) =>
    //         ele.qualifiers.some((el) => el.name === referenceGoal)
    //       )[0]
    //       ?.qualifiers?.some((e) => !e.name.includes('goal'))
    //   ) {
    //     // console.log(
    //     //   'jumping into the #2 if return prod if is okay without goals'
    //     // );
    //     return _arr
    //       .filter((ele) =>
    //         ele.qualifiers.some((el) => el.name === referenceGoal)
    //       )
    //       .filter((el) => !el.qualifiers.some((e) => e.name.includes('goal')));
    //     // else return an array of products without goal in their qualifier
    //   } else {
    //     // console.log('jumping into the else return prod filtered without goal');
    //     return _arr.filter(
    //       (el) => !el.qualifiers.some((e) => e.name.includes('goal'))
    //     );
    //   }
    //   //valition to check if there's a product for 1st position in multipleChoice and this one doesn't contain goal in its qualifiers and return the product for this qualifier
    // } else if (
    //   _arr.filter((ele) =>
    //     ele.qualifiers.some(
    //       (el) => el.name === _multipleChoice[0]?.answersQualifiers[0]?.name
    //     )
    //   ).length > 0 &&
    //   !!_arr
    //     .filter((ele) =>
    //       ele.qualifiers.some(
    //         (el) => el.name === _multipleChoice[0]?.answersQualifiers[0]?.name
    //       )
    //     )[0]
    //     ?.qualifiers?.some((e) => !e.name.includes('goal'))
    // ) {
    //   // return the product for the qualifier at the first position in _multipleChoice
    //   // console.log(
    //   //   'jumping into the else if to return product for 1st position multichoice'
    //   // );
    //   return _arr
    //     .filter((ele) =>
    //       ele.qualifiers.some(
    //         (el) => el.name === _multipleChoice[0]?.answersQualifiers[0]?.name
    //       )
    //     )
    //     .filter((el) => !el.qualifiers.some((e) => e.name.includes('goal')));
    // } else {
    //   // console.log(
    //   //   'jumping into the last else to return prod filtered without goal'
    //   // );
    //   return _arr.filter(
    //     (el) => !el.qualifiers.some((e) => e.name.includes('goal'))
    //   );
    // }
  }

  return {
    handleGetUserAnswers: handleGetUserAnswers,
    handleGetQuestionsByID: handleGetQuestionsByID,
    handleGetAdvancedResults: handleGetAdvancedResults,
    handleGetAnswersQualifiers: handleGetAnswersQualifiers,
    handleGetProductQualifiers: handleGetProductQualifiers,
    handleGetProductsResultByAnswers: handleGetProductsResultByAnswers,
    handleGetRegularResultsByCategory: handleGetRegularResultsByCategory,
  };
}
