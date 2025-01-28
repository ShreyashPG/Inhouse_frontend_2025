// import React, { useEffect, useRef } from 'react';
// import NavList from "../components/NavList";
// import { motion, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';
// import { ArrowRight, Award, BookOpen, Users, Calendar } from 'lucide-react';
// import pict from '../assets/loginbg.jpg';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { FaUserTie, FaFilePdf, FaFileAlt, FaUserShield } from 'react-icons/fa';

// const RunningText = ({ text }) => {
//   return (
//     <div className="overflow-hidden whitespace-nowrap w-full bg-blue-900 py-2">
//       <motion.div
//         initial={{ x: "100%" }}
//         animate={{ x: "-100%" }}
//         transition={{
//           repeat: Infinity,
//           duration: 20,
//           ease: "easeInOut"
//         }}
//         className="inline-block"
//       >
//         <span className="text-white text-lg font-medium mx-4">
//           {text} • {text} • {text} •
//         </span>
//       </motion.div>
//     </div>
//   );
// };

// const StatCard = ({ icon: Icon, number, text }) => {
//   const controls = useAnimation();
//   const ref = useRef(null);
//   const isInView = useInView(ref);

//   useEffect(() => {
//     if (isInView) {
//       controls.start({ opacity: 1, y: 0 });
//     }
//   }, [isInView, controls]);

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, y: 50 }}
//       animate={controls}
//       className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
//     >
//       <div className="flex items-center justify-center mb-4">
//         <Icon size={32} className="text-blue-600" />
//       </div>
//       <motion.h3
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//         className="text-3xl font-bold text-center text-gray-800 mb-2"
//       >
//         {number}+
//       </motion.h3>
//       <p className="text-gray-600 text-center">{text}</p>
//     </motion.div>
//   );
// };

// const DeveloperCard = ({ title, names }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.5 }}
//     className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg"
//   >
//     <h4 className="text-lg font-semibold text-blue-800 mb-2">{title}</h4>
//     <p className="text-gray-700">{names}</p>
//   </motion.div>
// );

// const ProjectShowcase = () => (
//   <section className="py-20">
//     <div className="container mx-auto px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-xl shadow-2xl overflow-hidden"
//       >
//         <div className=" p-8">
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-bold text-gray-800">Department of Information Technology</h2>
//               <h3 className="text-2xl font-semibold text-blue-600">Smart Report Generation Software</h3>
//             </div>

//             <div className="space-y-4">
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <h4 className="text-xl font-semibold text-gray-800 mb-2">Project Mentors</h4>
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-2">
//                     <Award className="text-blue-600" size={20} />
//                     <p className="text-gray-700">
//                       <span className="font-semibold">Mentor:</span> Dr. Archana Ghotkar
//                       <br />
//                       <span className="text-sm">Head of Information Technology Department</span>
//                     </p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Users className="text-blue-600" size={20} />
//                     <p className="text-gray-700">
//                       <span className="font-semibold">Guides:</span>
//                       <br />Mr. Tushar Rane
//                       <br />Mrs. Archana Kadam
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <DeveloperCard
//                   title="Senior Developer Team"
//                   names="Jayash Gaikwad, Priyanshu Mahukhaye, Abhijit Khyade, Om Nikam, Sahil Jagdale, Siddhant Sonawane"
//                 />
//                 <DeveloperCard
//                   title="Junior Developer Team"
//                   names="Shreyash Ingle, Rahul Kamble, Shreyash Ganekar, Adwait Borate, Anshi Patidar, Jidnyasa Harad, Ishwari Gondkar"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* <div className="relative h-[500px] space-y-4">
//             <img
//               src="/api/placeholder/800/400"
//               alt="PICT IT Department"
//               className="w-full h-[300px] object-cover rounded-lg shadow-lg"
//             />
//             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-transparent p-6 rounded-lg">
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="text-white text-center"
//               >
//                 <p className="text-sm italic">©2024 IT Department. All rights reserved.</p>
//               </motion.div>
//             </div>
//           </div> */}
//         </div>
//       </motion.div>
//     </div>
//   </section>
// );

// export const HomePage = () => {
//   const { currentUser } = useSelector((state) => state.user);
//   const { scrollYProgress } = useScroll();
//   const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

//   return (
//     <div className="overflow-x-hidden">
//       <NavList />

//       {/* Hero Section */}
//       <section className="relative h-screen">
//         <motion.div
//           style={{ opacity }}
//           className="absolute inset-0"
//         >
//           <img
//             src={pict}
//             alt="PICT Campus"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
//         </motion.div>

