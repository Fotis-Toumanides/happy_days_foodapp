import { useEffect, useState, useContext } from "react";
import MealItem from "./mealItem";

export default function Meals() {
    const [loadedMeals, setLoadedMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        async function fetchMeals(){
            setIsLoading(true)

            const response = await fetch('http://localhost:3000/meals');

            
            const meals = await response.json();

            if(!response.ok){
                throw new Error(meals.message || "Can't establish connection with the kitchen");
                /* setIsLoading(false);
                return(<Error title="Failed to fetch meals" message="Can't establish connection with the kitchen"/>) */
            }
            setLoadedMeals(meals);
            setIsLoading(false);
        }
            fetchMeals();
            return
    },[])
    
    return(
        <ul id="meals">
            {loadedMeals.map((meal) => {
                return(
                <MealItem key={meal.id} meal={meal} />)
            })}
        </ul>
    )
}