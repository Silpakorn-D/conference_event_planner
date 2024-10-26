// import the required dependencies.
import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealsSlice";
const ConferenceEvent = () => {
    const [showItems, setShowItems] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const venueItems = useSelector((state) => state.venue);//The useSelector() function retrieves venue items from the Redux store state.
    const avItems = useSelector((state) => state.av);// Retrieve the add-ons items
    const mealsItems = useSelector((state) => state.meals);//Retrieve the meal items
    const dispatch = useDispatch();
    const remainingAuditoriumQuantity = 3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity;// user cannot request more than three.

    
    const handleToggleItems = () => {
        console.log("handleToggleItems called");
        setShowItems(!showItems);
    };
    const handleAddToCart = (index) => {//Defines event handlers to manage the increase quantities from the user interactions.
        if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
          return; 
        }
        dispatch(incrementQuantity(index));
      };
    
      const handleRemoveFromCart = (index) => {//Defines event handlers to manage the decrease quantities from the user interactions.
        if (venueItems[index].quantity > 0) {
          dispatch(decrementQuantity(index));
        }
      };

    const handleIncrementAvQuantity = (index) => {
        dispatch(incrementAvQuantity(index));
    };

    const handleDecrementAvQuantity = (index) => {
        dispatch(decrementAvQuantity(index));
    };

    const handleMealSelection = (index) => {//function to calculate the meal subtotal based on the number of people.
        const item = mealsItems[index];
        if (item.selected && item.type === "mealForPeople") {
            // Ensure numberOfPeople is set before toggling selection
            const newNumberOfPeople = item.selected ? numberOfPeople : 0;
            dispatch(toggleMealSelection(index, newNumberOfPeople));
        }
        else {
            dispatch(toggleMealSelection(index));
        }      
    };

    const getItemsFromTotalCost = () => {
        const items = []; //create an empty array, prepared to store all items the user selected
        venueItems.forEach((item) => {
          if (item.quantity > 0) {// include selected venue item
            items.push({ ...item, type: "venue" }); //also add label "venue"
          }
        });
        avItems.forEach((item) => {
          if (
            item.quantity > 0 &&
            !items.some((i) => i.name === item.name && i.type === "av") // include selected av item
          ) {
            items.push({ ...item, type: "av" }); //also add label "av"
          }
        });
        mealsItems.forEach((item) => {
          if (item.selected) { // include selected meals item
            const itemForDisplay = { ...item, type: "meals" }; //also add label "meals"
            if (item.numberOfPeople) {
              itemForDisplay.numberOfPeople = numberOfPeople;
            }
            items.push(itemForDisplay);
          }
        });
        return items;
    };

    const items = getItemsFromTotalCost();

    const ItemsDisplay = ({ items }) => {
        console.log(items);
        return <>
            <div className="display_box1">
                {items.length === 0 && <p>No items selected</p>}
                <table className="table_item_data">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Unit Cost</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>${item.cost}</td>
                                <td>
                                    {item.type === "meals" || item.numberOfPeople
                                    ? ` For ${numberOfPeople} people`
                                    : item.quantity}
                                </td>
                                <td>{item.type === "meals" || item.numberOfPeople
                                    ? `${item.cost * numberOfPeople}`
                                    : `${item.cost * item.quantity}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    };
    const calculateTotalCost = (section) => {//calculate the cost for all selected rooms.
        let totalCost = 0;//Initialization of totalCost
        if (section === "venue") {//the total cost for the venue items will be calculated.
          venueItems.forEach((item) => {//Iteration over venueItems
            totalCost += item.cost * item.quantity;
          });
        } else if (section === "av") {//calculate the total cost for selected AV items 
            avItems.forEach((item) => {
              totalCost += item.cost * item.quantity;
            });
        } else if (section === "meals") {//calculate the total cost for selected meal items
            mealsItems.forEach((item) => {
                if (item.selected) {
                  totalCost += item.cost * numberOfPeople;
                }
              });
        }
        return totalCost;
      };
    const venueTotalCost = calculateTotalCost("venue");//the total cost of the "venue" section is stored in the constant venueTotalCost
    const avTotalCost = calculateTotalCost("av");//the total cost of the "add-ons" section is stored in the constant avTotalCost
    const mealsTotalCost = calculateTotalCost("meals");//the total cost of the "meals" section is stored in the constant mealsTotalCost
    const navigateToProducts = (idType) => {
        if (idType == '#venue' || idType == '#addons' || idType == '#meals') {
          if (showItems) { // Check if showItems is false
            setShowItems(!showItems); // Toggle showItems to true only if it's currently false
          }
        }
      }
    const totalCosts = {//Create one object named totalCosts
        venue: venueTotalCost,
        av: avTotalCost,
        meals: mealsTotalCost,
    };  
    return (
        <>
            <navbar className="navbar_event_conference">
                <div className="company_logo">Conference Expense Planner</div>
                <div className="left_navbar">
                    <div className="nav_links">
                        <a href="#venue" onClick={() => navigateToProducts("#venue")} >Venue</a>
                        <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
                        <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
                    </div>
                    <button className="details_button" onClick={() => setShowItems(!showItems)}>
                        Show Details
                    </button>
                </div>
            </navbar>
            <div className="main_container">
                {!showItems
                    ?
                    (
                        <div className="items-information">
                             <div id="venue" className="venue_container container_main">
        <div className="text">
 
          <h1>Venue Room Selection</h1>
        </div>
        <div className="venue_selection">
          {venueItems.map((item, index) => (
            <div className="venue_main" key={index}>
              <div className="img">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="text">{item.name}</div>
              <div>${item.cost}</div>
     <div className="button_container">
        {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (

          <>
          <button
            className={venueItems[index].quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
            onClick={() => handleRemoveFromCart(index)}
          >
            &#8211;
          </button>
          <span className="selected_count">
            {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
          </span>
          <button
            className={remainingAuditoriumQuantity === 0? "btn-success btn-disabled" : "btn-success btn-plus"}
            onClick={() => handleAddToCart(index)}
          >
            &#43;
          </button>
        </>
        ) : (
          <div className="button_container">
           <button
              className={venueItems[index].quantity ===0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
              onClick={() => handleRemoveFromCart(index)}
            >
               &#8211;
            </button>
            <span className="selected_count">
              {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
            </span>
            <button
              className={venueItems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
              onClick={() => handleAddToCart(index)}
            >
             &#43;
            </button>
            
            
          </div>
        )}
      </div>
            </div>
          ))}
        </div>
        <div className="total_cost">Total Cost: ${venueTotalCost}</div>{/*displays the total cost of all selected venue items*/}
      </div>

                            {/*Necessary Add-ons*/}
                            <div id="addons" className="venue_container container_main">


                                <div className="text">

                                    <h1> Add-ons Selection</h1>

                                </div>
                                <div className="addons_selection">
                                    {/*Display items from the avItems variable using the map() method. */}
                                    {avItems.map((item, index) => (
                                        <div className="av_data venue_main" key={index}>
                                            <div className="img">
                                                <img src={item.img} alt={item.name} />
                                            </div>
                                        <div className="text"> {item.name} </div>
                                        <div> ${item.cost} </div>
                                            {/*A set of buttons allowing users to adjust the quantity of the item*/}
                                            <div className="addons_btn">
                                                <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}> &ndash; </button>
                                                <span className="quantity-value">{item.quantity}</span>
                                                <button className=" btn-success" onClick={() => handleIncrementAvQuantity(index)}> &#43; </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/*display the total cost of the selected av items.*/}
                                <div className="total_cost">Total Cost:{avTotalCost}</div>

                            </div>

                            {/* Meal Section */}

                            <div id="meals" className="venue_container container_main">

                                <div className="text">

                                    <h1>Meals Selection</h1>
                                </div>

                                <div className="input-container venue_selection">
                                    {/*creates a labeled input field for specifying the number of people.*/}
                                    <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                                    <input type="number" className="input_box5" id="numberOfPeople" value={numberOfPeople}
                                        onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                                        min="1"
                                    />
                                </div>
                                <div className="meal_selection">
                                    {/*Display he meal items using the map() method*/}
                                    {mealsItems.map((item, index) => (
                                        <div className="meal_item" key={index} style={{ padding: 15 }}>
                                            <div className="inner">
                                                <input type="checkbox" id={ `meal_${index}` }
                                                    checked={ item.selected }
                                                    onChange={() => handleMealSelection(index)}
                                                />
                                                <label htmlFor={`meal_${index}`}> {item.name} </label>
                                            </div>
                                            <div className="meal_cost">${item.cost}</div>
                                        </div>
                                    ))}

                                </div>
                                <div className="total_cost">Total Cost:{mealsTotalCost} </div>


                            </div>
                        </div>
                    ) : (
                        <div className="total_amount_detail">
                            <TotalCost totalCosts={totalCosts} handleClick={handleToggleItems} ItemsDisplay={() => <ItemsDisplay items={items} />} />
                        </div>
                    )
                }




            </div>
        </>

    );
};

export default ConferenceEvent;
