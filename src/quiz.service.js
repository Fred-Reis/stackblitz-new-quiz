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

  function handleGetProductsResultByAnswers(_products, _answers, _key) {
    const result = _products.filter((prod) =>
      handleGetProductQualifiers(prod, _key)?.every(
        (key) => _answers.includes(key) || key.includes('goal')
      )
    );

    return result;
  }

  function handleGetRegularResultsByCategory(
    _products,
    _answers,
    _key,
    _multipleChoice
  ) {
    let objReturn = {};

    const products = handleGetProductsResultByAnswers(
      _products,
      _answers,
      _key
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
            _key,
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

  function getResultByGoalReference(_arr, _key, _multipleChoice) {
    const idxForReference = handleGetProductQualifiers(_arr[0], _key)
      .find((el) => el.includes('goal'))
      .split('-')[1];

    const referenceGoal =
      _multipleChoice.length >= idxForReference
        ? _multipleChoice[idxForReference - 1]?.answersQualifiers[0]?.name
        : _multipleChoice.at(-1)?.answersQualifiers[0]?.name;

    return handleGetProductsResultByAnswers(
      _arr,
      [referenceGoal.toLowerCase()],
      _key
    ).filter(
      (res) =>
        !handleGetProductQualifiers(res, _key).some((e) => e.includes('goal'))
    );
  }

  function handleGetAdvancedResults(
    _advancedArr,
    _answers,
    _results,
    _coreRoutine,
    _multipleChoice,
    _key = 'name'
  ) {
    let arrResult = [];

    _advancedArr.forEach((adv) => {
      const hasGoalRef = adv?.quizzAttributes?.qualifiers?.some((e) =>
        e[_key].includes('goal')
      );

      if (hasGoalRef) {
        let idxForReference = '';

        adv.quizzAttributes.qualifiers.forEach((e) =>
          e[_key].includes('goal')
            ? (idxForReference = +e[_key].split('-')[1])
            : null
        );

        const referenceGoal =
          _multipleChoice.length >= idxForReference
            ? _multipleChoice[idxForReference - 1]?.answersQualifiers[0]?.name
            : _multipleChoice.at(-1)?.answersQualifiers[0]?.name;

        const hasProductByReference = _results
          .filter((ele) =>
            ele.quizzAttributes.qualifiers?.some(
              (el) => el.name.toLowerCase() === referenceGoal.toLowerCase()
            )
          )[0]
          ?.quizzAttributes.qualifiers?.some((e) => !e.name.includes('goal'));

        if (hasProductByReference) {
          let returnObj = _results
            .filter((ele) =>
              ele.quizzAttributes.qualifiers?.some(
                (el) => el.name.toLowerCase() === referenceGoal.toLowerCase()
              )
            )
            .filter(
              (el) =>
                !el.quizzAttributes.qualifiers?.some((e) =>
                  e.name.includes('goal')
                )
            )[0];

          returnObj.quizzAttributes.goalReferenceQualifier = referenceGoal;
          returnObj.quizzAttributes.priorityOrder =
            adv.priorityOrder || idxForReference;
          returnObj.quizzAttributes.goalReferenceValue = idxForReference;

          arrResult.unshift(returnObj);

          return returnObj;
        }
      } else {
        return arrResult.push(adv);
      }

      return arrResult;
    });

    arrResult = arrResult.reduce((acc, ele) => {
      const includeExternalID = [
        ...Object.keys(_coreRoutine).map(
          (item) => _coreRoutine[item][0]?.externalId
        ),
      ].includes(ele?.externalId);

      const coverAllAnswers = ele.quizzAttributes.qualifiers
        .map((el) => el.name.toLowerCase())
        .every((item) => _answers.includes(item.toLowerCase()));

      !includeExternalID && coverAllAnswers ? acc.push(ele) : null;
      return acc;
    }, []);

    arrResult = arrResult.sort(
      (a, b) =>
        a.quizzAttributes.priorityOrder - b.quizzAttributes.priorityOrder
    );

    function uniq(data, key) {
      return [...new Map(data.map((x) => [key(x), x])).values()];
    }

    return uniq(arrResult, (it) => it?.externalId);
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
