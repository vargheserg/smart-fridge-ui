/** @format */

import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../UserContext";
import Card from "react-bootstrap/Card";
import "./Recipe.css";
import ListGroup from "react-bootstrap/ListGroup";
import { getFridgesFromDB } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Navigator from "../../components/navigator/NavigatorComponent";

const Recipe = () => {
  const [userAcc] = useContext(UserContext);
  const [fridges, setFridges] = useState([]);
  const [ingredient, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [show, setShow] = useState(false);

  let navigate = useNavigate();

  // Fridge List

  useEffect(() => {
    const authToken = sessionStorage.getItem("Auth Token");
    const uid = sessionStorage.getItem("uid");
    if (!authToken) {
      navigate("/login");
    } else if (uid && authToken) {
      retrieveFridges(uid);
    }
  }, [userAcc, show]);

  const retrieveFridges = async (uid) => {
    const fridges = await getFridgesFromDB(uid);
    setFridges(fridges);
    var uniqueIngredients = new Set();
    fridges.forEach((fridge) => {
        Object.keys(fridge.items).forEach((ingredient) => {
            uniqueIngredients.add(ingredient);
        })
    });
    retrieveRecipes(uniqueIngredients)
  };

  const retrieveRecipes = async (ingredients) => {
    var ingredientParam = ""
    const delimiter = ",";
    for (const ingredient of ingredients){
      ingredientParam = ingredientParam.concat(ingredient, delimiter)
    }
    ingredientParam = ingredientParam.substring(0, ingredientParam.length - delimiter.length)
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?` + new URLSearchParams({
      ranking: 2,
      ingredients: ingredientParam,
      ignorePantry: false,
      apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
    }), {
      method: "GET",
      headers: { "Content-Type": "application/json",
     },
    }).then((response) => response.json())
    .then((data) => {
      const whitelist = new Set(["Dried Fruits;Produce;Baking","Spices and Seasonings","Savory Snacks", "Ethnic Foods;Health Foods", "Cereal", "Health Foods", "Beverages"]);
      const filteredRecipes = [];
      for (var recipeIndex in data) {
        var recipe = data[recipeIndex]
        var validRecipe = true;
        for(var missingIngredientIndex in recipe["missedIngredients"]) {
          var missingIngredient = recipe["missedIngredients"][missingIngredientIndex];
          if(!whitelist.has(missingIngredient["aisle"])) {
            validRecipe = false;
            break;
          }
        }
        if(validRecipe) {
          filteredRecipes.push(recipe);
        }
      }
      setIngredients(ingredientParam);
      setRecipes(filteredRecipes);
    });;
  };

  return (
    <div><Header />
    <div class="card-component grid">
        
      {recipes.map((recipe) => (
        <Card
          key={recipe.id}
          data={recipe}
          style={{ width: "18rem" }}
          class="card">
          <Card.Body>
            <Card.Img variant="top" src={recipe.image} width="auto" height="175"/>
            <Card.Title>
              {recipe.title}
            </Card.Title>
            {recipe.usedIngredients.map((ingredient) =>
            <ListGroup.Item>
            {ingredient.name} : {ingredient.amount} {ingredient.unit}
            </ListGroup.Item>
            )}
            {recipe.missedIngredients.map((ingredient) =>
            <ListGroup.Item>
            {ingredient.name} : {ingredient.amount} {ingredient.unit}
            </ListGroup.Item>
            )}
          </Card.Body>
        </Card>
      ))}
      <Navigator/>
      <Footer/>
    </div>
    </div>
  );
};

export default Recipe;
