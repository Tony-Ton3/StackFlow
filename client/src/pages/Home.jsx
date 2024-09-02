import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { FaRocket, FaLightbulb, FaBook } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  // const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="font-nerko h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container mx-auto px-4 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-7xl font-bold mb-6">StackFlow</h1>
          <p className="text-xl mb-12">
            Tailored recommendations for your project, powered by AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <button
            onClick={() => navigate("/projectinput")}
            className="bg-secondary hover:bg-accent text-white font-bold py-3 px-8 rounded-full text-2xl transition duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="bg-gray-800 p-6 rounded-lg">
            <FaRocket className="text-4xl mb-4 mx-auto text-purple-500" />
            <h2 className="text-2xl font-semibold mb-2">
              AI-Powered Recommendations
            </h2>
            <p>
              Get personalized tech stack suggestions based on your project
              needs
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <FaLightbulb className="text-4xl mb-4 mx-auto text-yellow-500" />
            <h2 className="text-2xl font-semibold mb-2">
              Comprehensive Resources
            </h2>
            <p>
              Access curated learning materials, tutorials, and documentation
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <FaBook className="text-4xl mb-4 mx-auto text-green-500" />
            <h2 className="text-2xl font-semibold mb-2">
              Guided Learning Path
            </h2>
            <p>
              Follow a structured approach to mastering your recommended tech
              stack
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
