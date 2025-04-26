import React from 'react';
import Navbar from './Navbar';

const teamMembers = [
  {
    name: "Aishwarya Bangar",
    role: "Development",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQFQi32jUdvkOg/profile-displayphoto-shrink_100_100/B4DZRLi7GrGUAU-/0/1736434288995?e=1749686400&v=beta&t=gs2aIIAiBorexRzvnVj_nGeiWUgMhl4UZ_IGpfLfkjg",
    profileUrl: "https://www.linkedin.com/in/aishwarya-bangar-076245232/",
  },
  {
    name: "Shubhan Ansari",
    role: "Frontend and Backend",
    img: "https://media.licdn.com/dms/image/v2/D5603AQEQGBbRUMZXjw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1670409129855?e=1749686400&v=beta&t=m7kDlJ8KeA_f9yQctOnZbBE46zkwK4bANRK7thQBk34",
    profileUrl: "https://www.linkedin.com/in/shubhan-ansari-524b9a259/",
  },
  {
    name: "Sumer Ali",
    role: "Frontend and Backend",
    img: "https://media.licdn.com/dms/image/v2/C5603AQFDyWxE8__-6g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1640248507792?e=1749686400&v=beta&t=C7Ny2pMHTm-DzPbgaNun-BiSGd04n7biH5f1cuvCIcc",
    profileUrl: "https://www.linkedin.com/in/sumer-ali-921015229/",
  },
  {
    name: "Visharad Baderao",
    role: "Machine Learning",
    img: "https://media.licdn.com/dms/image/v2/D4D35AQFgw0waQNoUgA/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1713347974662?e=1746298800&v=beta&t=fpst2L5HAGwUFyKl90822-9Go7SrSIOzfo53F-WUxDg",
    profileUrl: "https://www.linkedin.com/in/visharad-baderao-2810aa254/",
  },
];

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow relative bg-cover bg-center pt-24" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1515879218367-8466d910aaa4')` }}>
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

        <div className="relative z-10 container mx-auto px-4 py-12 text-center">

          {/* Heading */}
          <h1 className="text-5xl font-bold text-gray-800 mb-10">About Us</h1>

          {/* Team Section */}
          <section>
            <h2 className="text-3xl font-semibold bg-white/70 rounded-xl inline-block px-6 py-2 mb-8">
              Our Team
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-teal-600 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between w-60 h-80"
                >
                  <img src={member.img} alt={member.name} className="rounded-full w-24 h-24 object-cover mb-4" />
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm mb-4">{member.role}</p>
                  <a
                    href={member.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
                  >
                    Contact
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Mission Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-semibold bg-white/70 rounded-xl inline-block px-6 py-2 mb-6">
              Our Mission
            </h2>
            <p className="max-w-3xl mx-auto bg-white/80 rounded-xl p-6 text-gray-700 text-lg">
            We are committed to leveraging cutting-edge Artificial Intelligence and Machine Learning technologies to enhance public safety and security.

Our goal is to assist government agencies and security personnel in real-time identification of criminals from video surveillance feeds and accurately estimate crowd sizes in public spaces.

By enabling faster threat detection and efficient crowd management, we aim to support law enforcement in making smarter, data-driven decisions that ensure the safety and well-being of citizens.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 bg-gray-800 text-white text-center">
        <p>Copyrights Reserved @Aishwarya Bangar.</p>
      </footer>
    </div>
  );
};

export default About;