//         <div className="relative container mx-auto h-full flex items-center">
//           <motion.div
//             initial={{ opacity: 0, x: -100 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-white max-w-2xl"
//           >
//             <motion.h1
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="text-7xl font-bold mb-6"
//             >
//               Welcome to Smart Report Generation Software
//             </motion.h1>
//             <motion.p
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="text-3xl mb-8"
//             >
//               A comprehensive software solution to streamline teacher and student data management in more efficient way
//               with dynamic report generation.
//             </motion.p>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full flex items-center group"
//             >
//               {currentUser === null ? (
//                 <Link to="/auth/login">Sign Up</Link>
//               ) : (
//                 <Link
//                 to={
//                   currentUser.Role === 0
//                     ? "/a/dashboard"
//                     : currentUser.Role === 1
//                     ? "/t/dashboard"
//                     : currentUser.Role === 2
//                     ? "/s/dashboard"
//                     : "/dashboard"
//                 }
//                 >
//                   Dashboard
//                   </Link>
//               )}
//               <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
//             </motion.button>
//           </motion.div>
//         </div>
//       </section>

//       {/* Running Text Banner */}
//       <RunningText text="Admissions Open 2024-25 • NAAC A+ Accredited • NBA Approved • ISO 9001:2015 Certified" />

//       {/* Stats Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <StatCard icon={FaUserTie} number="Manage Staff & Students Data" text="Manage Staff & Students Data" />
//             <StatCard icon={FaFilePdf} number="Instant Report Generation" text="Based on Filters applied in the form of PDF and Excel" />
//             <StatCard icon={FaFileAlt} number="Report Generation" text="Instant Report Generation Based on Filters" />
//             <StatCard icon={FaUserShield} number="Admin Access" text="Admin and Committee Heads can filter required data" />
//           </div>
//         </div>
//       </section>

//       {/* Department Section */}
//       <ProjectShowcase />

//       {/* Accreditations Section */}
//       {/* <section className="py-20 bg-blue-50">
//         <div className="container mx-auto px-4">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             className="text-3xl font-bold text-center mb-16"
//           >
//             Our Accreditations
//           </motion.h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {['AICTE', 'NAAC', 'NBA', 'ISO'].map((accred, index) => (
//               <motion.div
//                 key={accred}
//                 initial={{ opacity: 0, scale: 0.5 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: index * 0.1 }}
//                 whileHover={{ y: -10 }}
//                 className="bg-white rounded-xl p-6 shadow-lg text-center"
//               >
//                 <div className="w-20 h-20 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
//                   <span className="text-xl font-bold text-white">{accred}</span>
//                 </div>
//                 <p className="text-gray-600">{accred} Certified</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section> */}

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between gap-8">
//             <div>
//               <h3 className="text-xl font-bold mb-4">Contact Us</h3>
//               <p className="text-gray-400">Survey No. 27, Near Trimurti Chowk,<br /> Bharati Vidyapeeth Campus, Dhankawadi, Pune - 411043</p>
//             </div>
//             <div>
//               <h3 className="text-xl font-bold mb-4">Quick Links</h3>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="https://pict.edu/" target='_blank' className="hover:text-blue-400 transition-colors">Admissions</a></li>
//                 <li><a href="https://pict.edu/" target='_blank' className="hover:text-blue-400 transition-colors">Academics</a></li>
//                 <li><a href="https://pict.edu/" target='_blank' className="hover:text-blue-400 transition-colors">Research</a></li>
//               </ul>
//             </div>
//             <div>
              
//             </div>
//           </div>
//           <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
//             <p>&copy; 2024 Pune Institute of Computer Technology. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };



import React, { useEffect, useRef } from 'react';
import NavList from "../components/NavList";
import { motion, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';
import { ArrowRight, Award, BookOpen, Users, Calendar } from 'lucide-react';
// import pict from '../assets/homepage.jpg';
import pict from '../assets/loginbg.jpg';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUserTie, FaFilePdf, FaFileAlt, FaUserShield } from 'react-icons/fa';
import asg from '../assets/asg.jpg';

const RunningText = ({ text }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap w-full bg-blue-900 py-2">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "easeInOut"
        }}
        className="inline-block"
      >
        <span className="text-white text-lg font-medium mx-4">
          {text} • {text} • {text} •
        </span>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon: Icon, number, text }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-center mb-4">
        <Icon size={32} className="text-blue-600" />
      </div>
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold text-center text-gray-800 mb-2"
      >
        {number}+
      </motion.h3>
      <p className="text-gray-600 text-center">{text}</p>
    </motion.div>
  );
};

const DeveloperCard = ({ title, names }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg"
  >
    <h4 className="text-lg font-semibold text-blue-800 mb-2">{title}</h4>
    <p className="text-gray-700">{names}</p>
  </motion.div>
);

