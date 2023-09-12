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

  function handleGetAdvancedResults(_answers = []) {
    // Bind advanced results based on answers qualifiersand results
    return console.log(
      '_answers, quiz marketAvailability',
      _answers,
      _quizModel.marketAvailability
    );
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
