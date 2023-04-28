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
    const uniqueIngredients = new Set();
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
      apiKey: "",
    }), {
      method: "GET",
      headers: { "Content-Type": "application/json",
     },
    }).then((response) => response.json())
    .then((data) => {
      const whitelist = new Set(["Dried Fruits;Produce;Baking","Spices and Seasonings","Savory Snacks", "Ethnic Foods;Health Foods", "Cereal  "]);
      const filteredRecipes = [];
      for (var recipeIndex in data) {
        var recipe = data[recipeIndex]
        var validRecipe = true;
        for(var missingIngredientIndex in recipe["missedIngredients"]) {
          var missingIngredient = recipe["missedIngredients"][missingIngredientIndex];
          if(!whitelist.has(missingIngredient["aisle"])) {
            console.log(missingIngredient["name"]);
            console.log(missingIngredient["aisle"]);
            validRecipe = false;
            break;
          }
        }
        if(validRecipe) {
          filteredRecipes.push(recipe);
        }
      }
      console.log(filteredRecipes);
      setIngredients(ingredientParam);
      setRecipes(filteredRecipes);
    });;
  };

  return (
    <div><Header />
    <div class="card-component grid">
        
      {fridges.map((fridge) => (
        <Card
          key={fridge.doc_id}
          data={fridge}
          style={{ width: "18rem" }}
          class="card fridge-card"
        >
          <Card.Body>
            <Card.Title>
              {fridge.name}{" "}
            </Card.Title>
            <ListGroup.Item>
              Ingredients: {ingredient}
            </ListGroup.Item>
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
