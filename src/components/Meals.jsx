import MealItem from "./MealItem.jsx";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";

const requestConfig={};
export default function Meals() {
    
    const {data: loadedMeals, error, isLoading} = useHttp('https://foodapp-api-2.onrender.com/meals', requestConfig, []);
    
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
