import React, { useState, useEffect } from "react";
import MDAnswer from "../components/MDAnswer";
import MDQuestion from "../components/MDQuestion";
import fakeResults from "../data/results.json";
import fakeRecipe from "../data/recipe.json";

import { Switch, Route, Redirect, useHistory } from "react-router-dom";

//Using functional component
const Main = ({ url }) => {
  //cache data to show similiar recipes
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("allRecipes")) || []
  );
  const [recipe, setRecipe] = useState(
    JSON.parse(localStorage.getItem("recipe")) || []
  );

  const [recipeId, setRecipeId] = useState(null);
  const [preference, setPreference] = useState({
    mealType: null,
    maxReadyTime: null,
    cuisine: null,
  });

  const [pantry] = useState(JSON.parse(localStorage.getItem("pantry")) || []);
  const [showAns, setShowAns] = useState(false);

  //for infinite scroll
  const [totalResultLength, setTotalResultLength] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  //Does all the fetch recipes.
  const fetchRecipes = (offset = 0) => {
    const { mealType, maxReadyTime, cuisine } = preference;
    return fetch(
      `https://api.spoonacular.com/recipes/complexSearch?cuisine=${cuisine}&includeIngredients=&maxReadyTime=${maxReadyTime}&instructionsRequired=true&type=${mealType}&offset=${offset}&apiKey=${process.env.REACT_APP_APIKEY}`
    ).then((res) => {
      return res.status > 300 //use fakeresults if no api key too
        ? fakeResults
        : res.json();
    });
  };

  //fetch more recipes for infinite scroll
  const fetchMoreData = () => {
    console.log(data.length, totalResultLength);
    if (data.length >= totalResultLength) {
      setHasMore(false);
      return;
    }
    const newOffset = data.length;
    setOffset(newOffset);
    fetchRecipes(newOffset).then((json) => {
      const newData = json.results;
      console.log(json);
      setData([...data, ...newData]);
    });
  };

  useEffect(() => {
    const { mealType, maxReadyTime, cuisine } = preference;
    //Only fetch if all not null
    if (mealType && maxReadyTime && cuisine) {
      //string all the ingredients seperated by comma
      //TODO check why api returning zero results if stringPantry have many items. I think it only returns recipe that use all the ingredients under "includeIngredients"
      // const stringPantry = pantry.map((item) => `${item.name}`).join(",");
      fetchRecipes(0).then((json) => {
        console.log(json);
        setTotalResultLength(json.totalResults);
        let newData = {};
        newData = json.results || fakeResults.results;

        if (newData?.length > 0) {
          //set state of data
          setData(newData);
          localStorage.setItem("allRecipes", JSON.stringify(newData));

          const randomRecipe =
            newData[Math.floor(Math.random() * newData.length)];
          setRecipeId(randomRecipe.id);
        }
        //TODO: Ask question again if no result.
      });
    }
  }, [preference]);

  //fetch recipe information if recipeid gets updated.
  useEffect(() => {
    //only fetch when recipeId is != null. Without this, fakerecipe overwrites cache recipe on start.
    if (recipeId) {
      fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${process.env.REACT_APP_APIKEY}`
      )
        .then((res) => {
          return res.status > 300 ? fakeRecipe : res.json();
        })
        .then((json) => {
          setRecipe(json);
          localStorage.setItem("recipe", JSON.stringify(json));
          setShowAns(true);
        });
    }
  }, [recipeId]);

  const history = useHistory();
  const handleEdit = () => {
    history.push(`${url}/qn`);
    //Set to question screen when edit button is clicked
    setShowAns(false);
  };

  const handleSave = () => {
    let savedRecipes = [];
    //if localstorage has saved recipes, add it in and set state, else add it in
    if (localStorage.getItem("savedRecipes")) {
      const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
      savedRecipes.push(recipe);
      localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
    } else {
      savedRecipes.push(recipe);
      localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
    }
  };

  const handleUnsave = () => {
    console.log(recipe);
    let savedRecipes = [];
    if (localStorage.getItem("savedRecipes")) {
      const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
      let filteredRecipes = savedRecipes.filter(
        (item) => item.id !== recipe.id
      );
      console.log(filteredRecipes);
      localStorage.setItem("savedRecipes", JSON.stringify(filteredRecipes));
    }
  };

  const isSavedRecipe = localStorage.getItem("savedRecipes")
    ? JSON.parse(localStorage.getItem("savedRecipes")).filter(
        (item) => item.id === recipe.id
      ).length
    : 0;

  const handleAnother = () => {
    //randomise recipe onclick another
    if (data) {
      const randomRecipe = data[Math.floor(Math.random() * data.length)];
      console.log(randomRecipe);
      localStorage.setItem("recipe", JSON.stringify(randomRecipe));
      setRecipeId(randomRecipe.id);
    } else {
      handleEdit(); //ask user to key in preference again
    }
  };

  const handleChangecard = (id) => {
    setRecipeId(id);
  };

  //ONLY if showAns (a question is asked), redirect to ans page
  //TODO redirect user from answer to qns if recipe is null
  return (
    <div>
      {showAns && <Redirect to={{ pathname: `${url}/answer` }} />}
      <Switch>
        <Route path={`${url}/answer`}>
          <MDAnswer
            recipe={recipe}
            isSavedRecipe={isSavedRecipe}
            onEdit={handleEdit}
            onSave={handleSave}
            onUnsave={handleUnsave}
            onAnother={handleAnother}
            allRecipes={data}
            changeCard={handleChangecard}
            fetchMoreData={fetchMoreData}
            hasMore={hasMore}
          />
        </Route>

        <Route path={`${url}/qn`}>
          <MDQuestion setPreference={setPreference} />
        </Route>

        <Route exact path={`${url}`}>
          <Redirect to={{ pathname: `${url}/qn` }} />
        </Route>
      </Switch>
    </div>
  );
};

export default Main;
