import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Utensils, CalendarDays, ShoppingBag } from "lucide-react";

/**
 * Home page component
 * Minimal, premium landing page with welcome message
 */
const Home = () => {
  const features = [
    {
      icon: Utensils,
      title: "Discover Recipes",
      description: "Explore curated recipes for every taste and occasion",
    },
    {
      icon: CalendarDays,
      title: "Plan Your Meals",
      description: "Organize your weekly meals with our smart planner",
    },
    {
      icon: ShoppingBag,
      title: "Shop Ingredients",
      description: "Get fresh ingredients delivered to your doorstep",
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-grid">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-savora-cream via-savora-beige-50/50 to-savora-cream pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-savora-brown-800 mb-6">
              Welcome.
            </h1>

            {/* Tagline with dots */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className="text-lg sm:text-xl text-savora-brown-600 font-medium">
                cook
              </span>
              <span className="w-1.5 h-1.5 bg-savora-green-500 rounded-full" />
              <span className="text-lg sm:text-xl text-savora-brown-600 font-medium">
                plan
              </span>
              <span className="w-1.5 h-1.5 bg-savora-green-500 rounded-full" />
              <span className="text-lg sm:text-xl text-savora-brown-600 font-medium">
                eat
              </span>
            </div>

            {/* Description */}
            <p className="text-savora-brown-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Your personal recipe manager and meal planner. Discover delicious
              recipes, organize your weekly meals, and shop for fresh
              ingredients—all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/recipes"
                className="btn-primary inline-flex items-center gap-2 group"
              >
                Explore Recipes
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/meal-planner"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Start Planning
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-savora-cream to-transparent pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-savora-brown-800 mb-4">
              Everything you need
            </h2>
            <p className="text-savora-brown-500 max-w-xl mx-auto">
              From recipe discovery to meal planning and ingredient shopping,
              we've got you covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card hover:shadow-soft-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-savora-green-50 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-savora-green-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-savora-brown-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-savora-brown-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-savora-beige-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-savora-brown-800 mb-4">
            Ready to start cooking?
          </h2>
          <p className="text-savora-brown-500 mb-8">
            Join SAVORA today and transform the way you cook and plan meals.
          </p>
          <Link
            to="/signup"
            className="btn-primary inline-flex items-center gap-2"
          >
            Get Started Free
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
