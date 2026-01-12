import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, Utensils } from "lucide-react";

/**
 * Meal Planner page
 * Weekly meal planning with diet type selector
 */
const MealPlanner = () => {
  const [selectedDiet, setSelectedDiet] = useState("Balanced");

  const dietTypes = [
    { id: "Balanced", name: "Balanced", description: "Well-rounded nutrition" },
    { id: "Keto", name: "Keto", description: "Low carb, high fat" },
    { id: "Vegan", name: "Vegan", description: "Plant-based only" },
    {
      id: "Intermittent",
      name: "Intermittent",
      description: "16:8 fasting pattern",
    },
    { id: "Fasting", name: "Fasting", description: "Extended fasting periods" },
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Mock meal plans for each diet
  const mealPlans = {
    Balanced: {
      Monday: {
        breakfast: "Oatmeal with berries and honey",
        lunch: "Grilled chicken salad with quinoa",
        dinner: "Salmon with roasted vegetables",
      },
      Tuesday: {
        breakfast: "Greek yogurt parfait",
        lunch: "Mediterranean wrap",
        dinner: "Pasta primavera",
      },
      Wednesday: {
        breakfast: "Avocado toast with eggs",
        lunch: "Lentil soup with bread",
        dinner: "Stir-fried tofu with rice",
      },
      Thursday: {
        breakfast: "Smoothie bowl",
        lunch: "Turkey sandwich with salad",
        dinner: "Grilled fish tacos",
      },
      Friday: {
        breakfast: "Pancakes with maple syrup",
        lunch: "Buddha bowl",
        dinner: "Chicken curry with naan",
      },
      Saturday: {
        breakfast: "Eggs benedict",
        lunch: "Sushi bowl",
        dinner: "Homemade pizza",
      },
      Sunday: {
        breakfast: "French toast with fruit",
        lunch: "Roast chicken with vegetables",
        dinner: "Light soup and salad",
      },
    },
    Keto: {
      Monday: {
        breakfast: "Bacon and eggs with avocado",
        lunch: "Caesar salad with grilled chicken",
        dinner: "Ribeye steak with asparagus",
      },
      Tuesday: {
        breakfast: "Keto pancakes with butter",
        lunch: "Tuna salad lettuce wraps",
        dinner: "Pork chops with cauliflower mash",
      },
      Wednesday: {
        breakfast: "Cheese omelette",
        lunch: "Bunless burger with side salad",
        dinner: "Baked salmon with broccoli",
      },
      Thursday: {
        breakfast: "Bulletproof coffee with eggs",
        lunch: "Chicken thighs with green beans",
        dinner: "Lamb chops with spinach",
      },
      Friday: {
        breakfast: "Sausage and egg muffins",
        lunch: "Cobb salad",
        dinner: "Shrimp scampi with zucchini noodles",
      },
      Saturday: {
        breakfast: "Cream cheese stuffed bacon",
        lunch: "Beef lettuce wraps",
        dinner: "Duck breast with mushrooms",
      },
      Sunday: {
        breakfast: "Keto waffles",
        lunch: "Pulled pork with coleslaw",
        dinner: "Grilled fish with butter sauce",
      },
    },
    Vegan: {
      Monday: {
        breakfast: "Chia pudding with fruit",
        lunch: "Falafel bowl with hummus",
        dinner: "Vegetable curry with rice",
      },
      Tuesday: {
        breakfast: "Smoothie with plant protein",
        lunch: "Black bean tacos",
        dinner: "Pasta with marinara sauce",
      },
      Wednesday: {
        breakfast: "Overnight oats with nut butter",
        lunch: "Quinoa Buddha bowl",
        dinner: "Stuffed bell peppers",
      },
      Thursday: {
        breakfast: "Acai bowl",
        lunch: "Lentil soup",
        dinner: "Thai green curry with tofu",
      },
      Friday: {
        breakfast: "Avocado toast with tomatoes",
        lunch: "Mediterranean salad",
        dinner: "Mushroom risotto",
      },
      Saturday: {
        breakfast: "Vegan pancakes",
        lunch: "Veggie burger",
        dinner: "Pad Thai with tofu",
      },
      Sunday: {
        breakfast: "Fruit salad with granola",
        lunch: "Roasted vegetable wrap",
        dinner: "Coconut chickpea curry",
      },
    },
    Intermittent: {
      Monday: {
        breakfast: "—",
        lunch: "Large protein salad (12pm)",
        dinner: "Chicken stir-fry with rice (7pm)",
      },
      Tuesday: {
        breakfast: "—",
        lunch: "Fish tacos with slaw (12pm)",
        dinner: "Beef and vegetable soup (7pm)",
      },
      Wednesday: {
        breakfast: "—",
        lunch: "Mediterranean bowl (12pm)",
        dinner: "Grilled salmon with quinoa (7pm)",
      },
      Thursday: {
        breakfast: "—",
        lunch: "Turkey wrap with veggies (12pm)",
        dinner: "Shrimp pasta (7pm)",
      },
      Friday: {
        breakfast: "—",
        lunch: "Poke bowl (12pm)",
        dinner: "Pizza and salad (7pm)",
      },
      Saturday: {
        breakfast: "—",
        lunch: "Brunch: Eggs and toast (12pm)",
        dinner: "BBQ chicken with sides (7pm)",
      },
      Sunday: {
        breakfast: "—",
        lunch: "Sunday roast (12pm)",
        dinner: "Light soup (7pm)",
      },
    },
    Fasting: {
      Monday: {
        breakfast: "Water / Black coffee",
        lunch: "Water / Herbal tea",
        dinner: "Balanced meal at 6pm",
      },
      Tuesday: {
        breakfast: "Bone broth",
        lunch: "Water / Green tea",
        dinner: "Protein-rich meal",
      },
      Wednesday: {
        breakfast: "Normal eating day",
        lunch: "Normal eating day",
        dinner: "Normal eating day",
      },
      Thursday: {
        breakfast: "Water / Black coffee",
        lunch: "Water / Herbal tea",
        dinner: "Light meal at 6pm",
      },
      Friday: {
        breakfast: "Normal eating day",
        lunch: "Normal eating day",
        dinner: "Normal eating day",
      },
      Saturday: {
        breakfast: "Normal eating day",
        lunch: "Normal eating day",
        dinner: "Normal eating day",
      },
      Sunday: {
        breakfast: "Optional fast",
        lunch: "Optional fast",
        dinner: "Break fast meal",
      },
    },
  };

  const currentPlan = mealPlans[selectedDiet];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-savora-brown-800 mb-2">
          Meal Planner
        </h1>
        <p className="text-savora-brown-500">
          Plan your weekly meals based on your dietary preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main planner */}
        <div className="flex-1">
          <motion.div
            key={selectedDiet}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-savora-beige-200">
              <div className="w-12 h-12 bg-savora-green-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-savora-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold text-savora-brown-800">
                  {selectedDiet} Diet
                </h2>
                <p className="text-sm text-savora-brown-500">
                  Weekly meal plan
                </p>
              </div>
            </div>

            {/* Days grid */}
            <div className="space-y-4">
              {days.map((day) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-savora-beige-50 rounded-xl"
                >
                  <h3 className="font-semibold text-savora-brown-800 mb-3">
                    {day}
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-savora-green-600 uppercase tracking-wider w-20">
                        Breakfast
                      </span>
                      <span className="text-sm text-savora-brown-600">
                        {currentPlan[day]?.breakfast}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-savora-green-600 uppercase tracking-wider w-20">
                        Lunch
                      </span>
                      <span className="text-sm text-savora-brown-600">
                        {currentPlan[day]?.lunch}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-savora-green-600 uppercase tracking-wider w-20">
                        Dinner
                      </span>
                      <span className="text-sm text-savora-brown-600">
                        {currentPlan[day]?.dinner}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Diet selector - Right side */}
        <div className="lg:w-80">
          <div className="card sticky top-24">
            <h3 className="text-lg font-serif font-semibold text-savora-brown-800 mb-4">
              Select Diet Type
            </h3>
            <div className="space-y-2">
              {dietTypes.map((diet) => (
                <button
                  key={diet.id}
                  onClick={() => setSelectedDiet(diet.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    selectedDiet === diet.id
                      ? "bg-savora-green-50 border-2 border-savora-green-500"
                      : "bg-savora-beige-50 border-2 border-transparent hover:bg-savora-beige-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`font-medium ${
                          selectedDiet === diet.id
                            ? "text-savora-green-700"
                            : "text-savora-brown-700"
                        }`}
                      >
                        {diet.name}
                      </p>
                      <p className="text-sm text-savora-brown-500">
                        {diet.description}
                      </p>
                    </div>
                    {selectedDiet === diet.id && (
                      <ChevronRight className="w-5 h-5 text-savora-green-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-savora-beige-200">
              <div className="flex items-center gap-3 text-savora-brown-500">
                <Utensils className="w-5 h-5" />
                <span className="text-sm">
                  Customize your plan based on your goals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