const MentorCard = ({ name, role, imageSrc }) => (
  <div className="flex items-center space-x-4">
    <div className="flex-shrink-0">
      <img
        src={imageSrc || "/api/placeholder/80/80"}
        alt={name}
        className="w-32 h-32 rounded-full object-cover border-2 border-blue-600"
      />
    </div>
    <div>
      <p className="font-semibold text-gray-800">{name}</p>
      <p className="text-sm text-gray-600">{role}</p>
    </div>
  </div>
);

const ProjectShowcase = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">Department of Information Technology</h2>
              <h3 className="text-2xl font-semibold text-blue-600">Smart Report Generation Software</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Project Mentors</h4>
                <div className="space-y-6">
                  {/* Mentor Section */}
                  <div className="border-b border-blue-200 pb-4">
                    <div className="flex items-center space-x-2">
                      <Award className="text-blue-600" size={20} />
                      <span className="font-semibold text-blue-800">Mentor</span>
                    </div>
                    <div className="mt-3">
                      <MentorCard
                        name="Dr. Archana Ghotkar"
                        role="Head of Information Technology Department"
                        imageSrc={asg}
                      />
                    </div>
                  </div>

                  {/* Guides Section */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="text-blue-600" size={20} />
                      <span className="font-semibold text-blue-800">Guides</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p>Mr. Tushar Rane</p>
                        <p>Mrs. Archana Kadam</p>
                      </div>
                      {/* <MentorCard
                        name="Mr. Tushar Rane"
                        role="Project Guide"
                        imageSrc="/api/placeholder/80/80"
                      />
                      <MentorCard
                        name="Mrs. Archana Kadam"
                        role="Project Guide"
                        imageSrc="/api/placeholder/80/80"
                      /> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <DeveloperCard
                  title="Senior Developer Team"
                  names="Jayash Gaikwad, Priyanshu Mahukhaye, Abhijit Khyade, Om Nikam, Sahil Jagdale, Siddhant Sonawane"
                />
                <DeveloperCard
                  title="Junior Developer Team"
                  names="Shreyash Ingle, Rahul Kamble, Shreyash Ganekar, Adwait Borate, Anshi Patidar, Jidnyasa Harad, Ishwari Gondkar"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export const HomePage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="overflow-x-hidden">
      <NavList />

      {/* Hero Section */}
      <section className="relative h-screen">
        <motion.div
          style={{ opacity }}
          className="absolute inset-0"
        >
          <img
            src={pict}
            alt="PICT Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
        </motion.div>

        <div className="relative container mx-auto h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-2xl"
          >
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-7xl font-bold mb-6"
            >
              Welcome to Smart Report Generation Software
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl mb-8"
            >
              A comprehensive software solution to streamline teacher and student data management in more efficient way
              with dynamic report generation.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full flex items-center group"
            >
              {currentUser === null ? (
                <Link to="/auth/login">Sign Up</Link>
              ) : (
                <Link to={
                  currentUser.role === 0 ? "/a/dashboard" :
                    currentUser.role === 1 ? "/t/dashboard" :
                      currentUser.role === 2 ? "/s/dashboard" :
                        "/dashboard" // fallback in case the role is not recognized
                }>
                  Dashboard
                </Link>
              )}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Running Text Banner */}
      <RunningText text="Admissions Open 2024-25 • NAAC A+ Accredited • NBA Approved • ISO 9001:2015 Certified" />

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard icon={FaUserTie} number="Manage Staff & Students Data" text="Manage Staff & Students Data" />
            <StatCard icon={FaFilePdf} number="Instant Report Generation" text="Based on Filters applied in the form of PDF and Excel" />
            <StatCard icon={FaFileAlt} number="Report Generation" text="Instant Report Generation Based on Filters" />
            <StatCard icon={FaUserShield} number="Admin Access" text="Admin and Committee Heads can filter required data" />
          </div>
        </div>
      </section>

      {/* Department Section */}
      <ProjectShowcase />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-400">Survey No. 27, Near Trimurti Chowk,<br /> Bharati Vidyapeeth Campus, Dhankawadi, Pune - 411043</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://pict.edu/" target='_blank' className="hover:text-blue-400 transition-colors">Admissions</a></li>
                <li><a href="https://pict.edu/" target='_blank' className="hover:text-blue-400 transition-colors">Academics</a></li>
                <li><a href="https://pict.edu/" target='_blank' className="hover:text-blue-400 transition-colors">Research</a></li>
              </ul>
            </div>
            <div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Department of Information Technology, PICT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};