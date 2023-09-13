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
      ][0]?.quizzAttributes?.qualifiers?.some((q) => q.name.includes('goal'));

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

  function getResultByGoalReference(_arr, _productKey, _multipleChoice) {
    var idxForReference = handleGetProductQualifiers(_arr[0], _productKey)
      .find((el) => el.includes('goal'))
      .split('-')[1];

    var referenceGoal =
      _multipleChoice.length >= idxForReference
        ? _multipleChoice[idxForReference - 1]?.answersQualifiers[0]?.name
        : _multipleChoice.at(-1)?.answersQualifiers[0]?.name;

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
  }

  function handleGetAdvancedResults(
    advancedArr,
    answers,
    results,
    coreRoutine,
    multipleChoiceState
  ) {
    let arrResult = [];

    advancedArr.forEach((adv) => {
      // check if there’re any goal reference in advanced qualifiers array
      if (adv.qualifiers?.some((e) => e.name.includes('goal'))) {
        let refIdx = '';

        // routine to get the goal number
        adv.qualifiers.forEach((e) =>
          e.name.includes('goal') ? (refIdx = +e.name.split('-')[1]) : null
        );

        // get the goal qualifier
        var referenceGoal =
          multipleChoiceState[refIdx - 1]?.answersQualifiers[0].name;

        // validation to check if there’re products for the reference qualifier without goal reference in its qualifiers and which cover all answers
        if (
          results.filter((ele) =>
            ele.qualifiers?.some((el) => el.name === referenceGoal)
          ).length > 0 &&
          results
            .filter((ele) =>
              ele.qualifiers?.some((el) => el.name === referenceGoal)
            )[0]
            ?.qualifiers?.some((e) => !e.name.includes('goal'))
        ) {
          // get the product for the reference goal without goal in its qualifiers
          var returnObj = results
            .filter((ele) =>
              ele.qualifiers?.some((el) => el.name === referenceGoal)
            )
            .filter(
              (el) => !el.qualifiers?.some((e) => e.name.includes('goal'))
            )[0];

          returnObj.goalReferenceQualifier = referenceGoal;
          returnObj.priorityOrder = adv.priorityOrder;
          returnObj.goalReferenceValue = refIdx;

          arrResult.push(returnObj);

          return returnObj;
        }
      } else {
        return arrResult.push(adv);
      }

      return arrResult;
    });

    // checking if the advanced results weren't shown yet and if the product covers all the answers
    arrResult = arrResult.reduce((acc, ele) => {
      ![
        ...Object.keys(coreRoutine).map(
          (item) => coreRoutine[item][0]?.productRecommended?.externalId
        ),
      ].includes(ele?.productRecommended?.externalId) &&
      ele.qualifiers
        .map((el) => el.name.toLowerCase())
        .every((item) => answers.includes(item.toLowerCase()))
        ? acc.push(ele)
        : null;
      return acc;
    }, []);

    // ordering by priorityOrder
    arrResult = arrResult.sort((a, b) => a.priorityOrder - b.priorityOrder);

    // function to remove duplicated products
    function uniq(data, key) {
      return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    // return arrResult;
    return uniq(arrResult, (it) => it.productRecommended?.externalId);
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
