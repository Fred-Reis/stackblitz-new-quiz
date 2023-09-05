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
      handleGetProductQualifiers(prod, _productKey)?.every((key) =>
        _answers.includes(key)
      )
    );

    return result;
  }

  function handleGetRegularResultsByCategory(_products, _answers, _productKey) {
    let objReturn = {};
    const products = _products.filter((prod) =>
      handleGetProductQualifiers(prod, _productKey)?.every((key) =>
        _answers.includes(key)
      )
    );

    for (const cat of categories) {
      // console.log(cat);
      objReturn[cat.toLowerCase()] = products
        .filter(
          (prod) =>
            prod.quizzAttributes.category.toLowerCase() === cat.toLowerCase()
        )
        .sort(
          (a, b) =>
            b.quizzAttributes?.qualifiers.length -
            a.quizzAttributes?.qualifiers.length
        );
    }
    // for (let i = 0; i < categories.length; i++) {
    // // console.log(categories[i]);
    //   objReturn[categories[i]] = products
    //     .filter((prod) => prod.quizzAttributes.category === categories[i])
    //     .sort(
    //       (a, b) =>
    //         b.quizzAttributes?.qualifiers.length -
    //         a.quizzAttributes?.qualifiers.length
    //     );
    // }

    return objReturn;
  }

  function handleGetQuestionsByID(_questions = []) {
    let questions = [];
    // for (let i = 0; i < questionsID.length; i++) {
    //   const foundQuestion = _questions.find((q) => q._id === questionsID[i]);
    //   questions.push(foundQuestion);
    // }

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
