import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AiOutlineEnvironment, AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import Navbar from "./Navbar";

const Contact = () => {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setmessage] = useState("");
  const navigate = useNavigate();

  async function save(event) {
    event.preventDefault();
    try {
      await axios.post("http://localhost:5000/smtp_form", {
        name: name,
        email: email,
        message: message,
      });
      alert("Feedback sent successfully!");
      setname("");
      setEmail("");
      setmessage("");
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('https://miro.medium.com/v2/resize:fit:3840/1*ee9Ji2ToUxeYfj3YUQ1xsA.jpeg')` }}>
      <Navbar />
      
      {/* Full screen overlay for background blur effect */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

      {/* Main content */}
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4 md:px-10">
      <div className="bg-white bg-opacity-80 rounded-2xl shadow-2xl p-6 md:p-12 w-full max-w-5xl mt-28">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-700 font-medium">For any help, feel free to reach out to us.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Left Section - Contact Info */}
            <div className="flex-1 space-y-8">
              <div className="flex items-start gap-4">
                <AiOutlineEnvironment className="text-3xl text-teal-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Address</h3>
                  <p className="text-gray-600">MIT ACADEMY OF ENGINEERING, Alandi-Dehu Phata, Pune-412105</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <AiOutlinePhone className="text-3xl text-teal-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Phone</h3>
                  <p className="text-gray-600">7588198664</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <AiOutlineMail className="text-3xl text-teal-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">disasterprediction37@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Right Section - Form */}
            <form onSubmit={save} className="flex-1 space-y-6">
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setmessage(e.target.value)}
                  required
                  className="w-full h-32 px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-md transition">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
