import MealItem from "./mealItem";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";

const requestConfig={};
export default function Meals() {
    
    const {data: loadedMeals, error, isLoading} = useHttp('http://localhost:3000/meals', requestConfig, []);
    
    if(isLoading){
        return(<p className="center">Connecting to the kitchen...</p>)
    }
    
    if(error) {
        return <Error title="Error while fetcing meals" message={error}/>
    }
    return(
        <ul id="meals">
            {loadedMeals.map((meal) => {
                return(
                <MealItem key={meal.id} meal={meal} />)
            })}
        </ul>
    )
}